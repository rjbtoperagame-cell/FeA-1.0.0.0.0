import React, { useState } from 'react';
import { Shield, Sparkles, User, Lock, ArrowRight, UserPlus, LogIn, Crown, Sparkle, Dices } from 'lucide-react';
import { ANIMALS } from '../data/rpgData';
import { AnimalId } from '../types';

export interface UserAccount {
  username: string;
  password?: string;
  characterName: string;
  animalId: AnimalId;
  createdAt: string;
  role?: 'player' | 'admin';
  xpTotal?: number;
}

interface LoginScreenProps {
  onLogin: (account: UserAccount) => void;
  existingAccounts: UserAccount[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, existingAccounts }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [characterNameInput, setCharacterNameInput] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState<AnimalId>('leao');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset demo accounts if none exist
  const defaultPresets: UserAccount[] = [
    { username: 'Mestre_GM', characterName: 'Mestre do Jogo (Visão Total)', animalId: 'leao', createdAt: '2026-01-01', role: 'admin', xpTotal: 5000 },
    { username: 'Jogador_Solis', characterName: 'Solis, O Rugido Solar', animalId: 'leao', createdAt: '2026-01-02', role: 'player', xpTotal: 1200 },
    { username: 'Jogador_Luna', characterName: 'Luna, A Sombra Prateada', animalId: 'lobo', createdAt: '2026-01-03', role: 'player', xpTotal: 1000 },
  ];

  const displayAccounts = existingAccounts.length > 0 ? existingAccounts : defaultPresets;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = usernameInput.trim();
    if (!cleanUsername) {
      setErrorMsg('Por favor, informe seu nome de usuário ou e-mail.');
      return;
    }

    const found = displayAccounts.find((a) => a.username.toLowerCase() === cleanUsername.toLowerCase());
    if (found) {
      onLogin(found);
    } else {
      // Auto-create basic profile if password provided or proceed
      const newAccount: UserAccount = {
        username: cleanUsername,
        characterName: characterNameInput.trim() || `Guardião ${cleanUsername}`,
        animalId: selectedAnimalId,
        createdAt: new Date().toISOString(),
      };
      onLogin(newAccount);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = usernameInput.trim();
    const cleanCharName = characterNameInput.trim();

    if (!cleanUsername) {
      setErrorMsg('Preencha seu nome de usuário.');
      return;
    }
    if (!cleanCharName) {
      setErrorMsg('Preencha o nome do seu Personagem.');
      return;
    }

    const newAccount: UserAccount = {
      username: cleanUsername,
      characterName: cleanCharName,
      animalId: selectedAnimalId,
      createdAt: new Date().toISOString(),
    };

    onLogin(newAccount);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-b from-amber-500/20 to-zinc-900 border border-amber-500/40 rounded-2xl shadow-xl shadow-amber-500/10 mb-2">
            <Shield size={36} className="text-amber-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-100 uppercase">
            RPG dos <span className="text-amber-400">Guardiões</span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Acesse sua Ficha de Personagem ou entre como Mestre do Jogo
          </p>
        </div>

        {/* Quick Profile Selection */}
        {displayAccounts.length > 0 && (
          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-amber-400" />
                Contas Gravadas neste Aparelho
              </span>
              <span className="text-[10px] text-amber-400/80 font-normal">Clique para Entrar</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {displayAccounts.map((acc) => (
                <button
                  key={acc.username}
                  onClick={() => onLogin(acc)}
                  className="w-full p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 hover:border-amber-500/50 rounded-xl transition-all flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                      {acc.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                        {acc.characterName}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        User: @{acc.username} • Guardião {ANIMALS[acc.animalId]?.name || 'Leão'}
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl space-y-5">
          {/* Tabs switch */}
          <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LogIn size={14} />
              <span>Entrar com Conta</span>
            </button>

            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserPlus size={14} />
              <span>Criar Novo Jogador</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Usuário ou Nome do Jogador</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Ex: Solis, Jogador_1, Mestre..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Senha (Opcional no modo local)</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Acessar Minha Ficha</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Nome do Jogador / Login</label>
                <input
                  type="text"
                  placeholder="Ex: @lucas, @mestre, @pedro"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Nome do Personagem RPG</label>
                <input
                  type="text"
                  placeholder="Ex: Solis, O Lança do Sol"
                  value={characterNameInput}
                  onChange={(e) => setCharacterNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Guardião Inicial (Animal)</label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => setSelectedAnimalId(e.target.value as AnimalId)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  {Object.values(ANIMALS).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.weapon})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Criar Personagem & Entrar</span>
                <Sparkles size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-zinc-500">
          Cada conta salva individualmente seus pontos, habilidades desbloqueadas, atributos e personalizações do RPG.
        </p>
      </div>
    </div>
  );
};

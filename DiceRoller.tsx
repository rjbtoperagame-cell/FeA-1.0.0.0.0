import React, { useState, useEffect } from 'react';
import { XPConfig, DEFAULT_XP_CONFIG, DEFAULT_TIER_RANK_XP_COSTS, DEFAULT_DESIGNIO_RANK_XP_COSTS, SkillNode } from '../types';
import { DesignioDefinition, DesignioRank, DESIGNIOS_LIST } from '../data/designiosData';
import { UserAccount } from './LoginScreen';
import { SkillEditorView } from './SkillEditorView';
import {
  Shield,
  Sparkles,
  Settings,
  UserCheck,
  Plus,
  RotateCcw,
  Check,
  Zap,
  Coins,
  Compass,
  Pencil,
  Trash2,
  Copy,
  Search,
  Save,
  Award,
  ArrowLeft,
  Edit3,
  Crown,
  Layers,
} from 'lucide-react';

interface AdminViewProps {
  xpConfig: XPConfig;
  onSaveXPConfig: (newConfig: XPConfig) => void;
  allAccounts: UserAccount[];
  onUpdateAccountXP: (username: string, newTotalXp: number, role?: 'player' | 'admin') => void;
  currentUser: UserAccount;
  designiosList: DesignioDefinition[];
  onSaveDesignios: (updatedList: DesignioDefinition[]) => void;
  allSkillsMap: Record<string, SkillNode>;
  customSkillsMap: Record<string, SkillNode>;
  onSaveSkill: (updatedSkill: SkillNode) => void;
  onResetSkill: (skillId: string) => void;
  onResetAllCustomSkills: () => void;
  onImportCustomSkills: (importedMap: Record<string, SkillNode>) => void;
  initialSubTab?: 'mestre' | 'xp' | 'skills';
}

export const AdminView: React.FC<AdminViewProps> = ({
  xpConfig,
  onSaveXPConfig,
  allAccounts = [],
  onUpdateAccountXP,
  currentUser,
  designiosList = [],
  onSaveDesignios,
  allSkillsMap,
  customSkillsMap,
  onSaveSkill,
  onResetSkill,
  onResetAllCustomSkills,
  onImportCustomSkills,
  initialSubTab = 'mestre',
}) => {
  const safeAccounts = allAccounts || [];
  const safeCurrentUser = currentUser || { username: 'Guest', characterName: 'Mestre', animalId: 'leao', createdAt: '' };

  const [activeSubTab, setActiveSubTab] = useState<'mestre' | 'xp' | 'skills'>(initialSubTab);

  // Sync initial subtab if prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // --- Desígnios Management State ---
  const [localDesignios, setLocalDesignios] = useState<DesignioDefinition[]>(
    designiosList && designiosList.length > 0 ? designiosList : DESIGNIOS_LIST
  );

  useEffect(() => {
    if (designiosList && designiosList.length > 0) {
      setLocalDesignios(designiosList);
    }
  }, [designiosList]);

  const [editingDes, setEditingDes] = useState<DesignioDefinition | null>(null);
  const [isCreatingNewDes, setIsCreatingNewDes] = useState<boolean>(false);
  const [desSearchQuery, setDesSearchQuery] = useState<string>('');
  const [desRankFilter, setDesRankFilter] = useState<'ALL' | DesignioRank>('ALL');

  // --- XP Costs Form State ---
  const [attrCosts, setAttrCosts] = useState({
    forca: xpConfig.attributeCosts?.forca ?? xpConfig.costPerAttributePoint ?? 100,
    destreza: xpConfig.attributeCosts?.destreza ?? xpConfig.costPerAttributePoint ?? 100,
    constituicao: xpConfig.attributeCosts?.constituicao ?? xpConfig.costPerAttributePoint ?? 100,
    poder: xpConfig.attributeCosts?.poder ?? xpConfig.costPerAttributePoint ?? 100,
  });

  const [combatCosts, setCombatCosts] = useState({
    pvs: xpConfig.combatStatCosts?.pvs ?? 20,
    pms: xpConfig.combatStatCosts?.pms ?? 20,
    ataque: xpConfig.combatStatCosts?.ataque ?? 50,
    defesa: xpConfig.combatStatCosts?.defesa ?? 50,
    atqEspecial: xpConfig.combatStatCosts?.atqEspecial ?? 50,
    defEspecial: xpConfig.combatStatCosts?.defEspecial ?? 50,
    velAtq: xpConfig.combatStatCosts?.velAtq ?? xpConfig.combatStatCosts?.velocidade ?? 50,
    velMov: xpConfig.combatStatCosts?.velMov ?? xpConfig.combatStatCosts?.velocidade ?? 50,
    velEspecial: xpConfig.combatStatCosts?.velEspecial ?? xpConfig.combatStatCosts?.velocidade ?? 50,
  });

  const [tierCosts, setTierCosts] = useState<Record<number, number>>({
    1: xpConfig.tierXpCosts[1] ?? 50,
    2: xpConfig.tierXpCosts[2] ?? 100,
    3: xpConfig.tierXpCosts[3] ?? 200,
    4: xpConfig.tierXpCosts[4] ?? 350,
    5: xpConfig.tierXpCosts[5] ?? 500,
    6: xpConfig.tierXpCosts[6] ?? 1000,
  });

  const [tierRankCosts, setTierRankCosts] = useState<Record<string, number>>(() => {
    return {
      ...DEFAULT_TIER_RANK_XP_COSTS,
      ...(xpConfig.tierRankXpCosts || {}),
    };
  });

  const [designioRankCosts, setDesignioRankCosts] = useState<Record<string, number>>(() => {
    return {
      ...DEFAULT_DESIGNIO_RANK_XP_COSTS,
      ...(xpConfig.designioRankXpCosts || {}),
    };
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // --- Player XP Adjustment State ---
  const [selectedUsername, setSelectedUsername] = useState<string>(
    safeAccounts[0]?.username || safeCurrentUser.username
  );
  const [addXpAmount, setAddXpAmount] = useState<number>(100);

  const selectedAccount = safeAccounts.find((a) => a.username === selectedUsername) || safeCurrentUser;

  // Handlers for XP costs
  const handleSaveCosts = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveXPConfig({
      costPerAttributePoint: attrCosts.forca,
      attributeCosts: attrCosts,
      combatStatCosts: combatCosts,
      tierXpCosts: tierCosts,
      tierRankXpCosts: tierRankCosts,
      designioRankXpCosts: designioRankCosts,
    });
    setSavedSuccessMsg('Configurações de custos de XP salvas com sucesso!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handleResetCosts = () => {
    setAttrCosts(DEFAULT_XP_CONFIG.attributeCosts);
    setCombatCosts(DEFAULT_XP_CONFIG.combatStatCosts);
    setTierCosts(DEFAULT_XP_CONFIG.tierXpCosts);
    setTierRankCosts(DEFAULT_TIER_RANK_XP_COSTS);
    setDesignioRankCosts(DEFAULT_DESIGNIO_RANK_XP_COSTS);
    onSaveXPConfig(DEFAULT_XP_CONFIG);
    setSavedSuccessMsg('Custos restaurados para os valores padrão!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handleGiveXp = (amount: number) => {
    const currentXp = selectedAccount.xpTotal ?? 1000;
    const newTotal = Math.max(0, currentXp + amount);
    onUpdateAccountXP(selectedAccount.username, newTotal);
  };

  const handleToggleRole = () => {
    const newRole = selectedAccount.role === 'admin' ? 'player' : 'admin';
    onUpdateAccountXP(selectedAccount.username, selectedAccount.xpTotal ?? 1000, newRole);
  };

  // Handlers for Desígnios
  const handleStartEditDes = (des: DesignioDefinition) => {
    setEditingDes({ ...des });
    setIsCreatingNewDes(false);
  };

  const handleStartCreateDes = () => {
    setEditingDes({
      id: `custom_des_${Date.now()}`,
      name: 'Novo Desígnio',
      rank: 'D',
      description: 'Aumenta PVs +2, PMs +2.',
      pvs: 2,
      pms: 2,
    });
    setIsCreatingNewDes(true);
  };

  const handleSaveSingleDes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDes || !editingDes.name.trim()) return;

    let updated: DesignioDefinition[];
    if (isCreatingNewDes) {
      updated = [...localDesignios, editingDes];
    } else {
      updated = localDesignios.map((d) => (d.id === editingDes.id ? editingDes : d));
    }

    setLocalDesignios(updated);
    onSaveDesignios?.(updated);
    setEditingDes(null);
    setIsCreatingNewDes(false);
    setSavedSuccessMsg(`Desígnio "${editingDes.name}" salvo com sucesso!`);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handleDeleteDes = (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o desígnio "${name}"?`)) return;
    const updated = localDesignios.filter((d) => d.id !== id);
    setLocalDesignios(updated);
    onSaveDesignios?.(updated);
    setSavedSuccessMsg(`Desígnio "${name}" removido com sucesso.`);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handleDuplicateDes = (des: DesignioDefinition) => {
    const clone: DesignioDefinition = {
      ...des,
      id: `${des.id}_copia_${Date.now()}`,
      name: `${des.name} (Cópia)`,
    };
    const updated = [...localDesignios, clone];
    setLocalDesignios(updated);
    onSaveDesignios?.(updated);
    setSavedSuccessMsg(`Cópia criada: "${clone.name}".`);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handleResetAllDes = () => {
    if (!window.confirm('Restaurar todos os Desígnios para a lista padrão do sistema? Alterações e novos desígnios serão resetados.')) return;
    setLocalDesignios(DESIGNIOS_LIST);
    onSaveDesignios?.(DESIGNIOS_LIST);
    setSavedSuccessMsg('Lista de Desígnios restaurada para os padrões originais!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const rankStyles: Record<DesignioRank, { border: string; bg: string; text: string; badge: string }> = {
    D: { border: 'border-zinc-800', bg: 'bg-zinc-950/80', text: 'text-zinc-300', badge: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
    C: { border: 'border-cyan-800/50', bg: 'bg-cyan-950/10', text: 'text-cyan-300', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
    B: { border: 'border-purple-800/50', bg: 'bg-purple-950/10', text: 'text-purple-300', badge: 'bg-purple-950/80 text-purple-300 border-purple-800' },
    A: { border: 'border-amber-800/50', bg: 'bg-amber-950/10', text: 'text-amber-300', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' },
    S: { border: 'border-red-800/50', bg: 'bg-red-950/10', text: 'text-red-300', badge: 'bg-red-950/80 text-red-300 border-red-800' },
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/80 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl shadow-inner shrink-0">
            <Shield size={24} className="sm:hidden" />
            <Shield size={28} className="hidden sm:block" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-zinc-100 uppercase tracking-wide">
                Painel do Administrador & Mestre
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Central de Edição
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Gerencie todas as regras de XP, conceda XP aos jogadores, edite a lista de Desígnios e personalize todas as Habilidades do sistema.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 flex items-center gap-2 shrink-0">
          <Crown size={15} className="text-amber-400" />
          <span>Mestre Ativo: <strong className="text-amber-300">{safeCurrentUser.characterName}</strong></span>
        </div>
      </div>

      {/* Primary Navigation Sub-Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('mestre')}
          className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
            activeSubTab === 'mestre'
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-950/50 text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <Shield size={16} />
          <span>1. Painel do Mestre & Jogadores</span>
        </button>

        <button
          onClick={() => setActiveSubTab('xp')}
          className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
            activeSubTab === 'xp'
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-950/50 text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <Settings size={16} />
          <span>2. Regras & Edição de XP</span>
        </button>

        <button
          onClick={() => setActiveSubTab('skills')}
          className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
            activeSubTab === 'skills'
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-950/50 text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <Edit3 size={16} />
          <span>3. Editor de Habilidades {Object.keys(customSkillsMap).length > 0 ? `(${Object.keys(customSkillsMap).length})` : ''}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {savedSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <Check size={18} className="text-emerald-400 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: PAINEL DO MESTRE & JOGADORES + DESÍGNIOS */}
      {activeSubTab === 'mestre' && (
        <div className="space-y-6">
          {/* Player Management Section */}
          <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-amber-400" />
                <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide">
                  Gestão de Jogadores & Atribuição de XP
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {safeAccounts.length} conta(s) registrada(s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 block">Selecione a Conta do Jogador</label>
                <select
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-bold focus:outline-none focus:border-amber-500"
                >
                  {safeAccounts.map((acc) => (
                    <option key={acc.username} value={acc.username}>
                      {acc.characterName} (@{acc.username}) — Total: {acc.xpTotal ?? 1000} XP ({acc.role === 'admin' ? 'Mestre' : 'Jogador'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Cargo Atual</span>
                  <span className={`text-xs font-extrabold ${selectedAccount.role === 'admin' ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {selectedAccount.role === 'admin' ? 'Mestre / ADM' : 'Jogador Standard'}
                  </span>
                </div>
                <button
                  onClick={handleToggleRole}
                  className="px-3 py-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-lg border border-zinc-700 transition-colors"
                >
                  Alternar Cargo
                </button>
              </div>
            </div>

            {/* Quick XP Allocation Controls */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">XP Total do Jogador Selecionado:</span>
                <span className="text-xl font-black text-amber-400 font-mono">{selectedAccount.xpTotal ?? 1000} XP</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleGiveXp(100)}
                  className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> +100 XP
                </button>
                <button
                  onClick={() => handleGiveXp(500)}
                  className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> +500 XP
                </button>
                <button
                  onClick={() => handleGiveXp(1000)}
                  className="py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> +1000 XP
                </button>
                <button
                  onClick={() => handleGiveXp(-500)}
                  className="py-2.5 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/50 rounded-xl text-xs font-bold transition-all"
                >
                  -500 XP
                </button>
              </div>

              {/* Custom XP Amount Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  placeholder="Quantidade exata de XP..."
                  value={addXpAmount}
                  onChange={(e) => setAddXpAmount(Number(e.target.value))}
                  className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono font-bold text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleGiveXp(addXpAmount)}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wide rounded-xl shadow transition-colors shrink-0"
                >
                  Conceder XP
                </button>
              </div>
            </div>
          </div>

          {/* Desígnios Management Section */}
          <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-amber-400" />
                <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide">
                  Editor & Gestão de Desígnios do RPG
                </h3>
              </div>

              <button
                onClick={handleStartCreateDes}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Novo Desígnio</span>
              </button>
            </div>

            {/* Desígnio Edit Form */}
            {editingDes ? (
              <form onSubmit={handleSaveSingleDes} className="p-5 bg-zinc-950 border border-amber-500/40 rounded-2xl space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDes(null)}
                      className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide">
                        {isCreatingNewDes ? 'Criar Novo Desígnio' : `Editar Desígnio: ${editingDes.name}`}
                      </h4>
                      <p className="text-[11px] text-zinc-400">Configure o nome, rank e os bônus concedidos por nível.</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-black rounded-lg border ${rankStyles[editingDes.rank].badge}`}>
                    Rank {editingDes.rank}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Nome do Desígnio</label>
                    <input
                      type="text"
                      required
                      value={editingDes.name}
                      onChange={(e) => setEditingDes({ ...editingDes, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-bold focus:outline-none focus:border-amber-500"
                      placeholder="Ex: Coragem Divina"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Rank (Categoria)</label>
                    <select
                      value={editingDes.rank}
                      onChange={(e) => setEditingDes({ ...editingDes, rank: e.target.value as DesignioRank })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    >
                      <option value="D">Rank D</option>
                      <option value="C">Rank C</option>
                      <option value="B">Rank B</option>
                      <option value="A">Rank A</option>
                      <option value="S">Rank S</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Descrição do Efeito</label>
                    <textarea
                      rows={2}
                      required
                      value={editingDes.description}
                      onChange={(e) => setEditingDes({ ...editingDes, description: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                      placeholder="Descreva os efeitos e aumentos de atributos concedidos por este Desígnio."
                    />
                  </div>
                </div>

                {/* Attribute Bonuses per level */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Award size={14} className="text-amber-400" />
                    Bônus de Atributos por Nível Adquirido
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'pvs', label: 'PVs (Vida)', color: 'text-red-400' },
                      { key: 'pms', label: 'PMs (Mana)', color: 'text-blue-400' },
                      { key: 'ataque', label: 'Ataque Físico', color: 'text-amber-400' },
                      { key: 'defesa', label: 'Defesa Física', color: 'text-emerald-400' },
                      { key: 'atqEspecial', label: 'Atq. Especial', color: 'text-purple-400' },
                      { key: 'defEspecial', label: 'Def. Especial', color: 'text-cyan-400' },
                      { key: 'velAtq', label: 'Vel. Ataque', color: 'text-cyan-300' },
                      { key: 'velMov', label: 'Vel. Movimento', color: 'text-emerald-300' },
                      { key: 'velEspecial', label: 'Vel. Especial', color: 'text-purple-300' },
                      { key: 'dCrit', label: 'Dano Crítico (+%)', color: 'text-amber-300' },
                      { key: 'regeneracao', label: 'Regeneração', color: 'text-emerald-400' },
                    ].map(({ key, label, color }) => {
                      const val = (editingDes as any)[key] ?? 0;
                      return (
                        <div key={key} className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col justify-between gap-1">
                          <span className={`text-[11px] font-bold ${color}`}>{label}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-zinc-500 font-mono">+</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={val}
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                setEditingDes((prev) => prev ? { ...prev, [key]: num > 0 ? num : undefined } : null);
                              }}
                              className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingDes(null)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold border border-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
                  >
                    <Save size={15} />
                    <span>Salvar Desígnio</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Desígnios List View */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Buscar Desígnio por nome ou efeito..."
                        value={desSearchQuery}
                        onChange={(e) => setDesSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto">
                      {(['ALL', 'D', 'C', 'B', 'A', 'S'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setDesRankFilter(r)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            desRankFilter === r
                              ? 'bg-amber-500 text-zinc-950 shadow'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          {r === 'ALL' ? 'Todos' : `Rank ${r}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleResetAllDes}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold border border-zinc-800 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden md:inline">Restaurar Desígnios Originais</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {localDesignios
                    .filter((d) => {
                      const matchRank = desRankFilter === 'ALL' || d.rank === desRankFilter;
                      const matchQuery =
                        !desSearchQuery.trim() ||
                        d.name.toLowerCase().includes(desSearchQuery.toLowerCase()) ||
                        d.description.toLowerCase().includes(desSearchQuery.toLowerCase());
                      return matchRank && matchQuery;
                    })
                    .map((des) => {
                      const style = rankStyles[des.rank];

                      return (
                        <div
                          key={des.id}
                          className={`p-4 rounded-2xl border ${style.border} ${style.bg} flex flex-col justify-between gap-3 relative group hover:border-amber-500/40 transition-all`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h4 className={`text-sm font-black ${style.text} flex items-center gap-1.5`}>
                                {des.name}
                              </h4>
                              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${style.badge}`}>
                                Rank {des.rank}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {des.pvs ? <span className="px-1.5 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-900/50 text-[10px] font-mono font-bold">PVs +{des.pvs}</span> : null}
                              {des.pms ? <span className="px-1.5 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-900/50 text-[10px] font-mono font-bold">PMs +{des.pms}</span> : null}
                              {des.ataque ? <span className="px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-900/50 text-[10px] font-mono font-bold">Ataque +{des.ataque}</span> : null}
                              {des.defesa ? <span className="px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/50 text-[10px] font-mono font-bold">Defesa +{des.defesa}</span> : null}
                              {des.atqEspecial ? <span className="px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-900/50 text-[10px] font-mono font-bold">Atq.Esp +{des.atqEspecial}</span> : null}
                              {des.defEspecial ? <span className="px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-900/50 text-[10px] font-mono font-bold">Def.Esp +{des.defEspecial}</span> : null}
                              {des.velAtq ? <span className="px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-200 border border-cyan-900/50 text-[10px] font-mono font-bold">Vel.Atq +{des.velAtq}</span> : null}
                              {des.velMov ? <span className="px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-200 border border-emerald-900/50 text-[10px] font-mono font-bold">Vel.Mov +{des.velMov}</span> : null}
                              {des.velEspecial ? <span className="px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-200 border border-purple-900/50 text-[10px] font-mono font-bold">Vel.Esp +{des.velEspecial}</span> : null}
                              {des.dCrit ? <span className="px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-200 border border-amber-900/50 text-[10px] font-mono font-bold">D.Crit +{des.dCrit}</span> : null}
                              {des.regeneracao ? <span className="px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/50 text-[10px] font-mono font-bold">Regen +{des.regeneracao}</span> : null}
                            </div>

                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {des.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-zinc-800/80">
                            <button
                              onClick={() => handleDuplicateDes(des)}
                              className="p-1.5 text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
                              title="Duplicar Desígnio"
                            >
                              <Copy size={13} />
                              <span className="hidden sm:inline">Duplicar</span>
                            </button>

                            <button
                              onClick={() => handleStartEditDes(des)}
                              className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Pencil size={13} />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => handleDeleteDes(des.id, des.name)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/40 rounded-lg border border-red-800/50 transition-colors flex items-center gap-1 text-[11px]"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGRAS E EDIÇÃO DE CUSTOS DE XP */}
      {activeSubTab === 'xp' && (
        <form onSubmit={handleSaveCosts} className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-amber-400" />
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide">
                Configuração e Edição de Regras de Custos de XP
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Tabela Oficial do Sistema</span>
          </div>

          {/* Primary Attributes XP Costs */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                Custos por Atributo Primário (+1 Ponto)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">FOR, DES, CON, POD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-400 block">Força (FOR)</span>
                  <span className="text-[10px] text-zinc-500">Ataque Físico & Dano</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={attrCosts.forca}
                    onChange={(e) => setAttrCosts({ ...attrCosts, forca: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 block">Destreza (DES)</span>
                  <span className="text-[10px] text-zinc-500">Precisão & Velocidade</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={attrCosts.destreza}
                    onChange={(e) => setAttrCosts({ ...attrCosts, destreza: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block">Constituição (CON)</span>
                  <span className="text-[10px] text-zinc-500">Pontos de Vida & Defesa</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={attrCosts.constituicao}
                    onChange={(e) => setAttrCosts({ ...attrCosts, constituicao: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-400 block">Poder (POD)</span>
                  <span className="text-[10px] text-zinc-500">Pontos de Mana & Magia</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={attrCosts.poder}
                    onChange={(e) => setAttrCosts({ ...attrCosts, poder: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-300 block">+1 PV (Pontos de Vida)</span>
                  <span className="text-[10px] text-zinc-500">Evolução direta de Vida</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.pvs}
                    onChange={(e) => setCombatCosts({ ...combatCosts, pvs: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-300 block">+1 PM (Pontos de Mana)</span>
                  <span className="text-[10px] text-zinc-500">Evolução direta de Mana</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.pms}
                    onChange={(e) => setCombatCosts({ ...combatCosts, pms: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Stats XP Costs */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Shield size={14} className="text-amber-400" />
                Custos de XP para Atributos Secundários de Combate
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">+1 Ataque Físico</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.ataque}
                    onChange={(e) => setCombatCosts({ ...combatCosts, ataque: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">+1 Defesa Física</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.defesa}
                    onChange={(e) => setCombatCosts({ ...combatCosts, defesa: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">+1 Atq Especial</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.atqEspecial}
                    onChange={(e) => setCombatCosts({ ...combatCosts, atqEspecial: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">+1 Def Especial</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.defEspecial}
                    onChange={(e) => setCombatCosts({ ...combatCosts, defEspecial: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300">+1 Vel. Ataque</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.velAtq}
                    onChange={(e) => setCombatCosts({ ...combatCosts, velAtq: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">+1 Vel. Movimento</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.velMov}
                    onChange={(e) => setCombatCosts({ ...combatCosts, velMov: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">+1 Vel. Casting</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={combatCosts.velEspecial}
                    onChange={(e) => setCombatCosts({ ...combatCosts, velEspecial: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Tier & Rank XP Costs */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Custos de XP das Habilidades Separados por Tier e Rank
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Tiers 1 a 6 • Ranks D a SS</span>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((tier) => (
                <div key={tier} className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      Tier {tier}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Configuração por Rank</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      { rank: 'D', label: 'Rank D', color: 'text-zinc-300 bg-zinc-950 border-zinc-800' },
                      { rank: 'C', label: 'Rank C', color: 'text-cyan-300 bg-cyan-950/20 border-cyan-800/50' },
                      { rank: 'B', label: 'Rank B', color: 'text-purple-300 bg-purple-950/20 border-purple-800/50' },
                      { rank: 'A', label: 'Rank A', color: 'text-amber-300 bg-amber-950/20 border-amber-800/50' },
                      { rank: 'S', label: 'Rank S', color: 'text-red-300 bg-red-950/20 border-red-800/50' },
                      { rank: 'SS', label: 'Rank SS', color: 'text-emerald-300 bg-emerald-950/20 border-emerald-800/50' },
                    ].map(({ rank, label, color }) => {
                      const key = `${tier}_${rank}`;
                      const val = tierRankCosts[key] ?? (tier * 100);
                      return (
                        <div key={rank} className={`p-2 rounded-lg border ${color} flex flex-col justify-between gap-1`}>
                          <span className="text-[10px] font-black tracking-wider uppercase">{label}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="50000"
                              value={val}
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                setTierRankCosts((prev) => ({
                                  ...prev,
                                  [key]: num,
                                }));
                              }}
                              className="w-full px-1.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                            />
                            <span className="text-[9px] text-zinc-500 font-mono">XP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desígnios XP Costs by Rank */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Compass size={14} className="text-amber-400" />
                Custos de XP para Desígnios Separados por Rank
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Evolução por Nível de Desígnio</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { rank: 'D', label: 'Rank D', color: 'text-zinc-300 bg-zinc-900 border-zinc-800' },
                { rank: 'C', label: 'Rank C', color: 'text-cyan-300 bg-cyan-950/20 border-cyan-800/50' },
                { rank: 'B', label: 'Rank B', color: 'text-purple-300 bg-purple-950/20 border-purple-800/50' },
                { rank: 'A', label: 'Rank A', color: 'text-amber-300 bg-amber-950/20 border-amber-800/50' },
                { rank: 'S', label: 'Rank S', color: 'text-red-300 bg-red-950/20 border-red-800/50' },
              ].map(({ rank, label, color }) => {
                const val = designioRankCosts[rank] ?? 100;
                return (
                  <div key={rank} className={`p-2.5 rounded-xl border ${color} flex flex-col justify-between gap-1.5`}>
                    <span className="text-xs font-black tracking-wider uppercase flex items-center justify-between">
                      <span>{label}</span>
                      <span className="text-[9px] text-zinc-500 font-normal">por nível</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        value={val}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          setDesignioRankCosts((prev) => ({
                            ...prev,
                            [rank]: num,
                          }));
                        }}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono">XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetCosts}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Restaurar Padrões</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Check size={16} />
              <span>Salvar Regras de Custos de XP</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: EDITOR DE HABILIDADES */}
      {activeSubTab === 'skills' && (
        <SkillEditorView
          allSkillsMap={allSkillsMap}
          customSkillsMap={customSkillsMap}
          onSaveSkill={onSaveSkill}
          onResetSkill={onResetSkill}
          onResetAllCustomSkills={onResetAllCustomSkills}
          onImportCustomSkills={onImportCustomSkills}
        />
      )}
    </div>
  );
};

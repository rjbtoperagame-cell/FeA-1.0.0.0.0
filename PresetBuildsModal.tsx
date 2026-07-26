import React, { useState } from 'react';
import { SkillNode, DiceRollResult } from '../types';
import { Dices, RotateCcw, X, Sparkles, Check, Flame } from 'lucide-react';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkillToRoll?: SkillNode | null;
  unlockedSkills?: SkillNode[];
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  isOpen,
  onClose,
  activeSkillToRoll = null,
  unlockedSkills = [],
}) => {
  const [modifier, setModifier] = useState<number>(3);
  const [history, setHistory] = useState<DiceRollResult[]>([]);
  const [rollMode, setRollMode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(activeSkillToRoll);

  if (!isOpen) return null;

  // Execute a die roll
  const rollDie = (sides: number, count: number = 1, skillName?: string) => {
    let rolls: number[] = [];
    if (sides === 20 && rollMode !== 'normal') {
      const roll1 = Math.floor(Math.random() * 20) + 1;
      const roll2 = Math.floor(Math.random() * 20) + 1;
      const chosen = rollMode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
      rolls = [chosen];
    } else {
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
    }

    const sumRolls = rolls.reduce((acc, curr) => acc + curr, 0);
    const total = sumRolls + modifier;
    const isCrit = rolls.some((r) => r === sides);
    const isFumble = rolls.some((r) => r === 1);

    const notation = `${count}d${sides}${modifier >= 0 ? `+${modifier}` : modifier}`;

    const newResult: DiceRollResult = {
      id: Math.random().toString(36).substring(2, 9),
      skillName,
      diceNotation: notation,
      individualRolls: rolls,
      modifier,
      total,
      isCrit,
      isFumble,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setHistory((prev) => [newResult, ...prev.slice(0, 19)]);
  };

  // Roll from selected skill formula parse (e.g. "3d8 + Mod. de Fogo")
  const rollSkillFormula = (skill: SkillNode) => {
    const match = skill.diceRoll.match(/(\d+)d(\d+)/);
    if (match) {
      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      rollDie(sides, count, skill.name);
    } else {
      rollDie(20, 1, skill.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Dices size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-100">Rolador de Dados TTRPG</h3>
              <span className="text-xs text-zinc-400">Simulador de Combate & Testes de Habilidade</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Active Skill Selector if present */}
          {unlockedSkills.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Rolar Habilidade do Personagem:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedSkill?.id || ''}
                  onChange={(e) => {
                    const sk = unlockedSkills.find((s) => s.id === e.target.value);
                    setSelectedSkill(sk || null);
                  }}
                  className="flex-1 p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Selecione uma Habilidade Aprendida --</option>
                  {unlockedSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.diceRoll})
                    </option>
                  ))}
                </select>

                <button
                  disabled={!selectedSkill}
                  onClick={() => selectedSkill && rollSkillFormula(selectedSkill)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Rolar Habilidade</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Dice Buttons */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Dados Rápidos:
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'd20', sides: 20 },
                { label: 'd12', sides: 12 },
                { label: 'd10', sides: 10 },
                { label: 'd8', sides: 8 },
                { label: 'd6', sides: 6 },
                { label: 'd4', sides: 4 },
              ].map((d) => (
                <button
                  key={d.sides}
                  onClick={() => rollDie(d.sides, 1)}
                  className="py-3 rounded-xl bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/50 border border-zinc-800 font-mono font-bold text-xs text-amber-300 hover:text-amber-400 transition-colors shadow-sm"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modifier & Advantage Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Modificador (+/-)
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModifier((m) => m - 1)}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 font-bold text-zinc-300 text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(Number(e.target.value))}
                  className="w-full text-center py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl font-mono font-bold text-amber-400 text-sm focus:outline-none"
                />
                <button
                  onClick={() => setModifier((m) => m + 1)}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 font-bold text-zinc-300 text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Vantagem (d20)
              </label>
              <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-[11px] font-medium">
                <button
                  onClick={() => setRollMode('normal')}
                  className={`flex-1 py-1 rounded-lg transition-colors ${
                    rollMode === 'normal' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-500'
                  }`}
                >
                  Norm.
                </button>
                <button
                  onClick={() => setRollMode('advantage')}
                  className={`flex-1 py-1 rounded-lg transition-colors ${
                    rollMode === 'advantage' ? 'bg-emerald-900/60 text-emerald-300 font-bold' : 'text-zinc-500'
                  }`}
                >
                  Vant.
                </button>
                <button
                  onClick={() => setRollMode('disadvantage')}
                  className={`flex-1 py-1 rounded-lg transition-colors ${
                    rollMode === 'disadvantage' ? 'bg-red-900/60 text-red-300 font-bold' : 'text-zinc-500'
                  }`}
                >
                  Desv.
                </button>
              </div>
            </div>
          </div>

          {/* Roll History Feed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Histórico de Rolagens
              </label>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1"
                >
                  <RotateCcw size={10} />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-6 text-center bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-zinc-500 text-xs">
                Clique nos dados acima para realizar rolagens.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      item.isCrit
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : item.isFumble
                        ? 'bg-red-500/20 border-red-500/60'
                        : 'bg-zinc-900/80 border-zinc-800'
                    }`}
                  >
                    <div>
                      {item.skillName && (
                        <span className="text-xs font-bold text-amber-300 block mb-0.5">
                          {item.skillName}
                        </span>
                      )}
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {item.diceNotation} → Dados: [{item.individualRolls.join(', ')}]
                        {item.modifier !== 0 && ` ${item.modifier >= 0 ? `+ ${item.modifier}` : `- ${Math.abs(item.modifier)}`}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold font-mono text-zinc-100">
                        {item.total}
                      </div>
                      {item.isCrit && (
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-0.5">
                          <Flame size={10} /> CRÍTICO!
                        </span>
                      )}
                      {item.isFumble && (
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                          FALHA CRÍTICA
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

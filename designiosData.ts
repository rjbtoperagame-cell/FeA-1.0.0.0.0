import React, { useState, useEffect } from 'react';
import { SkillNode, SkillRank, XPConfig, getSkillXpCost } from '../types';
import { ELEMENTS, ANIMALS } from '../data/rpgData';
import { IconHelper } from './IconHelper';
import { X, Check, Lock, Zap, Shield, Sparkles, BookOpen, Dices, Layers, Coins } from 'lucide-react';

interface SkillDetailModalProps {
  skill: SkillNode | null;
  onClose: () => void;
  unlockedSkillIds: string[];
  userSkillRanks?: Record<string, SkillRank>;
  onUpgradeSkillRank?: (skillId: string) => void;
  xpAvailable?: number;
  xpConfig?: XPConfig;
  onToggleUnlock: (skillId: string) => void;
  allSkillsMap: Record<string, SkillNode>;
  onTestRollSkill: (skill: SkillNode) => void;
}

export type RankType = 'D' | 'C' | 'B' | 'A' | 'S';

export function getScaledSkillForRank(skill: SkillNode, rank: RankType) {
  const rankMultipliers: Record<RankType, number> = {
    D: 1,
    C: 2,
    B: 3,
    A: 4,
    S: 5,
  };

  const mult = rankMultipliers[rank];

  // Calculate PMs cost scaling
  let manaCost = skill.manaCost;
  if (manaCost > 0) {
    manaCost = Math.max(1, skill.manaCost + (mult - 1) * 2);
  }

  // Calculate Dice scaling
  let diceRoll = skill.diceRoll;
  if (diceRoll.includes('1d6') || diceRoll.includes('d6')) {
    diceRoll = `${mult}d6 + Modificador`;
  } else if (diceRoll.includes('1d8') || diceRoll.includes('d8')) {
    diceRoll = `${mult}d8 + Mod. Elemental`;
  } else if (diceRoll.includes('2x')) {
    diceRoll = `${mult}x (${Math.max(1, mult - 1)}d6 + Atq)`;
  } else if (diceRoll.includes('4d10')) {
    diceRoll = `${mult + 3}d10 + Mod. Supremo`;
  }

  // Calculate Effect Summary scaling
  let effectSummary = skill.effectSummary;
  if (effectSummary.includes('Atq+2')) {
    effectSummary = `Atq+${mult * 2}`;
  } else if (effectSummary.includes('A.esp+2')) {
    effectSummary = `A.esp+${mult * 2}`;
  } else if (effectSummary.includes('Def+1')) {
    effectSummary = `Def+${mult}`;
  } else if (effectSummary.includes('PVs Mágicos +5')) {
    effectSummary = `PVs Mágicos +${mult * 5}`;
  } else if (effectSummary.includes('A.esp+3')) {
    effectSummary = `A.esp+${mult * 3} (${1 + mult} alvos)`;
  } else if (effectSummary.includes('Vel.Mov +2')) {
    effectSummary = `Vel.Mov +${mult + 1}`;
  } else if (effectSummary.includes('Vel.Atq +2')) {
    effectSummary = `Vel.Atq +${mult + 1}`;
  } else if (effectSummary.includes('Crítico +2')) {
    effectSummary = `Crítico +${mult + 1}`;
  } else if (effectSummary.includes('Atq Inimigo -1')) {
    effectSummary = `Atq Inimigo -${mult}`;
  } else if (effectSummary.includes('-1 PV/ação')) {
    effectSummary = `-${mult} PV/ação (Max ${mult + 2} Stacks)`;
  } else if (effectSummary.includes('PMs +5')) {
    effectSummary = `PMs +${mult * 5} permanente`;
  }

  return {
    rank,
    manaCost,
    diceRoll,
    effectSummary,
    description: `Habilidade Rank ${rank} (${skill.type}). Consome ${manaCost > 0 ? manaCost + ' PMs' : '0 PMs'}. Efeito: ${effectSummary}. Alcance: ${skill.range}. ${skill.duration}, ${skill.cooldownRec}.`,
  };
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  onClose,
  unlockedSkillIds,
  userSkillRanks = {},
  onUpgradeSkillRank,
  xpAvailable = 0,
  xpConfig,
  onToggleUnlock,
  allSkillsMap,
  onTestRollSkill,
}) => {
  if (!skill) return null;

  const [selectedRank, setSelectedRank] = useState<RankType>('D');

  useEffect(() => {
    setSelectedRank('D');
  }, [skill?.id]);

  const elemDef = ELEMENTS[skill.elementId];
  const animalDef = ANIMALS[skill.animalId];
  const isUnlocked = unlockedSkillIds.includes(skill.id);

  const scaledStats = getScaledSkillForRank(skill, selectedRank);

  const skillXpCost = getSkillXpCost({ tier: skill.tier, rank: selectedRank }, xpConfig);

  // Prerequisites check
  const missingPrereqs = skill.prerequisites.filter((id) => !unlockedSkillIds.includes(id));
  const meetsPrereqs = missingPrereqs.length === 0;
  const meetsXP = xpAvailable >= skillXpCost || isUnlocked;

  const canUnlock = meetsPrereqs && meetsXP;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Header Banner */}
        <div
          className="relative p-6 text-white overflow-hidden border-b border-zinc-800"
          style={{
            background: `linear-gradient(135deg, ${elemDef.colorHex}22 0%, rgba(18, 18, 20, 0.95) 100%)`,
          }}
        >
          {/* Background Glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: elemDef.colorHex }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900/60 hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-center shadow-lg ${elemDef.bgClass} ${elemDef.borderClass}`}
              style={{ color: elemDef.colorHex }}
            >
              <IconHelper name={elemDef.iconName} size={32} />
            </div>

            <div className="flex-1 pr-8">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${elemDef.colorHex}15`,
                    color: elemDef.colorHex,
                    borderColor: `${elemDef.colorHex}40`,
                  }}
                >
                  {elemDef.name}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                  {skill.type}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Rank Selecionado: {selectedRank}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Tier {skill.tier} {skill.isUltimate && '• SUPREMA'}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">
                {skill.name}
              </h2>
              <p className="text-xs text-zinc-400">
                Guardião: <strong className="text-zinc-200">{animalDef.name}</strong> • Arma: <strong className="text-zinc-200">{animalDef.weapon}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Rank Selector Tabs (Every skill scales from Rank D to S) */}
          <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Layers size={14} className="text-amber-400" />
                Evolução de Rank da Habilidade (Rank D a S)
              </span>
              <span className="text-[10px] text-zinc-400">Progresso independente do Tier</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {(['D', 'C', 'B', 'A', 'S'] as RankType[]).map((r) => {
                const isActive = selectedRank === r;
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRank(r)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center border ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                        : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span>Rank {r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Mechanical Stats Grid for Selected Rank */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80">
              <span className="text-xs text-zinc-500 block mb-1">Custo de Mana</span>
              <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                <Zap size={16} />
                <span>{scaledStats.manaCost > 0 ? `-${scaledStats.manaCost} PMs` : 'Sem Custo'}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80">
              <span className="text-xs text-zinc-500 block mb-1">Duração do Efeito</span>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Shield size={16} />
                <span>{skill.duration || 'Instantâneo'}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80">
              <span className="text-xs text-zinc-500 block mb-1">Tempo de Recarga</span>
              <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                <Sparkles size={16} />
                <span>{skill.cooldownRec || skill.cooldown}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80">
              <span className="text-xs text-zinc-500 block mb-1">Dado / Ação</span>
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Dices size={16} />
                <span>{scaledStats.diceRoll}</span>
              </div>
            </div>
          </div>

          {/* Effect Summary Badge */}
          {scaledStats.effectSummary && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 flex items-center justify-between text-xs font-bold">
              <span>Efeito Principal no Rank {selectedRank}:</span>
              <span className="text-amber-400 font-mono text-sm">{scaledStats.effectSummary}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen size={14} className="text-zinc-500" />
              Efeito Mecânico do Rank {selectedRank}
            </h4>
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/60 leading-relaxed text-zinc-200">
              {scaledStats.description}
            </div>
          </div>

          {/* Lore text */}
          {skill.lore && (
            <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-900 italic text-xs text-zinc-400 border-l-2" style={{ borderLeftColor: elemDef.colorHex }}>
              "{skill.lore}"
            </div>
          )}

          {/* Requirements & Prerequisites Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Requisitos de Aprendizado
            </h4>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${meetsXP ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-red-950/20 border-red-800/40 text-red-300'}`}>
                <span>Custo de XP (Tier {skill.tier}): <strong>{skillXpCost} XP</strong> (Disponível: {xpAvailable} XP)</span>
                {meetsXP ? <Check size={16} className="text-emerald-400" /> : <X size={16} className="text-red-400" />}
              </div>

              {skill.prerequisites.length > 0 && (
                <div className={`p-3 rounded-lg border ${meetsPrereqs ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/20 border-amber-800/40 text-amber-300'}`}>
                  <span className="block font-semibold mb-1">Habilidades Pré-requisito Necessárias:</span>
                  <div className="space-y-1">
                    {skill.prerequisites.map((reqId) => {
                      const reqNode = allSkillsMap[reqId];
                      const isReqUnlocked = unlockedSkillIds.includes(reqId);
                      return (
                        <div key={reqId} className="flex items-center justify-between pl-2 border-l border-zinc-700/50">
                          <span>{reqNode ? reqNode.name : reqId}</span>
                          {isReqUnlocked ? (
                            <span className="text-xs text-emerald-400 flex items-center gap-1"><Check size={12} /> Aprendida</span>
                          ) : (
                            <span className="text-xs text-amber-400 flex items-center gap-1"><Lock size={12} /> Bloqueada</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onTestRollSkill({
                ...skill,
                diceRoll: scaledStats.diceRoll,
                manaCost: scaledStats.manaCost,
                effectSummary: scaledStats.effectSummary,
                rank: selectedRank,
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-2 transition-colors border border-zinc-700/60"
          >
            <Dices size={16} className="text-amber-400" />
            <span>Testar Dado (Rank {selectedRank})</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white font-medium text-xs transition-colors"
            >
              Fechar
            </button>

            {isUnlocked ? (
              <button
                onClick={() => onToggleUnlock(skill.id)}
                className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <X size={16} />
                <span>Esquecer Habilidade</span>
              </button>
            ) : (
              <button
                disabled={!canUnlock}
                onClick={() => onToggleUnlock(skill.id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                  canUnlock
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20 hover:scale-[1.02]'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <Check size={16} />
                <span>Aprender ({skillXpCost} XP)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

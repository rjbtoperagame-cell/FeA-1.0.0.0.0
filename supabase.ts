import React, { useState } from 'react';
import { AnimalDefinition, ElementId, SkillNode, SkillRank, XPConfig, getSkillXpCost } from '../types';
import { ELEMENTS } from '../data/rpgData';
import { SkillNodeItem } from './SkillNodeItem';
import { IconHelper } from './IconHelper';
import { checkTierUnlocked } from '../utils/xpUtils';
import { RotateCcw, Sparkles, Shield, Zap, Search, Filter, Layers, CheckCircle2, Coins, Lock } from 'lucide-react';

interface SkillTreeCanvasProps {
  animal: AnimalDefinition;
  skillsByElement: Record<ElementId, SkillNode[]>;
  unlockedSkillIds: string[];
  userSkillRanks?: Record<string, SkillRank>;
  onUpgradeSkillRank?: (skillId: string) => void;
  xpTotal: number;
  xpAvailable: number;
  xpSpent: number;
  xpConfig: XPConfig;
  onSelectSkill: (skill: SkillNode) => void;
  onQuickToggleSkill: (skillId: string) => void;
  onResetTree: () => void;
  allSkillsMap: Record<string, SkillNode>;
}

export const SkillTreeCanvas: React.FC<SkillTreeCanvasProps> = ({
  animal,
  skillsByElement,
  unlockedSkillIds,
  userSkillRanks = {},
  xpTotal,
  xpAvailable,
  xpSpent,
  xpConfig,
  onSelectSkill,
  onQuickToggleSkill,
  onResetTree,
  allSkillsMap,
}) => {
  // Active element tab filter or 'all'
  const [activeElementTab, setActiveElementTab] = useState<ElementId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const visibleElements = activeElementTab === 'all' ? animal.elements : [activeElementTab];

  // Helper to check if a node can be unlocked using XP
  const isNodeAvailable = (skill: SkillNode): boolean => {
    if (unlockedSkillIds.includes(skill.id)) return true;

    // Check Tier unlocking rule: requires at least one skill from previous tier at Rank B or superior
    const tierCheck = checkTierUnlocked(skill.tier, unlockedSkillIds, userSkillRanks, allSkillsMap);
    if (!tierCheck.unlocked) return false;

    const skillCost = getSkillXpCost(skill, xpConfig);
    if (xpAvailable < skillCost) return false;
    if (skill.prerequisites.length === 0) return true;
    return skill.prerequisites.some((prereqId) => unlockedSkillIds.includes(prereqId));
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className="p-4 sm:p-6 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Animal Profile Header */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border text-white"
              style={{
                backgroundColor: `${animal.color}25`,
                borderColor: `${animal.color}60`,
              }}
            >
              <IconHelper name={animal.iconName} size={32} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                  {animal.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-amber-400 border border-zinc-700">
                  Arma: {animal.weapon}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-lg">
                {animal.description}
              </p>
            </div>
          </div>

          {/* Right: XP Counters */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {/* XP Available Indicator */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900/90 rounded-xl border border-amber-500/30 shadow-md">
              <Coins className="w-5 h-5 text-amber-400" />
              <div className="text-left font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
                  XP Disponível
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-amber-300">{xpAvailable} XP</span>
                  <span className="text-xs text-zinc-500">/ Gastos: {xpSpent} XP</span>
                </div>
              </div>
            </div>

            {/* Total XP Badge */}
            <div className="px-3.5 py-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-400">
              <span className="text-[10px] block text-zinc-500 uppercase font-bold">XP Total Acumulado</span>
              <span className="text-sm font-mono font-bold text-emerald-400">{xpTotal} XP</span>
            </div>

            {/* Reset Tree */}
            <button
              onClick={onResetTree}
              title="Reiniciar Árvores"
              className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-800/50 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Resetar</span>
            </button>
          </div>
        </div>

        {/* Filter & Element Selector Tabs */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Element Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveElementTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                activeElementTab === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Layers size={14} />
              <span>Todos os 3 Elementos</span>
            </button>

            {animal.elements.map((elemId) => {
              const elemDef = ELEMENTS[elemId];
              const isSelected = activeElementTab === elemId;
              return (
                <button
                  key={elemId}
                  onClick={() => setActiveElementTab(elemId)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? `${elemDef.bgClass} ${elemDef.textClass} ${elemDef.borderClass} shadow-md ring-1 ring-amber-500/20`
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <IconHelper name={elemDef.iconName} size={14} />
                  <span>{elemDef.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Action Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar habilidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Trees Display Grid */}
      <div
        className={`grid gap-8 ${
          visibleElements.length === 1
            ? 'grid-cols-1 max-w-2xl mx-auto'
            : 'grid-cols-1 lg:grid-cols-3'
        }`}
      >
        {visibleElements.map((elemId) => {
          const elemDef = ELEMENTS[elemId];
          const rawSkills = skillsByElement[elemId] || [];

          // Filter by search query if present
          const skills = searchQuery.trim()
            ? rawSkills.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : rawSkills;

          // Group skills by rowIndex (Row 0 to Row 5)
          const rows: SkillNode[][] = [[], [], [], [], [], []];
          skills.forEach((s) => {
            if (s.rowIndex >= 0 && s.rowIndex <= 5) {
              rows[s.rowIndex].push(s);
            }
          });

          const unlockedCount = rawSkills.filter((s) => unlockedSkillIds.includes(s.id)).length;

          return (
            <div
              key={elemId}
              className="relative p-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl flex flex-col items-center overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${elemDef.colorHex}08 0%, rgba(9, 9, 11, 0.95) 100%)`,
              }}
            >
              {/* Elemental Tree Header Banner */}
              <div className="w-full pb-4 mb-6 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl border text-white shadow-md"
                    style={{
                      backgroundColor: `${elemDef.colorHex}20`,
                      borderColor: `${elemDef.colorHex}40`,
                      color: elemDef.colorHex,
                    }}
                  >
                    <IconHelper name={elemDef.iconName} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                      Caminho do {elemDef.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 block">
                      {elemDef.damageType} • {elemDef.primaryStat}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {unlockedCount} / 15
                  </span>
                  <span className="text-[9px] text-zinc-500 block">Desbloqueadas</span>
                </div>
              </div>

              {/* Rows Stack */}
              <div className="w-full space-y-8 flex flex-col items-center relative py-2">
                {rows.map((rowSkills, rowIndex) => {
                  if (rowSkills.length === 0) return null;

                  return (
                    <div key={rowIndex} className="w-full flex flex-col items-center relative">
                      {/* Tier Row Label */}
                      <div className="mb-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/60 border border-zinc-800">
                        {rowIndex === 5 ? 'Tier 6 — Habilidade Suprema' : `Linha ${rowIndex + 1} (Tier ${rowIndex + 1})`}
                      </div>

                      {/* Nodes Row Flex Container */}
                      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap w-full">
                        {rowSkills.map((skill) => {
                          const unlocked = unlockedSkillIds.includes(skill.id);
                          const available = isNodeAvailable(skill);

                          return (
                            <SkillNodeItem
                              key={skill.id}
                              skill={skill}
                              isUnlocked={unlocked}
                              isAvailable={available}
                              onSelect={onSelectSkill}
                              xpConfig={xpConfig}
                              onQuickToggle={(e, id) => {
                                e.stopPropagation();
                                onQuickToggleSkill(id);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

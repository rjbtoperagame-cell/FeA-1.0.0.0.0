import React, { useState, useMemo } from 'react';
import { DesignioDefinition, DesignioRank, DESIGNIOS_LIST } from '../data/designiosData';
import { XPConfig, getDesignioXpCost } from '../types';
import {
  Compass,
  Sparkles,
  Search,
  Award,
  Plus,
  Minus,
  Coins,
  Shield,
  Zap,
} from 'lucide-react';

interface DesigniosViewProps {
  xpTotal: number;
  xpSpent: number;
  xpAvailable: number;
  xpConfig: XPConfig;
  userDesignios?: Record<string, number>;
  onDesignioLevelChange?: (designioId: string, delta: number) => void;
  designiosList?: DesignioDefinition[];
}

export const DesigniosView: React.FC<DesigniosViewProps> = ({
  xpTotal,
  xpSpent,
  xpAvailable,
  xpConfig,
  userDesignios = {},
  onDesignioLevelChange,
  designiosList = [],
}) => {
  const [selectedRank, setSelectedRank] = useState<'ALL' | DesignioRank>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeList = useMemo(() => {
    return designiosList && designiosList.length > 0 ? designiosList : DESIGNIOS_LIST;
  }, [designiosList]);

  // Count active desígnios acquired
  const activeAcquiredCount = useMemo(() => {
    return Object.values(userDesignios).filter((lvl: number) => lvl > 0).length;
  }, [userDesignios]);

  const filteredDesignios = useMemo(() => {
    return activeList.filter((des) => {
      const matchRank = selectedRank === 'ALL' || des.rank === selectedRank;
      const matchQuery =
        !searchQuery.trim() ||
        des.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRank && matchQuery;
    });
  }, [activeList, selectedRank, searchQuery]);

  const rankStyles: Record<DesignioRank, { border: string; bg: string; text: string; badge: string }> = {
    D: { border: 'border-zinc-800', bg: 'bg-zinc-950/80', text: 'text-zinc-300', badge: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
    C: { border: 'border-cyan-800/50', bg: 'bg-cyan-950/10', text: 'text-cyan-300', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
    B: { border: 'border-purple-800/50', bg: 'bg-purple-950/10', text: 'text-purple-300', badge: 'bg-purple-950/80 text-purple-300 border-purple-800' },
    A: { border: 'border-amber-800/50', bg: 'bg-amber-950/10', text: 'text-amber-300', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' },
    S: { border: 'border-red-800/50', bg: 'bg-red-950/10', text: 'text-red-300', badge: 'bg-red-950/80 text-red-300 border-red-800' },
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner & XP Stats Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/80 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl shadow-inner shrink-0">
            <Compass size={28} className="sm:hidden" />
            <Compass size={32} className="hidden sm:block" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-zinc-100 uppercase tracking-wide">
                Desígnios do RPG
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                {activeAcquiredCount} Adquirido(s)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Escolha e evolua Desígnios para obter fortalecimentos passivos e aumentos permanentes nos atributos do seu personagem.
            </p>
          </div>
        </div>

        {/* XP Status Card */}
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 bg-zinc-950/90 border border-amber-500/30 rounded-xl shadow-md w-full md:w-auto justify-around shrink-0">
          <Coins className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
          <div className="flex items-baseline gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">XP Disponível</span>
              <span className="text-sm sm:text-base font-black text-amber-300">{xpAvailable} XP</span>
            </div>
            <div className="text-zinc-600">|</div>
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">XP Gastos</span>
              <span className="text-xs font-bold text-zinc-400">{xpSpent} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 sm:p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar Desígnio por nome ou efeito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto no-scrollbar snap-x">
            {(['ALL', 'D', 'C', 'B', 'A', 'S'] as const).map((rank) => (
              <button
                key={rank}
                onClick={() => setSelectedRank(rank)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap snap-start shrink-0 min-h-[36px] ${
                  selectedRank === rank
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {rank === 'ALL' ? 'Todos Ranks' : `Rank ${rank}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Desígnios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesignios.map((des) => {
          const currentLevel = userDesignios[des.id] || 0;
          const cost = getDesignioXpCost(des.rank, xpConfig);
          
          // Prerequisite check
          let prereqMet = true;
          let parentName = '';
          if (des.prerequisiteId) {
            const parent = activeList.find((d) => d.id === des.prerequisiteId);
            parentName = parent ? parent.name : des.prerequisiteId;
            const parentLevel = userDesignios[des.prerequisiteId] || 0;
            const reqLevel = des.prerequisiteLevel || 5;
            if (parentLevel < reqLevel) {
              prereqMet = false;
            }
          }

          const canAfford = prereqMet && xpAvailable >= cost;
          const style = rankStyles[des.rank];

          return (
            <div
              key={des.id}
              className={`p-4 rounded-2xl border ${style.border} ${style.bg} flex flex-col justify-between gap-4 transition-all relative group ${
                currentLevel > 0 ? 'ring-1 ring-amber-500/40 shadow-xl shadow-amber-500/5' : 'hover:border-zinc-700'
              } ${!prereqMet ? 'opacity-70' : ''}`}
            >
              <div>
                {/* Header: Name + Rank & Level Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className={`text-base font-black ${style.text} flex items-center gap-1.5`}>
                      {currentLevel > 0 && <Sparkles size={16} className="text-amber-400 shrink-0" />}
                      {des.name}
                    </h3>
                    <span className="text-[11px] text-zinc-500 font-mono">Custo por Nível: {cost} XP</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border ${style.badge}`}>
                      Rank {des.rank}
                    </span>
                    {currentLevel > 0 ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Nív. {currentLevel}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-zinc-900 text-zinc-600 border border-zinc-800">
                        Não Ativo
                      </span>
                    )}
                  </div>
                </div>

                {/* Prerequisite Indicator if locked */}
                {!prereqMet && des.prerequisiteId && (
                  <div className="mb-2 p-2 rounded-xl bg-red-950/30 border border-red-800/40 text-[10px] text-red-300 font-medium flex items-center gap-1.5">
                    <Shield size={13} className="text-red-400 shrink-0" />
                    <span>Requer: {des.prerequisiteLevel || 5} níveis de <strong>{parentName}</strong></span>
                  </div>
                )}

                {/* Attribute Bonus Badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {des.pvs ? <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-900/50 text-[11px] font-mono font-bold">PVs +{des.pvs * (currentLevel || 1)}</span> : null}
                    {des.pms ? <span className="px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-900/50 text-[11px] font-mono font-bold">PMs +{des.pms * (currentLevel || 1)}</span> : null}
                    {des.ataque ? <span className="px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-900/50 text-[11px] font-mono font-bold">Ataque +{des.ataque * (currentLevel || 1)}</span> : null}
                    {des.defesa ? <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/50 text-[11px] font-mono font-bold">Defesa +{des.defesa * (currentLevel || 1)}</span> : null}
                    {des.atqEspecial ? <span className="px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-900/50 text-[11px] font-mono font-bold">Atq.Esp +{des.atqEspecial * (currentLevel || 1)}</span> : null}
                    {des.defEspecial ? <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-900/50 text-[11px] font-mono font-bold">Def.Esp +{des.defEspecial * (currentLevel || 1)}</span> : null}
                    {des.velAtq ? <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-200 border border-cyan-900/50 text-[11px] font-mono font-bold">Vel.Atq +{des.velAtq * (currentLevel || 1)}</span> : null}
                    {des.velMov ? <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-200 border border-emerald-900/50 text-[11px] font-mono font-bold">Vel.Mov +{des.velMov * (currentLevel || 1)}</span> : null}
                    {des.velEspecial ? <span className="px-2 py-0.5 rounded bg-purple-950/50 text-purple-200 border border-purple-900/50 text-[11px] font-mono font-bold">Vel.Esp +{des.velEspecial * (currentLevel || 1)}</span> : null}
                    {des.dCrit ? <span className="px-2 py-0.5 rounded bg-amber-950/50 text-amber-200 border border-amber-900/50 text-[11px] font-mono font-bold">D.Crit +{des.dCrit * (currentLevel || 1)}</span> : null}
                    {des.regeneracao ? <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/50 text-[11px] font-mono font-bold">Regen. +{des.regeneracao * (currentLevel || 1)}</span> : null}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {des.description}
                    {currentLevel > 1 && (
                      <span className="block text-[11px] text-amber-400 font-semibold mt-1">
                        • Multiplicador Nível {currentLevel}: bônus x{currentLevel} acumulados!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Bottom Evolution Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDesignioLevelChange?.(des.id, -1)}
                    disabled={currentLevel <= 0}
                    className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 transition-colors"
                    title="Reduzir Nível"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center font-black text-sm text-zinc-100 font-mono">
                    {currentLevel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDesignioLevelChange?.(des.id, 1)}
                    disabled={!canAfford}
                    className="w-8 h-8 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 transition-colors"
                    title={!prereqMet ? `Requer ${des.prerequisiteLevel || 5} níveis de ${parentName}` : canAfford ? `Aumentar Nível (+${cost} XP)` : `Sem XP suficiente (${cost} XP)`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onDesignioLevelChange?.(des.id, 1)}
                  disabled={!canAfford}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title={!prereqMet ? `Requer ${des.prerequisiteLevel || 5} níveis de ${parentName}` : undefined}
                >
                  <Award size={14} />
                  <span>{currentLevel > 0 ? 'Evoluir' : 'Adquirir'} ({cost} XP)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

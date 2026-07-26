import React from 'react';
import { SkillNode, XPConfig, getSkillXpCost } from '../types';
import { ELEMENTS } from '../data/rpgData';
import { IconHelper } from './IconHelper';
import { Lock, Check, Sparkles, Crown } from 'lucide-react';

interface SkillNodeItemProps {
  skill: SkillNode;
  isUnlocked: boolean;
  isAvailable: boolean;
  onSelect: (skill: SkillNode) => void;
  onQuickToggle: (e: React.MouseEvent, skillId: string) => void;
  xpConfig?: XPConfig;
}

export const SkillNodeItem: React.FC<SkillNodeItemProps> = ({
  skill,
  isUnlocked,
  isAvailable,
  onSelect,
  onQuickToggle,
  xpConfig,
}) => {
  const elemDef = ELEMENTS[skill.elementId];
  const skillXpCost = getSkillXpCost(skill, xpConfig);

  return (
    <div className="relative group flex flex-col items-center">
      {/* Node Container Card */}
      <button
        onClick={() => onSelect(skill)}
        className={`relative flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl transition-all duration-300 border backdrop-blur-md cursor-pointer select-none ${
          skill.isUltimate ? 'w-full max-w-[220px] sm:w-56 p-3 sm:p-4 min-h-[100px] sm:min-h-[110px]' : 'w-28 xs:w-32 sm:w-40 min-h-[90px] sm:min-h-[96px]'
        } ${
          isUnlocked
            ? 'bg-zinc-900/90 shadow-xl border-amber-500/50 hover:scale-[1.03] ring-1 ring-amber-500/30'
            : isAvailable
            ? 'bg-zinc-900/60 border-zinc-700 hover:border-amber-400/80 hover:bg-zinc-800/80 hover:scale-[1.02] shadow-md'
            : 'bg-zinc-950/80 border-zinc-900 text-zinc-600 opacity-60 hover:opacity-80'
        }`}
        style={{
          boxShadow: isUnlocked
            ? `0 0 20px ${elemDef.colorHex}35`
            : isAvailable
            ? `0 0 10px ${elemDef.colorHex}15`
            : 'none',
        }}
      >
        {/* Top Badges Bar */}
        <div className="w-full flex items-center justify-between gap-1 text-[10px]">
          <span
            className="px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
            style={{
              backgroundColor: `${elemDef.colorHex}20`,
              color: isUnlocked ? '#fef08a' : elemDef.colorHex,
            }}
          >
            T{skill.tier} • Ranks D-S
          </span>

          <span className="truncate text-zinc-400 font-medium text-[9px] max-w-[80px]">
            {skill.type}
          </span>

          {isUnlocked ? (
            <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Check size={10} />
            </span>
          ) : !isAvailable ? (
            <span className="p-1 rounded-full bg-zinc-900 text-zinc-600">
              <Lock size={10} />
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 font-mono">
              {skillXpCost} XP
            </span>
          )}
        </div>

        {/* Central Icon & Title */}
        <div className="my-1.5 flex flex-col items-center text-center gap-1">
          <div
            className={`p-2 rounded-xl transition-transform ${
              skill.isUltimate ? 'p-2.5 shadow-lg' : ''
            }`}
            style={{
              backgroundColor: isUnlocked ? `${elemDef.colorHex}30` : 'rgba(24, 24, 27, 0.8)',
              color: isUnlocked ? '#ffffff' : isAvailable ? elemDef.colorHex : '#71717a',
            }}
          >
            {skill.isUltimate ? (
              <Crown className="w-6 h-6 animate-pulse text-amber-400" />
            ) : (
              <IconHelper name={elemDef.iconName} size={skill.isUltimate ? 24 : 18} />
            )}
          </div>

          <h5
            className={`font-semibold line-clamp-2 leading-snug transition-colors ${
              skill.isUltimate ? 'text-xs sm:text-sm text-amber-300 font-extrabold' : 'text-[11px] sm:text-xs'
            } ${
              isUnlocked
                ? 'text-zinc-100 font-bold'
                : isAvailable
                ? 'text-zinc-200'
                : 'text-zinc-500'
            }`}
          >
            {skill.name}
          </h5>
        </div>

        {/* Bottom Dice & Mana indicator */}
        <div className="w-full pt-1 border-t border-zinc-800/60 flex items-center justify-between text-[9px] text-zinc-400">
          <span className="truncate font-mono text-amber-400/90">{skill.diceRoll}</span>
          <span>{skill.manaCost > 0 ? `${skill.manaCost}PM` : ''}</span>
        </div>
      </button>

      {/* Quick Action Overlay on Hover */}
      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => onQuickToggle(e, skill.id)}
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md transition-all ${
            isUnlocked
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : isAvailable
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 scale-105'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isUnlocked ? 'Esquecer' : 'Aprender'}
        </button>
      </div>
    </div>
  );
};

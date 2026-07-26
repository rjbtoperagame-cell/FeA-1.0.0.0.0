import React, { useState, useMemo } from 'react';
import { AnimalDefinition, CharacterAttributes, SkillNode, SkillRank, XPConfig, getDesignioXpCost, PurchasedCombatStats } from '../types';
import { ELEMENTS } from '../data/rpgData';
import { DESIGNIOS_LIST, DESIGNIOS_MAP, DesignioRank, DesignioDefinition } from '../data/designiosData';
import { IconHelper } from './IconHelper';
import { getCombatStatCost, getSkillNextUpgradeCost } from '../utils/xpUtils';
import { BookOpen, Dices, Download, Printer, Copy, Check, Sparkles, Shield, Zap, Crown, Plus, Minus, Heart, Flame, Activity, ShieldAlert, FastForward, Swords, Coins, Settings, Compass, Award } from 'lucide-react';

interface CharacterSheetViewProps {
  characterName: string;
  onCharacterNameChange: (name: string) => void;
  animal: AnimalDefinition;
  attributes: CharacterAttributes;
  onAttributesChange: (attrs: CharacterAttributes) => void;
  purchasedCombatStats?: PurchasedCombatStats;
  onCombatStatChange?: (statKey: keyof PurchasedCombatStats, delta: number) => void;
  userSkillRanks?: Record<string, SkillRank>;
  onUpgradeSkillRank?: (skillId: string) => void;
  unlockedSkills: SkillNode[];
  onTestRollSkill: (skill: SkillNode) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  xpTotal: number;
  xpSpent: number;
  xpAvailable: number;
  xpConfig: XPConfig;
  userDesignios?: Record<string, number>;
  onDesignioLevelChange?: (designioId: string, delta: number) => void;
  userRole?: string;
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
  designiosList?: DesignioDefinition[];
  onNavigateToDesignios?: () => void;
}

export const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({
  characterName,
  onCharacterNameChange,
  animal,
  attributes,
  onAttributesChange,
  purchasedCombatStats,
  onCombatStatChange,
  userSkillRanks = {},
  onUpgradeSkillRank,
  unlockedSkills,
  onTestRollSkill,
  notes,
  onNotesChange,
  xpTotal,
  xpSpent,
  xpAvailable,
  xpConfig,
  userDesignios = {},
  onDesignioLevelChange,
  userRole,
  onOpenAdminPanel,
  isAdmin,
  designiosList,
  onNavigateToDesignios,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [designioFilter, setDesignioFilter] = useState<'ALL' | DesignioRank>('ALL');

  // Dynamic desígnios list and map
  const activeDesigniosList = useMemo(() => {
    return designiosList && designiosList.length > 0 ? designiosList : DESIGNIOS_LIST;
  }, [designiosList]);

  // Only habilitated (acquired) desígnios for the character sheet
  const enabledDesigniosList = useMemo(() => {
    return activeDesigniosList.filter((des) => (userDesignios[des.id] || 0) > 0);
  }, [activeDesigniosList, userDesignios]);

  const activeDesigniosMap = useMemo(() => {
    return activeDesigniosList.reduce((acc, des) => {
      acc[des.id] = des;
      return acc;
    }, {} as Record<string, DesignioDefinition>);
  }, [activeDesigniosList]);

  // Group unlocked skills by action type
  const mainActions = unlockedSkills.filter((s) => s.type === 'Ação Principal');
  const bonusActions = unlockedSkills.filter((s) => s.type === 'Ação de Bônus' || s.type === 'Ação de Movimento');
  const reactions = unlockedSkills.filter((s) => s.type === 'Reação');
  const passives = unlockedSkills.filter((s) => s.type === 'Passiva');
  const ultimates = unlockedSkills.filter((s) => s.type === 'Suprema');

  // Compute Desígnios bonuses
  const totalDesignioBonus = useMemo(() => {
    const bonus = {
      pvs: 0,
      pms: 0,
      ataque: 0,
      defesa: 0,
      atqEspecial: 0,
      defEspecial: 0,
      velAtq: 0,
      velMov: 0,
      velEspecial: 0,
      dCrit: 0,
      regeneracao: 0,
    };

    Object.entries(userDesignios || {}).forEach(([id, level]) => {
      const lvl = Number(level) || 0;
      if (lvl <= 0) return;
      const des = activeDesigniosMap[id];
      if (!des) return;

      if (des.pvs) bonus.pvs += des.pvs * lvl;
      if (des.pms) bonus.pms += des.pms * lvl;
      if (des.ataque) bonus.ataque += des.ataque * lvl;
      if (des.defesa) bonus.defesa += des.defesa * lvl;
      if (des.atqEspecial) bonus.atqEspecial += des.atqEspecial * lvl;
      if (des.defEspecial) bonus.defEspecial += des.defEspecial * lvl;
      if (des.velAtq) bonus.velAtq += des.velAtq * lvl;
      if (des.velMov) bonus.velMov += des.velMov * lvl;
      if (des.velEspecial) bonus.velEspecial += des.velEspecial * lvl;
      if (des.dCrit) bonus.dCrit += des.dCrit * lvl;
      if (des.regeneracao) bonus.regeneracao += des.regeneracao * lvl;
    });

    return bonus;
  }, [userDesignios, activeDesigniosMap]);

  // Attribute allocation rules using XP
  const getAttrCost = (key: keyof CharacterAttributes) => {
    return xpConfig.attributeCosts?.[key] ?? xpConfig.costPerAttributePoint ?? 100;
  };

  const handleModifyAttribute = (key: keyof CharacterAttributes, delta: number) => {
    const currentVal = attributes[key];
    const newVal = currentVal + delta;
    const cost = getAttrCost(key);

    if (newVal < 0) return;
    if (delta > 0 && xpAvailable < cost) return; // Must have available XP

    onAttributesChange({
      ...attributes,
      [key]: newVal,
    });
  };

  // Purchased combat stats default fallback
  const purchased = purchasedCombatStats || {
    pvs: 0,
    pms: 0,
    ataque: 0,
    atqEspecial: 0,
    defesa: 0,
    defEspecial: 0,
    critico: 0,
    velAtq: 0,
    velMov: 0,
    velEspecial: 0,
  };

  // Derived Secondary Stats Calculations with Desígnios Bonuses and XP-Purchased Stats
  const pvs = 20 + attributes.constituicao + totalDesignioBonus.pvs + (purchased.pvs || 0);
  const pms = 20 + attributes.poder + totalDesignioBonus.pms + (purchased.pms || 0);
  const ataque = attributes.forca + attributes.destreza + totalDesignioBonus.ataque + (purchased.ataque || 0);
  const defesa = attributes.constituicao + attributes.forca + totalDesignioBonus.defesa + (purchased.defesa || 0);
  const atqEspecial = attributes.poder + (animal.weapon === 'Arco' || animal.weapon === 'Adagas' ? attributes.destreza : attributes.forca) + totalDesignioBonus.atqEspecial + (purchased.atqEspecial || 0);
  const defEspecial = attributes.poder + attributes.constituicao + totalDesignioBonus.defEspecial + (purchased.defEspecial || 0);
  const velAtaque = attributes.destreza + totalDesignioBonus.velAtq + (purchased.velAtq || 0);
  const velMovimento = attributes.destreza + totalDesignioBonus.velMov + (purchased.velMov || 0);
  const deslocamentoMetros = 3 + velMovimento; // Regra: 3m base + 1m por ponto extra em vel. movimento
  const velEspecial = attributes.poder + totalDesignioBonus.velEspecial + (purchased.velEspecial || 0);

  // Copy build summary to clipboard
  const handleCopyBuild = () => {
    let summaryText = `=== FICHA DE PERSONAGEM - RPG DE MESA ===\n`;
    summaryText += `Nome: ${characterName || 'Guardião Sem Nome'}\n`;
    summaryText += `Guardião Animal: ${animal.name} (${animal.weapon})\n`;
    summaryText += `XP Total: ${xpTotal} | XP Gastos: ${xpSpent} | XP Livre: ${xpAvailable}\n\n`;
    summaryText += `--- ATRIBUTOS BASE ---\n`;
    summaryText += `Força: ${attributes.forca} | Destreza: ${attributes.destreza} | Constituição: ${attributes.constituicao} | Poder: ${attributes.poder}\n\n`;
    summaryText += `--- ESTATÍSTICAS DE COMBATE DERIVADAS ---\n`;
    summaryText += `PVs (Vida): ${pvs} (20 + CON)\n`;
    summaryText += `PMs (Mana): ${pms} (20 + POD)\n`;
    summaryText += `Ataque: +${ataque} (FOR + DES)\n`;
    summaryText += `Defesa: +${defesa} (CON + FOR)\n`;
    summaryText += `Ataque Especial: +${atqEspecial} (POD + FOR/DES)\n`;
    summaryText += `Defesa Especial: +${defEspecial} (POD + CON)\n`;
    summaryText += `Velocidades: Atq +${velAtaque} | Mov +${velMovimento} (Deslocamento ${deslocamentoMetros}m) | Esp +${velEspecial}\n\n`;
    summaryText += `--- DESÍGNIOS ADQUIRIDOS & EVOLUÍDOS ---\n`;
    const activeDesignios = Object.entries(userDesignios || {}).filter(([_, lvl]) => Number(lvl) > 0);
    if (activeDesignios.length === 0) {
      summaryText += `Nenhum Desígnio adquirido.\n\n`;
    } else {
      activeDesignios.forEach(([id, lvl]) => {
        const des = activeDesigniosMap[id];
        if (des) {
          summaryText += `- ${des.name} [Rank ${des.rank}] (Nível ${lvl}): ${des.description}\n`;
        }
      });
      summaryText += `\n`;
    }

    summaryText += `--- GRIMÓRIO DE HABILIDADES DEBLOQUEADAS (${unlockedSkills.length}) ---\n`;

    unlockedSkills.forEach((s, idx) => {
      summaryText += `${idx + 1}. ${s.name} [Rank ${s.rank || 'D'}] [${s.type}] - Dado: ${s.diceRoll} (${s.manaCost} PMs, ${s.cooldownRec || s.cooldown})\n`;
      summaryText += `   Efeito: ${s.description}\n\n`;
    });

    navigator.clipboard.writeText(summaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Export JSON file
  const handleExportJSON = () => {
    const data = {
      characterName,
      animalId: animal.id,
      xpTotal,
      xpSpent,
      xpAvailable,
      attributes,
      derivedStats: { pvs, pms, ataque, defesa, atqEspecial, defEspecial, velAtaque, velMovimento, velEspecial },
      unlockedSkillIds: unlockedSkills.map((s) => s.id),
      notes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterName || 'personagem'}_${animal.id}_xp${xpTotal}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Printable Sheet Wrapper */}
      <div className="p-3 sm:p-6 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-xl space-y-4 sm:space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div
              className="p-2.5 sm:p-3 rounded-2xl border text-white shadow-lg shrink-0"
              style={{
                backgroundColor: `${animal.color}20`,
                borderColor: `${animal.color}50`,
                color: animal.color,
              }}
            >
              <IconHelper name={animal.iconName} size={28} className="sm:hidden" />
              <IconHelper name={animal.iconName} size={32} className="hidden sm:block" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => onCharacterNameChange(e.target.value)}
                  placeholder="Nome do Personagem..."
                  className="w-full text-lg sm:text-2xl font-bold bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-1 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 truncate"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 truncate">
                Guardião <strong className="text-zinc-200">{animal.name}</strong> • Arma: <strong className="text-amber-400">{animal.weapon}</strong>
              </p>
            </div>
          </div>

          {/* XP Summary Card & Admin Panel Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-zinc-900/90 border border-amber-500/30 rounded-xl shadow-md w-full sm:w-auto justify-around">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse shrink-0" />
              <div className="flex items-baseline gap-2 sm:gap-3 text-xs font-mono">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 block uppercase font-bold">XP Disponível</span>
                  <span className="text-sm sm:text-base font-black text-amber-300">{xpAvailable} XP</span>
                </div>
                <div className="text-zinc-600">|</div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 block uppercase font-bold">XP Gastos</span>
                  <span className="text-xs font-bold text-zinc-400">{xpSpent} XP</span>
                </div>
                <div className="text-zinc-600">|</div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 block uppercase font-bold">XP Total</span>
                  <span className="text-xs font-bold text-emerald-400">{xpTotal} XP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              {onOpenAdminPanel && userRole === 'admin' && (
                <button
                  onClick={onOpenAdminPanel}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md min-h-[38px]"
                >
                  <Settings size={14} />
                  <span>Mestre (ADM)</span>
                </button>
              )}

              <button
                onClick={handleCopyBuild}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
              >
                {copiedText ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedText ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
              >
                <Download size={14} />
                <span>Exportar</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md min-h-[38px]"
              >
                <Printer size={14} />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. SEÇÃO CARACTERÍSTICAS */}
        <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-3 gap-2">
            <div>
              <h3 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Activity size={20} className="text-amber-400" />
                Características Base do Personagem
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evolua suas características gastando Pontos de Experiência (XP). Custos definidos pelo Mestre.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <Coins size={14} />
              <span>XP Livre: {xpAvailable} XP</span>
            </div>
          </div>

          {/* Atributos Quatro Básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Força */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs font-bold text-red-400 block uppercase tracking-wide">Força (FOR)</span>
                <span className="text-[10px] text-zinc-500 block">Ataque Físico & Impacto</span>
                <span className="text-[10px] font-mono text-amber-400/90 font-semibold">{getAttrCost('forca')} XP / pt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModifyAttribute('forca', -1)}
                  disabled={attributes.forca <= 0}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-black text-lg text-zinc-100 font-mono">{attributes.forca}</span>
                <button
                  onClick={() => handleModifyAttribute('forca', 1)}
                  disabled={xpAvailable < getAttrCost('forca')}
                  title={xpAvailable < getAttrCost('forca') ? `Necessário ${getAttrCost('forca')} XP` : `Aumentar (+${getAttrCost('forca')} XP)`}
                  className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 text-xs font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Destreza */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wide">Destreza (DES)</span>
                <span className="text-[10px] text-zinc-500 block">Precisão, Esquiva & Vel</span>
                <span className="text-[10px] font-mono text-amber-400/90 font-semibold">{getAttrCost('destreza')} XP / pt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModifyAttribute('destreza', -1)}
                  disabled={attributes.destreza <= 0}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-black text-lg text-zinc-100 font-mono">{attributes.destreza}</span>
                <button
                  onClick={() => handleModifyAttribute('destreza', 1)}
                  disabled={xpAvailable < getAttrCost('destreza')}
                  title={xpAvailable < getAttrCost('destreza') ? `Necessário ${getAttrCost('destreza')} XP` : `Aumentar (+${getAttrCost('destreza')} XP)`}
                  className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 text-xs font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Constituição */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wide">Constituição (CON)</span>
                <span className="text-[10px] text-zinc-500 block">Vida Max & Defesa</span>
                <span className="text-[10px] font-mono text-amber-400/90 font-semibold">{getAttrCost('constituicao')} XP / pt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModifyAttribute('constituicao', -1)}
                  disabled={attributes.constituicao <= 0}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-black text-lg text-zinc-100 font-mono">{attributes.constituicao}</span>
                <button
                  onClick={() => handleModifyAttribute('constituicao', 1)}
                  disabled={xpAvailable < getAttrCost('constituicao')}
                  title={xpAvailable < getAttrCost('constituicao') ? `Necessário ${getAttrCost('constituicao')} XP` : `Aumentar (+${getAttrCost('constituicao')} XP)`}
                  className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 text-xs font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Poder */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs font-bold text-purple-400 block uppercase tracking-wide">Poder (POD)</span>
                <span className="text-[10px] text-zinc-500 block">Mana Max & Casting</span>
                <span className="text-[10px] font-mono text-amber-400/90 font-semibold">{getAttrCost('poder')} XP / pt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModifyAttribute('poder', -1)}
                  disabled={attributes.poder <= 0}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-black text-lg text-zinc-100 font-mono">{attributes.poder}</span>
                <button
                  onClick={() => handleModifyAttribute('poder', 1)}
                  disabled={xpAvailable < getAttrCost('poder')}
                  title={xpAvailable < getAttrCost('poder') ? `Necessário ${getAttrCost('poder')} XP` : `Aumentar (+${getAttrCost('poder')} XP)`}
                  className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 text-xs font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Reservas de Vida (PV) e Mana (PM) Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Pontos de Vida (PV) */}
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-400 border border-red-500/40 shrink-0">
                  <Heart size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">Pontos de Vida (PV)</span>
                  <span className="text-[10px] text-zinc-400">20 Base + CON({attributes.constituicao}) {purchased.pvs > 0 ? `+ ${purchased.pvs} XP` : ''}</span>
                  <span className="text-[10px] font-mono text-amber-400/90 font-semibold block">{getCombatStatCost('pvs', xpConfig)} XP / PV</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-red-400 font-mono">{pvs}</span>
                  <span className="text-[10px] text-zinc-500 block">PVs Máximos</span>
                </div>

                {onCombatStatChange && (
                  <div className="flex items-center gap-1.5 pl-3 border-l border-red-500/20">
                    <button
                      type="button"
                      onClick={() => onCombatStatChange('pvs', -1)}
                      disabled={purchased.pvs <= 0}
                      className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                      title="Diminuir 1 PV"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-black text-sm text-red-300 font-mono">
                      +{purchased.pvs}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCombatStatChange('pvs', 1)}
                      disabled={xpAvailable < getCombatStatCost('pvs', xpConfig)}
                      className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-red-300 border border-red-500/30 text-xs font-bold"
                      title={xpAvailable < getCombatStatCost('pvs', xpConfig) ? `Necessário ${getCombatStatCost('pvs', xpConfig)} XP` : `Aumentar 1 PV (+${getCombatStatCost('pvs', xpConfig)} XP)`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pontos de Mana (PM) */}
            <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/40 shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">Pontos de Mana (PM)</span>
                  <span className="text-[10px] text-zinc-400">20 Base + POD({attributes.poder}) {purchased.pms > 0 ? `+ ${purchased.pms} XP` : ''}</span>
                  <span className="text-[10px] font-mono text-amber-400/90 font-semibold block">{getCombatStatCost('pms', xpConfig)} XP / PM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-400 font-mono">{pms}</span>
                  <span className="text-[10px] text-zinc-500 block">PMs Máximos</span>
                </div>

                {onCombatStatChange && (
                  <div className="flex items-center gap-1.5 pl-3 border-l border-blue-500/20">
                    <button
                      type="button"
                      onClick={() => onCombatStatChange('pms', -1)}
                      disabled={purchased.pms <= 0}
                      className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 text-xs font-bold"
                      title="Diminuir 1 PM"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-black text-sm text-blue-300 font-mono">
                      +{purchased.pms}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCombatStatChange('pms', 1)}
                      disabled={xpAvailable < getCombatStatCost('pms', xpConfig)}
                      className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-blue-300 border border-blue-500/30 text-xs font-bold"
                      title={xpAvailable < getCombatStatCost('pms', xpConfig) ? `Necessário ${getCombatStatCost('pms', xpConfig)} XP` : `Aumentar 1 PM (+${getCombatStatCost('pms', xpConfig)} XP)`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO COMBATE */}
        <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Swords size={20} className="text-amber-400" />
              Estatísticas de Combate & Velocidades
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Valores calculados para testes de ataque, defesas, margem de crítico e tempos de ação em rodada
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {/* Ataque */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <Swords size={14} className="text-amber-400" /> Ataque
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-amber-300 font-mono">+{ataque}</strong>
                {purchased.ataque > 0 && <span className="text-xs text-amber-500 font-bold ml-1.5">(+{purchased.ataque} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Força({attributes.forca}) + Destreza({attributes.destreza})</span>
            </div>

            {/* Ataque Especial */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                <Flame size={14} className="text-purple-400" /> Ataque Especial
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-purple-300 font-mono">+{atqEspecial}</strong>
                {purchased.atqEspecial > 0 && <span className="text-xs text-purple-500 font-bold ml-1.5">(+{purchased.atqEspecial} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Poder({attributes.poder}) + Modificadores</span>
            </div>

            {/* Defesa */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" /> Defesa
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-emerald-300 font-mono">+{defesa}</strong>
                {purchased.defesa > 0 && <span className="text-xs text-emerald-500 font-bold ml-1.5">(+{purchased.defesa} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Constituição({attributes.constituicao}) + Força({attributes.forca})</span>
            </div>

            {/* Defesa Especial */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-cyan-400" /> Defesa Especial
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-cyan-300 font-mono">+{defEspecial}</strong>
                {purchased.defEspecial > 0 && <span className="text-xs text-cyan-500 font-bold ml-1.5">(+{purchased.defEspecial} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Poder({attributes.poder}) + Constituição({attributes.constituicao})</span>
            </div>

            {/* Dano Crítico Base */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> Dano Crítico Extra
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Gatilho: Face Máx.
                </span>
              </div>
              <div className="my-2 grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block font-bold">FOR (Físico)</span>
                  <strong className="text-sm font-black text-red-400 font-mono">+{attributes.forca}</strong>
                </div>
                <div className="p-1.5 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block font-bold">DES (Ágil)</span>
                  <strong className="text-sm font-black text-cyan-400 font-mono">+{attributes.destreza}</strong>
                </div>
                <div className="p-1.5 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block font-bold">POD (Mágico)</span>
                  <strong className="text-sm font-black text-purple-400 font-mono">+{attributes.poder}</strong>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400">
                Acerto automático! Crítico ativa ao tirar máx. no dado (Ex: 8 no 1d8).
              </span>
            </div>

            {/* Velocidade de Ataque */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                <FastForward size={14} className="text-cyan-400" /> Vel. Ataque
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-cyan-200 font-mono">+{velAtaque}</strong>
                {purchased.velAtq > 0 && <span className="text-xs text-cyan-500 font-bold ml-1.5">(+{purchased.velAtq} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Iniciativa / Agilidade (DES)</span>
            </div>

            {/* Velocidade de Movimento */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <FastForward size={14} className="text-emerald-400" /> Vel. Movimento
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <strong className="text-2xl font-black text-emerald-200 font-mono">+{velMovimento}</strong>
                <span className="text-xs font-bold text-emerald-400 font-mono">({deslocamentoMetros}m)</span>
                {purchased.velMov > 0 && <span className="text-xs text-emerald-500 font-bold">(+{purchased.velMov} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Deslocamento: 3m + 1m por ponto em Vel</span>
            </div>

            {/* Velocidade de Casting */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/90 flex flex-col justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                <FastForward size={14} className="text-purple-400" /> Vel. Casting
              </span>
              <div className="my-2">
                <strong className="text-2xl font-black text-purple-200 font-mono">+{velEspecial}</strong>
                {purchased.velEspecial > 0 && <span className="text-xs text-purple-500 font-bold ml-1.5">(+{purchased.velEspecial} XP)</span>}
              </div>
              <span className="text-[10px] text-zinc-500">Conjuração Magias (Poder)</span>
            </div>
          </div>

          {/* Sub-painel: Compra Direta de Estatísticas por XP */}
          {onCombatStatChange && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Coins size={14} />
                    Evolução de Atributos de Combate por XP
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    Compre pontos adicionais para customizar os atributos do seu personagem usando XP livre.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  XP Livre: {xpAvailable} XP
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
                {[
                  { key: 'ataque' as const, label: 'Ataque Físico', cost: getCombatStatCost('ataque', xpConfig), val: purchased.ataque },
                  { key: 'atqEspecial' as const, label: 'Atq. Especial', cost: getCombatStatCost('atqEspecial', xpConfig), val: purchased.atqEspecial },
                  { key: 'defesa' as const, label: 'Defesa Física', cost: getCombatStatCost('defesa', xpConfig), val: purchased.defesa },
                  { key: 'defEspecial' as const, label: 'Def. Especial', cost: getCombatStatCost('defEspecial', xpConfig), val: purchased.defEspecial },
                  { key: 'critico' as const, label: 'Bônus Crítico', cost: getCombatStatCost('critico', xpConfig), val: purchased.critico },
                  { key: 'velAtq' as const, label: 'Vel. Ataque', cost: getCombatStatCost('velAtq', xpConfig), val: purchased.velAtq },
                  { key: 'velMov' as const, label: 'Vel. Movimento', cost: getCombatStatCost('velMov', xpConfig), val: purchased.velMov },
                  { key: 'velEspecial' as const, label: 'Vel. Casting', cost: getCombatStatCost('velEspecial', xpConfig), val: purchased.velEspecial },
                ].map((st) => {
                  const canAfford = xpAvailable >= st.cost;
                  return (
                    <div
                      key={st.key}
                      className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between gap-1"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-zinc-300 block leading-none">{st.label}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{st.cost} XP/pt</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onCombatStatChange(st.key, -1)}
                          disabled={st.val <= 0}
                          className="w-5 h-5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 text-zinc-400 flex items-center justify-center border border-zinc-800 text-xs"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-xs font-mono text-amber-400">
                          +{st.val}
                        </span>
                        <button
                          type="button"
                          onClick={() => onCombatStatChange(st.key, 1)}
                          disabled={!canAfford}
                          className="w-5 h-5 rounded bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-20 text-amber-400 flex items-center justify-center border border-amber-500/30 text-xs"
                          title={canAfford ? `Comprar 1 ponto (+${st.cost} XP)` : `Sem XP suficiente`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. SEÇÃO DESÍGNIOS DO GUARDIÃO (HABILITADOS) */}
        <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Compass size={20} className="text-amber-400" />
                Desígnios Habilitados ({enabledDesigniosList.length})
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Fortalecimentos passivos ativos no personagem. Acesse a aba <strong className="text-amber-400">Desígnios</strong> para adquirir ou alterar.
              </p>
            </div>

            {/* Rank Filter Tabs */}
            {enabledDesigniosList.length > 0 && (
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 self-start sm:self-auto overflow-x-auto max-w-full">
                {[
                  { rank: 'ALL', label: 'Todos' },
                  { rank: 'D', label: 'Rank D' },
                  { rank: 'C', label: 'Rank C' },
                  { rank: 'B', label: 'Rank B' },
                  { rank: 'A', label: 'Rank A' },
                  { rank: 'S', label: 'Rank S' },
                ].map(({ rank, label }) => (
                  <button
                    key={rank}
                    onClick={() => setDesignioFilter(rank as any)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      designioFilter === rank
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desígnios List Grid or Empty State */}
          {enabledDesigniosList.length === 0 ? (
            <div className="p-6 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center space-y-3">
              <Compass className="w-8 h-8 text-amber-500/60 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-300">Nenhum Desígnio Habilitado</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Seu personagem ainda não possui Desígnios ativos. Acesse a aba de <strong className="text-amber-400">Desígnios</strong> no menu superior para escolher e evoluir os fortalecimentos com seus pontos de XP!
              </p>
              {onNavigateToDesignios && (
                <button
                  type="button"
                  onClick={onNavigateToDesignios}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  <Compass size={14} />
                  <span>Acessar Aba de Desígnios</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {enabledDesigniosList
                .filter((des) => designioFilter === 'ALL' || des.rank === designioFilter)
                .map((des) => {
                  const currentLevel = userDesignios[des.id] || 0;
                  const cost = getDesignioXpCost(des.rank, xpConfig);
                  const canAfford = xpAvailable >= cost;

                  const rankColors: Record<DesignioRank, { border: string; bg: string; text: string; badge: string }> = {
                    D: { border: 'border-zinc-800', bg: 'bg-zinc-950/80', text: 'text-zinc-300', badge: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
                    C: { border: 'border-cyan-800/50', bg: 'bg-cyan-950/10', text: 'text-cyan-300', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
                    B: { border: 'border-purple-800/50', bg: 'bg-purple-950/10', text: 'text-purple-300', badge: 'bg-purple-950/80 text-purple-300 border-purple-800' },
                    A: { border: 'border-amber-800/50', bg: 'bg-amber-950/10', text: 'text-amber-300', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' },
                    S: { border: 'border-red-800/50', bg: 'bg-red-950/10', text: 'text-red-300', badge: 'bg-red-950/80 text-red-300 border-red-800' },
                  };

                  const style = rankColors[des.rank];

                  return (
                    <div
                      key={des.id}
                      className={`p-4 rounded-xl border ${style.border} ${style.bg} flex flex-col justify-between gap-3 transition-all relative group shadow-lg ring-1 ring-amber-500/30`}
                    >
                      <div>
                        {/* Top Bar: Name + Rank Badge + Level Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className={`text-sm font-black ${style.text} flex items-center gap-1.5`}>
                              <Sparkles size={14} className="text-amber-400 shrink-0" />
                              {des.name}
                            </h4>
                            <span className="text-[10px] text-zinc-500 font-mono">Custo: {cost} XP / nível</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${style.badge}`}>
                              Rank {des.rank}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              Nív. {currentLevel}
                            </span>
                          </div>
                        </div>

                        {/* Description & Bonus Stats List */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap gap-1">
                            {des.pvs && <span className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-900/50 text-[10px] font-mono font-bold">PVs +{des.pvs * currentLevel}</span>}
                            {des.pms && <span className="px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-900/50 text-[10px] font-mono font-bold">PMs +{des.pms * currentLevel}</span>}
                            {des.ataque && <span className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-900/50 text-[10px] font-mono font-bold">Ataque +{des.ataque * currentLevel}</span>}
                            {des.defesa && <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 text-[10px] font-mono font-bold">Defesa +{des.defesa * currentLevel}</span>}
                            {des.atqEspecial && <span className="px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-900/50 text-[10px] font-mono font-bold">Atq.Esp +{des.atqEspecial * currentLevel}</span>}
                            {des.defEspecial && <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-900/50 text-[10px] font-mono font-bold">Def.Esp +{des.defEspecial * currentLevel}</span>}
                            {des.velAtq && <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-200 border border-cyan-900/50 text-[10px] font-mono font-bold">Vel.Atq +{des.velAtq * currentLevel}</span>}
                            {des.velMov && <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-200 border border-emerald-900/50 text-[10px] font-mono font-bold">Vel.Mov +{des.velMov * currentLevel}</span>}
                            {des.velEspecial && <span className="px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-200 border border-purple-900/50 text-[10px] font-mono font-bold">Vel.Esp +{des.velEspecial * currentLevel}</span>}
                            {des.dCrit && <span className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-200 border border-amber-900/50 text-[10px] font-mono font-bold">D.Crit +{des.dCrit * currentLevel}</span>}
                            {des.regeneracao && <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 text-[10px] font-mono font-bold">Regen. +{des.regeneracao * currentLevel}</span>}
                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                            {des.description}
                            {currentLevel > 1 && (
                              <span className="block text-[10px] text-amber-400/90 font-semibold mt-0.5">
                                • Multiplicador Nível {currentLevel}: x{currentLevel} bônus acumulados
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Evolution Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onDesignioLevelChange?.(des.id, -1)}
                            disabled={currentLevel <= 0}
                            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 border border-zinc-800 transition-colors"
                            title="Reduzir Nível"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-black text-sm text-zinc-100 font-mono">
                            {currentLevel}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDesignioLevelChange?.(des.id, 1)}
                            disabled={!canAfford}
                            className="w-7 h-7 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-amber-400 border border-amber-500/30 transition-colors"
                            title={canAfford ? `Aumentar Nível (+${cost} XP)` : `Sem XP suficiente (${cost} XP)`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDesignioLevelChange?.(des.id, 1)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                          }`}
                        >
                          <Award size={13} />
                          <span>Evoluir ({cost} XP)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Unlocked Skill List by Categories */}
        <div className="space-y-6 pt-4">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            Grimório de Habilidades Ativas ({unlockedSkills.length})
          </h3>

          {unlockedSkills.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
              Nenhuma habilidade aprendida ainda. Acesse a guia <strong className="text-amber-400">Árvore de Habilidades</strong> para desbloquear suas técnicas!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ultimates */}
              {ultimates.length > 0 && (
                <SkillCategoryBlock
                  title="Habilidades Supremas (Rank SS)"
                  icon={<Crown className="text-amber-400" size={18} />}
                  skills={ultimates}
                  userSkillRanks={userSkillRanks}
                  onUpgradeSkillRank={onUpgradeSkillRank}
                  xpAvailable={xpAvailable}
                  xpConfig={xpConfig}
                  onTestRollSkill={onTestRollSkill}
                />
              )}

              {/* Main Actions */}
              {mainActions.length > 0 && (
                <SkillCategoryBlock
                  title="Ações Principais em Combate"
                  icon={<Zap className="text-orange-400" size={18} />}
                  skills={mainActions}
                  userSkillRanks={userSkillRanks}
                  onUpgradeSkillRank={onUpgradeSkillRank}
                  xpAvailable={xpAvailable}
                  xpConfig={xpConfig}
                  onTestRollSkill={onTestRollSkill}
                />
              )}

              {/* Bonus Actions */}
              {bonusActions.length > 0 && (
                <SkillCategoryBlock
                  title="Ações de Bônus / Movimento"
                  icon={<Sparkles className="text-cyan-400" size={18} />}
                  skills={bonusActions}
                  userSkillRanks={userSkillRanks}
                  onUpgradeSkillRank={onUpgradeSkillRank}
                  xpAvailable={xpAvailable}
                  xpConfig={xpConfig}
                  onTestRollSkill={onTestRollSkill}
                />
              )}

              {/* Reactions */}
              {reactions.length > 0 && (
                <SkillCategoryBlock
                  title="Reações & Defesas"
                  icon={<Shield className="text-emerald-400" size={18} />}
                  skills={reactions}
                  userSkillRanks={userSkillRanks}
                  onUpgradeSkillRank={onUpgradeSkillRank}
                  xpAvailable={xpAvailable}
                  xpConfig={xpConfig}
                  onTestRollSkill={onTestRollSkill}
                />
              )}

              {/* Passives */}
              {passives.length > 0 && (
                <SkillCategoryBlock
                  title="Habilidades Passivas Permanentemente Ativas"
                  icon={<BookOpen className="text-purple-400" size={18} />}
                  skills={passives}
                  userSkillRanks={userSkillRanks}
                  onUpgradeSkillRank={onUpgradeSkillRank}
                  xpAvailable={xpAvailable}
                  xpConfig={xpConfig}
                  onTestRollSkill={onTestRollSkill}
                />
              )}
            </div>
          )}
        </div>

        {/* Character Notes Textarea */}
        <div className="pt-6 border-t border-zinc-900">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Anotações do Jogador / História do Personagem
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Anote detalhes de equipamento, origem do guardião, feitiços favoritos ou antecedentes de mesa..."
            rows={4}
            className="w-full p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
};

interface SkillCategoryBlockProps {
  title: string;
  icon: React.ReactNode;
  skills: SkillNode[];
  userSkillRanks?: Record<string, SkillRank>;
  onUpgradeSkillRank?: (skillId: string) => void;
  xpAvailable?: number;
  xpConfig?: XPConfig;
  onTestRollSkill: (skill: SkillNode) => void;
}

const SkillCategoryBlock: React.FC<SkillCategoryBlockProps> = ({
  title,
  icon,
  skills,
  userSkillRanks = {},
  onUpgradeSkillRank,
  xpAvailable = 0,
  xpConfig,
  onTestRollSkill,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
        {icon}
        <span>{title} ({skills.length})</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((skill) => {
          const elemDef = ELEMENTS[skill.elementId];
          const rank = userSkillRanks[skill.id] || 'D';
          const nextUpgrade = getSkillNextUpgradeCost(skill.tier, rank, xpConfig);
          const canAffordUpgrade = nextUpgrade ? xpAvailable >= nextUpgrade.cost : false;

          return (
            <div
              key={skill.id}
              className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="p-1.5 rounded-lg border text-white"
                      style={{
                        backgroundColor: `${elemDef.colorHex}20`,
                        borderColor: `${elemDef.colorHex}40`,
                        color: elemDef.colorHex,
                      }}
                    >
                      <IconHelper name={elemDef.iconName} size={14} />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                        {skill.name}
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black">
                          Rank {rank}
                        </span>
                      </h5>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    {skill.diceRoll}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
                  {skill.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 gap-2">
                <span>Alcance: {skill.range} • Mana: {skill.manaCost}PM</span>

                <div className="flex items-center gap-1.5">
                  {nextUpgrade && onUpgradeSkillRank && (
                    <button
                      onClick={() => onUpgradeSkillRank(skill.id)}
                      disabled={!canAffordUpgrade}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        canAffordUpgrade
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                      }`}
                      title={canAffordUpgrade ? `Evoluir para Rank ${nextUpgrade.nextRank}` : `Necessário ${nextUpgrade.cost} XP`}
                    >
                      <Award size={11} />
                      <span>Evoluir ({nextUpgrade.cost} XP)</span>
                    </button>
                  )}

                  <button
                    onClick={() => onTestRollSkill(skill)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Dices size={12} />
                    <span>Rolar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

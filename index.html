export type AnimalId =
  | 'leao'
  | 'aguia'
  | 'tartaruga'
  | 'raposa'
  | 'urso'
  | 'bufalo'
  | 'lobo'
  | 'corvo'
  | 'javali'
  | 'polvo'
  | 'peixe'
  | 'carneiro'
  | 'elefante'
  | 'tigre'
  | 'pavao';

export type ElementId =
  | 'fogo'
  | 'sagrado'
  | 'magico'
  | 'vento'
  | 'raio'
  | 'som'
  | 'metal'
  | 'agua'
  | 'terra'
  | 'espiritual'
  | 'gelo'
  | 'demoniaco'
  | 'veneno'
  | 'sombrio'
  | 'psionico';

export type SkillActionType =
  | 'Ação Principal'
  | 'Ação de Bônus'
  | 'Ação de Movimento'
  | 'Reação'
  | 'Passiva'
  | 'Suprema';

export type SkillRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS (Suprema)';

export interface XPConfig {
  costPerAttributePoint: number;
  attributeCosts: {
    forca: number;
    destreza: number;
    constituicao: number;
    poder: number;
  };
  combatStatCosts: {
    pvs: number;
    pms: number;
    ataque: number;
    defesa: number;
    atqEspecial: number;
    defEspecial: number;
    velAtq: number;
    velMov: number;
    velEspecial: number;
    velocidade?: number;
    critico?: number;
  };
  tierXpCosts: Record<number, number>;
  tierRankXpCosts: Record<string, number>;
  designioRankXpCosts: Record<string, number>;
}

export const DEFAULT_DESIGNIO_RANK_XP_COSTS: Record<string, number> = {
  'D': 100,
  'C': 200,
  'B': 350,
  'A': 500,
  'S': 800,
};

export const DEFAULT_TIER_RANK_XP_COSTS: Record<string, number> = {
  '1_D': 50,
  '1_C': 75,
  '1_B': 100,
  '1_A': 150,
  '1_S': 200,
  '1_SS': 300,

  '2_D': 100,
  '2_C': 125,
  '2_B': 150,
  '2_A': 200,
  '2_S': 275,
  '2_SS': 400,

  '3_D': 200,
  '3_C': 225,
  '3_B': 250,
  '3_A': 300,
  '3_S': 375,
  '3_SS': 500,

  '4_D': 350,
  '4_C': 375,
  '4_B': 400,
  '4_A': 450,
  '4_S': 550,
  '4_SS': 700,

  '5_D': 500,
  '5_C': 550,
  '5_B': 600,
  '5_A': 700,
  '5_S': 850,
  '5_SS': 1100,

  '6_D': 1000,
  '6_C': 1100,
  '6_B': 1200,
  '6_A': 1400,
  '6_S': 1700,
  '6_SS': 2000,
};

export const DEFAULT_XP_CONFIG: XPConfig = {
  costPerAttributePoint: 100,
  attributeCosts: {
    forca: 100,
    destreza: 100,
    constituicao: 100,
    poder: 100,
  },
  combatStatCosts: {
    pvs: 20,
    pms: 20,
    ataque: 50,
    defesa: 50,
    atqEspecial: 50,
    defEspecial: 50,
    velAtq: 50,
    velMov: 50,
    velEspecial: 50,
    critico: 80,
  },
  tierXpCosts: {
    1: 50,
    2: 100,
    3: 200,
    4: 350,
    5: 500,
    6: 1000,
  },
  tierRankXpCosts: DEFAULT_TIER_RANK_XP_COSTS,
  designioRankXpCosts: DEFAULT_DESIGNIO_RANK_XP_COSTS,
};

export function getDesignioXpCost(
  rank: 'D' | 'C' | 'B' | 'A' | 'S',
  xpConfig?: XPConfig
): number {
  if (xpConfig?.designioRankXpCosts && xpConfig.designioRankXpCosts[rank] !== undefined) {
    return xpConfig.designioRankXpCosts[rank];
  }
  return DEFAULT_DESIGNIO_RANK_XP_COSTS[rank] ?? 100;
}

export function getSkillXpCost(
  skill: { tier: number; rank?: string },
  xpConfig?: XPConfig
): number {
  if (!xpConfig) return (skill.tier || 1) * 100;

  const tier = skill.tier || 1;
  const rawRank = skill.rank || 'D';
  let cleanRank = 'D';
  if (rawRank.includes('SS')) cleanRank = 'SS';
  else if (rawRank.includes('S')) cleanRank = 'S';
  else if (rawRank.includes('A')) cleanRank = 'A';
  else if (rawRank.includes('B')) cleanRank = 'B';
  else if (rawRank.includes('C')) cleanRank = 'C';
  else if (rawRank.includes('D')) cleanRank = 'D';

  const key = `${tier}_${cleanRank}`;
  if (xpConfig.tierRankXpCosts && xpConfig.tierRankXpCosts[key] !== undefined) {
    return xpConfig.tierRankXpCosts[key];
  }

  if (xpConfig.tierXpCosts && xpConfig.tierXpCosts[tier] !== undefined) {
    return xpConfig.tierXpCosts[tier];
  }

  return tier * 100;
}

export interface PurchasedCombatStats {
  pvs: number;
  pms: number;
  ataque: number;
  atqEspecial: number;
  defesa: number;
  defEspecial: number;
  critico: number;
  velAtq: number;
  velMov: number;
  velEspecial: number;
}

export interface CharacterAttributes {
  forca: number;
  destreza: number;
  constituicao: number;
  poder: number;
}

export interface CalculatedStats {
  pvs: number; // 20 + Constituição
  pms: number; // 20 + Poder
  atq: number; // Força + Destreza
  def: number; // Constituição + Força
  atqEsp: number; // Poder + (Força/Destreza)
  defEsp: number; // Poder + Constituição
  velAtq: number; // Destreza
  velMov: number; // Destreza
  velEsp: number; // Poder
}

export interface SkillNode {
  id: string;
  name: string;
  animalId: AnimalId;
  elementId: ElementId;
  tier: number; // 1 to 6
  rank: SkillRank; // D, C, B, A, S, SS
  rowIndex: number; // 0 to 5
  colIndex: number; // 0..1 for row 0, 0..2 for row 1..4, 0 for row 5
  prerequisites: string[]; // IDs of required parent nodes
  costSP: number;
  minLevel: number;
  type: SkillActionType;
  cooldown: string;
  cooldownRec: string; // e.g. "Recarga 2"
  duration: string; // e.g. "Duração 3", "Instantâneo"
  range: string;
  manaCost: number; // Cost in PMs
  diceRoll: string;
  effectSummary: string; // e.g. "Atq+2", "Def+1", "-2 PMs"
  description: string;
  lore: string;
  isUltimate?: boolean;
}

export interface AnimalDefinition {
  id: AnimalId;
  name: string;
  weapon: string;
  weaponCategory: string;
  elements: [ElementId, ElementId, ElementId];
  iconName: string;
  color: string;
  bgGradient: string;
  description: string;
  combatStyle: string;
  statBonus: string;
}

export interface ElementDefinition {
  id: ElementId;
  name: string;
  iconName: string;
  colorHex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  description: string;
  primaryStat: string;
  damageType: string;
}

export interface CharacterBuild {
  id: string;
  name: string;
  animalId: AnimalId;
  level: number;
  totalPoints: number;
  attributes: CharacterAttributes;
  unlockedSkillIds: string[];
  notes: string;
  createdAt: string;
}

export interface DiceRollResult {
  id: string;
  skillName?: string;
  diceNotation: string;
  individualRolls: number[];
  modifier: number;
  total: number;
  isCrit: boolean;
  isFumble: boolean;
  timestamp: string;
}

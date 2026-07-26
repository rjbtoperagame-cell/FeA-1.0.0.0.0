import { AnimalDefinition, AnimalId, ElementDefinition, ElementId, SkillNode, SkillActionType, SkillRank } from '../types';

export const ELEMENTS: Record<ElementId, ElementDefinition> = {
  fogo: {
    id: 'fogo',
    name: 'Fogo',
    iconName: 'Flame',
    colorHex: '#f97316',
    textClass: 'text-orange-500',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
    glowClass: 'shadow-orange-500/50',
    description: 'Chamas devoradoras, explosões térmicas e queimaduras contínuas.',
    primaryStat: 'Força / Pod. Elemental',
    damageType: 'Dano do Fogo',
  },
  sagrado: {
    id: 'sagrado',
    name: 'Sagrado',
    iconName: 'Sun',
    colorHex: '#eab308',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    glowClass: 'shadow-amber-500/50',
    description: 'Luz divindade, bênçãos protetoras, purificação e cura radiante.',
    primaryStat: 'Fé / Vontade',
    damageType: 'Dano Radiante',
  },
  magico: {
    id: 'magico',
    name: 'Mágico',
    iconName: 'Sparkles',
    colorHex: '#a855f7',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
    glowClass: 'shadow-purple-500/50',
    description: 'Arcanismo puro, manipulação de éter e perturbação da realidade.',
    primaryStat: 'Inteligência',
    damageType: 'Dano Arcano',
  },
  vento: {
    id: 'vento',
    name: 'Vento',
    iconName: 'Wind',
    colorHex: '#06b6d4',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    glowClass: 'shadow-cyan-500/50',
    description: 'Vendavais cortantes, agilidade extrema e deslocamento aéreo.',
    primaryStat: 'Destreza',
    damageType: 'Dano de Cortante / Ar',
  },
  raio: {
    id: 'raio',
    name: 'Raio',
    iconName: 'Zap',
    colorHex: '#facc15',
    textClass: 'text-yellow-300',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/30',
    glowClass: 'shadow-yellow-500/50',
    description: 'Sobrecarga elétrica, eletrocussão em cadeia e velocidade do trovão.',
    primaryStat: 'Agilidade',
    damageType: 'Dano Elétrico',
  },
  som: {
    id: 'som',
    name: 'Som',
    iconName: 'Volume2',
    colorHex: '#10b981',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    glowClass: 'shadow-emerald-500/50',
    description: 'Ondas sônicas, atordoamento acústico e ressonância destrutiva.',
    primaryStat: 'Percepção / Carisma',
    damageType: 'Dano Sônico',
  },
  metal: {
    id: 'metal',
    name: 'Metal',
    iconName: 'Shield',
    colorHex: '#94a3b8',
    textClass: 'text-slate-300',
    bgClass: 'bg-slate-500/10',
    borderClass: 'border-slate-500/30',
    glowClass: 'shadow-slate-500/50',
    description: 'Dureza inquebrável, lâminas magnéticas e couraça impenetrável.',
    primaryStat: 'Vigor / Constituição',
    damageType: 'Dano Perfurante / Impacto',
  },
  agua: {
    id: 'agua',
    name: 'Água',
    iconName: 'Droplet',
    colorHex: '#3b82f6',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    glowClass: 'shadow-blue-500/50',
    description: 'Torrentes místicas, desaceleração fluida e regeneração contínua.',
    primaryStat: 'Sabedoria',
    damageType: 'Dano Concussivo / Fluido',
  },
  terra: {
    id: 'terra',
    name: 'Terra',
    iconName: 'Mountain',
    colorHex: '#d97706',
    textClass: 'text-amber-600',
    bgClass: 'bg-amber-600/10',
    borderClass: 'border-amber-600/30',
    glowClass: 'shadow-amber-600/50',
    description: 'Sismos, controle rochoso e enraizamento defensivo implacável.',
    primaryStat: 'Constituição / Força',
    damageType: 'Dano Concussivo',
  },
  espiritual: {
    id: 'espiritual',
    name: 'Espiritual',
    iconName: 'Ghost',
    colorHex: '#14b8a6',
    textClass: 'text-teal-300',
    bgClass: 'bg-teal-500/10',
    borderClass: 'border-teal-500/30',
    glowClass: 'shadow-teal-500/50',
    description: 'Projeção astral, drenagem de alma e fortalecimento do espírito.',
    primaryStat: 'Espírito / Misticismo',
    damageType: 'Dano Espiritual',
  },
  gelo: {
    id: 'gelo',
    name: 'Gelo',
    iconName: 'Snowflake',
    colorHex: '#38bdf8',
    textClass: 'text-sky-300',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/30',
    glowClass: 'shadow-sky-500/50',
    description: 'Geada paralisante, lanças gélidas e armadura de gelo eterno.',
    primaryStat: 'Constituição / Foco',
    damageType: 'Dano de Frio',
  },
  demoniaco: {
    id: 'demoniaco',
    name: 'Demoníaco',
    iconName: 'Skull',
    colorHex: '#ef4444',
    textClass: 'text-red-500',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    glowClass: 'shadow-red-500/50',
    description: 'Chamas infernais, pactos sombrios, corrupção e roubo de vitalidade.',
    primaryStat: 'Carisma Profano / Força',
    damageType: 'Dano Profano',
  },
  veneno: {
    id: 'veneno',
    name: 'Veneno',
    iconName: 'Biohazard',
    colorHex: '#84cc16',
    textClass: 'text-lime-400',
    bgClass: 'bg-lime-500/10',
    borderClass: 'border-lime-500/30',
    glowClass: 'shadow-lime-500/50',
    description: 'Toxinas paralisantes, miasma ácido e degradação orgânica.',
    primaryStat: 'Destreza / Astúcia',
    damageType: 'Dano Tóxico',
  },
  sombrio: {
    id: 'sombrio',
    name: 'Sombrio',
    iconName: 'Moon',
    colorHex: '#8b5cf6',
    textClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
    glowClass: 'shadow-violet-500/50',
    description: 'Manipulação de sombras, furtividade, medo e escuridão opressora.',
    primaryStat: 'Astúcia / Furtividade',
    damageType: 'Dano de Necrose / Sombra',
  },
  psionico: {
    id: 'psionico',
    name: 'Psiônico',
    iconName: 'Brain',
    colorHex: '#ec4899',
    textClass: 'text-pink-400',
    bgClass: 'bg-pink-500/10',
    borderClass: 'border-pink-500/30',
    glowClass: 'shadow-pink-500/50',
    description: 'Telecinese, ilusões mentais, ondas psíquicas e controle mental.',
    primaryStat: 'Mente / Vontade',
    damageType: 'Dano Psíquico',
  },
};

export const ANIMALS: Record<AnimalId, AnimalDefinition> = {
  leao: {
    id: 'leao',
    name: 'Leão',
    weapon: 'Espada',
    weaponCategory: 'Marcial Lâmina',
    elements: ['fogo', 'sagrado', 'magico'],
    iconName: 'Crown',
    color: '#f97316',
    bgGradient: 'from-amber-900/40 to-orange-950/60',
    description: 'O Soberano dos Campos de Batalha. Combina lâminas flamejantes e aura solar majestosa.',
    combatStyle: 'Combate Corpo a Corpo Majestoso, Cortes em Fogo e Liderança Divina.',
    statBonus: '+2 Força, +1 Fé',
  },
  aguia: {
    id: 'aguia',
    name: 'Águia',
    weapon: 'Arco',
    weaponCategory: 'Ataque à Distância',
    elements: ['vento', 'raio', 'som'],
    iconName: 'Feather',
    color: '#06b6d4',
    bgGradient: 'from-cyan-900/40 to-sky-950/60',
    description: 'A Caçadora dos Céus. Dispara flechas sônicas e relâmpagos com precisão milimétrica.',
    combatStyle: 'Mobilidade Extrema, Tiros Perfurantes e Controle do Campo Aéreo.',
    statBonus: '+2 Destreza, +1 Percepção',
  },
  tartaruga: {
    id: 'tartaruga',
    name: 'Tartaruga',
    weapon: 'Escudo',
    weaponCategory: 'Defensivo Pesado',
    elements: ['metal', 'agua', 'terra'],
    iconName: 'Shield',
    color: '#10b981',
    bgGradient: 'from-emerald-900/40 to-teal-950/60',
    description: 'O Baluarte Inabalável. Transforma o escudo em muralha elemental impenetrável.',
    combatStyle: 'Defesa Absoluta, Contra-Ataques de Bastião e Absorção Total.',
    statBonus: '+2 Constituição, +1 Vigor',
  },
  raposa: {
    id: 'raposa',
    name: 'Raposa',
    weapon: 'Orb',
    weaponCategory: 'Foco Arcano',
    elements: ['magico', 'espiritual', 'fogo'],
    iconName: 'Sparkles',
    color: '#f43f5e',
    bgGradient: 'from-rose-900/40 to-purple-950/60',
    description: 'A Ilusionista de Nove Caudas. Manipula orbes mágicos e chamas espirituais.',
    combatStyle: 'Magia de Controle, Ilusões Etnicas e Explosões Espirituais.',
    statBonus: '+2 Inteligência, +1 Astúcia',
  },
  urso: {
    id: 'urso',
    name: 'Urso',
    weapon: 'Garras',
    weaponCategory: 'Arma Natural / Manopla',
    elements: ['raio', 'sagrado', 'gelo'],
    iconName: 'PawPrint',
    color: '#38bdf8',
    bgGradient: 'from-sky-900/40 to-blue-950/60',
    description: 'O Guardião das Montanhas. Desfere patadas congelantes carregadas de eletricidade e luz.',
    combatStyle: 'Avanço Brutal, Desarme com Garras e Resistência Imparável.',
    statBonus: '+2 Força, +1 Constituição',
  },
  bufalo: {
    id: 'bufalo',
    name: 'Búfalo',
    weapon: 'Machado',
    weaponCategory: 'Marcial Pesada',
    elements: ['terra', 'demoniaco', 'veneno'],
    iconName: 'Axe',
    color: '#b45309',
    bgGradient: 'from-amber-950/60 to-red-950/60',
    description: 'A Fúria Ctoniana. Rompe o solo com golpadas de machado impregnadas de toxina e fogo profano.',
    combatStyle: 'Golpes Sísmicos, Envenenamento em Área e Carga Devastadora.',
    statBonus: '+2 Força, +1 Vigor',
  },
  lobo: {
    id: 'lobo',
    name: 'Lobo',
    weapon: 'Adagas',
    weaponCategory: 'Dupla Leve / Furtiva',
    elements: ['som', 'sombrio', 'veneno'],
    iconName: 'Zap',
    color: '#8b5cf6',
    bgGradient: 'from-purple-900/40 to-slate-950/60',
    description: 'O Predador das Sombras. Corta gargantas no silêncio com adagas venenosas e uivos sônicos.',
    combatStyle: 'Ataques Furtivos, Envenenamento Rápido e Uivos de Caça.',
    statBonus: '+2 Agilidade, +1 Furtividade',
  },
  corvo: {
    id: 'corvo',
    name: 'Corvo',
    weapon: 'Foice',
    weaponCategory: 'Hastil Sombria',
    elements: ['sombrio', 'vento', 'demoniaco'],
    iconName: 'Skull',
    color: '#a855f7',
    bgGradient: 'from-violet-950/60 to-zinc-950/80',
    description: 'O Ceifador dos Ventos Malditos. Dança com uma foice sombria drenando almas do ar.',
    combatStyle: 'Corte Amplificado, Drenagem de Vida e Lâminas de Névoa.',
    statBonus: '+2 Astúcia, +1 Espírito',
  },
  javali: {
    id: 'javali',
    name: 'Javali',
    weapon: 'Mangual',
    weaponCategory: 'Corrente Implacável',
    elements: ['demoniaco', 'terra', 'metal'],
    iconName: 'Hammer',
    color: '#ef4444',
    bgGradient: 'from-red-950/60 to-stone-950/80',
    description: 'A Destruição Descorrenada. Gira manguais pontiagudos que despedaçam armaduras e o solo.',
    combatStyle: 'Desorganização de Linhas, Quebra de Escudos e Fúria Incontrolável.',
    statBonus: '+2 Força, +1 Vigor',
  },
  polvo: {
    id: 'polvo',
    name: 'Polvo',
    weapon: 'Pincel',
    weaponCategory: 'Exótica / Canalizadora',
    elements: ['veneno', 'psionico', 'agua'],
    iconName: 'Paintbrush',
    color: '#ec4899',
    bgGradient: 'from-pink-900/40 to-indigo-950/60',
    description: 'O Mestre da Tinta Mística. Pinta runas venenosas e ilusões psíquicas com rajadas d\'água.',
    combatStyle: 'Controle de Grupo, Tinta Alucinógena e Tentáculos Fluídos.',
    statBonus: '+2 Mente, +1 Destreza',
  },
  peixe: {
    id: 'peixe',
    name: 'Peixe',
    weapon: 'Lança',
    weaponCategory: 'Hastil Perfurante',
    elements: ['agua', 'gelo', 'som'],
    iconName: 'Fish',
    color: '#38bdf8',
    bgGradient: 'from-cyan-900/40 to-blue-950/60',
    description: 'O Dragão dos Mares Profundos. Estoca com lanças gélidas que propagam ondas aquáticas.',
    combatStyle: 'Estocadas Fluídas, Congelamento em Linha e Eco Marítimo.',
    statBonus: '+2 Destreza, +1 Sabedoria',
  },
  carneiro: {
    id: 'carneiro',
    name: 'Carneiro',
    weapon: 'Cajado',
    weaponCategory: 'Mística Mágica',
    elements: ['sagrado', 'espiritual', 'psionico'],
    iconName: 'Sun',
    color: '#f59e0b',
    bgGradient: 'from-amber-900/40 to-purple-950/60',
    description: 'O Sábio Astral. Canaliza orações sagradas e energias psíquicas através do cajado.',
    combatStyle: 'Suporte Sagrado, Escudos Psíquicos e Purificação Astral.',
    statBonus: '+2 Fé, +1 Vontade',
  },
  elefante: {
    id: 'elefante',
    name: 'Elefante',
    weapon: 'Martelo',
    weaponCategory: 'Impacto Gigantesco',
    elements: ['gelo', 'sombrio', 'metal'],
    iconName: 'ShieldAlert',
    color: '#64748b',
    bgGradient: 'from-slate-900/50 to-indigo-950/70',
    description: 'O Titã Antigo. Esmaga o chão com martelos pesados de ferro congelado e sombras.',
    combatStyle: 'Impacto Devastador, Congelamento Sísmico e Inércia Colossal.',
    statBonus: '+2 Força, +1 Constituição',
  },
  tigre: {
    id: 'tigre',
    name: 'Tigre',
    weapon: 'Katar',
    weaponCategory: 'Garra Lâmina Dupla',
    elements: ['espiritual', 'fogo', 'raio'],
    iconName: 'Zap',
    color: '#f97316',
    bgGradient: 'from-orange-900/40 to-yellow-950/60',
    description: 'O Espada Celestial. Executa estocadas fulminantes incandescentes revestidas de relâmpago.',
    combatStyle: 'GOLPES Críticos, Explosão Espiritual e Velocidade Predatória.',
    statBonus: '+2 Destreza, +1 Força',
  },
  pavao: {
    id: 'pavao',
    name: 'Pavão',
    weapon: 'Leque',
    weaponCategory: 'Exótica Graciosa',
    elements: ['psionico', 'vento', 'magico'],
    iconName: 'Sparkles',
    color: '#ec4899',
    bgGradient: 'from-pink-900/40 to-cyan-950/60',
    description: 'A Dança dos Mil Encantos. Reflete projéteis e desencadeia rajadas psíquicas com leques no ar.',
    combatStyle: 'Dança Hipnótica, Desvio de Projéteis e Tempestade de Razões.',
    statBonus: '+2 Carisma, +1 Mente',
  },
};

export const RANK_NAMES: Record<number, SkillRank> = {
  1: 'D',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'S',
  6: 'SS (Suprema)',
};

const SKILL_TITLE_PREFIXES: Record<ElementId, string[]> = {
  fogo: ['Chama', 'Brasa', 'Infernus', 'Erupção', 'Piroclasto', 'Vulcanismo', 'Incêndio', 'Supernova', 'Glaive de Fogo', 'Meteoro', 'Explosão Sol', 'Solstício', 'Marca Ardente', 'Dança Incandescente', 'Fênix Supreme'],
  sagrado: ['Bênção', 'Aura Solar', 'Luz Divina', 'Halo', 'Purificação', 'Escudo Santificado', 'Verdade', 'Raios Celes', 'Julgamento', 'Santidade', 'Anjo de Guerra', 'Sentença', 'Graça Imaculada', 'Bastião da Luz', 'Manifestação Divina'],
  magico: ['Éter', 'Runa', 'Arcanismo', 'Distorção', 'Singularidade', 'Orbe Cósmico', 'Nexus', 'Invocação', 'Transmutação', 'Cataclismo', 'Vórtice', 'Espelho Arcano', 'Selo de Mana', 'Fluxo Místico', 'Teia Cósmica Suprema'],
  vento: ['Brisa', 'Vendaval', 'Lâmina de Ar', 'Ciclone', 'Tornado', 'Passo Aéreo', 'Trovoadas', 'Vácuo', 'Corte Eólico', 'Asas do Vento', 'Tufão', 'Barreira Aerodinâmica', 'Furacão Cortante', 'Presa do Vento', 'Devastação Tempestuosa'],
  raio: ['Fagulha', 'Relâmpago', 'Trovão', 'Eletrocussão', 'Sobrecarga', 'Raio Estático', 'Descarga Volt', 'Choque em Cadeia', 'Centelha', 'Aceleração Elétrica', 'Corrente Voltáica', 'Ressonância', 'Dança dos Raios', 'Fúria Volt', 'Cataclismo de Trovão'],
  som: ['Uivo', 'Eco', 'Vibração', 'Pulso Acústico', 'Sinfonia', 'Clamor', 'Grito de Guerra', 'Ressonância', 'Frequência', 'Choque Sonoro', 'Lamento', 'Canção da Morte', 'Onda Estilhaçante', 'Rugido Sônico', 'Apocalipse Acústico'],
  metal: ['Couraça', 'Lâmina de Aço', 'Impacto Ferro', 'Magnetismo', 'Fúria de Titânio', 'Bastião', 'Escudo de Platina', 'Estaca de Metal', 'Têmpera', 'Muralha de Ferro', 'Aniquilação Metálica', 'Glaive de Lança', 'Escultura de Aço', 'Corrente Pesada', 'Avatar de Metal Imortal'],
  agua: ['Gota', 'Torrente', 'Maré', 'Onda', 'Tsunami', 'Gêiser', 'Névoa Fluida', 'Espelho d\'Água', 'Maelstrom', 'Absorção Aquosa', 'Fluxo Marítimo', 'Aura Oceanográfica', 'Dança da Cascata', 'Miséria Aquática', 'Domínio dos Mares Profundos'],
  terra: ['Cascalho', 'Terremoto', 'Rocha', 'Placa Tectônica', 'Fagote de Terra', 'Enraizamento', 'Coluna de Pedra', 'Abalos Sísmicos', 'Escudo Petrificado', 'Avalanche', 'Fúria Ctoniana', 'Muralha de Granito', 'Impacto Terrestre', 'Sismo Profundo', 'Deus dos Abismos Terrestres'],
  espiritual: ['Vulto', 'Projeção Astral', 'Névoa Espiritual', 'Drenagem de Alma', 'Fantasma', 'Possessão', 'Aura Etérea', 'Glaive do Espírito', 'Caminho Etnico', 'Despertar Astral', 'Elo Espiritual', 'Vozes do Além', 'Lâmina Etérea', 'Guardião Astral', 'Transcendência Astral Suprema'],
  gelo: ['Geada', 'Cristal', 'Lança de Gelo', 'Estalactite', 'Ventania Gélida', 'Pico de Neve', 'Congelamento', 'Bastião Congelado', 'Zero Absoluto', 'Tundra', 'Caixão de Gelo', 'Armadura de Geada', 'Avalanche Gélida', 'Coração Glacial', 'Era Glacial Suprema'],
  demoniaco: ['Chama Profana', 'Selo Infernal', 'Pacto de Sangue', 'Devoração', 'Marca da Besta', 'Corrupção', 'Lâmina Profana', 'Abismo', 'Gritos do Hades', 'Miasma Demoníaco', 'Fúria Infernal', 'Sacrifício', 'Tentáculo da Sombra', 'Condenação', 'Lorde do Abismo Infernal'],
  veneno: ['Gota Tóxica', 'Ácido', 'Névoa Venenosa', 'Seringa Toxis', 'Degradação', 'Peçonha', 'Mordida Tóxica', 'Lança Paralisante', 'Neurotoxina', 'Chuva de Veneno', 'Miasma Mortal', 'Necrose Venenosa', 'Aura Pestilenta', 'Injeção Letal', 'Apocalipse Pestilento'],
  sombrio: ['Sombra', 'Penumbra', 'Escuridão', 'Manto Sombrio', 'Lâmina das Sombras', 'Medo', 'Visão Sombria', 'Vácuo Noturno', 'Ataque das Sombras', 'Portal Sombrio', 'Passo das Sombras', 'Prisão Sombria', 'Silêncio Noturno', 'Pesadelo Real', 'Eclipse Sombrio Absoluto'],
  psionico: ['Pulso Mental', 'Telecinese', 'Ilusão', 'Onda Psíquica', 'Rajada Psíquica', 'Domínio da Mente', 'Escudo Mental', 'Sombra da Mente', 'Quebra de Sanidade', 'Espelho Psíquico', 'Projeção Psíquica', 'Sussurro Mental', 'Tormento Psíquico', 'Vortex do Caos', 'Singularidade Mental Suprema'],
};

// Skill templates generator with exact rule parameters for Rank D (Tier 1) up to Rank SS
export function generateSkillNodesForAnimal(animalId: AnimalId): Record<ElementId, SkillNode[]> {
  const animal = ANIMALS[animalId];
  const result: Partial<Record<ElementId, SkillNode[]>> = {};

  animal.elements.forEach((elementId) => {
    const elemDef = ELEMENTS[elementId];
    const skillList: SkillNode[] = [];
    const prefixes = SKILL_TITLE_PREFIXES[elementId] || SKILL_TITLE_PREFIXES.fogo;

    let totalCreated = 0;
    const rowCounts = [2, 3, 3, 3, 3, 1]; // 15 skills in total

    // Skill archetype configurations for Rank D (Tier 1) and scaled higher ranks
    const RANK_D_TEMPLATES = [
      { nameSuffix: 'Golpe Veloz', type: 'Ação de Movimento' as SkillActionType, manaCost: 2, duration: 'Instantâneo', cooldownRec: 'Recarga 2', effectSummary: 'Atq+2', diceRoll: '1d6 + Atq' },
      { nameSuffix: 'Disparo Projétil', type: 'Ação Principal' as SkillActionType, manaCost: 2, duration: 'Instantâneo', cooldownRec: 'Recarga 2', effectSummary: 'A.esp+2', diceRoll: '1d6 + A.esp' },
      { nameSuffix: 'Escudo Protetor', type: 'Ação Principal' as SkillActionType, manaCost: 3, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 2', effectSummary: 'Def+1', diceRoll: 'Passivo' },
      { nameSuffix: 'Barreira Elemental', type: 'Ação Principal' as SkillActionType, manaCost: 3, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 2', effectSummary: 'PVs Mágicos +5', diceRoll: 'Passivo' },
      { nameSuffix: 'Ataque em Área', type: 'Ação Principal' as SkillActionType, manaCost: 7, duration: 'Instantâneo', cooldownRec: 'Recarga 4', effectSummary: 'A.esp+3 (1d4+2 alvos)', diceRoll: '1d8 + A.esp' },
      { nameSuffix: 'Golpe Múltiplo', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Instantâneo', cooldownRec: 'Recarga 4', effectSummary: 'Atq+1 (2 Ataques)', diceRoll: '2x (1d6 + Atq)' },
      { nameSuffix: 'Dash Tático', type: 'Ação de Movimento' as SkillActionType, manaCost: 1, duration: 'Instantâneo', cooldownRec: 'Recarga 3', effectSummary: 'Deslocamento x2', diceRoll: 'Movimento' },
      { nameSuffix: 'Estímulo de Velocidade', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 3', effectSummary: 'Vel.Mov +2', diceRoll: 'Buff' },
      { nameSuffix: 'Dança das Lâminas', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 3', effectSummary: 'Vel.Atq +2', diceRoll: 'Buff' },
      { nameSuffix: 'Foco Crítico', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 3', effectSummary: 'Crítico +2', diceRoll: 'Buff' },
      { nameSuffix: 'Névoa Debilitante', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Duração 3 rodadas', cooldownRec: 'Recarga 3', effectSummary: 'Atq Inimigo -1', diceRoll: 'Debuff' },
      { nameSuffix: 'Selo de Imobilização', type: 'Ação Principal' as SkillActionType, manaCost: 4, duration: 'Duração 2 rodadas', cooldownRec: 'Recarga 4', effectSummary: 'Imobilizar (Sem Movimento)', diceRoll: 'Status' },
      { nameSuffix: 'Aura de Sangramento', type: 'Passiva' as SkillActionType, manaCost: 0, duration: 'Passivo', cooldownRec: 'Sempre Ativo', effectSummary: '-1 PV/ação (Max 3 Stacks)', diceRoll: 'Passiva' },
      { nameSuffix: 'Sintonia Elemental', type: 'Passiva' as SkillActionType, manaCost: 0, duration: 'Passivo', cooldownRec: 'Sempre Ativo', effectSummary: 'PMs +5 permanente', diceRoll: 'Passiva' },
      { nameSuffix: 'SUPREMA', type: 'Suprema' as SkillActionType, manaCost: 15, duration: 'Instantâneo', cooldownRec: '1x por Combate', effectSummary: 'Dano Colossal + Status Supremo', diceRoll: '4d10 + A.esp' },
    ];

    rowCounts.forEach((count, rowIndex) => {
      const tier = rowIndex + 1;
      const rank = RANK_NAMES[tier];

      for (let col = 0; col < count; col++) {
        const skillIndex = totalCreated; // 0 to 14
        const skillId = `${animalId}_${elementId}_${skillIndex + 1}`;

        // Compute prerequisites based on previous row
        const prerequisites: string[] = [];
        if (rowIndex > 0) {
          const prevRowStart = skillList
            .filter((s) => s.rowIndex === rowIndex - 1)
            .map((s) => s.id);

          if (rowIndex === 5) {
            prerequisites.push(...prevRowStart);
          } else if (rowIndex === 1) {
            if (col === 0) prerequisites.push(prevRowStart[0]);
            else if (col === 1) prerequisites.push(prevRowStart[0], prevRowStart[1]);
            else prerequisites.push(prevRowStart[1]);
          } else {
            if (col === 0) prerequisites.push(prevRowStart[0]);
            if (col === 1) prerequisites.push(prevRowStart[1] || prevRowStart[0]);
            if (col === 2) prerequisites.push(prevRowStart[2] || prevRowStart[1]);
          }
        }

        const isUltimate = rowIndex === 5;
        const template = RANK_D_TEMPLATES[skillIndex % RANK_D_TEMPLATES.length];
        const namePrefix = prefixes[skillIndex % prefixes.length];

        const skillName = isUltimate
          ? `SUPREMA: ${namePrefix} de ${animal.name}`
          : `${namePrefix} - ${template.nameSuffix}`;

        const actionType = isUltimate ? 'Suprema' : template.type;

        // Scaling parameters for higher ranks
        const manaCost = isUltimate ? 25 : Math.max(1, template.manaCost + (tier - 1) * 2);
        const costSP = isUltimate ? 5 : Math.max(1, Math.floor(tier / 2) + 1);
        const minLevel = isUltimate ? 15 : (tier - 1) * 3 + 1;

        let range = 'Toque';
        if (animal.weapon === 'Arco' || elemDef.id === 'vento' || elemDef.id === 'raio') range = '18m';
        else if (animal.weapon === 'Orb' || animal.weapon === 'Cajado' || elemDef.id === 'magico' || template.nameSuffix.includes('Projétil')) range = '12m';
        else range = 'Melee / 3m';

        let diceRoll = template.diceRoll;
        if (diceRoll.includes('d6')) diceRoll = `${tier}d6 + Modificador`;
        else if (diceRoll.includes('d8')) diceRoll = `${tier}d8 + Mod. Elemental`;

        const effectSummary = isUltimate ? 'Dano Massivo Elemental + Efeito em Área' : template.effectSummary;

        let description = '';
        let lore = '';

        if (isUltimate) {
          description = `Habilidade Rank SS Suprema. Canaliza a essência ancestral do ${animal.name} e de ${elemDef.name} através do ${animal.weapon}. Causa ${diceRoll} de ${elemDef.damageType} em todos os inimigos e concede status supremo. (-${manaCost} PMs, Recarga: 1x por Combate).`;
          lore = `A lenda lendária do Guardião ${animal.name} escrita nas páginas secretas da ordem de ${elemDef.name}.`;
        } else if (actionType === 'Passiva') {
          description = `Habilidade Rank ${rank} Passiva. ${template.effectSummary}. Fortalece o estilo de combate do ${animal.name} utilizando a arma ${animal.weapon}.`;
          lore = `Instinto primordial do ${animal.name} gravado nas profundezas do elemento ${elemDef.name}.`;
        } else {
          description = `Habilidade Rank ${rank} (${actionType}). Consome ${manaCost} PMs. Efeito: ${template.effectSummary}. Alcance: ${range}. ${template.duration}, ${template.cooldownRec}.`;
          lore = `Técnica militar do Guardião ${animal.name} refinada no elemento ${elemDef.name}.`;
        }

        skillList.push({
          id: skillId,
          name: skillName,
          animalId,
          elementId,
          tier,
          rank,
          rowIndex,
          colIndex: col,
          prerequisites,
          costSP,
          minLevel,
          type: actionType,
          cooldown: template.cooldownRec,
          cooldownRec: template.cooldownRec,
          duration: template.duration,
          range,
          manaCost,
          diceRoll,
          effectSummary,
          description,
          lore,
          isUltimate,
        });

        totalCreated++;
      }
    });

    result[elementId] = skillList;
  });

  return result as Record<ElementId, SkillNode[]>;
}

// Pre-generated full cache of all animal skill trees
export const ALL_SKILL_TREES: Record<AnimalId, Record<ElementId, SkillNode[]>> = {
  leao: generateSkillNodesForAnimal('leao'),
  aguia: generateSkillNodesForAnimal('aguia'),
  tartaruga: generateSkillNodesForAnimal('tartaruga'),
  raposa: generateSkillNodesForAnimal('raposa'),
  urso: generateSkillNodesForAnimal('urso'),
  bufalo: generateSkillNodesForAnimal('bufalo'),
  lobo: generateSkillNodesForAnimal('lobo'),
  corvo: generateSkillNodesForAnimal('corvo'),
  javali: generateSkillNodesForAnimal('javali'),
  polvo: generateSkillNodesForAnimal('polvo'),
  peixe: generateSkillNodesForAnimal('peixe'),
  carneiro: generateSkillNodesForAnimal('carneiro'),
  elefante: generateSkillNodesForAnimal('elefante'),
  tigre: generateSkillNodesForAnimal('tigre'),
  pavao: generateSkillNodesForAnimal('pavao'),
};

export const SAMPLE_PRESETS = [
  {
    name: 'Leão Paladino Solstício',
    animalId: 'leao' as AnimalId,
    level: 18,
    unlockedSkillIds: [
      'leao_fogo_1', 'leao_fogo_2', 'leao_fogo_3', 'leao_fogo_6', 'leao_fogo_9', 'leao_fogo_12', 'leao_fogo_15',
      'leao_sagrado_1', 'leao_sagrado_3', 'leao_sagrado_6', 'leao_sagrado_15',
    ],
    notes: 'Build focada em dano radiante e lâmina flamejante de espada.',
  },
  {
    name: 'Águia Tempestuosa',
    animalId: 'aguia' as AnimalId,
    level: 16,
    unlockedSkillIds: [
      'aguia_vento_1', 'aguia_vento_3', 'aguia_vento_6', 'aguia_vento_9', 'aguia_vento_15',
      'aguia_raio_1', 'aguia_raio_3', 'aguia_raio_6',
    ],
    notes: 'Arqueiro de vento e relâmpago com extrema mobilidade aérea.',
  },
  {
    name: 'Polvo Ilusionista Tóxico',
    animalId: 'polvo' as AnimalId,
    level: 15,
    unlockedSkillIds: [
      'polvo_veneno_1', 'polvo_veneno_2', 'polvo_veneno_3', 'polvo_veneno_15',
      'polvo_psionico_1', 'polvo_psionico_3', 'polvo_psionico_6',
    ],
    notes: 'Pinta runas psíquicas e tinta tóxica paralisante.',
  },
  {
    name: 'Tartaruga Muralha da Terra',
    animalId: 'tartaruga' as AnimalId,
    level: 20,
    unlockedSkillIds: [
      'tartaruga_metal_1', 'tartaruga_metal_3', 'tartaruga_metal_6', 'tartaruga_metal_15',
      'tartaruga_terra_1', 'tartaruga_terra_3', 'tartaruga_terra_6', 'tartaruga_terra_15',
    ],
    notes: 'Tanque inabalável com escudo de aço e terra elemental.',
  },
];

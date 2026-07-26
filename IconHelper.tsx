import React, { useState, useMemo, useEffect } from 'react';
import { AnimalId, CharacterAttributes, ElementId, SkillNode, SkillRank, XPConfig, DEFAULT_XP_CONFIG, getSkillXpCost, getDesignioXpCost, PurchasedCombatStats } from './types';
import { ALL_SKILL_TREES, ANIMALS, ELEMENTS } from './data/rpgData';
import { DESIGNIOS_LIST, DESIGNIOS_MAP, DesignioDefinition } from './data/designiosData';
import { SkillTreeCanvas } from './components/SkillTreeCanvas';
import { SkillDetailModal } from './components/SkillDetailModal';
import { AnimalCompendium } from './components/AnimalCompendium';
import { ElementCompendium } from './components/ElementCompendium';
import { CharacterSheetView } from './components/CharacterSheetView';
import { DesigniosView } from './components/DesigniosView';
import { SkillEditorView } from './components/SkillEditorView';
import { AdminView } from './components/AdminView';
import { LoginScreen, UserAccount } from './components/LoginScreen';
import { DiceRoller } from './components/DiceRoller';
import { IconHelper } from './components/IconHelper';
import {
  checkTierUnlocked,
  getCombatStatCost,
  getSkillNextUpgradeCost,
  getSkillTotalSpent,
  cleanRank,
} from './utils/xpUtils';
import {
  subscribeToUsers,
  subscribeToSystemConfig,
  saveUserToFirestore,
  saveXPConfigToFirestore,
  saveCustomSkillsToFirestore,
  saveDesigniosToFirestore,
  CharacterSheetState,
} from './lib/firebase';
import {
  Layers,
  Sword,
  Sparkles,
  BookOpen,
  Dices,
  Shield,
  RotateCcw,
  Flame,
  Crown,
  Edit3,
  UserCheck,
  LogOut,
  User,
  Settings,
  Coins,
  Compass,
} from 'lucide-react';

export default function App() {
  // Map of Firestore character sheets
  const [userSheetsMap, setUserSheetsMap] = useState<Record<string, CharacterSheetState>>({});

  // Saved accounts list
  const [existingAccounts, setExistingAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_user_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Current logged in user account - always start at login screen on app load
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [currentAnimalId, setCurrentAnimalId] = useState<AnimalId>('leao');
  const [characterName, setCharacterName] = useState<string>('Guardião do Sol');

  // System XP Config state
  const [xpConfig, setXpConfig] = useState<XPConfig>(() => {
    try {
      const saved = localStorage.getItem('rpg_xp_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_XP_CONFIG,
          ...parsed,
          tierRankXpCosts: {
            ...DEFAULT_XP_CONFIG.tierRankXpCosts,
            ...(parsed.tierRankXpCosts || {}),
          },
        };
      }
      return DEFAULT_XP_CONFIG;
    } catch (e) {
      return DEFAULT_XP_CONFIG;
    }
  });

  // Character Total XP state
  const [xpTotal, setXpTotal] = useState<number>(1000);

  const [attributes, setAttributes] = useState<CharacterAttributes>({
    forca: 2,
    destreza: 2,
    constituicao: 1,
    poder: 1,
  });
  const [unlockedSkillIds, setUnlockedSkillIds] = useState<string[]>([]);
  const [userSkillRanks, setUserSkillRanks] = useState<Record<string, SkillRank>>({});
  const [purchasedCombatStats, setPurchasedCombatStats] = useState<PurchasedCombatStats>({
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
  });
  const [userDesignios, setUserDesignios] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'tree' | 'designios' | 'compendium' | 'elements' | 'sheet' | 'admin'>('sheet');
  const [adminSubTab, setAdminSubTab] = useState<'mestre' | 'xp' | 'skills'>('mestre');
  const [notes, setNotes] = useState<string>('');
  const isAdmin = currentUser ? (currentUser.role === 'admin' || currentUser.username.toLowerCase().includes('mestre')) : false;

  // Custom skills state
  const [customSkillsMap, setCustomSkillsMap] = useState<Record<string, SkillNode>>(() => {
    try {
      const saved = localStorage.getItem('rpg_custom_skills');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Global custom Desígnios list state
  const [designiosList, setDesigniosList] = useState<DesignioDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_custom_designios_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DESIGNIOS_LIST;
  });

  // 1. Subscribe to Firestore System Config (XPConfig, Custom Skills, Designios)
  useEffect(() => {
    const unsubscribeSystem = subscribeToSystemConfig((remoteXpConfig, remoteCustomSkills, remoteDesignios) => {
      if (remoteXpConfig) {
        setXpConfig({
          ...DEFAULT_XP_CONFIG,
          ...remoteXpConfig,
          tierRankXpCosts: {
            ...DEFAULT_XP_CONFIG.tierRankXpCosts,
            ...(remoteXpConfig.tierRankXpCosts || {}),
          },
        });
      }
      if (remoteCustomSkills) {
        setCustomSkillsMap(remoteCustomSkills);
      }
      if (remoteDesignios) {
        setDesigniosList(remoteDesignios);
      }
    });

    return () => unsubscribeSystem();
  }, []);

  // 2. Subscribe to Firestore Users (Accounts and Character Sheets) in Real Time (onSnapshot)
  useEffect(() => {
    const defaultPresets: UserAccount[] = [
      { username: 'Mestre_GM', characterName: 'Mestre do Jogo (Visão Total)', animalId: 'leao', createdAt: '2026-01-01', role: 'admin', xpTotal: 5000 },
      { username: 'Jogador_Solis', characterName: 'Solis, O Rugido Solar', animalId: 'leao', createdAt: '2026-01-02', role: 'player', xpTotal: 1200 },
      { username: 'Jogador_Luna', characterName: 'Luna, A Sombra Prateada', animalId: 'lobo', createdAt: '2026-01-03', role: 'player', xpTotal: 1000 },
    ];

    const unsubscribeUsers = subscribeToUsers((remoteUsers, remoteSheets) => {
      setUserSheetsMap(remoteSheets);

      if (remoteUsers.length > 0) {
        setExistingAccounts(remoteUsers);
      } else {
        // Seed initial default accounts if database is empty
        defaultPresets.forEach((acc) => saveUserToFirestore(acc));
        setExistingAccounts(defaultPresets);
      }
    });

    return () => unsubscribeUsers();
  }, []);

  // Sync active user character sheet when user object or remote sheets update
  useEffect(() => {
    if (!currentUser) return;
    const userKey = currentUser.username;
    const remoteSheet = userSheetsMap[userKey];

    if (remoteSheet) {
      setCharacterName(remoteSheet.characterName);
      if (remoteSheet.animalId && ANIMALS[remoteSheet.animalId as AnimalId]) {
        setCurrentAnimalId(remoteSheet.animalId as AnimalId);
      }
      setXpTotal(remoteSheet.xpTotal ?? currentUser.xpTotal ?? 1000);
      setAttributes(remoteSheet.attributes || { forca: 2, destreza: 2, constituicao: 1, poder: 1 });
      setUnlockedSkillIds(remoteSheet.unlockedSkillIds || [`${currentUser.animalId || 'leao'}_fogo_1`]);
      setUserSkillRanks(remoteSheet.userSkillRanks || {});
      setPurchasedCombatStats(
        remoteSheet.purchasedCombatStats || {
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
        }
      );
      setUserDesignios(remoteSheet.userDesignios || {});
      setNotes(remoteSheet.notes || '');
    }
  }, [currentUser?.username, userSheetsMap]);

  // Ensure non-admin users cannot access the admin tab
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('sheet');
    }
  }, [activeTab, isAdmin]);

  const designiosMap = useMemo(() => {
    return designiosList.reduce((acc, des) => {
      acc[des.id] = des;
      return acc;
    }, {} as Record<string, DesignioDefinition>);
  }, [designiosList]);

  const handleSaveDesignios = (updatedList: DesignioDefinition[]) => {
    setDesigniosList(updatedList);
    saveDesigniosToFirestore(updatedList);
  };

  // Auto-sync active character updates to Firestore
  useEffect(() => {
    if (!currentUser) return;

    const sheetData: Partial<CharacterSheetState> = {
      characterName,
      animalId: currentAnimalId,
      xpTotal,
      attributes,
      unlockedSkillIds,
      userSkillRanks,
      purchasedCombatStats,
      userDesignios,
      notes,
    };

    saveUserToFirestore(currentUser, sheetData);
  }, [
    currentUser?.username,
    characterName,
    currentAnimalId,
    xpTotal,
    attributes,
    unlockedSkillIds,
    userSkillRanks,
    purchasedCombatStats,
    userDesignios,
    notes,
  ]);

  // Save XP Config globally
  const handleSaveXPConfig = (newConfig: XPConfig) => {
    setXpConfig(newConfig);
    saveXPConfigToFirestore(newConfig);
  };

  // Update XP Total or Role for any user account (Mestre Admin Panel)
  const handleUpdateAccountXP = (username: string, newTotalXp: number, newRole?: 'player' | 'admin') => {
    const foundAcc = existingAccounts.find((a) => a.username === username);
    if (!foundAcc) return;

    const updatedAccount: UserAccount = {
      ...foundAcc,
      xpTotal: newTotalXp,
      role: newRole !== undefined ? newRole : foundAcc.role,
    };

    saveUserToFirestore(updatedAccount, { xpTotal: newTotalXp });

    if (currentUser && currentUser.username === username) {
      setXpTotal(newTotalXp);
      if (newRole !== undefined) {
        setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
      }
    }
  };

  // Handle Login & Register
  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    setActiveTab('sheet');
    saveUserToFirestore(account);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Modals state
  const [selectedSkillModal, setSelectedSkillModal] = useState<SkillNode | null>(null);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [testSkillForDice, setTestSkillForDice] = useState<SkillNode | null>(null);

  // Load initial unlocked skills for default animal
  useEffect(() => {
    // Default unlock tier 1 skills for first animal
    const initialSkills = [`${currentAnimalId}_fogo_1`, `${currentAnimalId}_fogo_2`];
    setUnlockedSkillIds(initialSkills);
  }, []);

  const currentAnimal = ANIMALS[currentAnimalId];

  // Map of all default skills
  const defaultAllSkillsMap = useMemo(() => {
    const map: Record<string, SkillNode> = {};
    Object.values(ALL_SKILL_TREES).forEach((elemMap) => {
      Object.values(elemMap).forEach((skillList) => {
        skillList.forEach((skill) => {
          map[skill.id] = skill;
        });
      });
    });
    return map;
  }, []);

  // Effective all skills map merging defaults with custom edits
  const allSkillsMap = useMemo(() => {
    return {
      ...defaultAllSkillsMap,
      ...customSkillsMap,
    };
  }, [defaultAllSkillsMap, customSkillsMap]);

  // Effective skills by element for active animal
  const skillsByElement = useMemo(() => {
    const rawMap = ALL_SKILL_TREES[currentAnimalId];
    const result: Record<ElementId, SkillNode[]> = {} as any;

    Object.entries(rawMap).forEach(([elemKey, skillList]) => {
      const elemId = elemKey as ElementId;
      const skillListTyped = skillList as SkillNode[];
      result[elemId] = skillListTyped.map((defaultSkill) => {
        return customSkillsMap[defaultSkill.id] || defaultSkill;
      });
    });

    return result;
  }, [currentAnimalId, customSkillsMap]);

  // Handlers for skill customization
  const handleSaveSkill = (updatedSkill: SkillNode) => {
    setCustomSkillsMap((prev) => {
      const updated = {
        ...prev,
        [updatedSkill.id]: updatedSkill,
      };
      saveCustomSkillsToFirestore(updated);
      return updated;
    });
  };

  const handleResetSkill = (skillId: string) => {
    setCustomSkillsMap((prev) => {
      const next = { ...prev };
      delete next[skillId];
      saveCustomSkillsToFirestore(next);
      return next;
    });
  };

  const handleResetAllCustomSkills = () => {
    setCustomSkillsMap({});
    saveCustomSkillsToFirestore({});
  };

  const handleImportCustomSkills = (importedMap: Record<string, SkillNode>) => {
    setCustomSkillsMap((prev) => {
      const updated = {
        ...prev,
        ...importedMap,
      };
      saveCustomSkillsToFirestore(updated);
      return updated;
    });
  };

  // Compute XP Spent & Available
  const xpSpent = useMemo(() => {
    // 1. XP spent on Attributes
    const getAttrCost = (key: keyof CharacterAttributes) => {
      return xpConfig.attributeCosts?.[key] ?? xpConfig.costPerAttributePoint ?? 100;
    };

    const attrCost =
      (attributes.forca * getAttrCost('forca')) +
      (attributes.destreza * getAttrCost('destreza')) +
      (attributes.constituicao * getAttrCost('constituicao')) +
      (attributes.poder * getAttrCost('poder'));

    // 2. XP spent on Purchased Combat Stats
    const combatStatsCost = Object.entries(purchasedCombatStats).reduce((sum, [key, count]) => {
      const cnt = Number(count) || 0;
      if (cnt <= 0) return sum;
      const unitCost = getCombatStatCost(key, xpConfig);
      return sum + (cnt * unitCost);
    }, 0);

    // 3. XP spent on Unlocked Skills & Rank Upgrades
    const skillsCost = unlockedSkillIds.reduce((sum, id) => {
      const sk = allSkillsMap[id];
      if (!sk) return sum;
      const rank = userSkillRanks[id] || 'D';
      return sum + getSkillTotalSpent(sk.tier, rank, xpConfig);
    }, 0);

    // 4. XP spent on Desígnios
    const designiosCost = Object.entries(userDesignios).reduce((sum, [id, level]) => {
      const lvl = Number(level) || 0;
      if (lvl <= 0) return sum;
      const des = designiosMap[id];
      if (!des) return sum;
      const costPerLevel = getDesignioXpCost(des.rank, xpConfig);
      return sum + (costPerLevel * lvl);
    }, 0);

    return attrCost + combatStatsCost + skillsCost + designiosCost;
  }, [attributes, purchasedCombatStats, unlockedSkillIds, userSkillRanks, allSkillsMap, userDesignios, xpConfig, designiosMap]);

  const xpAvailable = useMemo(() => {
    return Math.max(0, xpTotal - xpSpent);
  }, [xpTotal, xpSpent]);

  // Handle purchasing secondary combat stats with XP
  const handleCombatStatChange = (statKey: keyof PurchasedCombatStats, delta: number) => {
    const currentCount = purchasedCombatStats[statKey] || 0;
    const newCount = currentCount + delta;
    if (newCount < 0) return;

    const unitCost = getCombatStatCost(statKey, xpConfig);
    if (delta > 0 && xpAvailable < unitCost) return;

    setPurchasedCombatStats((prev) => ({
      ...prev,
      [statKey]: newCount,
    }));
  };

  // Handle skill rank upgrade with XP
  const handleUpgradeSkillRank = (skillId: string) => {
    if (!unlockedSkillIds.includes(skillId)) return;
    const sk = allSkillsMap[skillId];
    if (!sk) return;

    const currentRank = userSkillRanks[skillId] || 'D';
    const upgrade = getSkillNextUpgradeCost(sk.tier, currentRank, xpConfig);
    if (!upgrade) return; // already max rank

    if (xpAvailable < upgrade.cost) return; // Not enough XP

    setUserSkillRanks((prev) => ({
      ...prev,
      [skillId]: upgrade.nextRank,
    }));
  };

  // Handle Desígnio level modification with Prerequisite Checks
  const handleDesignioLevelChange = (designioId: string, delta: number) => {
    const des = designiosMap[designioId];
    if (!des) return;
    const cost = getDesignioXpCost(des.rank, xpConfig);
    const currentLevel = userDesignios[designioId] || 0;
    const newLevel = currentLevel + delta;

    if (newLevel < 0) return;

    // Prerequisite check when purchasing/leveling up
    if (delta > 0) {
      if (des.prerequisiteId) {
        const parentLevel = userDesignios[des.prerequisiteId] || 0;
        const requiredLevel = des.prerequisiteLevel || 5;
        if (parentLevel < requiredLevel) return;
      }
      if (xpAvailable < cost) return;
    }

    // Prerequisite safeguard when decreasing parent desígnio level
    if (delta < 0 && newLevel < 5) {
      // Check if any acquired child desígnio depends on this one being level 5
      const activeChildren = DESIGNIOS_LIST.filter(
        (child) => child.prerequisiteId === designioId && (userDesignios[child.id] || 0) > 0
      );
      if (activeChildren.length > 0) return; // Cannot decrease while child is active
    }

    setUserDesignios((prev) => {
      const updated = { ...prev };
      if (newLevel === 0) {
        delete updated[designioId];
      } else {
        updated[designioId] = newLevel;
      }
      return updated;
    });
  };

  // Toggle unlock/forget skill
  const handleToggleUnlock = (skillId: string) => {
    setUnlockedSkillIds((prev) => {
      if (prev.includes(skillId)) {
        // Forget skill and any children depending on it
        const idsToRemove = new Set<string>([skillId]);
        let changed = true;
        while (changed) {
          changed = false;
          prev.forEach((id) => {
            const sk = allSkillsMap[id];
            if (sk && !idsToRemove.has(id)) {
              if (sk.prerequisites.some((req) => idsToRemove.has(req))) {
                idsToRemove.add(id);
                changed = true;
              }
            }
          });
        }
        return prev.filter((id) => !idsToRemove.has(id));
      } else {
        // Learn skill
        return [...prev, skillId];
      }
    });
  };

  // Reset current tree
  const handleResetTree = () => {
    setUnlockedSkillIds([]);
  };

  // Switch animal guardian
  const handleSelectAnimal = (animalId: AnimalId) => {
    setCurrentAnimalId(animalId);
    setUnlockedSkillIds([`${animalId}_${ANIMALS[animalId].elements[0]}_1`]);
    setActiveTab('tree');
  };

  // Load preset build
  const handleLoadBuild = (preset: {
    name: string;
    animalId: AnimalId;
    level?: number;
    unlockedSkillIds: string[];
    notes?: string;
  }) => {
    setCurrentAnimalId(preset.animalId);
    setCharacterName(preset.name);
    setUnlockedSkillIds(preset.unlockedSkillIds);
    if (preset.notes) setNotes(preset.notes);
    setActiveTab('tree');
  };

  // Unlocked Skill Objects
  const unlockedSkillObjects = useMemo(() => {
    return unlockedSkillIds
      .map((id) => allSkillsMap[id])
      .filter((s): s is SkillNode => s !== undefined);
  }, [unlockedSkillIds, allSkillsMap]);

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} existingAccounts={existingAccounts} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Crown size={20} className="sm:hidden" />
                <Crown size={22} className="hidden sm:block" />
              </div>
            </div>

            <div>
              <h1 className="font-extrabold text-xs sm:text-base tracking-tight text-zinc-100 flex items-center gap-1.5 sm:gap-2">
                Guardiões & Elementos
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  RPG
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 hidden md:block">
                15 Animais-Armas • 15 Elementos • Sistema por XP
              </p>
            </div>
          </div>

          {/* User Account Controls & Quick Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Active User Badge & Logout */}
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[9px] sm:text-[10px] shrink-0 border border-amber-500/30">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block text-left max-w-[120px] md:max-w-none truncate">
                <div className="font-bold text-zinc-200 leading-none flex items-center gap-1 truncate text-xs">
                  <span className="truncate">{characterName}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded shrink-0">ADM</span>
                  )}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono truncate">@{currentUser.username} • {xpTotal} XP</div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                title="Trocar de Jogador / Sair"
              >
                <LogOut size={14} />
              </button>
            </div>

            {/* Admin Panel Button if Admin or Mestre */}
            {isAdmin && (
              <button
                onClick={() => {
                  setAdminSubTab('mestre');
                  setActiveTab('admin');
                }}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Painel do Mestre (Administrador)"
              >
                <Shield size={15} />
                <span className="hidden md:inline">Painel ADM</span>
              </button>
            )}

            <button
              onClick={() => setIsDiceRollerOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Dices size={16} />
              <span className="hidden sm:inline">Dados TTRPG</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x border-t border-zinc-900/80 pt-1.5 pb-2">
          {[
            { id: 'sheet', label: `Ficha (${unlockedSkillIds.length})`, fullLabel: `Ficha de Personagem (${unlockedSkillIds.length})`, icon: BookOpen },
            { id: 'tree', label: 'Árvore de Habilidades', fullLabel: 'Árvore de Habilidades', icon: Layers },
            { id: 'designios', label: 'Desígnios', fullLabel: 'Desígnios', icon: Compass },
            { id: 'compendium', label: '15 Guardiões', fullLabel: '15 Guardiões (Animais)', icon: Sword },
            { id: 'elements', label: '15 Elementos', fullLabel: '15 Elementos Místicos', icon: Sparkles },
            ...(isAdmin
              ? [
                  {
                    id: 'admin',
                    label: 'Painel ADM',
                    fullLabel: `Administrador${Object.keys(customSkillsMap).length > 0 ? ` (${Object.keys(customSkillsMap).length})` : ''}`,
                    icon: Shield,
                  },
                ]
              : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 border snap-start min-h-[40px] ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/60 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {activeTab === 'tree' && (
          <SkillTreeCanvas
            animal={currentAnimal}
            skillsByElement={skillsByElement}
            unlockedSkillIds={unlockedSkillIds}
            userSkillRanks={userSkillRanks}
            onUpgradeSkillRank={handleUpgradeSkillRank}
            xpTotal={xpTotal}
            xpAvailable={xpAvailable}
            xpSpent={xpSpent}
            xpConfig={xpConfig}
            onSelectSkill={(skill) => setSelectedSkillModal(skill)}
            onQuickToggleSkill={handleToggleUnlock}
            onResetTree={handleResetTree}
            allSkillsMap={allSkillsMap}
          />
        )}

        {activeTab === 'designios' && (
          <DesigniosView
            xpTotal={xpTotal}
            xpSpent={xpSpent}
            xpAvailable={xpAvailable}
            xpConfig={xpConfig}
            userDesignios={userDesignios}
            onDesignioLevelChange={handleDesignioLevelChange}
            designiosList={designiosList}
          />
        )}

        {activeTab === 'compendium' && (
          <AnimalCompendium
            currentAnimalId={currentAnimalId}
            onSelectAnimal={handleSelectAnimal}
          />
        )}

        {activeTab === 'elements' && <ElementCompendium />}

        {activeTab === 'sheet' && (
          <CharacterSheetView
            characterName={characterName}
            onCharacterNameChange={setCharacterName}
            animal={currentAnimal}
            xpTotal={xpTotal}
            xpSpent={xpSpent}
            xpAvailable={xpAvailable}
            xpConfig={xpConfig}
            attributes={attributes}
            onAttributesChange={setAttributes}
            purchasedCombatStats={purchasedCombatStats}
            onCombatStatChange={handleCombatStatChange}
            userSkillRanks={userSkillRanks}
            onUpgradeSkillRank={handleUpgradeSkillRank}
            unlockedSkills={unlockedSkillObjects}
            onTestRollSkill={(sk) => {
              setTestSkillForDice(sk);
              setIsDiceRollerOpen(true);
            }}
            notes={notes}
            onNotesChange={setNotes}
            userDesignios={userDesignios}
            onDesignioLevelChange={handleDesignioLevelChange}
            userRole={currentUser.role}
            onOpenAdminPanel={isAdmin ? () => {
              setAdminSubTab('mestre');
              setActiveTab('admin');
            } : undefined}
            designiosList={designiosList}
            onNavigateToDesignios={() => setActiveTab('designios')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            xpConfig={xpConfig}
            onSaveXPConfig={handleSaveXPConfig}
            allAccounts={existingAccounts}
            onUpdateAccountXP={handleUpdateAccountXP}
            currentUser={currentUser}
            designiosList={designiosList}
            onSaveDesignios={handleSaveDesignios}
            allSkillsMap={allSkillsMap}
            customSkillsMap={customSkillsMap}
            onSaveSkill={handleSaveSkill}
            onResetSkill={handleResetSkill}
            onResetAllCustomSkills={handleResetAllCustomSkills}
            onImportCustomSkills={handleImportCustomSkills}
            initialSubTab={adminSubTab}
          />
        )}
      </main>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkillModal}
        onClose={() => setSelectedSkillModal(null)}
        unlockedSkillIds={unlockedSkillIds}
        userSkillRanks={userSkillRanks}
        onUpgradeSkillRank={handleUpgradeSkillRank}
        xpAvailable={xpAvailable}
        xpConfig={xpConfig}
        onToggleUnlock={(id) => {
          handleToggleUnlock(id);
          setSelectedSkillModal(null);
        }}
        allSkillsMap={allSkillsMap}
        onTestRollSkill={(sk) => {
          setSelectedSkillModal(null);
          setTestSkillForDice(sk);
          setIsDiceRollerOpen(true);
        }}
      />

      {/* TTRPG Dice Roller Modal */}
      <DiceRoller
        isOpen={isDiceRollerOpen}
        onClose={() => {
          setIsDiceRollerOpen(false);
          setTestSkillForDice(null);
        }}
        activeSkillToRoll={testSkillForDice}
        unlockedSkills={unlockedSkillObjects}
      />
    </div>
  );
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount } from '../components/LoginScreen';
import { XPConfig, SkillNode, PurchasedCombatStats, CharacterAttributes, SkillRank } from '../types';
import { DesignioDefinition } from '../data/designiosData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface CharacterSheetState {
  characterName: string;
  animalId: string;
  xpTotal: number;
  attributes: CharacterAttributes;
  unlockedSkillIds: string[];
  userSkillRanks: Record<string, SkillRank>;
  purchasedCombatStats: PurchasedCombatStats;
  userDesignios: Record<string, number>;
  notes: string;
}

// In-memory local state cache for offline/unconfigured fallback
const localUsersStore: Record<string, { account: UserAccount; sheet: CharacterSheetState }> = {};
const localSystemStore: Record<string, unknown> = {};

// Subscribe to real-time users updates
export function subscribeToUsers(
  onUpdate: (users: UserAccount[], userSheets: Record<string, CharacterSheetState>) => void
) {
  if (!supabase) {
    // LocalStorage fallback if Supabase is not configured yet
    const loadFromLocal = () => {
      try {
        const saved = localStorage.getItem('rpg_supabase_users_cache');
        if (saved) {
          const parsed = JSON.parse(saved);
          const usersList: UserAccount[] = [];
          const sheetsMap: Record<string, CharacterSheetState> = {};
          Object.values(parsed as Record<string, { account: UserAccount; sheet: CharacterSheetState }>).forEach(
            (item) => {
              usersList.push(item.account);
              sheetsMap[item.account.username] = item.sheet;
            }
          );
          onUpdate(usersList, sheetsMap);
          return;
        }
      } catch (e) {
        console.error('Error loading local user state:', e);
      }
      onUpdate([], {});
    };

    loadFromLocal();
    return () => {};
  }

  // Initial fetch from Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.warn('Supabase fetch users error:', error.message);
      return;
    }

    if (data) {
      const usersList: UserAccount[] = [];
      const userSheets: Record<string, CharacterSheetState> = {};

      data.forEach((row) => {
        const username = row.username;
        const sheet = row.sheet_data || {};

        usersList.push({
          username: row.username,
          password: row.password || '',
          role: row.role || 'user',
          characterName: row.character_name || 'Guardião',
          animalId: row.animal_id || 'leao',
          xpTotal: Number(row.xp_total ?? 1000),
          createdAt: row.created_at || new Date().toISOString(),
        });

        userSheets[username] = {
          characterName: row.character_name || 'Guardião',
          animalId: row.animal_id || 'leao',
          xpTotal: Number(row.xp_total ?? 1000),
          attributes: sheet.attributes || { forca: 2, destreza: 2, constituicao: 1, poder: 1 },
          unlockedSkillIds: Array.isArray(sheet.unlockedSkillIds) ? sheet.unlockedSkillIds : [],
          userSkillRanks: sheet.userSkillRanks || {},
          purchasedCombatStats: sheet.purchasedCombatStats || {
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
          },
          userDesignios: sheet.userDesignios || {},
          notes: sheet.notes || '',
        };
      });

      onUpdate(usersList, userSheets);
    }
  };

  fetchUsers();

  // Supabase Realtime Subscription
  const channel = supabase
    .channel('users_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
      fetchUsers();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Save single user account + character sheet to Supabase
export async function saveUserToSupabase(
  account: UserAccount,
  sheetData?: Partial<CharacterSheetState>
) {
  if (!supabase) {
    // Local fallback
    try {
      const existing = localUsersStore[account.username] || {
        account,
        sheet: {
          characterName: account.characterName || 'Guardião',
          animalId: account.animalId || 'leao',
          xpTotal: account.xpTotal || 1000,
          attributes: { forca: 2, destreza: 2, constituicao: 1, poder: 1 },
          unlockedSkillIds: [],
          userSkillRanks: {},
          purchasedCombatStats: {
            pvs: 0, pms: 0, ataque: 0, atqEspecial: 0, defesa: 0,
            defEspecial: 0, critico: 0, velAtq: 0, velMov: 0, velEspecial: 0
          },
          userDesignios: {},
          notes: '',
        },
      };

      const updatedAccount: UserAccount = { ...existing.account, ...account };
      const updatedSheet: CharacterSheetState = { ...existing.sheet, ...(sheetData || {}) };

      localUsersStore[account.username] = { account: updatedAccount, sheet: updatedSheet };
      localStorage.setItem('rpg_supabase_users_cache', JSON.stringify(localUsersStore));
    } catch (e) {
      console.error('Error saving to local storage:', e);
    }
    return;
  }

  try {
    // Fetch existing user row to merge JSONB sheet_data if needed
    const { data: existingRow } = await supabase
      .from('users')
      .select('sheet_data')
      .eq('username', account.username)
      .single();

    const currentSheetData = existingRow?.sheet_data || {};

    const updatedSheetData = {
      ...currentSheetData,
      ...(sheetData?.attributes ? { attributes: sheetData.attributes } : {}),
      ...(sheetData?.unlockedSkillIds ? { unlockedSkillIds: sheetData.unlockedSkillIds } : {}),
      ...(sheetData?.userSkillRanks ? { userSkillRanks: sheetData.userSkillRanks } : {}),
      ...(sheetData?.purchasedCombatStats ? { purchasedCombatStats: sheetData.purchasedCombatStats } : {}),
      ...(sheetData?.userDesignios ? { userDesignios: sheetData.userDesignios } : {}),
      ...(sheetData?.notes !== undefined ? { notes: sheetData.notes } : {}),
    };

    const rowPayload = {
      username: account.username,
      password: account.password || '',
      role: account.role || 'user',
      character_name: sheetData?.characterName || account.characterName || 'Guardião',
      animal_id: sheetData?.animalId || account.animalId || 'leao',
      xp_total: sheetData?.xpTotal ?? account.xpTotal ?? 1000,
      sheet_data: updatedSheetData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('users').upsert(rowPayload, { onConflict: 'username' });

    if (error) {
      console.error('Supabase save user error:', error.message);
    }
  } catch (error) {
    console.error('Failed to save user to Supabase:', error);
  }
}

// Real-time listener for System Config (XPConfig, Custom Skills, Designios)
export function subscribeToSystemConfig(
  onConfigUpdate: (
    xpConfig?: XPConfig,
    customSkills?: Record<string, SkillNode>,
    designiosList?: DesignioDefinition[]
  ) => void
) {
  if (!supabase) {
    try {
      const savedXp = localStorage.getItem('rpg_supabase_xp_cache');
      const savedSkills = localStorage.getItem('rpg_supabase_skills_cache');
      const savedDesignios = localStorage.getItem('rpg_supabase_designios_cache');

      onConfigUpdate(
        savedXp ? JSON.parse(savedXp) : undefined,
        savedSkills ? JSON.parse(savedSkills) : undefined,
        savedDesignios ? JSON.parse(savedDesignios) : undefined
      );
    } catch (e) {
      onConfigUpdate();
    }
    return () => {};
  }

  const fetchConfig = async () => {
    const { data, error } = await supabase.from('system_config').select('*');
    if (error) {
      console.warn('Supabase fetch config error:', error.message);
      return;
    }

    let xpConfig: XPConfig | undefined;
    let customSkills: Record<string, SkillNode> | undefined;
    let designiosList: DesignioDefinition[] | undefined;

    if (data) {
      data.forEach((row) => {
        if (row.id === 'xpConfig') {
          xpConfig = row.data as XPConfig;
        } else if (row.id === 'customSkills') {
          customSkills = row.data as Record<string, SkillNode>;
        } else if (row.id === 'designios') {
          designiosList = row.data as DesignioDefinition[];
        }
      });
    }

    onConfigUpdate(xpConfig, customSkills, designiosList);
  };

  fetchConfig();

  const channel = supabase
    .channel('system_config_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, () => {
      fetchConfig();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Save XP Config
export async function saveXPConfigToSupabase(xpConfig: XPConfig) {
  if (!supabase) {
    localStorage.setItem('rpg_supabase_xp_cache', JSON.stringify(xpConfig));
    return;
  }
  await supabase.from('system_config').upsert({
    id: 'xpConfig',
    data: xpConfig,
    updated_at: new Date().toISOString(),
  });
}

// Save Custom Skills
export async function saveCustomSkillsToSupabase(customSkills: Record<string, SkillNode>) {
  if (!supabase) {
    localStorage.setItem('rpg_supabase_skills_cache', JSON.stringify(customSkills));
    return;
  }
  await supabase.from('system_config').upsert({
    id: 'customSkills',
    data: customSkills,
    updated_at: new Date().toISOString(),
  });
}

// Save Designios List
export async function saveDesigniosToSupabase(designiosList: DesignioDefinition[]) {
  if (!supabase) {
    localStorage.setItem('rpg_supabase_designios_cache', JSON.stringify(designiosList));
    return;
  }
  await supabase.from('system_config').upsert({
    id: 'designios',
    data: designiosList,
    updated_at: new Date().toISOString(),
  });
}

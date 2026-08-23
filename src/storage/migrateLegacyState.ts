import { defaultState } from "../domain/defaults";
import type { MettlefieldStateV1 } from "../domain/types";

function read<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch { return fallback; }
}

function array<T>(value: unknown): T[] { return Array.isArray(value) ? value as T[] : []; }

export interface MigrationResult { state: MettlefieldStateV1; migrated: boolean; sourceKeys: string[]; }

export function migrateLegacyState(storage: Storage): MigrationResult {
  const sourceKeys = Object.keys(storage).filter((key) => key.startsWith("hc_"));
  const profile = read(storage, "hc_profile", defaultState.profile);
  const goals = read(storage, "hc_goals", defaultState.goals);
  const entries = read<unknown>(storage, "hc_entries", []);
  const settings = read<Record<string, string>>(storage, "hc_settings", {});
  const state: MettlefieldStateV1 = {
    ...defaultState,
    profile: { ...defaultState.profile, ...profile },
    goals: { ...defaultState.goals, ...goals },
    foods: array(entries),
    weights: array(read(storage, "hc_weights", [])),
    sleep: array(read(storage, "hc_sleep", [])),
    workouts: array(read(storage, "hc_workouts", [])),
    cardio: array(read(storage, "hc_cardio", [])),
    habits: array(read(storage, "hc_checklist", [])),
    plans: array(read(storage, "hc_custom_plans", [])),
    manualMaxes: read(storage, "hc_manual_maxes", {}),
    activePlanId: read<string | undefined>(storage, "hc_active_plan", undefined),
    integrations: {
      groqKey: storage.getItem("hc_groq_key") || settings.groqKey,
      geminiKey: storage.getItem("hc_gemini_key") || settings.geminiKey,
    },
    migratedAt: sourceKeys.length ? new Date().toISOString() : undefined,
  };
  return { state, migrated: sourceKeys.length > 0, sourceKeys };
}

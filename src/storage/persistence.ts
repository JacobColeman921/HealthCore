import { defaultState } from "../domain/defaults";
import type { MettlefieldStateV1 } from "../domain/types";
import { migrateLegacyState } from "./migrateLegacyState";
import { stateSchema } from "./schema";

export const STORAGE_KEY = "mettlefield_state_v1";
export interface LoadStateResult { state: MettlefieldStateV1; recoveryBackup?: string; }

export function loadStateWithStatus(storage: Storage = localStorage): LoadStateResult {
  const saved = storage.getItem(STORAGE_KEY) || undefined;
  try {
    if (saved) {
      const parsed = stateSchema.parse(JSON.parse(saved)) as MettlefieldStateV1;
      return { state: { ...defaultState, ...parsed, profile: { ...defaultState.profile, ...parsed.profile }, goals: { ...defaultState.goals, ...parsed.goals } } };
    }
    return { state: migrateLegacyState(storage).state };
  } catch { return { state: defaultState, recoveryBackup: saved }; }
}
export function loadState(storage: Storage = localStorage): MettlefieldStateV1 { return loadStateWithStatus(storage).state; }

export function saveState(state: MettlefieldStateV1, storage: Storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(stateSchema.parse(state)));
}

export function exportState(state: MettlefieldStateV1) {
  return JSON.stringify(stateSchema.parse(state), null, 2);
}

export function importState(raw: string): MettlefieldStateV1 {
  return stateSchema.parse(JSON.parse(raw)) as MettlefieldStateV1;
}

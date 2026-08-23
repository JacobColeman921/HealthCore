import { defaultState } from "../domain/defaults";
import type { MettlefieldStateV1 } from "../domain/types";
import { migrateLegacyState } from "./migrateLegacyState";
import { stateSchema } from "./schema";

export const STORAGE_KEY = "mettlefield_state_v1";

export function loadState(storage: Storage = localStorage): MettlefieldStateV1 {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = stateSchema.parse(JSON.parse(saved)) as MettlefieldStateV1;
      return { ...defaultState, ...parsed, profile: { ...defaultState.profile, ...parsed.profile }, goals: { ...defaultState.goals, ...parsed.goals } };
    }
    return migrateLegacyState(storage).state;
  } catch { return defaultState; }
}

export function saveState(state: MettlefieldStateV1, storage: Storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(state: MettlefieldStateV1) {
  return JSON.stringify(stateSchema.parse(state), null, 2);
}

export function importState(raw: string): MettlefieldStateV1 {
  return stateSchema.parse(JSON.parse(raw)) as MettlefieldStateV1;
}

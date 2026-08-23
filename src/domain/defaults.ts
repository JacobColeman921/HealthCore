import type { MettlefieldStateV1 } from "./types";

export const defaultState: MettlefieldStateV1 = {
  version: 1,
  profile: { name: "", units: "imperial", goal: "recomp", activity: 1.45 },
  goals: { calories: 2200, protein: 150, carbs: 240, fat: 70, water: 8, sleep: 8 },
  theme: "system",
  foods: [],
  water: [],
  weights: [],
  sleep: [],
  workouts: [],
  cardio: [],
  habits: [
    { id: "protein", label: "Meet protein target", dates: [] },
    { id: "movement", label: "Move for 30 minutes", dates: [] },
    { id: "sleep", label: "Keep a consistent bedtime", dates: [] },
  ],
  plans: [],
  manualMaxes: {},
  integrations: {},
};

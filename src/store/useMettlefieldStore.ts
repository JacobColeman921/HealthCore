import { create } from "zustand";
import type { CardioRecord, FoodEntry, Goals, Habit, MettlefieldStateV1, Plan, Profile, SleepRecord, Theme, WorkoutSession } from "../domain/types";
import { defaultState } from "../domain/defaults";
import { loadStateWithStatus, saveState } from "../storage/persistence";

interface Actions {
  storageStatus: "saved" | "memory-only" | "recovery-needed";
  recoveryBackup?: string;
  acknowledgeRecovery: () => void;
  addFood: (entry: FoodEntry) => void;
  removeFood: (id: string) => void;
  addWater: (date: string, value?: number) => void;
  addWeight: (date: string, value: number) => void;
  addSleep: (record: SleepRecord) => void;
  addSleepMany: (records: SleepRecord[]) => void;
  addWorkout: (workout: WorkoutSession) => void;
  addCardio: (record: CardioRecord) => void;
  addCardioMany: (records: CardioRecord[]) => void;
  setManualMax: (exercise: string, value: number) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (plan: Plan) => void;
  removePlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  setTheme: (theme: Theme) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateGoals: (goals: Partial<Goals>) => void;
  replaceState: (state: MettlefieldStateV1) => void;
  reset: () => void;
}

const initialLoad = typeof localStorage === "undefined" ? { state: defaultState } : loadStateWithStatus();
const initial = initialLoad.state;
const persist = (state: MettlefieldStateV1): Actions["storageStatus"] => { try { saveState(state); return "saved"; } catch { return "memory-only"; } };
const saved = <T extends MettlefieldStateV1 & { storageStatus?: Actions["storageStatus"]; recoveryBackup?: string }>(next: T) => next.storageStatus === "recovery-needed" && next.recoveryBackup ? { ...next, storageStatus: "recovery-needed" as const } : { ...next, storageStatus: persist(next) };

export const useMettlefieldStore = create<MettlefieldStateV1 & Actions>((set) => ({
  ...initial,
  storageStatus: initialLoad.recoveryBackup ? "recovery-needed" : "saved",
  recoveryBackup: initialLoad.recoveryBackup,
  acknowledgeRecovery: () => set((state) => { const next = { ...state, recoveryBackup: undefined, storageStatus: "saved" as const }; return { ...next, storageStatus: persist(next) }; }),
  addFood: (entry) => set((state) => saved({ ...state, foods: [...state.foods, entry] })),
  removeFood: (id) => set((state) => saved({ ...state, foods: state.foods.filter((entry) => entry.id !== id) })),
  addWater: (date, value = 1) => set((state) => saved({ ...state, water: [...state.water, { id: crypto.randomUUID(), date, value }] })),
  addWeight: (date, value) => set((state) => saved({ ...state, weights: [...state.weights, { id: crypto.randomUUID(), date, value }] })),
  addSleep: (record) => set((state) => saved({ ...state, sleep: [...state.sleep, record] })),
  addSleepMany: (records) => set((state) => { const known = new Set(state.sleep.map((item) => item.id)); const garminDates = new Set(state.sleep.filter((item) => item.source === "garmin").map((item) => item.date)); const additions = records.filter((item) => { if (known.has(item.id) || (item.source === "garmin" && garminDates.has(item.date))) return false; known.add(item.id); if (item.source === "garmin") garminDates.add(item.date); return true; }); return saved({ ...state, sleep: [...state.sleep, ...additions] }); }),
  addWorkout: (workout) => set((state) => saved({ ...state, workouts: [...state.workouts, workout] })),
  addCardio: (record) => set((state) => saved({ ...state, cardio: [...state.cardio, record] })),
  addCardioMany: (records) => set((state) => { const known = new Set(state.cardio.map((item) => item.id)); const additions = records.filter((item) => { if (known.has(item.id)) return false; known.add(item.id); return true; }); return saved({ ...state, cardio: [...state.cardio, ...additions] }); }),
  setManualMax: (exercise, value) => set((state) => saved({ ...state, manualMaxes: { ...state.manualMaxes, [exercise]: Math.max(state.manualMaxes[exercise] || 0, value) } })),
  toggleHabit: (habitId, date) => set((state) => saved({ ...state, habits: state.habits.map((habit) => habit.id === habitId ? { ...habit, dates: habit.dates.includes(date) ? habit.dates.filter((item) => item !== date) : [...habit.dates, date] } : habit) })),
  addHabit: (habit) => set((state) => saved({ ...state, habits: [...state.habits, habit] })),
  addPlan: (plan) => set((state) => saved({ ...state, plans: [...state.plans, plan] })),
  updatePlan: (plan) => set((state) => saved({ ...state, plans: state.plans.map((item) => item.id === plan.id ? plan : item) })),
  removePlan: (id) => set((state) => saved({ ...state, plans: state.plans.filter((item) => item.id !== id), activePlanId: state.activePlanId === id ? undefined : state.activePlanId })),
  setActivePlan: (activePlanId) => set((state) => saved({ ...state, activePlanId })),
  setTheme: (theme) => set((state) => saved({ ...state, theme })),
  updateProfile: (profile) => set((state) => { const changed = profile.units && profile.units !== state.profile.units; const factor = changed ? (profile.units === "metric" ? 0.45359237 : 2.20462262) : 1; const distanceFactor = changed ? (profile.units === "metric" ? 1.609344 : 0.621371) : 1; return saved({ ...state, profile: { ...state.profile, ...profile }, weights: state.weights.map((item) => ({ ...item, value: item.value * factor })), workouts: state.workouts.map((workout) => ({ ...workout, exercises: workout.exercises.map((exercise) => ({ ...exercise, sets: exercise.sets.map((item) => ({ ...item, weight: item.weight * factor })) })) })), manualMaxes: Object.fromEntries(Object.entries(state.manualMaxes).map(([key, value]) => [key, value * factor])), cardio: state.cardio.map((item) => ({ ...item, distance: item.distance === undefined ? undefined : item.distance * distanceFactor })) }); }),
  updateGoals: (goals) => set((state) => saved({ ...state, goals: { ...state.goals, ...goals } })),
  replaceState: (replacement) => set((state) => saved({ ...replacement, storageStatus: state.storageStatus, recoveryBackup: state.recoveryBackup })),
  reset: () => set((state) => saved({ ...defaultState, storageStatus: state.storageStatus, recoveryBackup: state.recoveryBackup })),
}));

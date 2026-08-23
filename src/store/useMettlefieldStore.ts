import { create } from "zustand";
import type { CardioRecord, FoodEntry, Goals, Habit, MettlefieldStateV1, Plan, Profile, SleepRecord, Theme, WorkoutSession } from "../domain/types";
import { defaultState } from "../domain/defaults";
import { loadState, saveState } from "../storage/persistence";

interface Actions {
  addFood: (entry: FoodEntry) => void;
  removeFood: (id: string) => void;
  addWater: (date: string, value?: number) => void;
  addWeight: (date: string, value: number) => void;
  addSleep: (record: SleepRecord) => void;
  addWorkout: (workout: WorkoutSession) => void;
  addCardio: (record: CardioRecord) => void;
  addCardioMany: (records: CardioRecord[]) => void;
  setManualMax: (exercise: string, value: number) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  addPlan: (plan: Plan) => void;
  setTheme: (theme: Theme) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateGoals: (goals: Partial<Goals>) => void;
  replaceState: (state: MettlefieldStateV1) => void;
  reset: () => void;
}

const initial = typeof localStorage === "undefined" ? defaultState : loadState();
const persist = (state: MettlefieldStateV1) => { try { saveState(state); } catch { /* Browsers can deny local storage. */ } };

export const useMettlefieldStore = create<MettlefieldStateV1 & Actions>((set) => ({
  ...initial,
  addFood: (entry) => set((state) => { const next = { ...state, foods: [...state.foods, entry] }; persist(next); return next; }),
  removeFood: (id) => set((state) => { const next = { ...state, foods: state.foods.filter((entry) => entry.id !== id) }; persist(next); return next; }),
  addWater: (date, value = 1) => set((state) => { const next = { ...state, water: [...state.water, { id: crypto.randomUUID(), date, value }] }; persist(next); return next; }),
  addWeight: (date, value) => set((state) => { const next = { ...state, weights: [...state.weights, { id: crypto.randomUUID(), date, value }] }; persist(next); return next; }),
  addSleep: (record) => set((state) => { const next = { ...state, sleep: [...state.sleep, record] }; persist(next); return next; }),
  addWorkout: (workout) => set((state) => { const next = { ...state, workouts: [...state.workouts, workout] }; persist(next); return next; }),
  addCardio: (record) => set((state) => { const next = { ...state, cardio: [...state.cardio, record] }; persist(next); return next; }),
  addCardioMany: (records) => set((state) => { const known = new Set(state.cardio.map((item) => item.id)); const next = { ...state, cardio: [...state.cardio, ...records.filter((item) => !known.has(item.id))] }; persist(next); return next; }),
  setManualMax: (exercise, value) => set((state) => { const next = { ...state, manualMaxes: { ...state.manualMaxes, [exercise]: value } }; persist(next); return next; }),
  toggleHabit: (habitId, date) => set((state) => { const next = { ...state, habits: state.habits.map((habit) => habit.id === habitId ? { ...habit, dates: habit.dates.includes(date) ? habit.dates.filter((item) => item !== date) : [...habit.dates, date] } : habit) }; persist(next); return next; }),
  addHabit: (habit) => set((state) => { const next = { ...state, habits: [...state.habits, habit] }; persist(next); return next; }),
  addPlan: (plan) => set((state) => { const next = { ...state, plans: [...state.plans, plan] }; persist(next); return next; }),
  setTheme: (theme) => set((state) => { const next = { ...state, theme }; persist(next); return next; }),
  updateProfile: (profile) => set((state) => { const next = { ...state, profile: { ...state.profile, ...profile } }; persist(next); return next; }),
  updateGoals: (goals) => set((state) => { const next = { ...state, goals: { ...state.goals, ...goals } }; persist(next); return next; }),
  replaceState: (replacement) => set(() => { persist(replacement); return replacement; }),
  reset: () => set(() => { persist(defaultState); return defaultState; }),
}));

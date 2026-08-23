import type { MettlefieldStateV1 } from "./types";
import { calculateNutritionTotals } from "./nutrition";
import { calculateRecoverySummary } from "./recovery";
import { calculateTrainingVolume } from "./training";

export function buildWeeklyReport(state: MettlefieldStateV1, dates: string[]) {
  const foods = state.foods.filter((entry) => dates.includes(entry.date));
  const workouts = state.workouts.filter((entry) => dates.includes(entry.date));
  return { nutrition: calculateNutritionTotals(foods), workoutCount: workouts.length, trainingVolume: workouts.reduce((sum, item) => sum + calculateTrainingVolume(item), 0), recovery: calculateRecoverySummary(state.sleep.filter((entry) => dates.includes(entry.date)), state.goals.sleep) };
}

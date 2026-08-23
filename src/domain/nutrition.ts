import type { FoodEntry } from "./types";

export function calculateNutritionTotals(entries: FoodEntry[]) {
  return entries.reduce((total, entry) => ({ calories: total.calories + entry.calories, protein: total.protein + entry.protein, carbs: total.carbs + entry.carbs, fat: total.fat + entry.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export function estimateTdee(weightKg?: number, heightCm?: number, age?: number, sex: "male" | "female" = "male", activity = 1.45) {
  if (!weightKg || !heightCm || !age) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  return Math.round(base * activity);
}

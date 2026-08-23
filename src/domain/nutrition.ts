import type { FoodEntry } from "./types";

export type NutritionGoal = "weight_loss" | "muscle_gain" | "maintenance" | "recomp";
export type NutritionSex = "male" | "female";
export type WeightUnit = "imperial" | "metric";

export interface NutritionRecommendationInput {
  weight?: number;
  weightUnit?: WeightUnit;
  heightCm?: number;
  age?: number;
  sex?: NutritionSex;
  activity?: number;
  goal?: NutritionGoal;
}

export interface NutritionRecommendation {
  maintenanceCalories: number;
  calorieRange: { minimum: number; maximum: number };
  suggestedCalories: number;
  proteinRange: { minimum: number; maximum: number };
  suggestedProtein: number;
}

const goalFactors: Record<NutritionGoal, { minimum: number; maximum: number; suggested: number }> = {
  weight_loss: { minimum: 0.8, maximum: 0.9, suggested: 0.85 },
  muscle_gain: { minimum: 1.05, maximum: 1.15, suggested: 1.1 },
  maintenance: { minimum: 0.95, maximum: 1.05, suggested: 1 },
  recomp: { minimum: 0.95, maximum: 1, suggested: 1 },
};

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function poundsToKilograms(pounds: number) {
  return pounds * 0.45359237;
}

export function kilogramsToPounds(kilograms: number) {
  return kilograms * 2.20462262;
}

export function calculateNutritionTotals(entries: FoodEntry[]) {
  return entries.reduce((total, entry) => ({ calories: total.calories + entry.calories, protein: total.protein + entry.protein, carbs: total.carbs + entry.carbs, fat: total.fat + entry.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export function estimateTdee(weightKg?: number, heightCm?: number, age?: number, sex: "male" | "female" = "male", activity = 1.45) {
  if (!isPositiveNumber(weightKg) || !isPositiveNumber(heightCm) || !isPositiveNumber(age) || !isPositiveNumber(activity)) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  return Math.round(base * activity);
}

export function calculateNutritionRecommendation(input: NutritionRecommendationInput): NutritionRecommendation | null {
  const { weight, weightUnit, heightCm, age, sex, activity, goal } = input;
  if (!weightUnit || !sex || !goal || !isPositiveNumber(weight) || !isPositiveNumber(heightCm) || heightCm > 300 || !isPositiveNumber(age) || age > 125 || !isPositiveNumber(activity) || activity > 3) return null;

  const weightKg = weightUnit === "metric" ? weight : poundsToKilograms(weight);
  const maintenanceCalories = estimateTdee(weightKg, heightCm, age, sex, activity);
  if (maintenanceCalories === null) return null;

  const factors = goalFactors[goal];
  const weightLb = weightUnit === "imperial" ? weight : kilogramsToPounds(weight);
  return {
    maintenanceCalories,
    calorieRange: {
      minimum: Math.round(maintenanceCalories * factors.minimum),
      maximum: Math.round(maintenanceCalories * factors.maximum),
    },
    suggestedCalories: Math.round(maintenanceCalories * factors.suggested),
    proteinRange: {
      minimum: Math.round(weightLb * 0.8),
      maximum: Math.round(weightLb * 1.2),
    },
    suggestedProtein: Math.round(weightLb),
  };
}

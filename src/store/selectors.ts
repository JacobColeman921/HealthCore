import type { MettlefieldStateV1 } from "../domain/types";
import { calculateNutritionTotals } from "../domain/nutrition";

export const selectFoodsForDate = (state: MettlefieldStateV1, date: string) => state.foods.filter((entry) => entry.date === date);
export const selectNutritionForDate = (state: MettlefieldStateV1, date: string) => calculateNutritionTotals(selectFoodsForDate(state, date));

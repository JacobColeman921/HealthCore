import { describe, expect, it } from "vitest";
import { calculateNutritionRecommendation, estimateTdee, kilogramsToPounds, poundsToKilograms, weightsAreEquivalent } from "./nutrition";

const completeProfile = {
  weight: 180,
  weightUnit: "imperial" as const,
  heightCm: 180,
  age: 30,
  sex: "male" as const,
  activity: 1.55,
  goal: "maintenance" as const,
};

describe("calculateNutritionRecommendation", () => {
  it("uses Mifflin-St Jeor and the activity multiplier", () => {
    const result = calculateNutritionRecommendation(completeProfile);

    expect(result?.maintenanceCalories).toBe(2785);
  });

  it.each([
    ["weight_loss", 0.8, 0.9, 0.85],
    ["muscle_gain", 1.05, 1.15, 1.1],
    ["maintenance", 0.95, 1.05, 1],
    ["recomp", 0.95, 1, 1],
  ] as const)("returns the goal range and suggested target for %s", (goal, minimum, maximum, suggested) => {
    const result = calculateNutritionRecommendation({ ...completeProfile, goal });
    const maintenance = result?.maintenanceCalories || 0;

    expect(result?.calorieRange).toEqual({
      minimum: Math.round(maintenance * minimum),
      maximum: Math.round(maintenance * maximum),
    });
    expect(result?.suggestedCalories).toBe(Math.round(maintenance * suggested));
  });

  it("returns a 0.8 to 1.2 gram per pound range and a 1.0 gram per pound suggestion", () => {
    const result = calculateNutritionRecommendation(completeProfile);

    expect(result?.proteinRange).toEqual({ minimum: 144, maximum: 216 });
    expect(result?.suggestedProtein).toBe(180);
  });

  it("produces the same result for equivalent imperial and metric bodyweights", () => {
    const imperial = calculateNutritionRecommendation(completeProfile);
    const metric = calculateNutritionRecommendation({
      ...completeProfile,
      weight: poundsToKilograms(180),
      weightUnit: "metric",
    });

    expect(metric).toEqual(imperial);
  });

  it.each([
    {},
    { ...completeProfile, weight: 0 },
    { ...completeProfile, heightCm: Number.NaN },
    { ...completeProfile, heightCm: 301 },
    { ...completeProfile, age: -1 },
    { ...completeProfile, age: 126 },
    { ...completeProfile, activity: 0 },
    { ...completeProfile, activity: 3.1 },
  ])("returns null when required inputs are incomplete or invalid", (input) => {
    expect(calculateNutritionRecommendation(input)).toBeNull();
  });

  it.each([
    { ...completeProfile, age: 17 },
    { ...completeProfile, age: 101 },
    { ...completeProfile, heightCm: 119 },
    { ...completeProfile, heightCm: 231 },
    { ...completeProfile, weight: kilogramsToPounds(34.9) },
    { ...completeProfile, weight: kilogramsToPounds(300.1) },
    { ...completeProfile, weight: 34.9, weightUnit: "metric" as const },
    { ...completeProfile, weight: 300.1, weightUnit: "metric" as const },
    { ...completeProfile, activity: 1.19 },
    { ...completeProfile, activity: 1.91 },
  ])("rejects values outside the adult planning bounds", (input) => {
    expect(calculateNutritionRecommendation(input)).toBeNull();
  });

  it("rejects a nonpositive maintenance estimate", () => {
    expect(estimateTdee(35, 120, 1000, "female", 1.2)).toBeNull();
  });

  it("treats a two-decimal unit round trip as the same bodyweight", () => {
    expect(weightsAreEquivalent(81.65, "metric", 180.01, "imperial")).toBe(true);
  });

  it("does not merge a meaningful same-day bodyweight change", () => {
    expect(weightsAreEquivalent(81.65, "metric", 181, "imperial")).toBe(false);
  });
});

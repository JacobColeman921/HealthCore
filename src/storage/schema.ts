import { z } from "zod";

export const stateSchema = z.object({
  version: z.literal(1),
  profile: z.object({ name: z.string(), units: z.enum(["imperial", "metric"]), goal: z.enum(["weight_loss", "muscle_gain", "maintenance", "recomp"]).optional(), age: z.number().optional(), heightCm: z.number().optional(), activity: z.number().optional() }),
  goals: z.object({ calories: z.number(), protein: z.number(), carbs: z.number(), fat: z.number(), water: z.number(), sleep: z.number() }),
  theme: z.enum(["system", "light", "dark"]),
  foods: z.array(z.any()), water: z.array(z.any()), weights: z.array(z.any()), sleep: z.array(z.any()), workouts: z.array(z.any()), cardio: z.array(z.any()).default([]), habits: z.array(z.any()), plans: z.array(z.any()), manualMaxes: z.record(z.string(), z.number()).default({}),
  activePlanId: z.string().optional(), integrations: z.record(z.string(), z.string().optional()), migratedAt: z.string().optional(),
});

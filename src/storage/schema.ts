import { z } from "zod";

const finite = z.number().finite();
const nonnegative = finite.nonnegative();
const positive = finite.positive();
const id = z.string().trim().min(1).max(200);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const bodyRecord = z.object({ id, date, value: finite });
const workoutSet = z.object({ id, reps: positive, weight: nonnegative, completed: z.boolean() });
const workoutExercise = z.object({ exerciseId: id, name: id, primaryMuscles: z.array(id), sets: z.array(workoutSet) });

export const stateSchema = z.object({
  version: z.literal(1),
  profile: z.object({ name: z.string().max(120), units: z.enum(["imperial", "metric"]), goal: z.enum(["weight_loss", "muscle_gain", "maintenance", "recomp"]).optional(), age: positive.max(125).optional(), heightCm: positive.max(300).optional(), sex: z.enum(["male", "female"]).optional(), activity: positive.max(3).optional() }),
  goals: z.object({ calories: positive, protein: nonnegative, carbs: nonnegative, fat: nonnegative, water: positive, sleep: positive.max(24) }),
  theme: z.enum(["system", "light", "dark"]),
  foods: z.array(z.object({ id, date, meal: z.enum(["Breakfast", "Lunch", "Dinner", "Snack"]), name: id, serving: z.string().max(200), calories: nonnegative, protein: nonnegative, carbs: nonnegative, fat: nonnegative })),
  water: z.array(bodyRecord), weights: z.array(bodyRecord),
  sleep: z.array(bodyRecord.extend({ quality: finite.min(0).max(100).optional(), source: z.enum(["manual", "garmin"]).optional() })),
  workouts: z.array(z.object({ id, date, title: id, durationMinutes: positive, exercises: z.array(workoutExercise), notes: z.string().max(5000).optional() })),
  cardio: z.array(z.object({ id, date, type: id, durationMinutes: positive, distance: nonnegative.optional(), calories: nonnegative.optional(), notes: z.string().max(5000).optional(), source: z.enum(["manual", "garmin"]).optional() })).default([]),
  habits: z.array(z.object({ id, label: id, dates: z.array(date) })),
  plans: z.array(z.object({ id, name: id, days: z.array(z.object({ name: id, exerciseIds: z.array(id) })).min(1).max(7) })),
  manualMaxes: z.record(z.string(), nonnegative).default({}),
  activePlanId: id.optional(), integrations: z.object({}).strict(), migratedAt: z.string().datetime().optional(),
});

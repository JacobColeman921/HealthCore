import type { WorkoutSession } from "./types";

export const estimateOneRepMax = (weight: number, reps: number) => reps <= 0 || weight <= 0 ? null : Math.round(weight * (1 + reps / 30) * 10) / 10;
export const calculateTrainingVolume = (session: WorkoutSession) => session.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed).reduce((sum, set) => sum + set.weight * set.reps, 0);
export function aggregateMuscleVolume(workouts: WorkoutSession[]) {
  return workouts.reduce<Record<string, number>>((totals, workout) => { workout.exercises.forEach((exercise) => { const volume = exercise.sets.filter((set) => set.completed).reduce((sum, set) => sum + Math.max(set.weight, 1) * set.reps, 0); exercise.primaryMuscles.forEach((muscle) => { totals[muscle] = (totals[muscle] || 0) + volume; }); }); return totals; }, {});
}
export function calculateWorkoutStreak(workouts: WorkoutSession[], today = new Date()) {
  const days = new Set(workouts.map((workout) => workout.date)); let streak = 0; const cursor = new Date(today); cursor.setHours(12, 0, 0, 0);
  while (days.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

import raw from "../data/exercises.json";
import { normalizeExercise } from "./normalizeExercise";
import type { Exercise, ExerciseFilters, ExerciseRepository } from "./types";

const exercises = (raw.exercises as Parameters<typeof normalizeExercise>[0][]).map(normalizeExercise);
export class RepDbExerciseRepository implements ExerciseRepository {
  search(query = "", filters: ExerciseFilters = {}): Exercise[] {
    const needle = query.trim().toLowerCase();
    return exercises.filter((exercise) => (!needle || [exercise.name, exercise.bodyPart, exercise.equipment, ...exercise.primaryMuscles].join(" ").toLowerCase().includes(needle)) && (!filters.bodyPart || exercise.bodyPart === filters.bodyPart) && (!filters.equipment || exercise.equipment === filters.equipment) && (!filters.difficulty || exercise.difficulty === filters.difficulty));
  }
  getById(id: string) { return exercises.find((exercise) => exercise.id === id); }
}
export const exerciseRepository = new RepDbExerciseRepository();

export interface Exercise {
  id: string; name: string; description: string; instructions: string[]; tips: string[]; category: string; difficulty: string; equipment: string; bodyPart: string; primaryMuscles: string[]; secondaryMuscles: string[]; images: string[];
}
export interface ExerciseFilters { bodyPart?: string; equipment?: string; difficulty?: string; }
export interface ExerciseRepository { search(query?: string, filters?: ExerciseFilters): Exercise[]; getById(id: string): Exercise | undefined; }

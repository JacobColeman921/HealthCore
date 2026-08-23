import type { Exercise } from "./types";

interface RawExercise { id: string; name: string; description?: string; instructions?: string[]; tips?: string[]; category?: string; difficulty?: string; equipment?: string; body_part?: string; primary_muscles?: string[]; secondary_muscles?: string[]; images?: { flat?: string[] }; }
export function normalizeExercise(raw: RawExercise): Exercise {
  const poses = raw.images?.flat || [];
  return { id: raw.id, name: raw.name, description: raw.description || "Technique notes are not available for this movement.", instructions: raw.instructions || [], tips: raw.tips || [], category: raw.category || "strength", difficulty: raw.difficulty || "unspecified", equipment: raw.equipment || "none", bodyPart: raw.body_part || "full body", primaryMuscles: raw.primary_muscles || [], secondaryMuscles: raw.secondary_muscles || [], images: poses.map((pose) => `${import.meta.env.BASE_URL}exercises/${raw.id}-${pose}.webp`) };
}

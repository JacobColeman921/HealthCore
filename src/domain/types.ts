export type Theme = "system" | "light" | "dark";
export type Meal = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface Profile {
  name: string;
  units: "imperial" | "metric";
  goal?: "weight_loss" | "muscle_gain" | "maintenance" | "recomp";
  age?: number;
  heightCm?: number;
  activity?: number;
}

export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  sleep: number;
}

export interface FoodEntry {
  id: string;
  date: string;
  meal: Meal;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BodyRecord { id: string; date: string; value: number; }
export interface SleepRecord extends BodyRecord { quality?: number; }
export interface WorkoutSet { id: string; reps: number; weight: number; completed: boolean; }
export interface WorkoutExercise { exerciseId: string; name: string; primaryMuscles: string[]; sets: WorkoutSet[]; }
export interface WorkoutSession { id: string; date: string; title: string; durationMinutes: number; exercises: WorkoutExercise[]; notes?: string; }
export interface CardioRecord { id: string; date: string; type: string; durationMinutes: number; distance?: number; calories?: number; notes?: string; source?: "manual" | "garmin"; }
export interface Plan { id: string; name: string; days: Array<{ name: string; exerciseIds: string[] }>; }
export interface Habit { id: string; label: string; dates: string[]; }
export interface IntegrationSettings { groqKey?: string; geminiKey?: string; }

export interface MettlefieldStateV1 {
  version: 1;
  profile: Profile;
  goals: Goals;
  theme: Theme;
  foods: FoodEntry[];
  water: BodyRecord[];
  weights: BodyRecord[];
  sleep: SleepRecord[];
  workouts: WorkoutSession[];
  cardio: CardioRecord[];
  habits: Habit[];
  plans: Plan[];
  manualMaxes: Record<string, number>;
  activePlanId?: string;
  integrations: IntegrationSettings;
  migratedAt?: string;
}

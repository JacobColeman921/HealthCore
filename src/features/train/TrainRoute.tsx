import { useState } from "react";
import { Subnav } from "../../components/ui/Subnav";
import { exerciseRepository } from "../../exercises/RepDbExerciseRepository";
import type { Exercise } from "../../exercises/types";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";
import { ActiveWorkout } from "./ActiveWorkout";
import { CardioLog } from "./CardioLog";
import { ExerciseDetailDialog } from "./ExerciseDetailDialog";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { StrengthProgress } from "./StrengthProgress";
import { WorkoutPlans } from "./WorkoutPlans";

function resolveExercise(exerciseId: string) { const direct = exerciseRepository.getById(exerciseId); if (direct) return direct; if (!exerciseId.startsWith("legacy-exercise-")) return undefined; const name = exerciseId.replace("legacy-exercise-", "").replaceAll("-", " "); const results = exerciseRepository.search(name); return results.find((item) => item.name.toLowerCase() === name) || results[0]; }
export function TrainRoute() {
  const workouts = useMettlefieldStore((state) => state.workouts); const [detail, setDetail] = useState<Exercise>(); const [session, setSession] = useState<Exercise[]>([]); const [notice, setNotice] = useState(""); const [view, setView] = useState<"workout" | "plans" | "strength" | "cardio">("workout");
  function add(exercise: Exercise) { setSession((items) => items.some((item) => item.id === exercise.id) ? items : [...items, exercise]); setDetail(undefined); }
  function startPlan(exerciseIds: string[], label: string) { const resolved = exerciseIds.map(resolveExercise).filter(Boolean) as Exercise[]; setSession(resolved); setView("workout"); setNotice(resolved.length ? `${label} loaded. Add sets when you are ready.` : `${label} has no matched movements. Edit the plan before starting.`); }
  return <section className="route-frame train-route"><header className="route-header compact"><div><p className="eyebrow">Movement and progress</p><h1>Train</h1><p className="lede">Plan sessions, record strength work, and keep cardio in the same history.</p></div><div className="catalog-count"><strong>{exerciseRepository.search().length}</strong><span>included exercises</span></div></header><Subnav label="Training sections" value={view} onChange={setView} items={[{ value: "workout", label: "Workout" }, { value: "plans", label: "Plans" }, { value: "strength", label: "Strength PRs" }, { value: "cardio", label: "Cardio" }]} />{notice && <div className="inline-notice" role="status">{notice}</div>}{view === "workout" && <><div className="train-layout"><div><ExerciseLibrary onSelect={setDetail} /></div><ActiveWorkout exercises={session} onRemove={(exerciseId) => setSession((items) => items.filter((item) => item.id !== exerciseId))} onFinish={(summary) => { setSession([]); setNotice(summary); }} /></div><section className="session-history"><span className="section-kicker">Training history</span><h2>Recent sessions</h2>{workouts.length ? [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((workout) => <article key={workout.id}><div><strong>{workout.title}</strong><span>{workout.date}</span></div><div><strong>{workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sets</strong><span>{workout.durationMinutes} min</span></div></article>) : <p>No completed sessions yet.</p>}</section></>}{view === "plans" && <WorkoutPlans onStart={startPlan} />}{view === "strength" && <StrengthProgress />}{view === "cardio" && <CardioLog />}{detail && <ExerciseDetailDialog exercise={detail} onClose={() => setDetail(undefined)} onAdd={() => add(detail)} />}</section>;
}

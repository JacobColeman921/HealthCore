import { useState } from "react";
import { Subnav } from "../../components/ui/Subnav";
import type { Exercise } from "../../exercises/types";
import { ActiveWorkout } from "./ActiveWorkout";
import { ExerciseDetailDialog } from "./ExerciseDetailDialog";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { exerciseRepository } from "../../exercises/RepDbExerciseRepository";
import { CardioLog } from "./CardioLog";
import { StrengthProgress } from "./StrengthProgress";
import { WorkoutPlans } from "./WorkoutPlans";

export function TrainRoute() {
  const [detail, setDetail] = useState<Exercise>(); const [session, setSession] = useState<Exercise[]>([]); const [notice, setNotice] = useState(""); const [view, setView] = useState<"workout" | "plans" | "strength" | "cardio">("workout");
  function add(exercise: Exercise) { setSession((items) => items.some((item) => item.id === exercise.id) ? items : [...items, exercise]); setDetail(undefined); }
  return <section className="route-frame train-route"><header className="route-header compact"><div><p className="eyebrow">Movement and progress</p><h1>Train</h1><p className="lede">Plan sessions, record strength work, and keep cardio in the same history.</p></div><div className="catalog-count"><strong>{exerciseRepository.search().length}</strong><span>included exercises</span></div></header><Subnav label="Training sections" value={view} onChange={setView} items={[{ value: "workout", label: "Workout" }, { value: "plans", label: "Plans" }, { value: "strength", label: "Strength PRs" }, { value: "cardio", label: "Cardio" }]} />{notice && <div className="inline-notice" role="status">{notice}</div>}{view === "workout" && <div className="train-layout"><div><ExerciseLibrary onSelect={setDetail} /></div><ActiveWorkout exercises={session} onRemove={(exerciseId) => setSession((items) => items.filter((item) => item.id !== exerciseId))} onFinish={() => { setSession([]); setNotice("Session saved to your training history."); }} /></div>}{view === "plans" && <WorkoutPlans />}{view === "strength" && <StrengthProgress />}{view === "cardio" && <CardioLog />}{detail && <ExerciseDetailDialog exercise={detail} onClose={() => setDetail(undefined)} onAdd={() => add(detail)} />}</section>;
}

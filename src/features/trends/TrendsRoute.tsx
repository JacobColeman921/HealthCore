import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "../../components/ui/EmptyState";
import { Subnav } from "../../components/ui/Subnav";
import { calculateRecoverySummary } from "../../domain/recovery";
import { calculateTrainingVolume } from "../../domain/training";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";
import { CheckIn } from "./CheckIn";
import { MuscleMap } from "./MuscleMap";
import { RecoveryView } from "./RecoveryView";
import { WeeklyReport } from "./WeeklyReport";

type View = "overview" | "recovery" | "muscles" | "report" | "checkin";
export function TrendsRoute() {
  const [view, setView] = useState<View>("overview");
  const weights = useMettlefieldStore((state) => state.weights); const sleep = useMettlefieldStore((state) => state.sleep); const workouts = useMettlefieldStore((state) => state.workouts); const units = useMettlefieldStore((state) => state.profile.units === "metric" ? "kg" : "lb"); const recovery = calculateRecoverySummary(sleep);
  const workoutData = workouts.slice(-14).map((item) => ({ date: item.date.slice(5), volume: calculateTrainingVolume(item) })); const weightData = weights.slice(-30).map((item) => ({ date: item.date.slice(5), weight: item.value }));
  const chart = (data: Array<Record<string, string | number>>, key: string, label: string) => data.length > 1 ? <div className="chart-wrap" aria-label={label}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} /><YAxis domain={key === "weight" ? ["dataMin - 2", "dataMax + 2"] : undefined} tickLine={false} axisLine={false} width={42} /><Tooltip contentStyle={{ background: "var(--surface-strong)", border: "1px solid var(--line)" }} /><Area dataKey={key} type="monotone" stroke="var(--accent)" strokeWidth={2} fill="var(--accent-soft)" /></AreaChart></ResponsiveContainer></div> : <EmptyState title={`No ${key} trend`}>Add at least two records to see a useful direction.</EmptyState>;
  return <section className="route-frame"><header className="route-header compact"><div><p className="eyebrow">Your history</p><h1>Trends</h1><p className="lede">Look for direction over time. Single days are rarely the full story.</p></div></header><Subnav label="Trend sections" value={view} onChange={setView} items={[{ value: "overview", label: "Overview" }, { value: "recovery", label: "Recovery" }, { value: "muscles", label: "Muscle map" }, { value: "report", label: "Weekly report" }, { value: "checkin", label: "Check-in" }]} />
    {view === "overview" && <><div className="insight-grid"><article className="insight-card"><span>Body weight</span><strong>{weights.length ? `${weights.at(-1)?.value} ${units}` : "No records"}</strong><p>{weights.length > 1 ? `${Math.abs(weights.at(-1)!.value - weights[0].value).toFixed(1)} ${units} change across your saved history` : "Add at least two records to see a direction."}</p></article><article className="insight-card"><span>Average sleep</span><strong>{recovery.average ? `${recovery.average} hr` : "No records"}</strong><p>{recovery.targetHitRate === null ? "Sleep records will appear here." : `${recovery.targetHitRate}% of nights met your target.`}</p></article><article className="insight-card"><span>Training sessions</span><strong>{workouts.length}</strong><p>{workouts.length ? `${workoutData.reduce((sum, item) => sum + item.volume, 0).toLocaleString()} total load recorded.` : "Finished sessions will appear here."}</p></article></div><div className="trend-chart-grid"><section className="chart-card"><header><div><span className="section-kicker">Body weight</span><h2>Recorded trend</h2></div><p>Last 30 entries</p></header>{chart(weightData, "weight", "Body weight chart")}</section><section className="chart-card"><header><div><span className="section-kicker">Training load</span><h2>Session volume</h2></div><p>Weight multiplied by completed reps</p></header>{chart(workoutData, "volume", "Training volume chart")}</section></div></>}
    {view === "recovery" && <RecoveryView />}
    {view === "muscles" && <section className="chart-card standalone"><header><div><span className="section-kicker">Muscle map</span><h2>Where the work went</h2></div><p>Based on completed set volume</p></header><MuscleMap workouts={workouts} /></section>}
    {view === "report" && <WeeklyReport />}
    {view === "checkin" && <CheckIn />}
  </section>;
}

import { useState, type FormEvent } from "react";
import { CalendarDots, Plus } from "@phosphor-icons/react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { id } from "../../lib/date";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";

const starters = [
  { name: "Three-day full body", detail: "A, B, and C sessions with a squat, press, pull, hinge, and trunk movement." },
  { name: "Four-day upper and lower", detail: "Two upper sessions and two lower sessions with room for accessories." },
  { name: "Strength foundation", detail: "Three weekly sessions centered on squat, bench press, deadlift, and overhead press." },
];
export function WorkoutPlans() {
  const plans = useMettlefieldStore((state) => state.plans); const addPlan = useMettlefieldStore((state) => state.addPlan); const [open, setOpen] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const days = Number(data.get("days")); addPlan({ id: id(), name: String(data.get("name")), days: Array.from({ length: days }, (_, index) => ({ name: `Day ${index + 1}`, exerciseIds: [] })) }); event.currentTarget.reset(); setOpen(false); }
  return <div><div className="feature-heading"><div><span className="section-kicker">Programs</span><h2>Give the week a structure</h2><p>Use a simple template, then choose movements when you start each session.</p></div><Button onClick={() => setOpen(!open)}><Plus aria-hidden="true" /> New plan</Button></div>{open && <form className="plan-form surface" onSubmit={submit}><Field label="Plan name" name="name" required placeholder="Autumn strength block" /><Field label="Days per week" name="days" type="number" min="1" max="7" defaultValue="3" required /><Button type="submit">Create plan</Button></form>}<div className="plan-grid">{starters.map((plan) => <article key={plan.name}><CalendarDots aria-hidden="true" /><h3>{plan.name}</h3><p>{plan.detail}</p><button onClick={() => addPlan({ id: id(), name: plan.name, days: Array.from({ length: Number(plan.name[0]) || 3 }, (_, index) => ({ name: `Day ${index + 1}`, exerciseIds: [] })) })}>Save template</button></article>)}</div>{plans.length > 0 && <section className="saved-plans"><span className="section-kicker">Saved</span>{plans.map((plan) => <div key={plan.id}><strong>{plan.name}</strong><span>{plan.days.length} training days</span></div>)}</section>}</div>;
}

import { useState, type FormEvent } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Field } from "../../components/ui/Field";
import { Subnav } from "../../components/ui/Subnav";
import type { Meal } from "../../domain/types";
import { calculateNutritionTotals } from "../../domain/nutrition";
import { id, todayKey } from "../../lib/date";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";
import { MealIdeas } from "./MealIdeas";
import { NutritionOverview } from "./NutritionOverview";
import { useSearchParams } from "react-router-dom";
import { FoodCatalogSearch } from "./FoodCatalogSearch";

const meals: Meal[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
export function LogRoute() {
  const [params, setParams] = useSearchParams(); const initial = params.get("view"); const [date, setDate] = useState(todayKey()); const [open, setOpen] = useState(false); const [meal, setMeal] = useState<Meal>("Breakfast"); const [view, setView] = useState<"diary" | "ideas" | "nutrition">(initial === "ideas" || initial === "nutrition" ? initial : "diary");
  const foods = useMettlefieldStore((state) => state.foods); const goals = useMettlefieldStore((state) => state.goals); const addFood = useMettlefieldStore((state) => state.addFood); const removeFood = useMettlefieldStore((state) => state.removeFood); const addWater = useMettlefieldStore((state) => state.addWater); const addWeight = useMettlefieldStore((state) => state.addWeight); const addSleep = useMettlefieldStore((state) => state.addSleep);
  const entries = foods.filter((entry) => entry.date === date); const totals = calculateNutritionTotals(entries);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); addFood({ id: id(), date, meal, name: String(data.get("name")), serving: String(data.get("serving") || "1 serving"), calories: Number(data.get("calories")), protein: Number(data.get("protein") || 0), carbs: Number(data.get("carbs") || 0), fat: Number(data.get("fat") || 0) }); event.currentTarget.reset(); setOpen(false); }
  function submitBody(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const weight = Number(data.get("weight")); const sleep = Number(data.get("sleep")); if (weight > 0) addWeight(date, weight); if (sleep > 0) addSleep({ id: id(), date, value: sleep }); event.currentTarget.reset(); }
  return <section className="route-frame"><header className="route-header compact"><div><p className="eyebrow">Daily record</p><h1>Log</h1><p className="lede">Food, water, weight, and sleep in one place.</p></div><Field label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></header>
    <Subnav label="Log sections" value={view} onChange={(next) => { setView(next); setParams(next === "diary" ? {} : { view: next }); }} items={[{ value: "diary", label: "Diary" }, { value: "ideas", label: "Food ideas" }, { value: "nutrition", label: "Nutrition" }]} />
    {view === "diary" && <>
    <div className="summary-strip"><div><span>Energy</span><strong>{totals.calories.toLocaleString()} <small>kcal</small></strong><small>{Math.max(0, goals.calories - totals.calories).toLocaleString()} remaining</small></div><div><span>Protein</span><strong>{totals.protein} <small>g</small></strong><small>{goals.protein} g target</small></div><div><span>Carbs</span><strong>{totals.carbs} <small>g</small></strong><small>{goals.carbs} g target</small></div><div><span>Fat</span><strong>{totals.fat} <small>g</small></strong><small>{goals.fat} g target</small></div></div>
    <div className="toolbar"><div><h2>Food diary</h2><p>{entries.length} {entries.length === 1 ? "entry" : "entries"}</p></div><Button onClick={() => setOpen(!open)}><Plus aria-hidden="true" /> Add food</Button></div>
    {open && <form className="entry-form surface" onSubmit={submit}><div className="field"><span>Meal</span><select value={meal} onChange={(event) => setMeal(event.target.value as Meal)}>{meals.map((item) => <option key={item}>{item}</option>)}</select></div><FoodCatalogSearch date={date} meal={meal} /><div className="manual-divider"><span>Manual entry</span></div><Field label="Food" name="name" required placeholder="Greek yogurt" /><Field label="Serving" name="serving" placeholder="1 cup" /><Field label="Calories" name="calories" type="number" min="0" required /><Field label="Protein (g)" name="protein" type="number" min="0" /><Field label="Carbs (g)" name="carbs" type="number" min="0" /><Field label="Fat (g)" name="fat" type="number" min="0" /><div className="form-actions"><Button type="button" variant="quiet" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save food</Button></div></form>}
    <div className="diary">{meals.map((mealName) => { const group = entries.filter((entry) => entry.meal === mealName); const mealTotal = calculateNutritionTotals(group); return <section className="meal-group" key={mealName}><header><h3>{mealName}</h3><span>{mealTotal.calories} kcal</span></header>{group.length ? group.map((entry) => <div className="food-row" key={entry.id}><div><strong>{entry.name}</strong><span>{entry.serving}</span></div><div><strong>{entry.calories} kcal</strong><span>{entry.protein} g protein</span></div><button aria-label={`Remove ${entry.name}`} onClick={() => removeFood(entry.id)}><Trash aria-hidden="true" /></button></div>) : <p className="meal-empty">No entries</p>}</section>; })}</div>
    {!entries.length && <EmptyState title="Your diary is clear">Add a meal manually. The record only needs to be accurate enough to help.</EmptyState>}
    <section className="secondary-log"><div><span className="section-kicker">Other records</span><h2>Recovery and body</h2><p>Add only what you plan to use. Units follow your profile settings.</p></div><form onSubmit={submitBody}><Field label="Weight" name="weight" type="number" min="1" step="0.1" placeholder="Optional" /><Field label="Sleep (hours)" name="sleep" type="number" min="0" max="24" step="0.25" placeholder="Optional" /><Button type="submit" variant="secondary">Save records</Button></form></section>
    <div className="minor-actions"><Button variant="secondary" onClick={() => addWater(date)}>Add one cup water</Button></div>
    </>}
    {view === "ideas" && <MealIdeas date={date} />}
    {view === "nutrition" && <NutritionOverview date={date} />}
  </section>;
}

import { useMemo, useState } from "react";
import { Check, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import catalogData from "../../data/food-catalog.json";
import type { Meal } from "../../domain/types";
import { id } from "../../lib/date";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";

interface CatalogFood { id: string; name: string; calories: number; protein: number; carbs: number; fat: number; }
const catalog = catalogData as CatalogFood[];

function score(name: string, query: string) {
  const candidate = name.toLowerCase();
  const words = query.split(/\s+/).filter((word) => word.length > 1);
  if (candidate === query) return 200;
  if (candidate.startsWith(query)) return 150;
  if (candidate.includes(query)) return 100;
  const matches = words.filter((word) => candidate.includes(word)).length;
  return matches === words.length ? 80 : matches / Math.max(1, words.length) * 50;
}

export function FoodCatalogSearch({ date, meal }: { date: string; meal: Meal }) {
  const addFood = useMettlefieldStore((state) => state.addFood);
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState("");
  const normalized = query.toLowerCase().trim();
  const results = useMemo(() => normalized ? catalog.map((food) => ({ food, score: score(food.name, normalized) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8).map((item) => item.food) : [], [normalized]);

  function add(food: CatalogFood) {
    addFood({ id: id(), date, meal, name: food.name, serving: "1 listed serving", calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat });
    setAdded(food.name);
  }

  return <section className="catalog-search">
    <div><span className="section-kicker">Common foods</span><h3>Search the local catalog</h3><p>{catalog.length} retained entries. Values are reference estimates, so check the package serving when precision matters.</p></div>
    <label className="search-field"><MagnifyingGlass aria-hidden="true" /><span className="sr-only">Search common foods</span><input value={query} onChange={(event) => { setQuery(event.target.value); setAdded(""); }} placeholder="Chicken breast, Greek yogurt, Big Mac" /></label>
    {added && <div className="catalog-added" role="status"><Check aria-hidden="true" /> {added} added to {meal.toLowerCase()}.</div>}
    {normalized && <div className="catalog-results">{results.length ? results.map((food) => <div key={food.id}><div><strong>{food.name}</strong><span>{food.calories} kcal, {food.protein} g protein, {food.carbs} g carbs, {food.fat} g fat</span></div><button type="button" aria-label={`Add ${food.name}`} onClick={() => add(food)}><Plus aria-hidden="true" /> Add</button></div>) : <p>No catalog match. Use the manual fields below.</p>}</div>}
  </section>;
}

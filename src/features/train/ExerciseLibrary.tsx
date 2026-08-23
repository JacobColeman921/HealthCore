import { useEffect, useMemo, useState } from "react";
import { ImageBroken, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
import { EmptyState } from "../../components/ui/EmptyState";
import { exerciseRepository } from "../../exercises/RepDbExerciseRepository";
import type { Exercise } from "../../exercises/types";

export function ExerciseLibrary({ onSelect, selected }: { onSelect: (exercise: Exercise) => void; selected?: string }) {
  const [query, setQuery] = useState(""); const [bodyPart, setBodyPart] = useState(""); const [broken, setBroken] = useState<Set<string>>(new Set()); const [visible, setVisible] = useState(48);
  const results = useMemo(() => exerciseRepository.search(query, { bodyPart: bodyPart || undefined }), [query, bodyPart]);
  const parts = useMemo(() => Array.from(new Set(exerciseRepository.search().map((item) => item.bodyPart))).sort(), []);
  useEffect(() => setVisible(48), [query, bodyPart]);
  return <div><div className="library-tools"><label className="search-field"><MagnifyingGlass aria-hidden="true" /><span className="sr-only">Search exercises</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 400 exercises" /></label><label className="filter-field"><SlidersHorizontal aria-hidden="true" /><span className="sr-only">Filter body area</span><select value={bodyPart} onChange={(event) => setBodyPart(event.target.value)}><option value="">All body areas</option>{parts.map((part) => <option key={part} value={part}>{part.replaceAll("_", " ")}</option>)}</select></label></div>
    <p className="result-count">{results.length} movements</p>
    {results.length ? <><div className="exercise-grid">{results.slice(0, visible).map((exercise) => <button key={exercise.id} className={`exercise-card ${selected === exercise.id ? "selected" : ""}`} onClick={() => onSelect(exercise)}><div className="exercise-media">{exercise.images[0] && !broken.has(exercise.id) ? <img src={exercise.images[0]} alt="" loading="lazy" onError={() => setBroken((items) => new Set(items).add(exercise.id))} /> : <ImageBroken aria-hidden="true" />}</div><div><span>{exercise.bodyPart.replaceAll("_", " ")}</span><strong>{exercise.name}</strong><small>{exercise.equipment.replaceAll("_", " ")}</small></div></button>)}</div>{visible < results.length && <button className="load-more" onClick={() => setVisible((count) => count + 48)}>Show more movements</button>}</> : <EmptyState title="No matching movement">Try a broader name or remove the body-area filter.</EmptyState>}
  </div>;
}

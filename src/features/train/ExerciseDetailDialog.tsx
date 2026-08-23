import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "../../components/ui/Button";
import type { Exercise } from "../../exercises/types";

export function ExerciseDetailDialog({ exercise, onClose, onAdd }: { exercise: Exercise; onClose: () => void; onAdd: () => void }) {
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = panel.current;
    const focusable = () => Array.from(element?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])") || []);
    focusable()[0]?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [onClose]);

  return <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={panel} className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="exercise-title">
      <header>
        <div><span className="section-kicker">{exercise.bodyPart.replaceAll("_", " ")}</span><h2 id="exercise-title">{exercise.name}</h2></div>
        <button className="icon-button" aria-label="Close exercise" onClick={onClose}><X aria-hidden="true" /></button>
      </header>
      <div className="pose-strip">{exercise.images.map((image, index) => <img key={image} src={image} alt={`${exercise.name} ${index === 0 ? "starting" : "finishing"} position`} onError={(event) => { event.currentTarget.hidden = true; }} />)}<span className="pose-fallback">Movement images unavailable</span></div>
      <p>{exercise.description}</p>
      <dl className="detail-facts">
        <div><dt>Equipment</dt><dd>{exercise.equipment.replaceAll("_", " ")}</dd></div>
        <div><dt>Difficulty</dt><dd>{exercise.difficulty}</dd></div>
        <div><dt>Primary</dt><dd>{exercise.primaryMuscles.map((item) => item.replaceAll("_", " ")).join(", ")}</dd></div>
      </dl>
      {exercise.instructions.length > 0 && <div><h3>How to perform it</h3><ol className="instruction-list">{exercise.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></div>}
      <Button onClick={onAdd}>Add to session</Button>
    </section>
  </div>;
}

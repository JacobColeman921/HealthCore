import { useRef, type KeyboardEvent } from "react";

export function Subnav<T extends string>({ value, items, onChange, label }: { value: T; items: Array<{ value: T; label: string }>; onChange: (value: T) => void; label: string }) {
  const list = useRef<HTMLDivElement>(null);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length; onChange(items[next].value); requestAnimationFrame(() => list.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus()); }
  return <div ref={list} className="subnav" role="group" aria-label={label}>{items.map((item, index) => <button key={item.value} aria-pressed={value === item.value} className={value === item.value ? "active" : ""} onKeyDown={(event) => navigate(event, index)} onClick={() => onChange(item.value)}>{item.label}</button>)}</div>;
}

export function Subnav<T extends string>({ value, items, onChange, label }: { value: T; items: Array<{ value: T; label: string }>; onChange: (value: T) => void; label: string }) {
  return <div className="subnav" role="tablist" aria-label={label}>{items.map((item) => <button key={item.value} role="tab" aria-selected={value === item.value} className={value === item.value ? "active" : ""} onClick={() => onChange(item.value)}>{item.label}</button>)}</div>;
}

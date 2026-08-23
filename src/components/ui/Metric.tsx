export function Metric({ label, value, detail, progress }: { label: string; value: string; detail?: string; progress?: number }) {
  return <article className="metric"><div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>{typeof progress === "number" && <div className="meter" aria-label={`${label} ${Math.round(progress)} percent`}><i style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div>}</article>;
}

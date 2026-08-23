export function Metric({ label, value, detail, progress }: { label: string; value: string; detail?: string; progress?: number }) {
  const bounded = typeof progress === "number" ? Math.round(Math.min(100, Math.max(0, progress))) : 0;
  return <article className="metric"><div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>{typeof progress === "number" && <div className="meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={bounded}><i style={{ width: `${bounded}%` }} /></div>}</article>;
}

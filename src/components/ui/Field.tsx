import type { InputHTMLAttributes } from "react";

export function Field({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = props.id || `field-${label.toLowerCase().replace(/\s/g, "-")}`;
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} {...props} />{hint && <small>{hint}</small>}</label>;
}

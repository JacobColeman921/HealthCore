import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: "primary" | "secondary" | "quiet" | "danger" }) {
  return <button className={`button ${variant} ${className}`} {...props}>{children}</button>;
}

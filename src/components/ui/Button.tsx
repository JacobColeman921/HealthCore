import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", variant = "primary", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: "primary" | "secondary" | "quiet" | "danger" }) {
  return <button type={type} className={`button ${variant} ${className}`} {...props}>{children}</button>;
}

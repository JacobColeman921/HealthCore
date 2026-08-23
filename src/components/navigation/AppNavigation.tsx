import { Barbell, ChartLineUp, GearSix, House, ListChecks } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const items = [
  { label: "Today", to: "/today", icon: House }, { label: "Log", to: "/log", icon: ListChecks }, { label: "Train", to: "/train", icon: Barbell }, { label: "Trends", to: "/trends", icon: ChartLineUp }, { label: "Settings", to: "/settings", icon: GearSix },
] as const;

export function AppNavigation() {
  return <aside className="app-rail"><NavLink to="/today" className="wordmark" aria-label="Consistency home"><span className="brand-mark" aria-hidden="true">C</span><span>Consistency</span></NavLink><nav aria-label="Primary" className="primary-nav">{items.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Icon size={21} aria-hidden="true" /><span>{label}</span></NavLink>)}</nav><p className="rail-note">Private by default<br />Stored on this device</p></aside>;
}

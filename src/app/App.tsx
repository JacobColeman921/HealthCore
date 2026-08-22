import { ChartLineUp, GearSix, House, ListChecks, Barbell } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import { AppRoutes } from "./router";

const navigation = [
  { label: "Today", to: "/today", icon: House },
  { label: "Log", to: "/log", icon: ListChecks },
  { label: "Train", to: "/train", icon: Barbell },
  { label: "Trends", to: "/trends", icon: ChartLineUp },
  { label: "Settings", to: "/settings", icon: GearSix },
] as const;

export function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="app-rail">
        <NavLink to="/today" className="wordmark" aria-label="Mettlefield home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mettlefield</span>
        </NavLink>
        <nav aria-label="Primary" className="primary-nav">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Icon size={21} weight="regular" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <p className="rail-note">Private by default<br />Stored on this device</p>
      </aside>
      <main id="main-content" tabIndex={-1}>
        <AppRoutes />
      </main>
    </div>
  );
}

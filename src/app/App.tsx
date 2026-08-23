import { useEffect } from "react";
import { AppNavigation } from "../components/navigation/AppNavigation";
import { useMettlefieldStore } from "../store/useMettlefieldStore";
import { AppRoutes } from "./router";

export function App() {
  const theme = useMettlefieldStore((state) => state.theme);
  useEffect(() => {
    const resolved = theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
    document.documentElement.dataset.theme = resolved;
  }, [theme]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AppNavigation />
      <main id="main-content" tabIndex={-1}>
        <AppRoutes />
      </main>
    </div>
  );
}

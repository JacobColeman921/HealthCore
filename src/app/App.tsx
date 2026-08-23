import { useEffect } from "react";
import { AppNavigation } from "../components/navigation/AppNavigation";
import { useMettlefieldStore } from "../store/useMettlefieldStore";
import { AppRoutes } from "./router";

export function App() {
  const theme = useMettlefieldStore((state) => state.theme);
  const storageStatus = useMettlefieldStore((state) => state.storageStatus);
  const recoveryBackup = useMettlefieldStore((state) => state.recoveryBackup);
  const acknowledgeRecovery = useMettlefieldStore((state) => state.acknowledgeRecovery);
  function downloadRecovery() { if (!recoveryBackup) return; const url = URL.createObjectURL(new Blob([recoveryBackup], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "mettlefield-recovery-copy.json"; link.click(); URL.revokeObjectURL(url); acknowledgeRecovery(); }
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { document.documentElement.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme; };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AppNavigation />
      <main id="main-content" tabIndex={-1}>
        {storageStatus === "memory-only" && <div className="storage-warning" role="alert">Changes cannot be saved in this browser. Export your record before closing this tab.</div>}
        {storageStatus === "recovery-needed" && <div className="storage-warning" role="alert">A saved record could not be opened. New changes remain temporary until you <button onClick={downloadRecovery}>download the recovery copy and continue</button>.</div>}
        <AppRoutes />
      </main>
    </div>
  );
}

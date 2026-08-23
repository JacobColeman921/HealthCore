import { lazy, Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

const TodayRoute = lazy(() => import("../features/today/TodayRoute").then((module) => ({ default: module.TodayRoute })));
const LogRoute = lazy(() => import("../features/log/LogRoute").then((module) => ({ default: module.LogRoute })));
const TrainRoute = lazy(() => import("../features/train/TrainRoute").then((module) => ({ default: module.TrainRoute })));
const TrendsRoute = lazy(() => import("../features/trends/TrendsRoute").then((module) => ({ default: module.TrendsRoute })));
const SettingsRoute = lazy(() => import("../features/settings/SettingsRoute").then((module) => ({ default: module.SettingsRoute })));

export function AppRoutes() {
  const location = useLocation(); const reduced = useReducedMotion();
  return (
    <Suspense fallback={<div className="route-loading" role="status"><span>Loading view</span></div>}><AnimatePresence mode="wait" initial={false}><motion.div className="route-transition" key={`${location.pathname}${location.search}`} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -5 }} transition={{ duration: .18, ease: [0.22, 1, 0.36, 1] }}><Routes location={location}>
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="/today" element={<TodayRoute />} />
      <Route path="/log" element={<LogRoute />} />
      <Route path="/train" element={<TrainRoute />} />
      <Route path="/trends" element={<TrendsRoute />} />
      <Route path="/settings" element={<SettingsRoute />} />
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes></motion.div></AnimatePresence></Suspense>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";

const destinations = ["today", "log", "train", "trends", "settings"] as const;

function PlaceholderRoute({ name }: { name: string }) {
  return (
    <section className="route-frame">
      <p className="eyebrow">Mettlefield</p>
      <h1>{name}</h1>
      <p className="lede">Your records stay in this browser unless you export them.</p>
    </section>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" replace />} />
      {destinations.map((destination) => (
        <Route
          key={destination}
          path={`/${destination}`}
          element={<PlaceholderRoute name={destination[0].toUpperCase() + destination.slice(1)} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
}

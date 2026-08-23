import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { DownloadSimple, UploadSimple, Warning } from "@phosphor-icons/react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { calculateNutritionRecommendation, kilogramsToPounds, NUTRITION_RECOMMENDATION_BOUNDS, poundsToKilograms, weightsAreEquivalent, type NutritionGoal, type NutritionSex, type WeightUnit } from "../../domain/nutrition";
import type { Theme } from "../../domain/types";
import { todayKey } from "../../lib/date";
import { exportState, importState } from "../../storage/persistence";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";
import { GarminImport } from "./GarminImport";

const activityOptions = [
  { value: 1.2, label: "Mostly seated, ×1.2" },
  { value: 1.375, label: "Light exercise, 1 to 3 days, ×1.375" },
  { value: 1.45, label: "Regular daily movement, ×1.45" },
  { value: 1.55, label: "Moderate exercise, 3 to 5 days, ×1.55" },
  { value: 1.725, label: "Hard exercise, 6 to 7 days, ×1.725" },
  { value: 1.9, label: "Very hard training, ×1.9" },
] as const;

function positiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function displayNumber(value?: number) {
  if (value === undefined) return "";
  return String(Math.round(value * 100) / 100);
}

function lowerInputBound(value: number) {
  return Math.ceil(value * 100) / 100;
}

function upperInputBound(value: number) {
  return Math.floor(value * 100) / 100;
}

export function SettingsRoute() {
  const state = useMettlefieldStore();
  const input = useRef<HTMLInputElement>(null);
  const latestWeight = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const [message, setMessage] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetText, setResetText] = useState("");
  const [units, setUnits] = useState<WeightUnit>(state.profile.units);
  const [goal, setGoal] = useState<NutritionGoal>(state.profile.goal || "recomp");
  const [bodyweight, setBodyweight] = useState(latestWeight ? displayNumber(latestWeight.value) : "");
  const [height, setHeight] = useState(state.profile.heightCm ? displayNumber(state.profile.units === "imperial" ? state.profile.heightCm / 2.54 : state.profile.heightCm) : "");
  const [age, setAge] = useState(state.profile.age ? String(state.profile.age) : "");
  const [sex, setSex] = useState<NutritionSex | "">(state.profile.sex || "");
  const [activity, setActivity] = useState(state.profile.activity ? String(state.profile.activity) : "");
  const [calories, setCalories] = useState(String(state.goals.calories));
  const [protein, setProtein] = useState(String(state.goals.protein));
  const weightBounds = units === "imperial" ? {
    minimum: lowerInputBound(kilogramsToPounds(NUTRITION_RECOMMENDATION_BOUNDS.weightKg.minimum)),
    maximum: upperInputBound(kilogramsToPounds(NUTRITION_RECOMMENDATION_BOUNDS.weightKg.maximum)),
  } : NUTRITION_RECOMMENDATION_BOUNDS.weightKg;
  const heightBounds = units === "imperial" ? {
    minimum: lowerInputBound(NUTRITION_RECOMMENDATION_BOUNDS.heightCm.minimum / 2.54),
    maximum: upperInputBound(NUTRITION_RECOMMENDATION_BOUNDS.heightCm.maximum / 2.54),
  } : NUTRITION_RECOMMENDATION_BOUNDS.heightCm;
  const hasCustomActivity = activity !== "" && !activityOptions.some((option) => String(option.value) === activity);

  const heightCm = positiveNumber(height) ? (units === "imperial" ? Number(height) * 2.54 : Number(height)) : undefined;
  const recommendation = useMemo(() => calculateNutritionRecommendation({
    weight: positiveNumber(bodyweight),
    weightUnit: units,
    heightCm,
    age: positiveNumber(age),
    sex: sex || undefined,
    activity: positiveNumber(activity),
    goal,
  }), [activity, age, bodyweight, goal, heightCm, sex, units]);

  useEffect(() => { input.current?.setAttribute("aria-label", "Import backup"); }, []);

  function changeUnits(nextUnits: WeightUnit) {
    if (nextUnits === units) return;
    const weight = positiveNumber(bodyweight);
    const currentHeight = positiveNumber(height);
    if (weight) setBodyweight(displayNumber(nextUnits === "metric" ? poundsToKilograms(weight) : kilogramsToPounds(weight)));
    if (currentHeight) setHeight(displayNumber(nextUnits === "metric" ? currentHeight * 2.54 : currentHeight / 2.54));
    setUnits(nextUnits);
  }

  function download() {
    const blob = new Blob([exportState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `consistency-backup-${new Date().toLocaleDateString("en-CA")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function restore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      state.replaceState(importState(await file.text()));
      setMessage("Backup restored.");
    } catch {
      setMessage("That file is not a valid Consistency backup. Your current record was not changed.");
    }
    event.target.value = "";
  }

  function saveBasics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const savedWeight = positiveNumber(bodyweight);
    const duplicateToday = savedWeight !== undefined && state.weights.some((record) => record.date === todayKey() && weightsAreEquivalent(record.value, state.profile.units, savedWeight, units));

    state.updateProfile({
      name: String(data.get("name")),
      units,
      goal,
      age: positiveNumber(age),
      heightCm,
      sex: sex || undefined,
      activity: positiveNumber(activity),
    });
    state.updateGoals({
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(data.get("carbs")),
      fat: Number(data.get("fat")),
      water: Number(data.get("water")),
      sleep: Number(data.get("sleep")),
    });
    if (savedWeight !== undefined && !duplicateToday) state.addWeight(todayKey(), savedWeight);
    setMessage("Profile and targets saved.");
  }

  function applyRecommendation() {
    if (!recommendation) return;
    setCalories(String(recommendation.suggestedCalories));
    setProtein(String(recommendation.suggestedProtein));
  }

  function clearData() {
    download();
    state.reset();
    setResetOpen(false);
    setResetText("");
    setMessage("A backup was downloaded and local data was cleared.");
  }

  return <section className="route-frame settings-route">
    <header className="route-header compact"><div><p className="eyebrow">Preferences and data</p><h1>Settings</h1><p className="lede">Adjust the display and keep a copy of your records.</p></div></header>
    {message && <div className="inline-notice" role="status">{message}</div>}
    <div className="settings-stack">
      <section className="settings-section profile-settings">
        <div><h2>Profile and targets</h2><p>Set a direction, review a practical starting range, and keep the final targets under your control.</p></div>
        <form onSubmit={saveBasics}>
          <div className="profile-fields">
            <Field label="Name" name="name" defaultValue={state.profile.name} />
            <label className="field"><span>Units</span><select name="units" value={units} onChange={(event) => changeUnits(event.target.value as WeightUnit)}><option value="imperial">Imperial</option><option value="metric">Metric</option></select></label>
            <label className="field"><span>Current goal</span><select name="goal" value={goal} onChange={(event) => setGoal(event.target.value as NutritionGoal)}><option value="weight_loss">Cut</option><option value="muscle_gain">Build</option><option value="maintenance">Maintain</option><option value="recomp">Recomposition</option></select></label>
            <Field label={`Bodyweight (${units === "imperial" ? "lb" : "kg"})`} name="bodyweight" type="number" min={weightBounds.minimum} max={weightBounds.maximum} step="0.01" value={bodyweight} onChange={(event) => setBodyweight(event.target.value)} />
            <Field label={`Height (${units === "imperial" ? "in" : "cm"})`} name="height" type="number" min={heightBounds.minimum} max={heightBounds.maximum} step="0.01" value={height} onChange={(event) => setHeight(event.target.value)} />
            <Field label="Age" name="age" type="number" min={NUTRITION_RECOMMENDATION_BOUNDS.age.minimum} max={NUTRITION_RECOMMENDATION_BOUNDS.age.maximum} value={age} onChange={(event) => setAge(event.target.value)} />
            <label className="field"><span>Sex used for estimate</span><select name="sex" value={sex} onChange={(event) => setSex(event.target.value as NutritionSex | "")}><option value="">Select</option><option value="female">Female</option><option value="male">Male</option></select></label>
            <label className="field"><span>Activity level</span><select name="activity" value={activity} onChange={(event) => setActivity(event.target.value)}><option value="">Select</option>{hasCustomActivity && <option value={activity}>Saved custom level, ×{activity}</option>}{activityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>

          <section className="target-recommendation" aria-live="polite">
            {recommendation ? <>
              <header><div><span className="section-kicker">Suggested starting targets</span><h3>Use the range, then watch the trend.</h3></div><span className="recommendation-goal">{goal === "weight_loss" ? "Cut" : goal === "muscle_gain" ? "Build" : goal === "maintenance" ? "Maintain" : "Recomposition"}</span></header>
              <dl>
                <div><dt>Estimated maintenance</dt><dd>{recommendation.maintenanceCalories.toLocaleString()} <small>kcal</small></dd></div>
                <div><dt>Calorie range</dt><dd>{recommendation.calorieRange.minimum.toLocaleString()} to {recommendation.calorieRange.maximum.toLocaleString()} <small>kcal</small></dd></div>
                <div><dt>Suggested calories</dt><dd>{recommendation.suggestedCalories.toLocaleString()} <small>kcal</small></dd></div>
                <div><dt>Protein range</dt><dd>{recommendation.proteinRange.minimum} to {recommendation.proteinRange.maximum} <small>g</small></dd><span>0.8 to 1.2 g per lb</span></div>
                <div><dt>Suggested protein</dt><dd>{recommendation.suggestedProtein} <small>g</small></dd><span>1.0 g per lb</span></div>
              </dl>
              <p>Mifflin-St Jeor estimates maintenance from the profile above. These figures are planning estimates, not medical recommendations. Review two to three weeks of weight trends before adjusting.</p>
              <Button type="button" variant="secondary" onClick={applyRecommendation}>Apply suggested targets</Button>
            </> : <div className="recommendation-empty"><span className="section-kicker">Suggested starting targets</span><p>Add your bodyweight, height, age, sex, and activity level to see a starting range.</p></div>}
          </section>

          <div className="target-fields">
            <Field label="Calories" name="calories" type="number" min="1" required value={calories} onChange={(event) => setCalories(event.target.value)} />
            <Field label="Protein (g)" name="protein" type="number" min="0" required value={protein} onChange={(event) => setProtein(event.target.value)} />
            <Field label="Carbs (g)" name="carbs" type="number" min="0" defaultValue={state.goals.carbs} />
            <Field label="Fat (g)" name="fat" type="number" min="0" defaultValue={state.goals.fat} />
            <Field label="Water (cups)" name="water" type="number" min="1" defaultValue={state.goals.water} />
            <Field label="Sleep (hours)" name="sleep" type="number" min="1" max="24" step="0.25" defaultValue={state.goals.sleep} />
          </div>
          <div className="profile-save"><p>Applying a suggestion only fills the calorie and protein fields. Nothing is stored until you save.</p><Button type="submit">Save profile and targets</Button></div>
        </form>
      </section>
      <section className="settings-section"><div><h2>Appearance</h2><p>Follow your device or choose a fixed theme.</p></div><div className="segmented" aria-label="Color theme">{(["system", "light", "dark"] as Theme[]).map((theme) => <button key={theme} aria-pressed={state.theme === theme} className={state.theme === theme ? "active" : ""} onClick={() => state.setTheme(theme)}>{theme[0].toUpperCase() + theme.slice(1)}</button>)}</div></section>
      <section className="settings-section integration-section"><div><h2>Garmin import</h2><p>Import activity and sleep files exported from Garmin.</p></div><GarminImport /></section>
      <section className="settings-section"><div><h2>Backup</h2><p>Export creates a portable JSON file. Import validates the complete record before replacing anything.</p></div><div className="button-row"><Button variant="secondary" onClick={download}><DownloadSimple aria-hidden="true" /> Export</Button><Button variant="secondary" onClick={() => input.current?.click()}><UploadSimple aria-hidden="true" /> Import</Button><input ref={input} className="sr-only" type="file" accept="application/json" onChange={restore} /></div></section>
      <section className="settings-section"><div><h2>Exercise credits</h2><p>Exercise data and movement images are provided by <a href="https://repdb.co/free-exercise-dataset" target="_blank" rel="noreferrer">RepDB</a> under its free-tier license.</p></div></section>
      <section className="settings-section danger-zone"><div><h2>Reset local data</h2><p>Consistency downloads a backup before clearing this browser.</p>{resetOpen && <div className="reset-confirm"><Field label="Type CLEAR CONSISTENCY to continue" value={resetText} onChange={(event) => setResetText(event.target.value)} /><div className="button-row"><Button variant="secondary" onClick={() => { setResetOpen(false); setResetText(""); }}>Cancel</Button><Button variant="danger" disabled={resetText !== "CLEAR CONSISTENCY"} onClick={clearData}>Download backup and clear</Button></div></div>}</div>{!resetOpen && <Button variant="danger" onClick={() => setResetOpen(true)}><Warning aria-hidden="true" /> Clear data</Button>}</section>
    </div>
    <footer className="product-note"><strong>Consistency</strong><p>A personal training and nutrition record.</p></footer>
  </section>;
}

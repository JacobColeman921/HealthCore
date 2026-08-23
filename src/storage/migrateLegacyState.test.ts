import { migrateLegacyState } from "./migrateLegacyState";
import { exportState, importState, loadStateWithStatus, saveState, STORAGE_KEY } from "./persistence";

describe("legacy migration", () => {
  it("adapts the original HealthCore storage shapes without deleting them", () => {
    localStorage.setItem("hc_profile", JSON.stringify({ name: "Jacob", weight_lbs: 181, height_in: 70, activity: "moderate" }));
    localStorage.setItem("hc_goals", JSON.stringify({ calories: 2600, water: 96 }));
    localStorage.setItem("hc_entries", JSON.stringify({ "2026-08-22": { water: 80, weight: 181, foods: [{ name: "Greek yogurt", meal: "breakfast", serving: "1 cup", qty: 2, calories: 120, protein: 18, carbs: 8, fat: 0 }] } }));
    localStorage.setItem("hc_sleep", JSON.stringify([{ date: "2026-08-21", durationMins: 450, quality: 82 }]));
    localStorage.setItem("hc_workouts", JSON.stringify([{ date: "2026-08-22", type: "Upper", exercises: [{ name: "Bench Press", sets: [{ weight: 135, reps: 8 }] }] }]));
    localStorage.setItem("hc_habits", JSON.stringify([{ id: "walk", name: "Walk after lunch" }]));
    localStorage.setItem("hc_habit_checks", JSON.stringify({ "2026-08-22": { walk: true } }));
    localStorage.setItem("hc_active_plan", JSON.stringify({ name: "Legacy strength", days: { Monday: ["Bench Press", "Back Squat"] }, isCustom: false }));
    localStorage.setItem("hc_groq_key", "must-not-migrate");
    const result = migrateLegacyState(localStorage);
    expect(result.migrated).toBe(true);
    expect(result.state.profile.name).toBe("Jacob");
    expect(result.state.goals.calories).toBe(2600);
    expect(result.state.foods[0]).toMatchObject({ calories: 240, protein: 36, meal: "Breakfast" });
    expect(result.state.water[0].value).toBe(10);
    expect(result.state.weights[0].value).toBe(181);
    expect(result.state.goals.water).toBe(12);
    expect(result.state.sleep[0].value).toBe(7.5);
    expect(result.state.workouts[0].exercises[0].sets[0].completed).toBe(true);
    expect(result.state.workouts[0].exercises[0].primaryMuscles).toEqual(["chest", "triceps"]);
    expect(result.state.plans.find((plan) => plan.id === result.state.activePlanId)?.days[0].exerciseIds).toHaveLength(2);
    expect(result.state.habits[0].dates).toEqual(["2026-08-22"]);
    expect(result.state.integrations).toEqual({});
    expect(localStorage.getItem("hc_profile")).not.toBeNull();
  });

  it("exports data that can be validated and restored", () => {
    const state = migrateLegacyState(localStorage).state;
    expect(importState(exportState(state))).toEqual(state);
  });

  it("rejects malformed backup records", () => {
    const state = migrateLegacyState(localStorage).state;
    expect(() => importState(JSON.stringify({ ...state, foods: [{ calories: "a lot" }] }))).toThrow();
    expect(() => importState(JSON.stringify({ ...state, integrations: { groqKey: "secret" } }))).toThrow();
  });

  it("validates writes and preserves a damaged saved record for recovery", () => {
    const valid = migrateLegacyState(localStorage).state;
    expect(() => saveState({ ...valid, workouts: [{ id: "bad", date: "2026-08-22", title: "Bad set", durationMinutes: 1, exercises: [{ exerciseId: "x", name: "Squat", primaryMuscles: [], sets: [{ id: "s", reps: 0, weight: 1, completed: true }] }] }] })).toThrow();
    const damaged = JSON.stringify({ version: 1, foods: [{ calories: "many" }] });
    localStorage.setItem(STORAGE_KEY, damaged);
    const result = loadStateWithStatus(localStorage);
    expect(result.state).toEqual(expect.objectContaining({ foods: [] }));
    expect(result.recoveryBackup).toBe(damaged);
  });
});

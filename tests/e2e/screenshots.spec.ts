import { test } from "@playwright/test";

function dateOffset(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toLocaleDateString("en-CA");
}

test("capture review screens", async ({ page }, testInfo) => {
  const today = dateOffset(0);
  const seed = {
    version: 1,
    profile: { name: "Jacob", units: "imperial", goal: "recomp", activity: 1.45 },
    goals: { calories: 2200, protein: 150, carbs: 240, fat: 70, water: 8, sleep: 8 },
    theme: "light",
    foods: [
      { id: "food-1", date: today, meal: "Breakfast", name: "Greek yogurt and berries", serving: "1 bowl", calories: 310, protein: 27, carbs: 36, fat: 7 },
      { id: "food-2", date: today, meal: "Lunch", name: "Chicken rice bowl", serving: "1 bowl", calories: 690, protein: 52, carbs: 78, fat: 18 },
      { id: "food-3", date: today, meal: "Snack", name: "Protein smoothie", serving: "1 glass", calories: 390, protein: 38, carbs: 43, fat: 9 },
    ],
    water: Array.from({ length: 5 }, (_, index) => ({ id: `water-${index}`, date: today, value: 1 })),
    weights: Array.from({ length: 7 }, (_, index) => ({ id: `weight-${index}`, date: dateOffset(index - 6), value: 182.4 - index * 0.18 })),
    sleep: Array.from({ length: 7 }, (_, index) => ({ id: `sleep-${index}`, date: dateOffset(index - 6), value: [7.2, 8.1, 7.7, 6.9, 8.3, 7.8, 8][index] })),
    workouts: [{ id: "workout-1", date: dateOffset(-2), title: "Upper strength", durationMinutes: 54, exercises: [{ exerciseId: "bench-press", name: "Barbell Bench Press", primaryMuscles: ["chest", "triceps"], sets: [{ id: "set-1", reps: 6, weight: 175, completed: true }, { id: "set-2", reps: 6, weight: 175, completed: true }] }] }],
    cardio: [{ id: "cardio-1", date: dateOffset(-1), type: "Walk", durationMinutes: 42, distance: 2.6, notes: "Easy pace", source: "manual" }],
    habits: [
      { id: "protein", label: "Meet protein target", dates: [today] },
      { id: "movement", label: "Move for 30 minutes", dates: [today] },
      { id: "sleep", label: "Keep a consistent bedtime", dates: [] },
    ],
    plans: [],
    manualMaxes: { "Barbell Back Squat": 285 },
    integrations: {},
  };

  await page.addInitScript((value) => localStorage.setItem("mettlefield_state_v1", JSON.stringify(value)), seed);
  const suffix = testInfo.project.name === "mobile" ? "mobile" : "desktop";

  await page.goto("today");
  await page.getByRole("heading", { name: /^Good day/ }).waitFor();
  await page.screenshot({ path: `docs/qa/screenshots/today-${suffix}.png`, fullPage: false });

  await page.goto("log?view=ideas");
  await page.getByRole("heading", { name: "Meals that fit the job" }).waitFor();
  await page.screenshot({ path: `docs/qa/screenshots/food-ideas-${suffix}.png`, fullPage: false });

  await page.getByRole("tab", { name: "Diary" }).click();
  await page.getByRole("button", { name: "Add food" }).click();
  await page.getByPlaceholder("Chicken breast, Greek yogurt, Big Mac").fill("Greek yogurt");
  await page.getByRole("button", { name: /Add Greek Yogurt/ }).first().waitFor();
  await page.getByPlaceholder("Chicken breast, Greek yogurt, Big Mac").evaluate((element) => element.scrollIntoView({ block: "center" }));
  await page.screenshot({ path: `docs/qa/screenshots/food-search-${suffix}.png`, fullPage: false });

  await page.goto("train");
  await page.getByPlaceholder("Search 400 exercises").waitFor();
  await page.screenshot({ path: `docs/qa/screenshots/train-${suffix}.png`, fullPage: false });

  await page.goto("trends");
  await page.getByRole("tab", { name: "Weekly report" }).click();
  await page.getByRole("button", { name: "Print report" }).waitFor();
  await page.screenshot({ path: `docs/qa/screenshots/weekly-report-${suffix}.png`, fullPage: false });

  await page.goto("settings");
  await page.getByRole("heading", { name: "Profile and targets" }).waitFor();
  await page.screenshot({ path: `docs/qa/screenshots/settings-${suffix}.png`, fullPage: false });
});

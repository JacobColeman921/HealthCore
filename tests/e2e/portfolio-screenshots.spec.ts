import { expect, test } from "@playwright/test";

function dateOffset(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toLocaleDateString("en-CA");
}

function sets(prefix: string, weight: number, reps: number) {
  return [0, 1, 2].map((index) => ({ id: `${prefix}-${index}`, reps, weight, completed: true }));
}

test("capture populated portfolio screens", async ({ page }) => {
  const today = dateOffset(0);
  const dates = Array.from({ length: 7 }, (_, index) => dateOffset(index - 6));
  const dailyFoods = dates.flatMap((date, day) => [
    { id: `yogurt-${day}`, date, meal: "Breakfast", name: "Greek yogurt and berries", serving: "1 bowl", calories: 310, protein: 27, carbs: 36, fat: 7 },
    { id: `rice-${day}`, date, meal: "Lunch", name: "Chicken rice bowl", serving: "1 bowl", calories: 690, protein: 52, carbs: 78, fat: 18 },
    { id: `salmon-${day}`, date, meal: "Dinner", name: "Salmon, potatoes, and greens", serving: "1 plate", calories: 720, protein: 49, carbs: 68, fat: 26 },
    { id: `smoothie-${day}`, date, meal: "Snack", name: "Protein smoothie", serving: "1 glass", calories: 270, protein: 32, carbs: 29, fat: 5 },
  ]);
  const workouts = [
    {
      id: "workout-upper",
      date: dateOffset(-2),
      title: "Upper strength",
      durationMinutes: 58,
      exercises: [
        { exerciseId: "bench-press", name: "Barbell Bench Press", primaryMuscles: ["chest", "triceps"], sets: sets("bench", 175, 6) },
        { exerciseId: "lat-pulldown", name: "Lat Pulldown", primaryMuscles: ["back", "biceps"], sets: sets("pulldown", 145, 8) },
      ],
    },
    {
      id: "workout-lower",
      date: dateOffset(-1),
      title: "Lower strength",
      durationMinutes: 61,
      exercises: [
        { exerciseId: "back-squat", name: "Barbell Back Squat", primaryMuscles: ["quadriceps", "glutes"], sets: sets("squat", 245, 5) },
        { exerciseId: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscles: ["hamstrings", "glutes"], sets: sets("rdl", 205, 7) },
      ],
    },
    {
      id: "workout-push",
      date: dateOffset(0),
      title: "Push and shoulders",
      durationMinutes: 47,
      exercises: [
        { exerciseId: "incline-press", name: "Incline Dumbbell Press", primaryMuscles: ["chest", "shoulders"], sets: sets("incline", 65, 9) },
        { exerciseId: "lateral-raise", name: "Dumbbell Lateral Raise", primaryMuscles: ["shoulders"], sets: sets("raise", 20, 12) },
      ],
    },
  ];
  const seed = {
    version: 1,
    profile: { name: "Jacob", units: "imperial", goal: "recomp", age: 27, heightCm: 180, sex: "male", activity: 1.55 },
    goals: { calories: 2200, protein: 180, carbs: 240, fat: 70, water: 8, sleep: 8 },
    theme: "light",
    foods: dailyFoods,
    water: dates.flatMap((date, day) => Array.from({ length: day === 6 ? 7 : 8 }, (_, index) => ({ id: `water-${day}-${index}`, date, value: 1 }))),
    weights: dates.map((date, index) => ({ id: `weight-${index}`, date, value: 182.8 - index * 0.22 })),
    sleep: dates.map((date, index) => ({ id: `sleep-${index}`, date, value: [7.4, 8.1, 7.8, 7.2, 8.3, 7.9, 8.0][index], quality: [4, 5, 4, 3, 5, 4, 5][index], source: "manual" })),
    workouts,
    cardio: [
      { id: "cardio-1", date: dateOffset(-5), type: "Incline walk", durationMinutes: 35, distance: 2.2, notes: "Easy pace", source: "manual" },
      { id: "cardio-2", date: dateOffset(-3), type: "Outdoor run", durationMinutes: 28, distance: 3.1, notes: "Steady effort", source: "manual" },
    ],
    habits: [
      { id: "protein", label: "Meet protein target", dates },
      { id: "movement", label: "Move for 30 minutes", dates: dates.slice(1) },
      { id: "sleep", label: "Keep a consistent bedtime", dates: dates.filter((_, index) => index !== 2) },
    ],
    plans: [{ id: "plan-upper-lower", name: "Four-day strength", days: [
      { name: "Upper A", exerciseIds: ["legacy-exercise-barbell-bench-press", "legacy-exercise-lat-pulldown", "legacy-exercise-dumbbell-lateral-raise"] },
      { name: "Lower A", exerciseIds: ["legacy-exercise-barbell-back-squat", "legacy-exercise-romanian-deadlift"] },
    ] }],
    activePlanId: "plan-upper-lower",
    manualMaxes: { "Barbell Back Squat": 285, "Barbell Bench Press": 205, "Romanian Deadlift": 265 },
    integrations: {},
  };

  await page.addInitScript((value) => localStorage.setItem("mettlefield_state_v1", JSON.stringify(value)), seed);

  await page.goto("#/today");
  await expect(page.getByRole("heading", { name: "Good day, Jacob" })).toBeVisible();
  await page.screenshot({ path: "docs/qa/screenshots/portfolio-today.png", fullPage: false });

  await page.goto("#/log?view=ideas");
  await expect(page.getByRole("heading", { name: "Meals that fit the job" })).toBeVisible();
  await page.screenshot({ path: "docs/qa/screenshots/portfolio-meals.png", fullPage: false });

  await page.goto("#/train");
  await page.getByPlaceholder("Search 400 exercises").fill("Barbell Bench Press");
  await page.getByRole("button", { name: /Barbell Bench Press/ }).first().click();
  await page.getByRole("button", { name: "Add to session" }).click();
  await page.getByPlaceholder("Search 400 exercises").fill("Dumbbell Lateral Raise");
  await page.getByRole("button", { name: /Dumbbell Lateral Raise/ }).first().click();
  await page.getByRole("button", { name: "Add to session" }).click();
  await expect(page.getByRole("heading", { name: "Current session" })).toBeVisible();
  const activeExercises = page.locator(".workout-exercise");
  await activeExercises.nth(0).getByRole("button", { name: "Add set" }).click();
  await activeExercises.nth(0).getByRole("button", { name: "Add set" }).click();
  await activeExercises.nth(0).getByLabel("Barbell Bench Press set 1 weight").fill("180");
  await activeExercises.nth(0).getByLabel("Barbell Bench Press set 2 weight").fill("180");
  await activeExercises.nth(1).getByRole("button", { name: "Add set" }).click();
  await activeExercises.nth(1).getByRole("button", { name: "Add set" }).click();
  await activeExercises.nth(1).getByLabel("Dumbbell Lateral Raise set 1 weight").fill("20");
  await activeExercises.nth(1).getByLabel("Dumbbell Lateral Raise set 2 weight").fill("20");
  await page.screenshot({ path: "docs/qa/screenshots/portfolio-workout.png", fullPage: false });

  await page.goto("#/trends");
  await page.getByRole("button", { name: "Weekly report" }).click();
  await expect(page.getByRole("button", { name: "Print report" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "docs/qa/screenshots/portfolio-weekly-report.png", fullPage: false });
});

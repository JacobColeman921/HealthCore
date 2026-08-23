import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("#/today");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("every primary destination and subview renders", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Consistency home" })).toBeVisible();
  await expect(page).toHaveTitle("Consistency");
  await expect(page.getByRole("heading", { name: /^Good day/ })).toBeVisible();

  await page.getByRole("link", { name: "Log", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Food diary" })).toBeVisible();
  await page.getByRole("button", { name: "Food ideas" }).click();
  await expect(page.getByRole("heading", { name: "Meals that fit the job" })).toBeVisible();
  await page.getByRole("button", { name: "Nutrition" }).click();
  await expect(page.getByRole("heading", { name: "Calories by meal" })).toBeVisible();

  await page.getByRole("link", { name: "Train", exact: true }).click();
  await expect(page.getByPlaceholder("Search 400 exercises")).toBeVisible();
  await page.getByRole("button", { name: "Plans" }).click();
  await expect(page.getByRole("heading", { name: "Give the week a structure" })).toBeVisible();
  await page.getByRole("button", { name: "Strength PRs" }).click();
  await expect(page.getByRole("heading", { name: "Estimated and entered maxes" })).toBeVisible();
  await page.getByRole("button", { name: "Cardio" }).click();
  await expect(page.getByRole("heading", { name: "Record time on the move" })).toBeVisible();

  await page.getByRole("link", { name: "Trends", exact: true }).click();
  for (const [tab, heading] of [
    ["Recovery", "Sleep and repeatable habits"],
    ["Muscle map", "Where the work went"],
    ["Weekly report", /to/],
    ["Check-in", "A review grounded in your record"],
  ] as const) {
    await page.getByRole("button", { name: tab }).click();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Profile and targets" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Garmin import" })).toBeVisible();
});

test("a meal idea can be logged into the diary", async ({ page }) => {
  await page.goto("#/log?view=ideas");
  const firstCard = page.locator(".idea-card").first();
  const mealName = await firstCard.getByRole("heading").textContent();
  await firstCard.getByRole("button", { name: "Add to diary" }).click();
  await expect(page.getByRole("status")).toContainText("added");
  await page.getByRole("button", { name: "Diary", exact: true }).click();
  await expect(page.getByText(mealName || "", { exact: true })).toBeVisible();
});

test("a common food can be found and logged from the local catalog", async ({ page }) => {
  await page.goto("#/log");
  await page.getByRole("button", { name: "Add food" }).click();
  await page.getByPlaceholder("Chicken breast, Greek yogurt, Big Mac").fill("Big Mac");
  await page.getByRole("button", { name: "Add McDonald's Big Mac" }).click();
  await expect(page.getByRole("status")).toContainText("added to breakfast");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("McDonald's Big Mac", { exact: true })).toBeVisible();
});

test("a cardio activity can be saved", async ({ page }) => {
  await page.goto("#/train");
  await page.getByRole("button", { name: "Cardio" }).click();
  await page.getByLabel("Minutes").fill("35");
  await page.getByLabel("Distance").fill("3.2");
  await page.getByRole("button", { name: "Save activity" }).click();
  await expect(page.getByRole("status")).toHaveText("Activity saved.");
  await expect(page.getByText("35 min")).toBeVisible();
});

test("a saved plan launches and completes a clean workout session", async ({ page }) => {
  await page.goto("#/train");
  await page.getByRole("button", { name: "Plans" }).click();
  await page.getByRole("button", { name: "Save and use template" }).first().click();
  await expect(page.getByRole("status")).toContainText("active plan");
  const plan = await page.evaluate(() => JSON.parse(localStorage.getItem("mettlefield_state_v1") || "{}").plans[0]);
  expect(plan.days[0].exerciseIds).toEqual(["squat", "bench-press", "wide-grip-seated-cable-row"]);
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Plan name").fill("My full body plan");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/My full body plan.*Active/)).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Plan name").fill("Discarded name");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Discarded name")).toHaveCount(0);
  await page.getByRole("button", { name: "Start Day 1" }).click();
  await expect(page.getByRole("heading", { name: "Current session" })).toBeVisible();
  await page.getByRole("button", { name: "Add set" }).first().click();
  const reps = page.getByLabel(/set 1 reps/).first();
  await reps.fill("");
  await expect(page.getByRole("button", { name: "Finish" })).toBeDisabled();
  await reps.fill("8");
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page.getByRole("status")).toContainText("sets saved in a");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("mettlefield_state_v1") || "{}").workouts);
  expect(saved).toHaveLength(1);
});

test("an invalid backup cannot replace the current record", async ({ page }) => {
  await page.goto("#/settings");
  await page.locator(".settings-section").filter({ hasText: "Export creates" }).locator('input[type="file"]').setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"version":1,"foods":[{"calories":"many"}]}') });
  await expect(page.locator(".inline-notice")).toContainText("not changed");
  const saved = await page.evaluate(() => localStorage.getItem("mettlefield_state_v1"));
  expect(saved).toBeNull();
});

test("suggested targets require explicit application before they are saved", async ({ page }) => {
  await page.goto("#/settings");
  await expect(page.getByText("Add your bodyweight, height, age, sex, and activity level to see a starting range.")).toBeVisible();

  await page.getByLabel("Calories").fill("1900");
  await page.getByLabel("Protein (g)").fill("170");
  await page.getByLabel("Bodyweight (lb)").fill("180");
  await page.getByLabel("Height (in)").fill("70.87");
  await page.getByLabel("Age").fill("30");
  await page.getByLabel("Sex used for estimate").selectOption("male");
  await page.getByLabel("Activity level").selectOption("1.55");
  await page.getByLabel("Current goal").selectOption("weight_loss");

  await expect(page.getByText("Suggested starting targets")).toBeVisible();
  await expect(page.getByText("0.8 to 1.2 g per lb")).toBeVisible();
  await expect(page.getByLabel("Calories")).toHaveValue("1900");
  await expect(page.getByLabel("Protein (g)")).toHaveValue("170");

  await page.getByRole("button", { name: "Apply suggested targets" }).click();
  await expect(page.getByLabel("Calories")).not.toHaveValue("1900");
  await expect(page.getByLabel("Protein (g)")).toHaveValue("180");
  const appliedCalories = await page.getByLabel("Calories").inputValue();

  await page.getByRole("button", { name: "Save profile and targets" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.reload();
  await expect(page.getByLabel("Calories")).toHaveValue(appliedCalories);
  await expect(page.getByLabel("Protein (g)")).toHaveValue("180");
  await expect(page.getByLabel("Bodyweight (lb)")).toHaveValue("180");
  await expect(page.getByLabel("Current goal")).toHaveValue("weight_loss");

  await page.getByRole("button", { name: "Save profile and targets" }).click();
  const sameDayWeights = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("mettlefield_state_v1") || "{}");
    return state.weights.filter((item: { date: string; value: number }) => item.value === 180).length;
  });
  expect(sameDayWeights).toBe(1);
});

test("representative routes and themes have no serious automated accessibility violations", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) for (const path of ["today", "log", "train", "trends", "settings"]) {
    await page.goto(`#/${path}`); await page.evaluate((value) => { const current = JSON.parse(localStorage.getItem("mettlefield_state_v1") || "null") || { version: 1, profile: { name: "", units: "imperial", goal: "recomp", activity: 1.45 }, goals: { calories: 2200, protein: 150, carbs: 240, fat: 70, water: 8, sleep: 8 }, foods: [], water: [], weights: [], sleep: [], workouts: [], cardio: [], habits: [], plans: [], manualMaxes: {}, integrations: {} }; current.theme = value; localStorage.setItem("mettlefield_state_v1", JSON.stringify(current)); }, theme); await page.reload();
    await page.waitForTimeout(500); const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || "")), `${path} ${theme}`).toEqual([]);
  }
});

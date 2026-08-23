import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("today");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("every primary destination and subview renders", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /^Good day/ })).toBeVisible();

  await page.getByRole("link", { name: "Log", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Food diary" })).toBeVisible();
  await page.getByRole("tab", { name: "Food ideas" }).click();
  await expect(page.getByRole("heading", { name: "Meals that fit the job" })).toBeVisible();
  await page.getByRole("tab", { name: "Nutrition" }).click();
  await expect(page.getByRole("heading", { name: "Calories by meal" })).toBeVisible();

  await page.getByRole("link", { name: "Train", exact: true }).click();
  await expect(page.getByPlaceholder("Search 400 exercises")).toBeVisible();
  await page.getByRole("tab", { name: "Plans" }).click();
  await expect(page.getByRole("heading", { name: "Give the week a structure" })).toBeVisible();
  await page.getByRole("tab", { name: "Strength PRs" }).click();
  await expect(page.getByRole("heading", { name: "Estimated and entered maxes" })).toBeVisible();
  await page.getByRole("tab", { name: "Cardio" }).click();
  await expect(page.getByRole("heading", { name: "Record time on the move" })).toBeVisible();

  await page.getByRole("link", { name: "Trends", exact: true }).click();
  for (const [tab, heading] of [
    ["Recovery", "Sleep and repeatable habits"],
    ["Muscle map", "Where the work went"],
    ["Weekly report", /to/],
    ["Check-in", "A review grounded in your record"],
  ] as const) {
    await page.getByRole("tab", { name: tab }).click();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Profile and targets" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Garmin import" })).toBeVisible();
});

test("a meal idea can be logged into the diary", async ({ page }) => {
  await page.goto("log?view=ideas");
  const firstCard = page.locator(".idea-card").first();
  const mealName = await firstCard.getByRole("heading").textContent();
  await firstCard.getByRole("button", { name: "Add to diary" }).click();
  await expect(page.getByRole("status")).toContainText("added");
  await page.getByRole("tab", { name: "Diary" }).click();
  await expect(page.getByText(mealName || "", { exact: true })).toBeVisible();
});

test("a common food can be found and logged from the local catalog", async ({ page }) => {
  await page.goto("log");
  await page.getByRole("button", { name: "Add food" }).click();
  await page.getByPlaceholder("Chicken breast, Greek yogurt, Big Mac").fill("Big Mac");
  await page.getByRole("button", { name: "Add McDonald's Big Mac" }).click();
  await expect(page.getByRole("status")).toContainText("added to breakfast");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("McDonald's Big Mac", { exact: true })).toBeVisible();
});

test("a cardio activity can be saved", async ({ page }) => {
  await page.goto("train");
  await page.getByRole("tab", { name: "Cardio" }).click();
  await page.getByLabel("Minutes").fill("35");
  await page.getByLabel("Distance").fill("3.2");
  await page.getByRole("button", { name: "Save activity" }).click();
  await expect(page.getByRole("status")).toHaveText("Activity saved.");
  await expect(page.getByText("35 min")).toBeVisible();
});

test("the shell has no serious automated accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "One representative axe pass is sufficient.");
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
});

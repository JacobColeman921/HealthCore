import { readFile, writeFile } from "node:fs/promises";

const legacy = await readFile(new URL("../docs/legacy/healthcore-monolith.html", import.meta.url), "utf8");
const startMarker = "const MEAL_PLANS = ";
const endMarker = "\nlet _mealCategory";
const start = legacy.indexOf(startMarker);
const end = legacy.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error("Legacy meal plan block was not found.");
const expression = legacy.slice(start + startMarker.length, end).trim().replace(/;[\s;]*$/, "");
const plans = Function(`"use strict"; return (${expression});`)();
await writeFile(new URL("../src/data/meal-ideas.json", import.meta.url), `${JSON.stringify(plans, null, 2)}\n`);

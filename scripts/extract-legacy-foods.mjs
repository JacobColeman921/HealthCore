import { readFile, writeFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const sourceUrl = new URL("../docs/legacy/healthcore-monolith.html", import.meta.url);
const outputUrl = new URL("../src/data/food-catalog.json", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const match = source.match(/const FOOD_DB = \[([\s\S]*?)\n\];\n\nfunction searchLocalFoods/);

if (!match) throw new Error("Could not locate the legacy food catalog.");

const rows = runInNewContext(`[${match[1]}]`, Object.create(null));
const seen = new Set();
const catalog = rows.map((row, index) => ({
  id: `legacy-food-${index + 1}`,
  name: String(row[0]),
  calories: Number(row[1]) || 0,
  protein: Number(row[2]) || 0,
  carbs: Number(row[3]) || 0,
  fat: Number(row[4]) || 0,
})).filter((food) => {
  const key = food.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

await writeFile(outputUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Extracted ${catalog.length} foods to ${outputUrl.pathname}`);

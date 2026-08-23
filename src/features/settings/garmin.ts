import type { CardioRecord, SleepRecord } from "../../domain/types";

export interface GarminImport { cardio: CardioRecord[]; sleep: SleepRecord[]; warnings: string[]; }
const dateKey = (value: unknown) => { const direct = String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/)?.[0]; if (direct) return direct; const parsed = new Date(String(value)); return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-CA"); };
const numeric = (value: unknown) => Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
const hash = (value: string) => { let output = 2166136261; for (const character of value) output = Math.imul(output ^ character.charCodeAt(0), 16777619); return (output >>> 0).toString(36); };
const stableId = (kind: string, values: unknown[]) => `garmin-${kind}-${hash(values.join("|"))}`;
function csv(text: string): string[][] { const rows: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false; for (let index = 0; index < text.length; index += 1) { const character = text[index]; if (character === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; } else if (character === '"') quoted = !quoted; else if (character === "," && !quoted) { row.push(cell.trim()); cell = ""; } else if ((character === "\n" || character === "\r") && !quoted) { if (character === "\r" && text[index + 1] === "\n") index += 1; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; } else cell += character; } row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); return rows; }
function minutes(value: unknown, secondsHint = false) { const raw = String(value ?? "").trim(); if (/^\d+:\d{2}(:\d{2})?$/.test(raw)) { const parts = raw.split(":").map(Number); return parts.length === 3 ? Math.round(parts[0] * 60 + parts[1] + parts[2] / 60) : Math.round(parts[0] + parts[1] / 60); } return Math.max(0, Math.round(numeric(raw) / (secondsHint ? 60 : 1))); }

export function parseGarminExport(text: string, filename = "garmin-export", units: "imperial" | "metric" = "imperial"): GarminImport {
  const result: GarminImport = { cardio: [], sleep: [], warnings: [] };
  try {
    if (filename.toLowerCase().endsWith(".csv") || (!text.trim().startsWith("{") && !text.trim().startsWith("["))) {
      const rows = csv(text); const headers = (rows.shift() || []).map((item) => item.toLowerCase());
      const column = (row: string[], names: string[]) => { const index = headers.findIndex((header) => names.some((name) => header.includes(name))); return index >= 0 ? row[index] : ""; };
      rows.forEach((row, index) => {
        const rawStart = column(row, ["start time", "date"]); const date = dateKey(rawStart); const providerId = column(row, ["activity id", "garmin id"]); const durationHeader = headers.find((header) => header.includes("duration") || header.includes("elapsed")) || ""; const duration = minutes(column(row, ["duration", "elapsed"]), durationHeader.includes("second")); const type = column(row, ["activity type", "type"]) || "Garmin activity"; const distanceHeader = headers.find((header) => header.includes("distance")) || ""; const rawDistance = numeric(column(row, ["distance"])); const distance = distanceHeader.includes("km") && units === "imperial" ? rawDistance * 0.621371 : (distanceHeader.includes("mi") || distanceHeader.includes("mile")) && units === "metric" ? rawDistance * 1.609344 : rawDistance; const sleepMinutes = minutes(column(row, ["sleep duration", "sleep time"]), headers.some((header) => header.includes("sleep") && header.includes("second")));
        if (date && sleepMinutes) result.sleep.push({ id: stableId("sleep", [rawStart, sleepMinutes]), date, value: Math.round(sleepMinutes / 6) / 10, source: "garmin" });
        else if (date && duration) result.cardio.push({ id: providerId ? `garmin-activity-${providerId}` : stableId("activity", [rawStart, type, duration, rawDistance]), date, type, durationMinutes: duration, distance: distance || undefined, calories: numeric(column(row, ["calories"])) || undefined, source: "garmin" });
      });
    } else {
      const data = JSON.parse(text); const records = Array.isArray(data) ? data : Array.isArray(data.activities) ? data.activities : Array.isArray(data.summarizedActivitiesExport) ? data.summarizedActivitiesExport : Array.isArray(data.activityList) ? data.activityList : Array.isArray(data.sleepData) ? data.sleepData : Array.isArray(data.sleepDataList) ? data.sleepDataList : Array.isArray(data.dailySleepDTO) ? data.dailySleepDTO : data.dailySleepDTO ? [data.dailySleepDTO] : [data];
      records.forEach((item: Record<string, unknown>) => {
        const rawStart = item.startTimeLocal || item.startTimeGMT || item.date || item.calendarDate; const date = dateKey(rawStart); const sleepFile = filename.toLowerCase().includes("sleep"); const sleepSeconds = numeric(item.sleepTimeSeconds || (sleepFile ? item.durationInSeconds : 0) || item.sleepDuration); const providerId = item.activityId || item.id;
        if (date && sleepSeconds) result.sleep.push({ id: providerId ? `garmin-sleep-${providerId}` : stableId("sleep", [rawStart, sleepSeconds]), date, value: Math.round(sleepSeconds / (sleepSeconds > 24 ? 360 : 0.1)) / 10, quality: numeric(item.sleepScores || item.overallSleepScore) || undefined, source: "garmin" });
        else { const duration = minutes(item.durationInSeconds || item.elapsedDuration || item.duration, Boolean(item.durationInSeconds || item.elapsedDuration)); if (date && duration) { const type = String(item.activityType || item.activityName || item.type || "Garmin activity"); const meters = numeric(item.distance); result.cardio.push({ id: providerId ? `garmin-activity-${providerId}` : stableId("activity", [rawStart, type, duration, meters]), date, type, durationMinutes: duration, distance: meters ? meters / (units === "metric" ? 1000 : 1609.344) : undefined, calories: numeric(item.calories) || undefined, source: "garmin" }); } }
      });
    }
  } catch { result.warnings.push("The file could not be read as a Garmin CSV or JSON export."); }
  if (!result.cardio.length && !result.sleep.length && !result.warnings.length) result.warnings.push("No supported activity or sleep records were found.");
  return result;
}

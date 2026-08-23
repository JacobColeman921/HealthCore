import type { CardioRecord, SleepRecord } from "../../domain/types";

export interface GarminImport { cardio: CardioRecord[]; sleep: SleepRecord[]; warnings: string[]; }
const dateKey = (value: unknown) => { const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-CA"); };
const number = (value: unknown) => Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;

export function parseGarminExport(text: string, filename = "garmin-export"): GarminImport {
  const result: GarminImport = { cardio: [], sleep: [], warnings: [] };
  try {
    if (filename.toLowerCase().endsWith(".csv") || !text.trim().startsWith("{" ) && !text.trim().startsWith("[")) {
      const rows = text.trim().split(/\r?\n/).map((row) => row.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim())); const headers = rows.shift()?.map((item) => item.toLowerCase()) || [];
      const at = (row: string[], names: string[]) => { const index = headers.findIndex((header) => names.some((name) => header.includes(name))); return index >= 0 ? row[index] : ""; };
      rows.forEach((row, index) => { const date = dateKey(at(row, ["date", "start time"])); const duration = number(at(row, ["duration", "elapsed"])); const type = at(row, ["activity type", "type"]) || "Garmin activity"; if (date && duration) result.cardio.push({ id: `garmin-${filename}-${index}-${date}`, date, type, durationMinutes: duration > 600 ? Math.round(duration / 60) : Math.round(duration), distance: number(at(row, ["distance"])) || undefined, calories: number(at(row, ["calories"])) || undefined, source: "garmin" }); const sleepHours = number(at(row, ["sleep duration", "sleep time"])); if (date && sleepHours) result.sleep.push({ id: `garmin-sleep-${filename}-${index}-${date}`, date, value: sleepHours > 24 ? Math.round(sleepHours / 60 * 10) / 10 : sleepHours }); });
    } else {
      const data = JSON.parse(text); const records = Array.isArray(data) ? data : Array.isArray(data.activities) ? data.activities : Array.isArray(data.sleepData) ? data.sleepData : [data]; records.forEach((item: Record<string, unknown>, index: number) => { const date = dateKey(item.startTimeLocal || item.startTimeGMT || item.date || item.calendarDate); const duration = number(item.duration || item.durationInSeconds || item.elapsedDuration); const sleepSeconds = number(item.sleepTimeSeconds || item.durationInSeconds && String(filename).toLowerCase().includes("sleep") ? item.durationInSeconds : item.sleepDuration); if (date && sleepSeconds) result.sleep.push({ id: `garmin-sleep-${filename}-${index}-${date}`, date, value: Math.round(sleepSeconds / (sleepSeconds > 24 ? 3600 : 1) * 10) / 10, quality: number(item.sleepScores || item.overallSleepScore) || undefined }); else if (date && duration) result.cardio.push({ id: `garmin-${filename}-${index}-${date}`, date, type: String(item.activityType || item.activityName || item.type || "Garmin activity"), durationMinutes: Math.round(duration / (duration > 600 ? 60 : 1)), distance: number(item.distance) || undefined, calories: number(item.calories) || undefined, source: "garmin" }); });
    }
  } catch { result.warnings.push("The file could not be read as a Garmin CSV or JSON export."); }
  if (!result.cardio.length && !result.sleep.length && !result.warnings.length) result.warnings.push("No supported activity or sleep records were found.");
  return result;
}

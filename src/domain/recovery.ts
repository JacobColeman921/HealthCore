import type { SleepRecord } from "./types";

export function calculateRecoverySummary(records: SleepRecord[], goal = 8) {
  if (!records.length) return { average: null, consistency: null, targetHitRate: null };
  const average = records.reduce((sum, item) => sum + item.value, 0) / records.length;
  const variance = records.reduce((sum, item) => sum + Math.abs(item.value - average), 0) / records.length;
  return { average: Math.round(average * 10) / 10, consistency: Math.max(0, Math.round((100 - variance * 15))), targetHitRate: Math.round(records.filter((item) => item.value >= goal).length / records.length * 100) };
}

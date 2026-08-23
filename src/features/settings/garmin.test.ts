import { parseGarminExport } from "./garmin";

describe("Garmin import", () => {
  it("reads activity CSV exports", () => { const result = parseGarminExport("Activity Type,Date,Duration,Calories\nRunning,2026-08-20,30,320", "Activities.csv"); expect(result.cardio[0]).toMatchObject({ type: "Running", durationMinutes: 30, calories: 320 }); });
  it("reports unsupported files", () => { expect(parseGarminExport("not useful", "file.txt").warnings).toHaveLength(1); });
});

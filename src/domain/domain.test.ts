import { estimateTdee } from "./nutrition";
import { calculateRecoverySummary } from "./recovery";
import { estimateOneRepMax } from "./training";

describe("health calculations", () => {
  it("uses transparent estimates and unavailable states", () => {
    expect(estimateTdee()).toBeNull();
    expect(estimateTdee(80, 180, 30)).toBe(2581);
    expect(estimateOneRepMax(100, 5)).toBe(116.7);
    expect(calculateRecoverySummary([]).average).toBeNull();
  });
});

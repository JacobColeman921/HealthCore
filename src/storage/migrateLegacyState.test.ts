import { migrateLegacyState } from "./migrateLegacyState";
import { exportState, importState } from "./persistence";

describe("legacy migration", () => {
  it("preserves values and leaves source keys untouched", () => {
    localStorage.setItem("hc_profile", JSON.stringify({ name: "Jacob", units: "metric" }));
    localStorage.setItem("hc_goals", JSON.stringify({ calories: 2600 }));
    localStorage.setItem("hc_weights", JSON.stringify([{ id: "w", date: "2026-08-22", value: 82 }]));
    const result = migrateLegacyState(localStorage);
    expect(result.migrated).toBe(true);
    expect(result.state.profile.name).toBe("Jacob");
    expect(result.state.goals.calories).toBe(2600);
    expect(result.state.weights).toHaveLength(1);
    expect(localStorage.getItem("hc_profile")).not.toBeNull();
  });

  it("exports data that can be validated and restored", () => {
    const state = migrateLegacyState(localStorage).state;
    expect(importState(exportState(state))).toEqual(state);
  });
});

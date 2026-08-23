import { defaultState } from "../domain/defaults";
import { useMettlefieldStore } from "./useMettlefieldStore";

describe("Mettlefield store safeguards", () => {
  beforeEach(() => { localStorage.clear(); useMettlefieldStore.setState({ ...defaultState, storageStatus: "saved" }); });

  it("converts saved weights and distances when units change", () => {
    useMettlefieldStore.setState({ weights: [{ id: "w", date: "2026-08-22", value: 220.462262 }], cardio: [{ id: "c", date: "2026-08-22", type: "Run", durationMinutes: 30, distance: 6.21371 }], manualMaxes: { Squat: 220.462262 } });
    useMettlefieldStore.getState().updateProfile({ units: "metric" });
    expect(useMettlefieldStore.getState().weights[0].value).toBeCloseTo(100, 3);
    expect(useMettlefieldStore.getState().cardio[0].distance).toBeCloseTo(10, 3);
    expect(useMettlefieldStore.getState().manualMaxes.Squat).toBeCloseTo(100, 3);
  });

  it("deduplicates Garmin sleep by stable id and date", () => {
    const record = { id: "garmin-sleep-one", date: "2026-08-21", value: 8, source: "garmin" as const };
    useMettlefieldStore.getState().addSleepMany([record, { ...record, id: "garmin-sleep-two" }]);
    useMettlefieldStore.getState().addSleepMany([{ ...record, id: "garmin-sleep-three" }]);
    expect(useMettlefieldStore.getState().sleep).toHaveLength(1);
  });

  it("deduplicates cardio records inside one import batch", () => {
    const record = { id: "garmin-activity-one", date: "2026-08-21", type: "Run", durationMinutes: 30, source: "garmin" as const };
    useMettlefieldStore.getState().addCardioMany([record, { ...record }]);
    expect(useMettlefieldStore.getState().cardio).toHaveLength(1);
  });

  it("exposes a warning state when browser persistence fails", () => {
    const failure = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    useMettlefieldStore.getState().addWater("2026-08-22");
    expect(useMettlefieldStore.getState().storageStatus).toBe("memory-only");
    failure.mockRestore();
  });

  it("does not overwrite a damaged record before explicit recovery acknowledgement", () => {
    const damaged = '{"version":1,"foods":"damaged"}'; localStorage.setItem("mettlefield_state_v1", damaged);
    useMettlefieldStore.setState({ ...defaultState, storageStatus: "recovery-needed", recoveryBackup: damaged });
    useMettlefieldStore.getState().addWater("2026-08-22");
    expect(localStorage.getItem("mettlefield_state_v1")).toBe(damaged);
    expect(useMettlefieldStore.getState().storageStatus).toBe("recovery-needed");
    useMettlefieldStore.getState().reset();
    expect(localStorage.getItem("mettlefield_state_v1")).toBe(damaged);
    useMettlefieldStore.getState().replaceState({ ...defaultState, profile: { ...defaultState.profile, name: "Imported" } });
    expect(localStorage.getItem("mettlefield_state_v1")).toBe(damaged);
    expect(useMettlefieldStore.getState().storageStatus).toBe("recovery-needed");
    useMettlefieldStore.getState().acknowledgeRecovery();
    expect(useMettlefieldStore.getState().storageStatus).toBe("saved");
    expect(JSON.parse(localStorage.getItem("mettlefield_state_v1") || "{}").profile.name).toBe("Imported");
  });
});

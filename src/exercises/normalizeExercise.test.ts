import { normalizeExercise } from "./normalizeExercise";
import { RepDbExerciseRepository } from "./RepDbExerciseRepository";

describe("exercise repository", () => {
  it("normalizes pose media and stable ids", () => {
    const exercise = normalizeExercise({ id: "test-move", name: "Test Move", images: { flat: ["start", "peak"] } });
    expect(exercise.images).toHaveLength(2); expect(exercise.description).toContain("not available");
  });
  it("searches names and filters equipment", () => {
    const results = new RepDbExerciseRepository().search("squat", { difficulty: "beginner" });
    expect(results.length).toBeGreaterThan(0); expect(results.every((item) => item.difficulty === "beginner")).toBe(true);
  });
});

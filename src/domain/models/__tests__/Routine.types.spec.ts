import { describe, it, expect } from "vitest";
import type {
  Day,
  Routine,
  WorkoutLog,
  WeightEntry,
  DayTypeEnum,
  SlotEntryTypeEnum,
  ImpressionEnum,
} from "../Routine.types.js";

describe("Routine types", () => {
  it("1.4.1: DayTypeEnum allows exactly 8 literals", () => {
    const types: DayTypeEnum[] = [
      "custom",
      "enom",
      "amrap",
      "hiit",
      "tabata",
      "edt",
      "rft",
      "afap",
    ];
    expect(types).toHaveLength(8);
  });

  it("1.4.2: SlotEntryTypeEnum allows exactly 9 literals", () => {
    const types: SlotEntryTypeEnum[] = [
      "normal",
      "warmup",
      "dropset",
      "myo",
      "partial",
      "forced",
      "tut",
      "iso",
      "jump",
    ];
    expect(types).toHaveLength(9);
  });

  it("1.4.3: ImpressionEnum is exactly 1|2|3", () => {
    const impressions: ImpressionEnum[] = ["1", "2", "3"];
    expect(impressions).toHaveLength(3);
  });

  it("1.4.4: Day.config accepts JsonValue, null, or undefined", () => {
    const dayWithConfig: Day = {
      id: 1,
      routine: 1,
      order: 0,
      config: { sets: 3 },
    };
    const dayWithNull: Day = { id: 1, routine: 1, order: 0, config: null };
    const dayWithout: Day = { id: 1, routine: 1, order: 0 };
    expect(dayWithConfig.config).toEqual({ sets: 3 });
    expect(dayWithNull.config).toBeNull();
    expect(dayWithout.config).toBeUndefined();
  });

  it("1.4.5: WorkoutLog.repetitions is string | null", () => {
    const log: WorkoutLog = {
      id: 1,
      date: "2024-01-01",
      session: 1,
      exercise: 1,
      repetitions: "10",
    };
    expect(log.repetitions).toBe("10");
  });

  it("1.4.6: WeightEntry.weight is string", () => {
    const entry: WeightEntry = {
      id: 1,
      date: "2024-01-01",
      weight: "85.5",
      user: 1,
    };
    expect(entry.weight).toBe("85.5");
  });

  it("1.4.7: Routine.name and description are optional", () => {
    const routine: Routine = {
      id: 1,
      created: "2024-01-01",
      start: "2024-01-01",
      end: "2024-12-31",
    };
    expect(routine.name).toBeUndefined();
    expect(routine.description).toBeUndefined();
  });
});

import { describe, it, expect } from "vitest";
import type {
  ExerciseInfo,
  ExerciseImage,
  Muscle,
  Nested,
} from "../Exercise.types.js";

describe("Exercise types", () => {
  it("1.3.1: ExerciseInfo has all required fields", () => {
    const info: ExerciseInfo = {
      id: 1,
      uuid: "abc",
      created: "2024-01-01",
      last_update: "2024-01-01",
      last_update_global: "2024-01-01",
      category: { id: 1, name: "Chest" },
      muscles: [],
      muscles_secondary: [],
      equipment: [],
      license: { id: 1, full_name: "CC-BY", short_name: "CC" },
      images: [],
      translations: [],
      videos: [],
      author_history: [],
      total_authors_history: [],
    };
    expect(info.id).toBe(1);
  });

  it("1.3.2: ExerciseInfo optional fields omitted", () => {
    const info: ExerciseInfo = {
      id: 1,
      uuid: "abc",
      created: "2024-01-01",
      last_update: "2024-01-01",
      last_update_global: "2024-01-01",
      category: { id: 1, name: "Chest" },
      muscles: [],
      muscles_secondary: [],
      equipment: [],
      license: { id: 1, full_name: "CC-BY", short_name: "CC" },
      images: [],
      translations: [],
      videos: [],
      author_history: [],
      total_authors_history: [],
    };
    expect(info.license_author).toBeUndefined();
    expect(info.variation_group).toBeUndefined();
  });

  it("1.3.3: ExerciseImage.author_history is ReadonlyArray<string>", () => {
    const img: ExerciseImage = {
      id: 1,
      uuid: "img-1",
      exercise: 1,
      exercise_uuid: "ex-1",
      image: "http://example.com/img.jpg",
      author_history: ["Alice", "Bob"],
    };
    expect(img.author_history).toEqual(["Alice", "Bob"]);
  });

  it("1.3.4: Nested.url accepts undefined, null, and string", () => {
    const a: Nested = { id: 1, full_name: "A", short_name: "a" };
    const b: Nested = { id: 1, full_name: "A", short_name: "a", url: null };
    const c: Nested = {
      id: 1,
      full_name: "A",
      short_name: "a",
      url: "http://x",
    };
    expect(a.url).toBeUndefined();
    expect(b.url).toBeNull();
    expect(c.url).toBe("http://x");
  });

  it("1.3.5: Muscle.name_en and Muscle.is_front are optional", () => {
    const muscle: Muscle = {
      id: 1,
      name: "Biceps",
      image_url_main: "",
      image_url_secondary: "",
    };
    expect(muscle.name_en).toBeUndefined();
    expect(muscle.is_front).toBeUndefined();
  });
});

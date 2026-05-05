import { describe, it, expect } from "vitest";
import {
  paginatedResponseSchema,
  exerciseInfoResponseSchema,
  routineResponseSchema,
  dayResponseSchema,
  workoutLogResponseSchema,
  nutritionPlanResponseSchema,
  mealResponseSchema,
  ingredientInfoResponseSchema,
} from "../responseSchemas.js";

describe("responseSchemas", () => {
  describe("paginatedResponseSchema", () => {
    it("validates paginated envelope", () => {
      const schema = paginatedResponseSchema(routineResponseSchema);
      const result = schema.parse({
        count: 2,
        next: "https://next",
        previous: null,
        results: [{ id: 1, created: "2024-01-01", start: "2024-01-01", end: "2024-12-31" }],
      });
      expect(result.count).toBe(2);
      expect(result.results[0].id).toBe(1);
    });

    it("rejects negative count", () => {
      const schema = paginatedResponseSchema(routineResponseSchema);
      expect(() =>
        schema.parse({
          count: -1,
          next: null,
          previous: null,
          results: [],
        }),
      ).toThrow();
    });
  });

  describe("exerciseInfoResponseSchema", () => {
    it("validates minimal exercise info", () => {
      const result = exerciseInfoResponseSchema.parse({
        id: 1,
        uuid: "abc",
        created: "2024-01-01",
        last_update: "2024-01-01",
        last_update_global: "2024-01-01",
        category: { id: 1, name: "Chest" },
        muscles: [],
        muscles_secondary: [],
        equipment: [],
        license: { id: 1, full_name: "CC", short_name: "c" },
        images: [],
        translations: [],
        videos: [],
        author_history: [],
        total_authors_history: [],
      });
      expect(result.id).toBe(1);
    });

    it("validates Wger string image styles", () => {
      const result = exerciseInfoResponseSchema.parse({
        id: 1,
        uuid: "abc",
        created: "2024-01-01",
        last_update: "2024-01-01",
        last_update_global: "2024-01-01",
        category: { id: 1, name: "Chest" },
        muscles: [],
        muscles_secondary: [],
        equipment: [],
        license: { id: 1, full_name: "CC", short_name: "c" },
        images: [
          {
            id: 1,
            uuid: "image-uuid",
            exercise: 1,
            exercise_uuid: "exercise-uuid",
            image: "https://example.com/image.png",
            style: "4",
            author_history: [],
          },
        ],
        translations: [],
        videos: [],
        author_history: [],
        total_authors_history: [],
      });
      expect(result.images[0].style).toBe("4");
    });
  });

  describe("dayResponseSchema", () => {
    it("validates day with config", () => {
      const result = dayResponseSchema.parse({
        id: 1,
        routine: 1,
        order: 0,
        name: "Day 1",
        config: { sets: 3 },
      });
      expect(result.config).toEqual({ sets: 3 });
    });

    it("validates day with null config", () => {
      const result = dayResponseSchema.parse({
        id: 1,
        routine: 1,
        order: 0,
        config: null,
      });
      expect(result.config).toBeNull();
    });
  });

  describe("workoutLogResponseSchema", () => {
    it("validates minimal workout log", () => {
      const result = workoutLogResponseSchema.parse({
        id: 1,
        date: "2024-01-01",
        session: 1,
        exercise: 1,
      });
      expect(result.exercise).toBe(1);
    });

    it("validates nullable fields", () => {
      const result = workoutLogResponseSchema.parse({
        id: 1,
        date: "2024-01-01",
        session: 1,
        exercise: 1,
        routine: null,
        iteration: null,
        rest: null,
        rest_target: null,
      });
      expect(result.routine).toBeNull();
    });
  });

  describe("nutritionPlanResponseSchema", () => {
    it("validates with null goals", () => {
      const result = nutritionPlanResponseSchema.parse({
        id: 1,
        creation_date: "2024-01-01",
        goal_energy: null,
        goal_protein: null,
      });
      expect(result.goal_energy).toBeNull();
    });
  });

  describe("mealResponseSchema", () => {
    it("validates with null time", () => {
      const result = mealResponseSchema.parse({
        id: 1,
        plan: 1,
        order: 0,
        time: null,
      });
      expect(result.time).toBeNull();
    });
  });

  describe("ingredientInfoResponseSchema", () => {
    it("validates ingredient info with nullable media and compact weight units", () => {
      const result = ingredientInfoResponseSchema.parse({
        id: 1,
        uuid: "ingredient-uuid",
        name: "Apple",
        created: "2024-01-01T00:00:00Z",
        last_update: "2024-01-01T00:00:00Z",
        last_imported: null,
        energy: 52,
        protein: "0.3",
        carbohydrates: "14.0",
        fat: "0.2",
        weight_units: [
          {
            id: 1,
            uuid: "weight-unit-uuid",
            gram: 100,
            name: "100 g",
          },
        ],
        language: { id: 1, full_name: "English", short_name: "en" },
        license: { id: 1, full_name: "CC", short_name: "cc" },
        image: null,
        thumbnails: null,
      });
      expect(result.image).toBeNull();
      expect(result.thumbnails).toBeNull();
      expect(result.weight_units[0].name).toBe("100 g");
    });
  });
});

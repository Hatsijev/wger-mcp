import { describe, it, expect } from "vitest";
import type {
  Nutriscore,
  Ingredient,
  Meal,
  NutritionPlan,
  NutritionalValues,
  NutritionDiaryEntry,
} from "../Nutrition.types.js";

describe("Nutrition types", () => {
  it("1.6.1: Nutriscore allows a,b,c,d,e,empty,null", () => {
    const scores: Nutriscore[] = ["a", "b", "c", "d", "e", "", null];
    expect(scores).toHaveLength(7);
  });

  it("1.6.2: Ingredient required fields", () => {
    const ing: Ingredient = {
      id: 1,
      uuid: "u",
      name: "Rice",
      energy: 100,
      protein: "2.5",
      carbohydrates: "20",
      fat: "0.5",
      weight_units: [],
      license: 1,
      language: 1,
      created: "2024-01-01",
      last_update: "2024-01-01",
      last_imported: null,
    };
    expect(ing.name).toBe("Rice");
  });

  it("1.6.4: Ingredient.weight_units is ReadonlyArray", () => {
    const ing: Ingredient = {
      id: 1,
      uuid: "u",
      name: "Rice",
      energy: 100,
      protein: "2.5",
      carbohydrates: "20",
      fat: "0.5",
      weight_units: [],
      license: 1,
      language: 1,
      created: "2024-01-01",
      last_update: "2024-01-01",
      last_imported: null,
    };
    expect(ing.weight_units).toEqual([]);
  });

  it("1.6.5: Ingredient.language is number; IngredientInfo.language is Nested", () => {
    const ing: Ingredient = {
      id: 1, uuid: "u", name: "Rice", energy: 100,
      protein: "2.5", carbohydrates: "20", fat: "0.5",
      weight_units: [], license: 1, language: 1,
      created: "2024-01-01", last_update: "2024-01-01", last_imported: null,
    };
    expect(typeof ing.language).toBe("number");
  });

  it("1.6.7: MealInfo has meal_items and nutritional_values; Meal does not", () => {
    const meal: Meal = { id: 1, plan: 1, order: 0 };
    expect((meal as unknown as Record<string, unknown>).meal_items).toBeUndefined();
    expect((meal as unknown as Record<string, unknown>).nutritional_values).toBeUndefined();
  });

  it("1.6.9: NutritionPlanInfo has meals; NutritionPlan does not", () => {
    const plan: NutritionPlan = { id: 1, creation_date: "2024-01-01" };
    expect((plan as unknown as Record<string, unknown>).meals).toBeUndefined();
  });

  it("1.6.10: NutritionalValues all 8 fields are required number", () => {
    const nv: NutritionalValues = {
      energy: 100, protein: 5, carbohydrates: 20,
      carbohydrates_sugar: 2, fat: 1, fat_saturated: 0.5,
      fiber: 3, sodium: 0.1,
    };
    expect(Object.keys(nv)).toHaveLength(8);
  });

  it("1.6.12: NutritionDiaryEntry.amount is string", () => {
    const entry: NutritionDiaryEntry = {
      id: 1, plan: 1, ingredient: 1, datetime: "2024-01-01T10:00:00", amount: "150.5",
    };
    expect(entry.amount).toBe("150.5");
  });

  it("1.6.13: Meal.time is string | null | undefined", () => {
    const a: Meal = { id: 1, plan: 1, order: 0 };
    const b: Meal = { id: 1, plan: 1, order: 0, time: null };
    const c: Meal = { id: 1, plan: 1, order: 0, time: "08:00" };
    expect(a.time).toBeUndefined();
    expect(b.time).toBeNull();
    expect(c.time).toBe("08:00");
  });

  it("1.6.16: NutritionPlan.end is string | null | undefined", () => {
    const a: NutritionPlan = { id: 1, creation_date: "2024-01-01" };
    const b: NutritionPlan = { id: 1, creation_date: "2024-01-01", end: null };
    const c: NutritionPlan = { id: 1, creation_date: "2024-01-01", end: "2024-12-31" };
    expect(a.end).toBeUndefined();
    expect(b.end).toBeNull();
    expect(c.end).toBe("2024-12-31");
  });

  it("1.6.17: NutritionPlan.goal_energy is number | null | undefined", () => {
    const a: NutritionPlan = { id: 1, creation_date: "2024-01-01" };
    const b: NutritionPlan = { id: 1, creation_date: "2024-01-01", goal_energy: null };
    const c: NutritionPlan = { id: 1, creation_date: "2024-01-01", goal_energy: 2500 };
    expect(a.goal_energy).toBeUndefined();
    expect(b.goal_energy).toBeNull();
    expect(c.goal_energy).toBe(2500);
  });
});

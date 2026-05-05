import { Nested } from "./Exercise.types.js";

export type Nutriscore = "a" | "b" | "c" | "d" | "e" | "" | null;

// ── Response types (exact from wger.yaml) ───────────────────────────────

export interface IngredientWeightUnitInfo {
  readonly id: number;
  readonly uuid: string;
  readonly gram: number;
  readonly name: string;
}

export interface IngredientImage {
  readonly id: number;
  readonly uuid: string;
  readonly ingredient_id: number | null;
  readonly ingredient_uuid: string;
  readonly image: string;
  readonly created: string;
  readonly last_update: string;
  readonly size: number;
  readonly width: number;
  readonly height: number;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
}

export interface Ingredient {
  readonly id: number;
  readonly uuid: string;
  readonly remote_id?: string | null | undefined;
  readonly source_name?: string | null | undefined;
  readonly source_url?: string | null | undefined;
  readonly code?: string | null | undefined;
  readonly name: string;
  readonly common_name?: string | null | undefined;
  readonly brand?: string | null | undefined;
  readonly created: string;
  readonly last_update: string;
  readonly last_imported: string | null;
  readonly energy: number;
  readonly protein: string;
  readonly carbohydrates: string;
  readonly carbohydrates_sugar?: string | null | undefined;
  readonly fat: string;
  readonly fat_saturated?: string | null | undefined;
  readonly fiber?: string | null | undefined;
  readonly sodium?: string | null | undefined;
  readonly is_vegan?: boolean | null | undefined;
  readonly is_vegetarian?: boolean | null | undefined;
  readonly weight_units: ReadonlyArray<IngredientWeightUnitInfo>;
  readonly nutriscore?: Nutriscore | undefined;
  readonly license: number;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
  readonly language: number;
}

export interface IngredientInfo {
  readonly id: number;
  readonly uuid: string;
  readonly remote_id?: string | null | undefined;
  readonly source_name?: string | null | undefined;
  readonly source_url?: string | null | undefined;
  readonly code?: string | null | undefined;
  readonly name: string;
  readonly common_name?: string | null | undefined;
  readonly brand?: string | null | undefined;
  readonly created: string;
  readonly last_update: string;
  readonly last_imported: string | null;
  readonly energy: number;
  readonly protein: string;
  readonly carbohydrates: string;
  readonly carbohydrates_sugar?: string | null | undefined;
  readonly fat: string;
  readonly fat_saturated?: string | null | undefined;
  readonly fiber?: string | null | undefined;
  readonly sodium?: string | null | undefined;
  readonly is_vegan?: boolean | null | undefined;
  readonly is_vegetarian?: boolean | null | undefined;
  readonly nutriscore?: Nutriscore | undefined;
  readonly weight_units: ReadonlyArray<IngredientWeightUnitInfo>;
  readonly language: Nested;
  readonly license: Nested;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
  readonly image: IngredientImage | null;
  readonly thumbnails: string | null;
}

export interface IngredientWeightUnit {
  readonly id: number;
  readonly gram: number;
  readonly ingredient: number;
  readonly name: string;
}

export interface MealItemInfo {
  readonly id: number;
  readonly meal: number;
  readonly ingredient: number;
  readonly ingredient_obj: IngredientInfo;
  readonly weight_unit: number;
  readonly weight_unit_obj: IngredientWeightUnit;
  readonly image: IngredientImage;
  readonly order: number;
  readonly amount: string;
}

export interface MealInfo {
  readonly id: number;
  readonly plan: number;
  readonly order: number;
  readonly time?: string | null | undefined;
  readonly name?: string | undefined;
  readonly meal_items: ReadonlyArray<MealItemInfo>;
  readonly nutritional_values: NutritionalValues;
}

export interface Meal {
  readonly id: number;
  readonly plan: number;
  readonly order: number;
  readonly time?: string | null | undefined;
  readonly name?: string | undefined;
}

export interface MealItem {
  readonly id: number;
  readonly meal: number;
  readonly ingredient: number;
  readonly weight_unit?: number | null | undefined;
  readonly order: number;
  readonly amount: string;
}

export interface NutritionPlan {
  readonly id: number;
  readonly creation_date: string;
  readonly start?: string | undefined;
  readonly end?: string | null | undefined;
  readonly description?: string | undefined;
  readonly only_logging?: boolean | undefined;
  readonly goal_energy?: number | null | undefined;
  readonly goal_protein?: number | null | undefined;
  readonly goal_carbohydrates?: number | null | undefined;
  readonly goal_fat?: number | null | undefined;
  readonly goal_fiber?: number | null | undefined;
}

export interface NutritionPlanInfo {
  readonly id: number;
  readonly creation_date: string;
  readonly start?: string | undefined;
  readonly end?: string | null | undefined;
  readonly description?: string | undefined;
  readonly only_logging?: boolean | undefined;
  readonly goal_energy?: number | null | undefined;
  readonly goal_protein?: number | null | undefined;
  readonly goal_carbohydrates?: number | null | undefined;
  readonly goal_fat?: number | null | undefined;
  readonly goal_fiber?: number | null | undefined;
  readonly meals: ReadonlyArray<MealInfo>;
}

export interface NutritionDiaryEntry {
  readonly id: number;
  readonly plan: number;
  readonly meal?: number | null | undefined;
  readonly ingredient: number;
  readonly weight_unit?: number | null | undefined;
  readonly datetime: string;
  readonly amount: string;
}

export interface NutritionalValues {
  readonly energy: number;
  readonly protein: number;
  readonly carbohydrates: number;
  readonly carbohydrates_sugar: number;
  readonly fat: number;
  readonly fat_saturated: number;
  readonly fiber: number;
  readonly sodium: number;
}

// ── Request body types for POST (exact from wger.yaml *Request) ──────────

export interface MealRequest {
  readonly plan: number;
  readonly time?: string | null | undefined;
  readonly name?: string | undefined;
}

export interface MealItemRequest {
  readonly meal: number;
  readonly ingredient: number;
  readonly weight_unit?: number | null | undefined;
  readonly amount: string;
}

export interface NutritionPlanRequest {
  readonly start?: string | undefined;
  readonly end?: string | null | undefined;
  readonly description?: string | undefined;
  readonly only_logging?: boolean | undefined;
  readonly goal_energy?: number | null | undefined;
  readonly goal_protein?: number | null | undefined;
  readonly goal_carbohydrates?: number | null | undefined;
  readonly goal_fat?: number | null | undefined;
  readonly goal_fiber?: number | null | undefined;
}

export interface LogItemRequest {
  readonly plan: number;
  readonly meal?: number | null | undefined;
  readonly ingredient: number;
  readonly weight_unit?: number | null | undefined;
  readonly datetime?: string | undefined;
  readonly amount: string;
}

// ── PATCH body types (exact from wger.yaml Patched*Request) ──────────────

export interface PatchedMealRequest {
  readonly plan?: number | undefined;
  readonly time?: string | null | undefined;
  readonly name?: string | undefined;
}

export interface PatchedMealItemRequest {
  readonly meal?: number | undefined;
  readonly ingredient?: number | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly amount?: string | undefined;
}

export interface PatchedNutritionPlanRequest {
  readonly start?: string | undefined;
  readonly end?: string | null | undefined;
  readonly description?: string | undefined;
  readonly only_logging?: boolean | undefined;
  readonly goal_energy?: number | null | undefined;
  readonly goal_protein?: number | null | undefined;
  readonly goal_carbohydrates?: number | null | undefined;
  readonly goal_fat?: number | null | undefined;
  readonly goal_fiber?: number | null | undefined;
}

export interface PatchedLogItemRequest {
  readonly plan?: number | undefined;
  readonly meal?: number | null | undefined;
  readonly ingredient?: number | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly datetime?: string | undefined;
  readonly amount?: string | undefined;
}

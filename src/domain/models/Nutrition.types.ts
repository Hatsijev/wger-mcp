import { Nested } from "./Exercise.types.js";

export type Nutriscore = "a" | "b" | "c" | "d" | "e" | "" | null;

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
  readonly license?: number;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
}

export interface Ingredient {
  readonly id: number;
  readonly uuid: string;
  readonly remote_id?: string | null;
  readonly source_name?: string | null;
  readonly source_url?: string | null;
  readonly code?: string | null;
  readonly name: string;
  readonly common_name?: string | null;
  readonly brand?: string | null;
  readonly created: string;
  readonly last_update: string;
  readonly last_imported: string | null;
  readonly energy: number;
  readonly protein: string;
  readonly carbohydrates: string;
  readonly carbohydrates_sugar?: string | null;
  readonly fat: string;
  readonly fat_saturated?: string | null;
  readonly fiber?: string | null;
  readonly sodium?: string | null;
  readonly is_vegan?: boolean | null;
  readonly is_vegetarian?: boolean | null;
  readonly weight_units: ReadonlyArray<IngredientWeightUnitInfo>;
  readonly nutriscore?: Nutriscore;
  readonly license: number;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
  readonly language: number;
}

export interface IngredientInfo {
  readonly id: number;
  readonly uuid: string;
  readonly remote_id?: string | null;
  readonly source_name?: string | null;
  readonly source_url?: string | null;
  readonly code?: string | null;
  readonly name: string;
  readonly common_name?: string | null;
  readonly brand?: string | null;
  readonly created: string;
  readonly last_update: string;
  readonly last_imported: string | null;
  readonly energy: number;
  readonly protein: string;
  readonly carbohydrates: string;
  readonly carbohydrates_sugar?: string | null;
  readonly fat: string;
  readonly fat_saturated?: string | null;
  readonly fiber?: string | null;
  readonly sodium?: string | null;
  readonly is_vegan?: boolean | null;
  readonly is_vegetarian?: boolean | null;
  readonly nutriscore?: Nutriscore;
  readonly weight_units: ReadonlyArray<IngredientWeightUnitInfo>;
  readonly language: Nested;
  readonly license: Nested;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
  readonly image: IngredientImage;
  readonly thumbnails: string;
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
  readonly time?: string | null;
  readonly name?: string;
  readonly meal_items: ReadonlyArray<MealItemInfo>;
  readonly nutritional_values: NutritionalValues;
}

export interface Meal {
  readonly id: number;
  readonly plan: number;
  readonly order: number;
  readonly time?: string | null;
  readonly name?: string;
}

export interface MealItem {
  readonly id: number;
  readonly meal: number;
  readonly ingredient: number;
  readonly weight_unit?: number | null;
  readonly order: number;
  readonly amount: string;
}

export interface NutritionPlan {
  readonly id: number;
  readonly creation_date: string;
  readonly start?: string;
  readonly end?: string | null;
  readonly description?: string;
  readonly only_logging?: boolean;
  readonly goal_energy?: number | null;
  readonly goal_protein?: number | null;
  readonly goal_carbohydrates?: number | null;
  readonly goal_fat?: number | null;
  readonly goal_fiber?: number | null;
}

export interface NutritionPlanInfo {
  readonly id: number;
  readonly creation_date: string;
  readonly start?: string;
  readonly end?: string | null;
  readonly description?: string;
  readonly only_logging?: boolean;
  readonly goal_energy?: number | null;
  readonly goal_protein?: number | null;
  readonly goal_carbohydrates?: number | null;
  readonly goal_fat?: number | null;
  readonly goal_fiber?: number | null;
  readonly meals: ReadonlyArray<MealInfo>;
}

export interface NutritionDiaryEntry {
  readonly id: number;
  readonly plan: number;
  readonly meal?: number | null;
  readonly ingredient: number;
  readonly weight_unit?: number | null;
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

import { z } from "zod";
import { jsonValueSchema } from "./sharedSchemas.js";
import { Config } from "../../domain/models/Routine.types.js";

// Boundary: Config is intentionally an open-ended JSON object in the domain model,
// but Wger returns arbitrary JSON-compatible values for config fields.
// This assertion bridges the runtime JSON validation to the compile-time Config type.
const configResponseSchema = jsonValueSchema as z.ZodType<Config>;

export const wgerStatusResponseSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
});

export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    count: z.number().int().min(0),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });
}

export const exerciseCategoryResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const muscleResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  name_en: z.string().optional(),
  is_front: z.boolean().optional(),
  image_url_main: z.string(),
  image_url_secondary: z.string(),
});

export const equipmentResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const nestedResponseSchema = z.object({
  id: z.number().int(),
  full_name: z.string(),
  short_name: z.string(),
  url: z.string().nullable().optional(),
});

export const exerciseImageResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  exercise: z.number().int(),
  exercise_uuid: z.string(),
  image: z.string(),
  is_main: z.boolean().optional(),
  style: z.enum(["1", "2", "3", "4", "5"]).optional(),
  license: z.number().int().optional(),
  license_title: z.string().optional(),
  license_object_url: z.string().optional(),
  license_author: z.string().nullable().optional(),
  license_author_url: z.string().optional(),
  license_derivative_source_url: z.string().optional(),
  author_history: z.array(z.string()),
  is_ai_generated: z.boolean().optional(),
});

export const exerciseVideoResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  exercise: z.number().int(),
  video: z.string(),
  is_main: z.boolean().optional(),
  size: z.number().int(),
  duration: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  codec: z.string(),
  codec_long: z.string(),
  license: z.number().int().optional(),
  license_title: z.string().optional(),
  license_object_url: z.string().optional(),
  license_author: z.string().nullable().optional(),
  license_author_url: z.string().optional(),
  license_derivative_source_url: z.string().optional(),
  author_history: z.array(z.string()),
});

export const exerciseAliasResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  alias: z.string(),
});

export const exerciseCommentResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  translation: z.number().int(),
  comment: z.string(),
});

export const exerciseTranslationResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  name: z.string(),
  exercise: z.number().int(),
  description: z.string(),
  created: z.string(),
  language: z.number().int(),
  aliases: z.array(exerciseAliasResponseSchema),
  notes: z.array(exerciseCommentResponseSchema),
  license: z.number().int().optional(),
  license_title: z.string().optional(),
  license_object_url: z.string().optional(),
  license_author: z.string().nullable().optional(),
  license_author_url: z.string().optional(),
  license_derivative_source_url: z.string().optional(),
  author_history: z.array(z.string()),
});

export const exerciseInfoResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  created: z.string(),
  last_update: z.string(),
  last_update_global: z.string(),
  category: exerciseCategoryResponseSchema,
  muscles: z.array(muscleResponseSchema),
  muscles_secondary: z.array(muscleResponseSchema),
  equipment: z.array(equipmentResponseSchema),
  license: nestedResponseSchema,
  license_author: z.string().nullable().optional(),
  images: z.array(exerciseImageResponseSchema),
  translations: z.array(exerciseTranslationResponseSchema),
  variation_group: z.string().nullable().optional(),
  videos: z.array(exerciseVideoResponseSchema),
  author_history: z.array(z.string()),
  total_authors_history: z.array(z.string()),
});

export const routineResponseSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  description: z.string().optional(),
  created: z.string(),
  start: z.string(),
  end: z.string(),
  fit_in_week: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

export const dayResponseSchema = z.object({
  id: z.number().int(),
  routine: z.number().int(),
  order: z.number().int(),
  name: z.string().optional(),
  description: z.string().optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: configResponseSchema.nullable().optional(),
});

export const slotResponseSchema = z.object({
  id: z.number().int(),
  day: z.number().int(),
  order: z.number().int(),
  comment: z.string().optional(),
  config: configResponseSchema.nullable().optional(),
});

export const slotEntryResponseSchema = z.object({
  id: z.number().int(),
  slot: z.number().int(),
  exercise: z.number().int(),
  type: z
    .enum([
      "normal",
      "warmup",
      "dropset",
      "myo",
      "partial",
      "forced",
      "tut",
      "iso",
      "jump",
    ])
    .optional(),
  repetition_unit: z.number().int().nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: z.number().int().nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().int(),
  comment: z.string().optional(),
  config: configResponseSchema.nullable().optional(),
});

export const workoutLogResponseSchema = z.object({
  id: z.number().int(),
  date: z.string(),
  session: z.number().int(),
  routine: z.number().int().nullable().optional(),
  iteration: z.number().int().nullable().optional(),
  slot_entry: z.number().int().nullable().optional(),
  next_log: z.number().int().nullable().optional(),
  exercise: z.number().int(),
  repetitions_unit: z.number().int().nullable().optional(),
  repetitions: z.string().nullable().optional(),
  repetitions_target: z.string().nullable().optional(),
  weight_unit: z.number().int().nullable().optional(),
  weight: z.string().nullable().optional(),
  weight_target: z.string().nullable().optional(),
  rir: z.string().nullable().optional(),
  rir_target: z.string().nullable().optional(),
  rest: z.number().int().nullable().optional(),
  rest_target: z.number().int().nullable().optional(),
});

export const workoutSessionResponseSchema = z.object({
  id: z.number().int(),
  routine: z.number().int().nullable().optional(),
  day: z.number().int().nullable().optional(),
  date: z.string(),
  notes: z.string().nullable().optional(),
  impression: z.enum(["1", "2", "3"]).optional(),
  time_start: z.string().nullable().optional(),
  time_end: z.string().nullable().optional(),
});

export const weightEntryResponseSchema = z.object({
  id: z.number().int(),
  date: z.string(),
  weight: z.string(),
  user: z.number().int(),
});

export const galleryImageResponseSchema = z.object({
  id: z.number().int(),
  date: z.string(),
  image: z.string(),
  description: z.string().optional(),
  height: z.number().int(),
  width: z.number().int(),
});

export const nutritionPlanResponseSchema = z.object({
  id: z.number().int(),
  creation_date: z.string(),
  start: z.string().optional(),
  end: z.string().nullable().optional(),
  description: z.string().optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z.number().int().nullable().optional(),
  goal_protein: z.number().int().nullable().optional(),
  goal_carbohydrates: z.number().int().nullable().optional(),
  goal_fat: z.number().int().nullable().optional(),
  goal_fiber: z.number().int().nullable().optional(),
});

export const nutritionDiaryEntryResponseSchema = z.object({
  id: z.number().int(),
  plan: z.number().int(),
  meal: z.number().int().nullable().optional(),
  ingredient: z.number().int(),
  weight_unit: z.number().int().nullable().optional(),
  datetime: z.string(),
  amount: z.string(),
});

export const mealResponseSchema = z.object({
  id: z.number().int(),
  plan: z.number().int(),
  order: z.number().int(),
  time: z.string().nullable().optional(),
  name: z.string().optional(),
});

export const mealItemResponseSchema = z.object({
  id: z.number().int(),
  meal: z.number().int(),
  ingredient: z.number().int(),
  weight_unit: z.number().int().nullable().optional(),
  order: z.number().int(),
  amount: z.string(),
});

export const ingredientWeightUnitResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  gram: z.number(),
  ingredient: z.number().int(),
  name: z.string(),
});

export const ingredientWeightUnitInfoResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  gram: z.number(),
  name: z.string(),
});

export const ingredientImageResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  ingredient_id: z.number().int().nullable(),
  ingredient_uuid: z.string(),
  image: z.string(),
  created: z.string(),
  last_update: z.string(),
  size: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
});

export const nutritionalValuesResponseSchema = z.object({
  energy: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  carbohydrates_sugar: z.number(),
  fat: z.number(),
  fat_saturated: z.number(),
  fiber: z.number(),
  sodium: z.number(),
});

export const ingredientInfoResponseSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  name: z.string(),
  created: z.string(),
  last_update: z.string(),
  last_imported: z.string().nullable(),
  energy: z.number(),
  protein: z.string(),
  carbohydrates: z.string(),
  fat: z.string(),
  weight_units: z.array(ingredientWeightUnitInfoResponseSchema),
  language: nestedResponseSchema,
  license: nestedResponseSchema,
  image: ingredientImageResponseSchema.nullable(),
  thumbnails: z.string().nullable(),
});

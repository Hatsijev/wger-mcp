import { z } from "zod";

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
  config: z.any().nullable().optional(),
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

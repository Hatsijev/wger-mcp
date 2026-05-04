import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import {
  Routine,
  Day,
  Slot,
  SlotEntry,
  WorkoutLog,
  WorkoutSession,
  WeightEntry,
  GalleryImage,
} from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  timeStringSchema,
  decimalAmountSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";
import { runTool, successResult } from "../toolResult.js";

const listRoutinesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const getRoutineSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getRoutineStructureSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getRoutineLogsSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getRoutineStatsSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getRoutineDateSequenceDisplaySchema = z.object({
  id: positiveIntegerIdSchema,
});

const getRoutineDateSequenceGymSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listDaysSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  routine: positiveIntegerIdSchema.optional(),
});

const getDaySchema = z.object({
  id: positiveIntegerIdSchema,
});

const listSlotsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  day: positiveIntegerIdSchema.optional(),
});

const getSlotSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listSlotEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  slot: positiveIntegerIdSchema.optional(),
});

const getSlotEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const listWorkoutLogsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  routine: positiveIntegerIdSchema.optional(),
  date: isoDateStringSchema.optional(),
});

const getWorkoutLogSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listWorkoutSessionsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  date: isoDateStringSchema.optional(),
});

const getWorkoutSessionSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listWeightEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  date__gt: isoDateStringSchema.optional(),
  date__gte: isoDateStringSchema.optional(),
});

const getWeightEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const listGalleryImagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const getGalleryImageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createRoutineSchema = z.object({
  name: boundedStringSchema(25).optional(),
  description: boundedStringSchema(1000).optional(),
  start: isoDateStringSchema,
  end: isoDateStringSchema,
  fit_in_week: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

const updateRoutineSchema = z.object({
  id: positiveIntegerIdSchema,
  name: boundedStringSchema(25).optional(),
  description: boundedStringSchema(1000).optional(),
  start: isoDateStringSchema.optional(),
  end: isoDateStringSchema.optional(),
  fit_in_week: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

const createDaySchema = z.object({
  routine: positiveIntegerIdSchema,
  order: z.number().optional(),
  name: boundedStringSchema(20).optional(),
  description: boundedStringSchema(1000).optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: jsonConfigSchema,
});

const updateDaySchema = z.object({
  id: positiveIntegerIdSchema,
  routine: positiveIntegerIdSchema.optional(),
  order: z.number().optional(),
  name: boundedStringSchema(20).optional(),
  description: boundedStringSchema(1000).optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: jsonConfigSchema,
});

const createSlotSchema = z.object({
  day: positiveIntegerIdSchema,
  order: z.number().optional(),
  comment: boundedStringSchema(200).optional(),
  config: jsonConfigSchema,
});

const updateSlotSchema = z.object({
  id: positiveIntegerIdSchema,
  day: positiveIntegerIdSchema.optional(),
  order: z.number().optional(),
  comment: boundedStringSchema(200).optional(),
  config: jsonConfigSchema,
});

const createSlotEntrySchema = z.object({
  slot: positiveIntegerIdSchema,
  exercise: positiveIntegerIdSchema,
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
  repetition_unit: positiveIntegerIdSchema.nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().optional(),
  comment: boundedStringSchema(100).optional(),
  config: jsonConfigSchema,
});

const updateSlotEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  slot: positiveIntegerIdSchema.optional(),
  exercise: positiveIntegerIdSchema.optional(),
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
  repetition_unit: positiveIntegerIdSchema.nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().optional(),
  comment: boundedStringSchema(100).optional(),
  config: jsonConfigSchema,
});

const createWorkoutLogSchema = z.object({
  date: isoDateStringSchema.optional(),
  routine: positiveIntegerIdSchema.nullable().optional(),
  iteration: z.number().nullable().optional(),
  slot_entry: positiveIntegerIdSchema.nullable().optional(),
  next_log: positiveIntegerIdSchema.nullable().optional(),
  exercise: positiveIntegerIdSchema,
  repetitions_unit: positiveIntegerIdSchema.nullable().optional(),
  repetitions: decimalAmountSchema.nullable().optional(),
  repetitions_target: decimalAmountSchema.nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight: decimalAmountSchema.nullable().optional(),
  weight_target: decimalAmountSchema.nullable().optional(),
  rir: decimalAmountSchema.nullable().optional(),
  rir_target: decimalAmountSchema.nullable().optional(),
  rest: z.number().nullable().optional(),
  rest_target: z.number().nullable().optional(),
});

const updateWorkoutLogSchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  routine: positiveIntegerIdSchema.nullable().optional(),
  iteration: z.number().nullable().optional(),
  slot_entry: positiveIntegerIdSchema.nullable().optional(),
  next_log: positiveIntegerIdSchema.nullable().optional(),
  exercise: positiveIntegerIdSchema.optional(),
  repetitions_unit: positiveIntegerIdSchema.nullable().optional(),
  repetitions: decimalAmountSchema.nullable().optional(),
  repetitions_target: decimalAmountSchema.nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight: decimalAmountSchema.nullable().optional(),
  weight_target: decimalAmountSchema.nullable().optional(),
  rir: decimalAmountSchema.nullable().optional(),
  rir_target: decimalAmountSchema.nullable().optional(),
  rest: z.number().nullable().optional(),
  rest_target: z.number().nullable().optional(),
});

const createWorkoutSessionSchema = z.object({
  routine: positiveIntegerIdSchema.nullable().optional(),
  day: positiveIntegerIdSchema.nullable().optional(),
  date: isoDateStringSchema.optional(),
  notes: z.string().nullable().optional(),
  impression: z.enum(["1", "2", "3"]).optional(),
  time_start: timeStringSchema.nullable().optional(),
  time_end: timeStringSchema.nullable().optional(),
});

const updateWorkoutSessionSchema = z.object({
  id: positiveIntegerIdSchema,
  routine: positiveIntegerIdSchema.nullable().optional(),
  day: positiveIntegerIdSchema.nullable().optional(),
  date: isoDateStringSchema.optional(),
  notes: z.string().nullable().optional(),
  impression: z.enum(["1", "2", "3"]).optional(),
  time_start: timeStringSchema.nullable().optional(),
  time_end: timeStringSchema.nullable().optional(),
});

const createWeightEntrySchema = z.object({
  date: isoDateStringSchema,
  weight: decimalAmountSchema,
});

const updateWeightEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  weight: decimalAmountSchema.optional(),
});

const createGalleryImageSchema = z.object({
  date: isoDateStringSchema,
  image: z.string(),
  description: boundedStringSchema(1000).optional(),
});

const updateGalleryImageSchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  image: z.string().optional(),
  description: boundedStringSchema(1000).optional(),
});

function toJsonBody(obj: Record<string, JsonValue | undefined>): JsonValue {
  const result: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value as JsonValue;
    }
  }
  return result;
}

export function registerRoutineTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_routines",
    {
      description: "List routines",
      inputSchema: listRoutinesSchema,
    },
    async (args) =>
      runTool(logger, "list_routines", async () => {
        const data = await client.get<WgerPaginatedResponse<Routine>>(
          "/api/v2/routine/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine",
    {
      description: "Get routine by ID",
      inputSchema: getRoutineSchema,
    },
    async (args) =>
      runTool(logger, "get_routine", async () => {
        const data = await client.get<Routine>(`/api/v2/routine/${args.id}/`);
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_days",
    {
      description: "List routine days",
      inputSchema: listDaysSchema,
    },
    async (args) =>
      runTool(logger, "list_days", async () => {
        const data = await client.get<WgerPaginatedResponse<Day>>(
          "/api/v2/day/",
          {
            limit: args.limit,
            offset: args.offset,
            routine: args.routine,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_day",
    {
      description: "Get day by ID",
      inputSchema: getDaySchema,
    },
    async (args) =>
      runTool(logger, "get_day", async () => {
        const data = await client.get<Day>(`/api/v2/day/${args.id}/`);
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_slots",
    {
      description: "List slots",
      inputSchema: listSlotsSchema,
    },
    async (args) =>
      runTool(logger, "list_slots", async () => {
        const data = await client.get<WgerPaginatedResponse<Slot>>(
          "/api/v2/slot/",
          {
            limit: args.limit,
            offset: args.offset,
            day: args.day,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_slot",
    {
      description: "Get slot by ID",
      inputSchema: getSlotSchema,
    },
    async (args) =>
      runTool(logger, "get_slot", async () => {
        const data = await client.get<Slot>(`/api/v2/slot/${args.id}/`);
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_slot_entries",
    {
      description: "List slot entries",
      inputSchema: listSlotEntriesSchema,
    },
    async (args) =>
      runTool(logger, "list_slot_entries", async () => {
        const data = await client.get<WgerPaginatedResponse<SlotEntry>>(
          "/api/v2/slot-entry/",
          {
            limit: args.limit,
            offset: args.offset,
            slot: args.slot,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_slot_entry",
    {
      description: "Get slot entry by ID",
      inputSchema: getSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "get_slot_entry", async () => {
        const data = await client.get<SlotEntry>(
          `/api/v2/slot-entry/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_workout_logs",
    {
      description: "List workout logs",
      inputSchema: listWorkoutLogsSchema,
    },
    async (args) =>
      runTool(logger, "list_workout_logs", async () => {
        const data = await client.get<WgerPaginatedResponse<WorkoutLog>>(
          "/api/v2/workoutlog/",
          {
            limit: args.limit,
            offset: args.offset,
            routine: args.routine,
            date: args.date,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_workout_log",
    {
      description: "Get workout log by ID",
      inputSchema: getWorkoutLogSchema,
    },
    async (args) =>
      runTool(logger, "get_workout_log", async () => {
        const data = await client.get<WorkoutLog>(
          `/api/v2/workoutlog/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_workout_sessions",
    {
      description: "List workout sessions",
      inputSchema: listWorkoutSessionsSchema,
    },
    async (args) =>
      runTool(logger, "list_workout_sessions", async () => {
        const data = await client.get<WgerPaginatedResponse<WorkoutSession>>(
          "/api/v2/workoutsession/",
          {
            limit: args.limit,
            offset: args.offset,
            date: args.date,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_workout_session",
    {
      description: "Get workout session by ID",
      inputSchema: getWorkoutSessionSchema,
    },
    async (args) =>
      runTool(logger, "get_workout_session", async () => {
        const data = await client.get<WorkoutSession>(
          `/api/v2/workoutsession/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_weight_entries",
    {
      description: "List weight entries",
      inputSchema: listWeightEntriesSchema,
    },
    async (args) =>
      runTool(logger, "list_weight_entries", async () => {
        const data = await client.get<WgerPaginatedResponse<WeightEntry>>(
          "/api/v2/weightentry/",
          {
            limit: args.limit,
            offset: args.offset,
            date__gt: args.date__gt,
            date__gte: args.date__gte,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_weight_entry",
    {
      description: "Get weight entry by ID",
      inputSchema: getWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "get_weight_entry", async () => {
        const data = await client.get<WeightEntry>(
          `/api/v2/weightentry/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_gallery_images",
    {
      description: "List gallery images",
      inputSchema: listGalleryImagesSchema,
    },
    async (args) =>
      runTool(logger, "list_gallery_images", async () => {
        const data = await client.get<WgerPaginatedResponse<GalleryImage>>(
          "/api/v2/gallery/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_gallery_image",
    {
      description: "Get gallery image by ID",
      inputSchema: getGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "get_gallery_image", async () => {
        const data = await client.get<GalleryImage>(
          `/api/v2/gallery/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine_structure",
    {
      description: "Get routine structure",
      inputSchema: getRoutineStructureSchema,
    },
    async (args) =>
      runTool(logger, "get_routine_structure", async () => {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/structure/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine_logs",
    {
      description: "Get routine logs",
      inputSchema: getRoutineLogsSchema,
    },
    async (args) =>
      runTool(logger, "get_routine_logs", async () => {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/logs/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine_stats",
    {
      description: "Get routine stats",
      inputSchema: getRoutineStatsSchema,
    },
    async (args) =>
      runTool(logger, "get_routine_stats", async () => {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/stats/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine_date_sequence_display",
    {
      description: "Get routine display date sequence",
      inputSchema: getRoutineDateSequenceDisplaySchema,
    },
    async (args) =>
      runTool(logger, "get_routine_date_sequence_display", async () => {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/date-sequence-display/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_routine_date_sequence_gym",
    {
      description: "Get routine gym date sequence",
      inputSchema: getRoutineDateSequenceGymSchema,
    },
    async (args) =>
      runTool(logger, "get_routine_date_sequence_gym", async () => {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/date-sequence-gym/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_routine",
    {
      description: "Create a new routine",
      inputSchema: createRoutineSchema,
    },
    async (args) =>
      runTool(logger, "create_routine", async () => {
        const data = await client.post<Routine>(
          "/api/v2/routine/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_routine",
    {
      description: "Update an existing routine",
      inputSchema: updateRoutineSchema,
    },
    async (args) =>
      runTool(logger, "update_routine", async () => {
        const { id, ...body } = args;
        const data = await client.patch<Routine>(
          `/api/v2/routine/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_day",
    {
      description: "Create a new day",
      inputSchema: createDaySchema,
    },
    async (args) =>
      runTool(logger, "create_day", async () => {
        const data = await client.post<Day>("/api/v2/day/", toJsonBody(args));
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_day",
    {
      description: "Update an existing day",
      inputSchema: updateDaySchema,
    },
    async (args) =>
      runTool(logger, "update_day", async () => {
        const { id, ...body } = args;
        const data = await client.patch<Day>(
          `/api/v2/day/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_slot",
    {
      description: "Create a new slot",
      inputSchema: createSlotSchema,
    },
    async (args) =>
      runTool(logger, "create_slot", async () => {
        const data = await client.post<Slot>("/api/v2/slot/", toJsonBody(args));
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_slot",
    {
      description: "Update an existing slot",
      inputSchema: updateSlotSchema,
    },
    async (args) =>
      runTool(logger, "update_slot", async () => {
        const { id, ...body } = args;
        const data = await client.patch<Slot>(
          `/api/v2/slot/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_slot_entry",
    {
      description: "Create a new slot entry",
      inputSchema: createSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "create_slot_entry", async () => {
        const data = await client.post<SlotEntry>(
          "/api/v2/slot-entry/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_slot_entry",
    {
      description: "Update an existing slot entry",
      inputSchema: updateSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "update_slot_entry", async () => {
        const { id, ...body } = args;
        const data = await client.patch<SlotEntry>(
          `/api/v2/slot-entry/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_workout_log",
    {
      description: "Create a new workout log",
      inputSchema: createWorkoutLogSchema,
    },
    async (args) =>
      runTool(logger, "create_workout_log", async () => {
        const data = await client.post<WorkoutLog>(
          "/api/v2/workoutlog/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_workout_log",
    {
      description: "Update an existing workout log",
      inputSchema: updateWorkoutLogSchema,
    },
    async (args) =>
      runTool(logger, "update_workout_log", async () => {
        const { id, ...body } = args;
        const data = await client.patch<WorkoutLog>(
          `/api/v2/workoutlog/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_workout_session",
    {
      description: "Create a new workout session",
      inputSchema: createWorkoutSessionSchema,
    },
    async (args) =>
      runTool(logger, "create_workout_session", async () => {
        const data = await client.post<WorkoutSession>(
          "/api/v2/workoutsession/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_workout_session",
    {
      description: "Update an existing workout session",
      inputSchema: updateWorkoutSessionSchema,
    },
    async (args) =>
      runTool(logger, "update_workout_session", async () => {
        const { id, ...body } = args;
        const data = await client.patch<WorkoutSession>(
          `/api/v2/workoutsession/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_weight_entry",
    {
      description: "Create a new weight entry",
      inputSchema: createWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "create_weight_entry", async () => {
        const data = await client.post<WeightEntry>(
          "/api/v2/weightentry/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_weight_entry",
    {
      description: "Update an existing weight entry",
      inputSchema: updateWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "update_weight_entry", async () => {
        const { id, ...body } = args;
        const data = await client.patch<WeightEntry>(
          `/api/v2/weightentry/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_gallery_image",
    {
      description: "Create a new gallery image",
      inputSchema: createGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "create_gallery_image", async () => {
        const data = await client.post<GalleryImage>(
          "/api/v2/gallery/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_gallery_image",
    {
      description: "Update an existing gallery image",
      inputSchema: updateGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "update_gallery_image", async () => {
        const { id, ...body } = args;
        const data = await client.patch<GalleryImage>(
          `/api/v2/gallery/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  logger.info("Routine tools registered");
}

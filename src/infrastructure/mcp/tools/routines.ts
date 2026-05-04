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

const listRoutinesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const getRoutineSchema = z.object({
  id: z.number(),
});

const getRoutineStructureSchema = z.object({
  id: z.number(),
});

const getRoutineLogsSchema = z.object({
  id: z.number(),
});

const getRoutineStatsSchema = z.object({
  id: z.number(),
});

const getRoutineDateSequenceDisplaySchema = z.object({
  id: z.number(),
});

const getRoutineDateSequenceGymSchema = z.object({
  id: z.number(),
});

const listDaysSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  routine: z.number().optional(),
});

const getDaySchema = z.object({
  id: z.number(),
});

const listSlotsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  day: z.number().optional(),
});

const getSlotSchema = z.object({
  id: z.number(),
});

const listSlotEntriesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  slot: z.number().optional(),
});

const getSlotEntrySchema = z.object({
  id: z.number(),
});

const listWorkoutLogsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  routine: z.number().optional(),
  date: z.string().optional(),
});

const getWorkoutLogSchema = z.object({
  id: z.number(),
});

const listWorkoutSessionsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  date: z.string().optional(),
});

const getWorkoutSessionSchema = z.object({
  id: z.number(),
});

const listWeightEntriesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  date__gt: z.string().optional(),
  date__gte: z.string().optional(),
});

const getWeightEntrySchema = z.object({
  id: z.number(),
});

const listGalleryImagesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const getGalleryImageSchema = z.object({
  id: z.number(),
});

const createRoutineSchema = z.object({
  name: z.string().max(25).optional(),
  description: z.string().max(1000).optional(),
  start: z.string(),
  end: z.string(),
  fit_in_week: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

const updateRoutineSchema = z.object({
  id: z.number(),
  name: z.string().max(25).optional(),
  description: z.string().max(1000).optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  fit_in_week: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

const createDaySchema = z.object({
  routine: z.number(),
  order: z.number().optional(),
  name: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const updateDaySchema = z.object({
  id: z.number(),
  routine: z.number().optional(),
  order: z.number().optional(),
  name: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const createSlotSchema = z.object({
  day: z.number(),
  order: z.number().optional(),
  comment: z.string().max(200).optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const updateSlotSchema = z.object({
  id: z.number(),
  day: z.number().optional(),
  order: z.number().optional(),
  comment: z.string().max(200).optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const createSlotEntrySchema = z.object({
  slot: z.number(),
  exercise: z.number(),
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
  repetition_unit: z.number().nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: z.number().nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().optional(),
  comment: z.string().max(100).optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const updateSlotEntrySchema = z.object({
  id: z.number(),
  slot: z.number().optional(),
  exercise: z.number().optional(),
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
  repetition_unit: z.number().nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: z.number().nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().optional(),
  comment: z.string().max(100).optional(),
  config: z.custom<JsonValue>().nullable().optional(),
});

const createWorkoutLogSchema = z.object({
  date: z.string().optional(),
  routine: z.number().nullable().optional(),
  iteration: z.number().nullable().optional(),
  slot_entry: z.number().nullable().optional(),
  next_log: z.number().nullable().optional(),
  exercise: z.number(),
  repetitions_unit: z.number().nullable().optional(),
  repetitions: z.string().nullable().optional(),
  repetitions_target: z.string().nullable().optional(),
  weight_unit: z.number().nullable().optional(),
  weight: z.string().nullable().optional(),
  weight_target: z.string().nullable().optional(),
  rir: z.string().nullable().optional(),
  rir_target: z.string().nullable().optional(),
  rest: z.number().nullable().optional(),
  rest_target: z.number().nullable().optional(),
});

const updateWorkoutLogSchema = z.object({
  id: z.number(),
  date: z.string().optional(),
  routine: z.number().nullable().optional(),
  iteration: z.number().nullable().optional(),
  slot_entry: z.number().nullable().optional(),
  next_log: z.number().nullable().optional(),
  exercise: z.number().optional(),
  repetitions_unit: z.number().nullable().optional(),
  repetitions: z.string().nullable().optional(),
  repetitions_target: z.string().nullable().optional(),
  weight_unit: z.number().nullable().optional(),
  weight: z.string().nullable().optional(),
  weight_target: z.string().nullable().optional(),
  rir: z.string().nullable().optional(),
  rir_target: z.string().nullable().optional(),
  rest: z.number().nullable().optional(),
  rest_target: z.number().nullable().optional(),
});

const createWorkoutSessionSchema = z.object({
  routine: z.number().nullable().optional(),
  day: z.number().nullable().optional(),
  date: z.string().optional(),
  notes: z.string().nullable().optional(),
  impression: z.enum(["1", "2", "3"]).optional(),
  time_start: z.string().nullable().optional(),
  time_end: z.string().nullable().optional(),
});

const updateWorkoutSessionSchema = z.object({
  id: z.number(),
  routine: z.number().nullable().optional(),
  day: z.number().nullable().optional(),
  date: z.string().optional(),
  notes: z.string().nullable().optional(),
  impression: z.enum(["1", "2", "3"]).optional(),
  time_start: z.string().nullable().optional(),
  time_end: z.string().nullable().optional(),
});

const createWeightEntrySchema = z.object({
  date: z.string(),
  weight: z.string(),
});

const updateWeightEntrySchema = z.object({
  id: z.number(),
  date: z.string().optional(),
  weight: z.string().optional(),
});

const createGalleryImageSchema = z.object({
  date: z.string(),
  image: z.string(),
  description: z.string().max(1000).optional(),
});

const updateGalleryImageSchema = z.object({
  id: z.number(),
  date: z.string().optional(),
  image: z.string().optional(),
  description: z.string().max(1000).optional(),
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
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<Routine>>(
          "/api/v2/routine/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine",
    {
      description: "Get routine by ID",
      inputSchema: getRoutineSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(`/api/v2/routine/${args.id}/`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_days",
    {
      description: "List routine days",
      inputSchema: listDaysSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<Day>>(
          "/api/v2/day/",
          {
            limit: args.limit,
            offset: args.offset,
            routine: args.routine,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_day",
    {
      description: "Get day by ID",
      inputSchema: getDaySchema,
    },
    async (args) => {
      try {
        const data = await client.get<Day>(`/api/v2/day/${args.id}/`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_slots",
    {
      description: "List slots",
      inputSchema: listSlotsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<Slot>>(
          "/api/v2/slot/",
          {
            limit: args.limit,
            offset: args.offset,
            day: args.day,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_slot",
    {
      description: "Get slot by ID",
      inputSchema: getSlotSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Slot>(`/api/v2/slot/${args.id}/`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_slot_entries",
    {
      description: "List slot entries",
      inputSchema: listSlotEntriesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<SlotEntry>>(
          "/api/v2/slot-entry/",
          {
            limit: args.limit,
            offset: args.offset,
            slot: args.slot,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_slot_entry",
    {
      description: "Get slot entry by ID",
      inputSchema: getSlotEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.get<SlotEntry>(
          `/api/v2/slot-entry/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_workout_logs",
    {
      description: "List workout logs",
      inputSchema: listWorkoutLogsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<WorkoutLog>>(
          "/api/v2/workoutlog/",
          {
            limit: args.limit,
            offset: args.offset,
            routine: args.routine,
            date: args.date,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_workout_log",
    {
      description: "Get workout log by ID",
      inputSchema: getWorkoutLogSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WorkoutLog>(
          `/api/v2/workoutlog/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_workout_sessions",
    {
      description: "List workout sessions",
      inputSchema: listWorkoutSessionsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<WorkoutSession>>(
          "/api/v2/workoutsession/",
          {
            limit: args.limit,
            offset: args.offset,
            date: args.date,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_workout_session",
    {
      description: "Get workout session by ID",
      inputSchema: getWorkoutSessionSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WorkoutSession>(
          `/api/v2/workoutsession/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_weight_entries",
    {
      description: "List weight entries",
      inputSchema: listWeightEntriesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<WeightEntry>>(
          "/api/v2/weightentry/",
          {
            limit: args.limit,
            offset: args.offset,
            date__gt: args.date__gt,
            date__gte: args.date__gte,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_weight_entry",
    {
      description: "Get weight entry by ID",
      inputSchema: getWeightEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.get<WeightEntry>(
          `/api/v2/weightentry/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_gallery_images",
    {
      description: "List gallery images",
      inputSchema: listGalleryImagesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<GalleryImage>>(
          "/api/v2/gallery/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_gallery_image",
    {
      description: "Get gallery image by ID",
      inputSchema: getGalleryImageSchema,
    },
    async (args) => {
      try {
        const data = await client.get<GalleryImage>(
          `/api/v2/gallery/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine_structure",
    {
      description: "Get routine structure",
      inputSchema: getRoutineStructureSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/structure/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine_logs",
    {
      description: "Get routine logs",
      inputSchema: getRoutineLogsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/logs/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine_stats",
    {
      description: "Get routine stats",
      inputSchema: getRoutineStatsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/stats/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine_date_sequence_display",
    {
      description: "Get routine display date sequence",
      inputSchema: getRoutineDateSequenceDisplaySchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/date-sequence-display/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_routine_date_sequence_gym",
    {
      description: "Get routine gym date sequence",
      inputSchema: getRoutineDateSequenceGymSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Routine>(
          `/api/v2/routine/${args.id}/date-sequence-gym/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_routine",
    {
      description: "Create a new routine",
      inputSchema: createRoutineSchema,
    },
    async (args) => {
      try {
        const data = await client.post<Routine>(
          "/api/v2/routine/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_routine",
    {
      description: "Update an existing routine",
      inputSchema: updateRoutineSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<Routine>(
          `/api/v2/routine/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_day",
    {
      description: "Create a new day",
      inputSchema: createDaySchema,
    },
    async (args) => {
      try {
        const data = await client.post<Day>("/api/v2/day/", toJsonBody(args));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_day",
    {
      description: "Update an existing day",
      inputSchema: updateDaySchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<Day>(
          `/api/v2/day/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_slot",
    {
      description: "Create a new slot",
      inputSchema: createSlotSchema,
    },
    async (args) => {
      try {
        const data = await client.post<Slot>("/api/v2/slot/", toJsonBody(args));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_slot",
    {
      description: "Update an existing slot",
      inputSchema: updateSlotSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<Slot>(
          `/api/v2/slot/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_slot_entry",
    {
      description: "Create a new slot entry",
      inputSchema: createSlotEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.post<SlotEntry>(
          "/api/v2/slot-entry/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_slot_entry",
    {
      description: "Update an existing slot entry",
      inputSchema: updateSlotEntrySchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<SlotEntry>(
          `/api/v2/slot-entry/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_workout_log",
    {
      description: "Create a new workout log",
      inputSchema: createWorkoutLogSchema,
    },
    async (args) => {
      try {
        const data = await client.post<WorkoutLog>(
          "/api/v2/workoutlog/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_workout_log",
    {
      description: "Update an existing workout log",
      inputSchema: updateWorkoutLogSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<WorkoutLog>(
          `/api/v2/workoutlog/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_workout_session",
    {
      description: "Create a new workout session",
      inputSchema: createWorkoutSessionSchema,
    },
    async (args) => {
      try {
        const data = await client.post<WorkoutSession>(
          "/api/v2/workoutsession/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_workout_session",
    {
      description: "Update an existing workout session",
      inputSchema: updateWorkoutSessionSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<WorkoutSession>(
          `/api/v2/workoutsession/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_weight_entry",
    {
      description: "Create a new weight entry",
      inputSchema: createWeightEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.post<WeightEntry>(
          "/api/v2/weightentry/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_weight_entry",
    {
      description: "Update an existing weight entry",
      inputSchema: updateWeightEntrySchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<WeightEntry>(
          `/api/v2/weightentry/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_gallery_image",
    {
      description: "Create a new gallery image",
      inputSchema: createGalleryImageSchema,
    },
    async (args) => {
      try {
        const data = await client.post<GalleryImage>(
          "/api/v2/gallery/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_gallery_image",
    {
      description: "Update an existing gallery image",
      inputSchema: updateGalleryImageSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<GalleryImage>(
          `/api/v2/gallery/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  logger.info("Routine tools registered");
}

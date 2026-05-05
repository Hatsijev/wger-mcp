import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { WorkoutLog, WorkoutLogRequest, PatchedWorkoutLogRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  decimalAmountSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

const listWorkoutLogsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  routine: positiveIntegerIdSchema.optional(),
  date: isoDateStringSchema.optional(),
});

const getWorkoutLogSchema = z.object({
  id: positiveIntegerIdSchema,
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

export function registerWorkoutLogTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
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
    "create_workout_log",
    {
      description: "Create a new workout log",
      inputSchema: createWorkoutLogSchema,
    },
    async (args) =>
      runTool(logger, "create_workout_log", async () => {
        const data = await client.post<WorkoutLog>(
          "/api/v2/workoutlog/",
          toJsonBody(args) as WorkoutLogRequest,
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
          toJsonBody(body) as PatchedWorkoutLogRequest,
        );
        return successResult(data);
      }),
  );

  logger.info("Workout log tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { WorkoutSession, WorkoutSessionRequest, PatchedWorkoutSessionRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  timeStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

const listWorkoutSessionsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  date: isoDateStringSchema.optional(),
});

const getWorkoutSessionSchema = z.object({
  id: positiveIntegerIdSchema,
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

export function registerWorkoutSessionTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
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
    "create_workout_session",
    {
      description: "Create a new workout session",
      inputSchema: createWorkoutSessionSchema,
    },
    async (args) =>
      runTool(logger, "create_workout_session", async () => {
        const data = await client.post<WorkoutSession>(
          "/api/v2/workoutsession/",
          toJsonBody(args) as WorkoutSessionRequest,
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
          toJsonBody(body) as PatchedWorkoutSessionRequest,
        );
        return successResult(data);
      }),
  );

  logger.info("Workout session tools registered");
}

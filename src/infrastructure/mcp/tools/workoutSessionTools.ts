import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listWorkoutSessionsEndpoint,
  getWorkoutSessionEndpoint,
  createWorkoutSessionEndpoint,
  updateWorkoutSessionEndpoint,
} from "../endpoints/workoutSessionEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  timeStringSchema,
} from "../sharedSchemas.js";

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
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_workout_sessions",
    {
      description: "List workout sessions",
      inputSchema: listWorkoutSessionsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_workout_sessions",
      listWorkoutSessionsEndpoint,
    ),
  );

  server.registerTool(
    "get_workout_session",
    {
      description: "Get workout session by ID",
      inputSchema: getWorkoutSessionSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_workout_session",
      getWorkoutSessionEndpoint,
    ),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_workout_session",
      {
        description: "Create a new workout session",
        inputSchema: createWorkoutSessionSchema,
      },
      endpointHandler(
        client,
        logger,
        "create_workout_session",
        createWorkoutSessionEndpoint,
      ),
    );

    server.registerTool(
      "update_workout_session",
      {
        description: "Update an existing workout session",
        inputSchema: updateWorkoutSessionSchema,
      },
      endpointHandler(
        client,
        logger,
        "update_workout_session",
        updateWorkoutSessionEndpoint,
      ),
    );
  }

  logger.info("Workout session tools registered");
}

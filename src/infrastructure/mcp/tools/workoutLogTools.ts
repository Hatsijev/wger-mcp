import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listWorkoutLogsEndpoint,
  getWorkoutLogEndpoint,
  createWorkoutLogEndpoint,
  updateWorkoutLogEndpoint,
} from "../endpoints/workoutLogEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  decimalAmountSchema,
  nonNegativeIntegerSchema,
  rirDecimalSchema,
} from "../sharedSchemas.js";

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
  iteration: nonNegativeIntegerSchema.nullable().optional(),
  slot_entry: positiveIntegerIdSchema.nullable().optional(),
  next_log: positiveIntegerIdSchema.nullable().optional(),
  exercise: positiveIntegerIdSchema,
  repetitions_unit: positiveIntegerIdSchema.nullable().optional(),
  repetitions: decimalAmountSchema.nullable().optional(),
  repetitions_target: decimalAmountSchema.nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight: decimalAmountSchema.nullable().optional(),
  weight_target: decimalAmountSchema.nullable().optional(),
  rir: rirDecimalSchema.nullable().optional(),
  rir_target: rirDecimalSchema.nullable().optional(),
  rest: nonNegativeIntegerSchema.nullable().optional(),
  rest_target: nonNegativeIntegerSchema.nullable().optional(),
});

const updateWorkoutLogSchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  routine: positiveIntegerIdSchema.nullable().optional(),
  iteration: nonNegativeIntegerSchema.nullable().optional(),
  slot_entry: positiveIntegerIdSchema.nullable().optional(),
  next_log: positiveIntegerIdSchema.nullable().optional(),
  exercise: positiveIntegerIdSchema.optional(),
  repetitions_unit: positiveIntegerIdSchema.nullable().optional(),
  repetitions: decimalAmountSchema.nullable().optional(),
  repetitions_target: decimalAmountSchema.nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight: decimalAmountSchema.nullable().optional(),
  weight_target: decimalAmountSchema.nullable().optional(),
  rir: rirDecimalSchema.nullable().optional(),
  rir_target: rirDecimalSchema.nullable().optional(),
  rest: nonNegativeIntegerSchema.nullable().optional(),
  rest_target: nonNegativeIntegerSchema.nullable().optional(),
});

export function registerWorkoutLogTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_workout_logs",
    { description: "List workout logs", inputSchema: listWorkoutLogsSchema },
    endpointHandler(client, logger, "list_workout_logs", listWorkoutLogsEndpoint),
  );

  server.registerTool(
    "get_workout_log",
    { description: "Get workout log by ID", inputSchema: getWorkoutLogSchema },
    endpointHandler(client, logger, "get_workout_log", getWorkoutLogEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_workout_log",
      { description: "Create a new workout log", inputSchema: createWorkoutLogSchema },
      endpointHandler(client, logger, "create_workout_log", createWorkoutLogEndpoint),
    );

    server.registerTool(
      "update_workout_log",
      { description: "Update an existing workout log", inputSchema: updateWorkoutLogSchema },
      endpointHandler(client, logger, "update_workout_log", updateWorkoutLogEndpoint),
    );
  }

  logger.info("Workout log tools registered");
}

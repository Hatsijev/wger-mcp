import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listRoutinesEndpoint,
  getRoutineEndpoint,
  getRoutineStructureEndpoint,
  getRoutineLogsEndpoint,
  getRoutineStatsEndpoint,
  getRoutineDateSequenceDisplayEndpoint,
  getRoutineDateSequenceGymEndpoint,
  createRoutineEndpoint,
  updateRoutineEndpoint,
} from "../endpoints/routineEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

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

export function registerRoutineTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_routines",
    { description: "List routines", inputSchema: listRoutinesSchema },
    endpointHandler(client, logger, "list_routines", listRoutinesEndpoint),
  );

  server.registerTool(
    "get_routine",
    { description: "Get routine by ID", inputSchema: getRoutineSchema },
    endpointHandler(client, logger, "get_routine", getRoutineEndpoint),
  );

  server.registerTool(
    "get_routine_structure",
    { description: "Get routine structure", inputSchema: getRoutineStructureSchema },
    endpointHandler(client, logger, "get_routine_structure", getRoutineStructureEndpoint),
  );

  server.registerTool(
    "get_routine_logs",
    { description: "Get routine logs", inputSchema: getRoutineLogsSchema },
    endpointHandler(client, logger, "get_routine_logs", getRoutineLogsEndpoint),
  );

  server.registerTool(
    "get_routine_stats",
    { description: "Get routine stats", inputSchema: getRoutineStatsSchema },
    endpointHandler(client, logger, "get_routine_stats", getRoutineStatsEndpoint),
  );

  server.registerTool(
    "get_routine_date_sequence_display",
    { description: "Get routine display date sequence", inputSchema: getRoutineDateSequenceDisplaySchema },
    endpointHandler(client, logger, "get_routine_date_sequence_display", getRoutineDateSequenceDisplayEndpoint),
  );

  server.registerTool(
    "get_routine_date_sequence_gym",
    { description: "Get routine gym date sequence", inputSchema: getRoutineDateSequenceGymSchema },
    endpointHandler(client, logger, "get_routine_date_sequence_gym", getRoutineDateSequenceGymEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_routine",
      { description: "Create a new routine", inputSchema: createRoutineSchema },
      endpointHandler(client, logger, "create_routine", createRoutineEndpoint),
    );

    server.registerTool(
      "update_routine",
      { description: "Update an existing routine", inputSchema: updateRoutineSchema },
      endpointHandler(client, logger, "update_routine", updateRoutineEndpoint),
    );
  }

  logger.info("Routine tools registered");
}

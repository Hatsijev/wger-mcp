import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Routine, RoutineRequest, PatchedRoutineRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

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
          toJsonBody(args) as RoutineRequest,
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
          toJsonBody(body) as PatchedRoutineRequest,
        );
        return successResult(data);
      }),
  );

  logger.info("Routine tools registered");
}

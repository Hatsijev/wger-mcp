import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Day,
  DayRequest,
  PatchedDayRequest,
} from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";
import {
  paginatedResponseSchema,
  dayResponseSchema,
} from "../responseSchemas.js";

const listDaysSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  routine: positiveIntegerIdSchema.optional(),
});

const getDaySchema = z.object({
  id: positiveIntegerIdSchema,
});

const createDaySchema = z.object({
  routine: positiveIntegerIdSchema,
  order: z.number().int().min(0).optional(),
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
  order: z.number().int().min(0).optional(),
  name: boundedStringSchema(20).optional(),
  description: boundedStringSchema(1000).optional(),
  is_rest: z.boolean().optional(),
  need_logs_to_advance: z.boolean().optional(),
  type: z
    .enum(["custom", "enom", "amrap", "hiit", "tabata", "edt", "rft", "afap"])
    .optional(),
  config: jsonConfigSchema,
});

export function registerDayTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
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
          paginatedResponseSchema(dayResponseSchema),
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
        const data = await client.get<Day>(
          `/api/v2/day/${args.id}/`,
          undefined,
          dayResponseSchema,
        );
        return successResult(data);
      }),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_day",
      {
        description: "Create a new day",
        inputSchema: createDaySchema,
      },
      async (args) =>
        runTool(logger, "create_day", async () => {
          const data = await client.post<Day>(
            "/api/v2/day/",
            toJsonBody(args) as DayRequest,
            dayResponseSchema,
          );
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
            toJsonBody(body) as PatchedDayRequest,
            dayResponseSchema,
          );
          return successResult(data);
        }),
    );
  }

  logger.info("Day tools registered");
}

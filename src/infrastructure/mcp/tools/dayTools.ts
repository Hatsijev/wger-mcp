import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listDaysEndpoint,
  getDayEndpoint,
  createDayEndpoint,
  updateDayEndpoint,
} from "../endpoints/dayEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";

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
    { description: "List routine days", inputSchema: listDaysSchema },
    endpointHandler(client, logger, "list_days", listDaysEndpoint),
  );

  server.registerTool(
    "get_day",
    { description: "Get day by ID", inputSchema: getDaySchema },
    endpointHandler(client, logger, "get_day", getDayEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_day",
      { description: "Create a new day", inputSchema: createDaySchema },
      endpointHandler(client, logger, "create_day", createDayEndpoint),
    );

    server.registerTool(
      "update_day",
      { description: "Update an existing day", inputSchema: updateDaySchema },
      endpointHandler(client, logger, "update_day", updateDayEndpoint),
    );
  }

  logger.info("Day tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listSlotsEndpoint,
  getSlotEndpoint,
  createSlotEndpoint,
  updateSlotEndpoint,
} from "../endpoints/slotEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";

const listSlotsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  day: positiveIntegerIdSchema.optional(),
});

const getSlotSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createSlotSchema = z.object({
  day: positiveIntegerIdSchema,
  order: z.number().int().min(0).optional(),
  comment: boundedStringSchema(200).optional(),
  config: jsonConfigSchema,
});

const updateSlotSchema = z.object({
  id: positiveIntegerIdSchema,
  day: positiveIntegerIdSchema.optional(),
  order: z.number().int().min(0).optional(),
  comment: boundedStringSchema(200).optional(),
  config: jsonConfigSchema,
});

export function registerSlotTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_slots",
    { description: "List slots", inputSchema: listSlotsSchema },
    endpointHandler(client, logger, "list_slots", listSlotsEndpoint),
  );

  server.registerTool(
    "get_slot",
    { description: "Get slot by ID", inputSchema: getSlotSchema },
    endpointHandler(client, logger, "get_slot", getSlotEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_slot",
      { description: "Create a new slot", inputSchema: createSlotSchema },
      endpointHandler(client, logger, "create_slot", createSlotEndpoint),
    );

    server.registerTool(
      "update_slot",
      { description: "Update an existing slot", inputSchema: updateSlotSchema },
      endpointHandler(client, logger, "update_slot", updateSlotEndpoint),
    );
  }

  logger.info("Slot tools registered");
}

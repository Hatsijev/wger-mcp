import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listWeightEntriesEndpoint,
  getWeightEntryEndpoint,
  createWeightEntryEndpoint,
  updateWeightEntryEndpoint,
} from "../endpoints/weightEntryEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  weightDecimalSchema,
} from "../sharedSchemas.js";

const listWeightEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  date__gt: isoDateStringSchema.optional(),
  date__gte: isoDateStringSchema.optional(),
});

const getWeightEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const createWeightEntrySchema = z.object({
  date: isoDateStringSchema,
  weight: weightDecimalSchema,
});

const updateWeightEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  weight: weightDecimalSchema.optional(),
});

export function registerWeightEntryTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_weight_entries",
    {
      description: "List weight entries",
      inputSchema: listWeightEntriesSchema,
    },
    endpointHandler(client, logger, "list_weight_entries", listWeightEntriesEndpoint),
  );

  server.registerTool(
    "get_weight_entry",
    {
      description: "Get weight entry by ID",
      inputSchema: getWeightEntrySchema,
    },
    endpointHandler(client, logger, "get_weight_entry", getWeightEntryEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_weight_entry",
      {
        description: "Create a new weight entry",
        inputSchema: createWeightEntrySchema,
      },
      endpointHandler(client, logger, "create_weight_entry", createWeightEntryEndpoint),
    );

    server.registerTool(
      "update_weight_entry",
      {
        description: "Update an existing weight entry",
        inputSchema: updateWeightEntrySchema,
      },
      endpointHandler(client, logger, "update_weight_entry", updateWeightEntryEndpoint),
    );
  }

  logger.info("Weight entry tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import { WeightEntry } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  decimalAmountSchema,
} from "../sharedSchemas.js";
import { runTool, successResult } from "../toolResult.js";

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
  weight: decimalAmountSchema,
});

const updateWeightEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  weight: decimalAmountSchema.optional(),
});

function toJsonBody(obj: Record<string, JsonValue | undefined>): JsonValue {
  const result: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value as JsonValue;
    }
  }
  return result;
}

export function registerWeightEntryTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_weight_entries",
    {
      description: "List weight entries",
      inputSchema: listWeightEntriesSchema,
    },
    async (args) =>
      runTool(logger, "list_weight_entries", async () => {
        const data = await client.get<WgerPaginatedResponse<WeightEntry>>(
          "/api/v2/weightentry/",
          {
            limit: args.limit,
            offset: args.offset,
            date__gt: args.date__gt,
            date__gte: args.date__gte,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_weight_entry",
    {
      description: "Get weight entry by ID",
      inputSchema: getWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "get_weight_entry", async () => {
        const data = await client.get<WeightEntry>(
          `/api/v2/weightentry/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_weight_entry",
    {
      description: "Create a new weight entry",
      inputSchema: createWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "create_weight_entry", async () => {
        const data = await client.post<WeightEntry>(
          "/api/v2/weightentry/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_weight_entry",
    {
      description: "Update an existing weight entry",
      inputSchema: updateWeightEntrySchema,
    },
    async (args) =>
      runTool(logger, "update_weight_entry", async () => {
        const { id, ...body } = args;
        const data = await client.patch<WeightEntry>(
          `/api/v2/weightentry/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  logger.info("Weight entry tools registered");
}

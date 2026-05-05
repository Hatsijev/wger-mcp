import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Slot, SlotRequest, PatchedSlotRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

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
    {
      description: "List slots",
      inputSchema: listSlotsSchema,
    },
    async (args) =>
      runTool(logger, "list_slots", async () => {
        const data = await client.get<WgerPaginatedResponse<Slot>>(
          "/api/v2/slot/",
          {
            limit: args.limit,
            offset: args.offset,
            day: args.day,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_slot",
    {
      description: "Get slot by ID",
      inputSchema: getSlotSchema,
    },
    async (args) =>
      runTool(logger, "get_slot", async () => {
        const data = await client.get<Slot>(`/api/v2/slot/${args.id}/`);
        return successResult(data);
      }),
  );

  if (enableWriteTools) {
  server.registerTool(
    "create_slot",
    {
      description: "Create a new slot",
      inputSchema: createSlotSchema,
    },
    async (args) =>
      runTool(logger, "create_slot", async () => {
        const data = await client.post<Slot>("/api/v2/slot/", toJsonBody(args) as SlotRequest);
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_slot",
    {
      description: "Update an existing slot",
      inputSchema: updateSlotSchema,
    },
    async (args) =>
      runTool(logger, "update_slot", async () => {
        const { id, ...body } = args;
        const data = await client.patch<Slot>(
          `/api/v2/slot/${id}/`,
          toJsonBody(body) as PatchedSlotRequest,
        );
        return successResult(data);
      }),
  );
  }

  logger.info("Slot tools registered");
}

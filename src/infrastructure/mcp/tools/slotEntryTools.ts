import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { SlotEntry, SlotEntryRequest, PatchedSlotEntryRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

const listSlotEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  slot: positiveIntegerIdSchema.optional(),
});

const getSlotEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const createSlotEntrySchema = z.object({
  slot: positiveIntegerIdSchema,
  exercise: positiveIntegerIdSchema,
  type: z
    .enum([
      "normal",
      "warmup",
      "dropset",
      "myo",
      "partial",
      "forced",
      "tut",
      "iso",
      "jump",
    ])
    .optional(),
  repetition_unit: positiveIntegerIdSchema.nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().int().min(0).optional(),
  comment: boundedStringSchema(100).optional(),
  config: jsonConfigSchema,
});

const updateSlotEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  slot: positiveIntegerIdSchema.optional(),
  exercise: positiveIntegerIdSchema.optional(),
  type: z
    .enum([
      "normal",
      "warmup",
      "dropset",
      "myo",
      "partial",
      "forced",
      "tut",
      "iso",
      "jump",
    ])
    .optional(),
  repetition_unit: positiveIntegerIdSchema.nullable().optional(),
  repetition_rounding: z.string().nullable().optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  weight_rounding: z.string().nullable().optional(),
  order: z.number().int().min(0).optional(),
  comment: boundedStringSchema(100).optional(),
  config: jsonConfigSchema,
});

export function registerSlotEntryTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_slot_entries",
    {
      description: "List slot entries",
      inputSchema: listSlotEntriesSchema,
    },
    async (args) =>
      runTool(logger, "list_slot_entries", async () => {
        const data = await client.get<WgerPaginatedResponse<SlotEntry>>(
          "/api/v2/slot-entry/",
          {
            limit: args.limit,
            offset: args.offset,
            slot: args.slot,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_slot_entry",
    {
      description: "Get slot entry by ID",
      inputSchema: getSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "get_slot_entry", async () => {
        const data = await client.get<SlotEntry>(
          `/api/v2/slot-entry/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  if (enableWriteTools) {
  server.registerTool(
    "create_slot_entry",
    {
      description: "Create a new slot entry",
      inputSchema: createSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "create_slot_entry", async () => {
        const data = await client.post<SlotEntry>(
          "/api/v2/slot-entry/",
          toJsonBody(args) as SlotEntryRequest,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_slot_entry",
    {
      description: "Update an existing slot entry",
      inputSchema: updateSlotEntrySchema,
    },
    async (args) =>
      runTool(logger, "update_slot_entry", async () => {
        const { id, ...body } = args;
        const data = await client.patch<SlotEntry>(
          `/api/v2/slot-entry/${id}/`,
          toJsonBody(body) as PatchedSlotEntryRequest,
        );
        return successResult(data);
      }),
  );
  }

  logger.info("Slot entry tools registered");
}

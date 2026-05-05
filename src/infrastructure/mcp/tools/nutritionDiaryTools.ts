import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { NutritionDiaryEntry, NutritionalValues, LogItemRequest, PatchedLogItemRequest } from "../../../domain/models/Nutrition.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  isoDateTimeStringSchema,
  decimalAmountSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";
import { paginatedResponseSchema, nutritionDiaryEntryResponseSchema } from "../responseSchemas.js";

const listNutritionDiaryEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  plan: positiveIntegerIdSchema.optional(),
  date: isoDateStringSchema.optional(),
});

const getNutritionDiaryEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const getNutritionDiaryNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createNutritionDiaryEntrySchema = z.object({
  plan: positiveIntegerIdSchema,
  meal: positiveIntegerIdSchema.nullable().optional(),
  ingredient: positiveIntegerIdSchema,
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  datetime: isoDateTimeStringSchema.optional(),
  amount: decimalAmountSchema,
});

const updateNutritionDiaryEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  plan: positiveIntegerIdSchema.optional(),
  meal: positiveIntegerIdSchema.nullable().optional(),
  ingredient: positiveIntegerIdSchema.optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  datetime: isoDateTimeStringSchema.optional(),
  amount: decimalAmountSchema.optional(),
});

export function registerNutritionDiaryTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_nutrition_diary_entries",
    {
      description: "List nutrition diary entries",
      inputSchema: listNutritionDiaryEntriesSchema,
    },
    async (args) =>
      runTool(logger, "list_nutrition_diary_entries", async () => {
        const data = await client.get<
          WgerPaginatedResponse<NutritionDiaryEntry>
        >("/api/v2/nutritiondiary/", {
          limit: args.limit,
          offset: args.offset,
          plan: args.plan,
          datetime__date: args.date,
        },
        paginatedResponseSchema(nutritionDiaryEntryResponseSchema));
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_diary_entry",
    {
      description: "Get nutrition diary entry by ID",
      inputSchema: getNutritionDiaryEntrySchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_diary_entry", async () => {
        const data = await client.get<NutritionDiaryEntry>(
          `/api/v2/nutritiondiary/${args.id}/`,
          undefined,
          nutritionDiaryEntryResponseSchema,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_diary_nutritional_values",
    {
      description: "Get nutritional values for a diary entry",
      inputSchema: getNutritionDiaryNutritionalValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_diary_nutritional_values", async () => {
        const data = await client.get<NutritionalValues>(
          `/api/v2/nutritiondiary/${args.id}/nutritional_values/`,
        );
        return successResult(data);
      }),
  );

  if (enableWriteTools) {
  server.registerTool(
    "create_nutrition_diary_entry",
    {
      description: "Create a new nutrition diary entry",
      inputSchema: createNutritionDiaryEntrySchema,
    },
    async (args) =>
      runTool(logger, "create_nutrition_diary_entry", async () => {
        const data = await client.post<NutritionDiaryEntry>(
          "/api/v2/nutritiondiary/",
          toJsonBody(args) as LogItemRequest,
          nutritionDiaryEntryResponseSchema,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_nutrition_diary_entry",
    {
      description: "Update an existing nutrition diary entry",
      inputSchema: updateNutritionDiaryEntrySchema,
    },
    async (args) =>
      runTool(logger, "update_nutrition_diary_entry", async () => {
        const { id, ...body } = args;
        const data = await client.patch<NutritionDiaryEntry>(
          `/api/v2/nutritiondiary/${id}/`,
          toJsonBody(body) as PatchedLogItemRequest,
          nutritionDiaryEntryResponseSchema,
        );
        return successResult(data);
      }),
  );
  }

  logger.info("Nutrition diary tools registered");
}

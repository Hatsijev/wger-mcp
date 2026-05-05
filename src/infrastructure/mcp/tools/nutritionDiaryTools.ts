import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listNutritionDiaryEntriesEndpoint,
  getNutritionDiaryEntryEndpoint,
  getNutritionDiaryNutritionalValuesEndpoint,
  createNutritionDiaryEntryEndpoint,
  updateNutritionDiaryEntryEndpoint,
} from "../endpoints/nutritionEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  isoDateTimeStringSchema,
  decimalAmountSchema,
} from "../sharedSchemas.js";

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
    endpointHandler(
      client,
      logger,
      "list_nutrition_diary_entries",
      listNutritionDiaryEntriesEndpoint,
    ),
  );

  server.registerTool(
    "get_nutrition_diary_entry",
    {
      description: "Get nutrition diary entry by ID",
      inputSchema: getNutritionDiaryEntrySchema,
    },
    endpointHandler(
      client,
      logger,
      "get_nutrition_diary_entry",
      getNutritionDiaryEntryEndpoint,
    ),
  );

  server.registerTool(
    "get_nutrition_diary_nutritional_values",
    {
      description: "Get nutritional values for a diary entry",
      inputSchema: getNutritionDiaryNutritionalValuesSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_nutrition_diary_nutritional_values",
      getNutritionDiaryNutritionalValuesEndpoint,
    ),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_nutrition_diary_entry",
      {
        description: "Create a new nutrition diary entry",
        inputSchema: createNutritionDiaryEntrySchema,
      },
      endpointHandler(
        client,
        logger,
        "create_nutrition_diary_entry",
        createNutritionDiaryEntryEndpoint,
      ),
    );

    server.registerTool(
      "update_nutrition_diary_entry",
      {
        description: "Update an existing nutrition diary entry",
        inputSchema: updateNutritionDiaryEntrySchema,
      },
      endpointHandler(
        client,
        logger,
        "update_nutrition_diary_entry",
        updateNutritionDiaryEntryEndpoint,
      ),
    );
  }

  logger.info("Nutrition diary tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listMealsEndpoint,
  getMealEndpoint,
  getMealNutritionalValuesEndpoint,
  listMealItemsEndpoint,
  getMealItemEndpoint,
  getMealItemNutritionalValuesEndpoint,
  createMealEndpoint,
  updateMealEndpoint,
  createMealItemEndpoint,
  updateMealItemEndpoint,
} from "../endpoints/nutritionEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  timeStringSchema,
  decimalAmountSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

const listMealsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  plan: positiveIntegerIdSchema.optional(),
  order: z.number().int().optional(),
});

const getMealSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getMealNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listMealItemsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  meal: positiveIntegerIdSchema.optional(),
  ingredient: positiveIntegerIdSchema.optional(),
});

const getMealItemSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getMealItemNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMealSchema = z.object({
  plan: positiveIntegerIdSchema,
  time: timeStringSchema.nullable().optional(),
  name: boundedStringSchema(25).optional(),
});

const updateMealSchema = z.object({
  id: positiveIntegerIdSchema,
  plan: positiveIntegerIdSchema.optional(),
  time: timeStringSchema.nullable().optional(),
  name: boundedStringSchema(25).optional(),
});

const createMealItemSchema = z.object({
  meal: positiveIntegerIdSchema,
  ingredient: positiveIntegerIdSchema,
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  amount: decimalAmountSchema,
});

const updateMealItemSchema = z.object({
  id: positiveIntegerIdSchema,
  meal: positiveIntegerIdSchema.optional(),
  ingredient: positiveIntegerIdSchema.optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  amount: decimalAmountSchema.optional(),
});

export function registerMealTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_meals",
    {
      description: "List meals",
      inputSchema: listMealsSchema,
    },
    endpointHandler(client, logger, "list_meals", listMealsEndpoint),
  );

  server.registerTool(
    "get_meal",
    {
      description: "Get meal by ID",
      inputSchema: getMealSchema,
    },
    endpointHandler(client, logger, "get_meal", getMealEndpoint),
  );

  server.registerTool(
    "get_meal_nutritional_values",
    {
      description: "Get nutritional values for a meal",
      inputSchema: getMealNutritionalValuesSchema,
    },
    endpointHandler(client, logger, "get_meal_nutritional_values", getMealNutritionalValuesEndpoint),
  );

  server.registerTool(
    "list_meal_items",
    {
      description: "List meal items",
      inputSchema: listMealItemsSchema,
    },
    endpointHandler(client, logger, "list_meal_items", listMealItemsEndpoint),
  );

  server.registerTool(
    "get_meal_item",
    {
      description: "Get meal item by ID",
      inputSchema: getMealItemSchema,
    },
    endpointHandler(client, logger, "get_meal_item", getMealItemEndpoint),
  );

  server.registerTool(
    "get_meal_item_nutritional_values",
    {
      description: "Get nutritional values for a meal item",
      inputSchema: getMealItemNutritionalValuesSchema,
    },
    endpointHandler(client, logger, "get_meal_item_nutritional_values", getMealItemNutritionalValuesEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_meal",
      {
        description: "Create a new meal",
        inputSchema: createMealSchema,
      },
      endpointHandler(client, logger, "create_meal", createMealEndpoint),
    );

    server.registerTool(
      "update_meal",
      {
        description: "Update an existing meal",
        inputSchema: updateMealSchema,
      },
      endpointHandler(client, logger, "update_meal", updateMealEndpoint),
    );

    server.registerTool(
      "create_meal_item",
      {
        description: "Create a new meal item",
        inputSchema: createMealItemSchema,
      },
      endpointHandler(client, logger, "create_meal_item", createMealItemEndpoint),
    );

    server.registerTool(
      "update_meal_item",
      {
        description: "Update an existing meal item",
        inputSchema: updateMealItemSchema,
      },
      endpointHandler(client, logger, "update_meal_item", updateMealItemEndpoint),
    );
  }

  logger.info("Meal tools registered");
}

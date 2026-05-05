import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Meal, MealItem, NutritionalValues, MealRequest, MealItemRequest, PatchedMealRequest, PatchedMealItemRequest } from "../../../domain/models/Nutrition.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  timeStringSchema,
  decimalAmountSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

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
  meal: z.number().optional(),
  ingredient: z.number().optional(),
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
  time: z.string().nullable().optional(),
  name: z.string().max(25).optional(),
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
): void {
  server.registerTool(
    "list_meals",
    {
      description: "List meals",
      inputSchema: listMealsSchema,
    },
    async (args) =>
      runTool(logger, "list_meals", async () => {
        const data = await client.get<WgerPaginatedResponse<Meal>>(
          "/api/v2/meal/",
          {
            limit: args.limit,
            offset: args.offset,
            plan: args.plan,
            order: args.order,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_meal",
    {
      description: "Get meal by ID",
      inputSchema: getMealSchema,
    },
    async (args) =>
      runTool(logger, "get_meal", async () => {
        const data = await client.get<Meal>(`/api/v2/meal/${args.id}/`);
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_meal_nutritional_values",
    {
      description: "Get nutritional values for a meal",
      inputSchema: getMealNutritionalValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_meal_nutritional_values", async () => {
        const data = await client.get<NutritionalValues>(
          `/api/v2/meal/${args.id}/nutritional_values/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_meal_items",
    {
      description: "List meal items",
      inputSchema: listMealItemsSchema,
    },
    async (args) =>
      runTool(logger, "list_meal_items", async () => {
        const data = await client.get<WgerPaginatedResponse<MealItem>>(
          "/api/v2/mealitem/",
          {
            limit: args.limit,
            offset: args.offset,
            meal: args.meal,
            ingredient: args.ingredient,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_meal_item",
    {
      description: "Get meal item by ID",
      inputSchema: getMealItemSchema,
    },
    async (args) =>
      runTool(logger, "get_meal_item", async () => {
        const data = await client.get<MealItem>(`/api/v2/mealitem/${args.id}/`);
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_meal_item_nutritional_values",
    {
      description: "Get nutritional values for a meal item",
      inputSchema: getMealItemNutritionalValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_meal_item_nutritional_values", async () => {
        const data = await client.get<NutritionalValues>(
          `/api/v2/mealitem/${args.id}/nutritional_values/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_meal",
    {
      description: "Create a new meal",
      inputSchema: createMealSchema,
    },
    async (args) =>
      runTool(logger, "create_meal", async () => {
        const data = await client.post<Meal>("/api/v2/meal/", toJsonBody(args) as MealRequest);
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_meal",
    {
      description: "Update an existing meal",
      inputSchema: updateMealSchema,
    },
    async (args) =>
      runTool(logger, "update_meal", async () => {
        const { id, ...body } = args;
        const data = await client.patch<Meal>(
          `/api/v2/meal/${id}/`,
          toJsonBody(body) as PatchedMealRequest,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_meal_item",
    {
      description: "Create a new meal item",
      inputSchema: createMealItemSchema,
    },
    async (args) =>
      runTool(logger, "create_meal_item", async () => {
        const data = await client.post<MealItem>(
          "/api/v2/mealitem/",
          toJsonBody(args) as MealItemRequest,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_meal_item",
    {
      description: "Update an existing meal item",
      inputSchema: updateMealItemSchema,
    },
    async (args) =>
      runTool(logger, "update_meal_item", async () => {
        const { id, ...body } = args;
        const data = await client.patch<MealItem>(
          `/api/v2/mealitem/${id}/`,
          toJsonBody(body) as PatchedMealItemRequest,
        );
        return successResult(data);
      }),
  );

  logger.info("Meal tools registered");
}

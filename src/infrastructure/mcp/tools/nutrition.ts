import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import {
  IngredientInfo,
  IngredientImage,
  IngredientWeightUnit,
  Meal,
  MealItem,
  NutritionPlan,
  NutritionDiaryEntry,
  NutritionalValues,
} from "../../../domain/models/Nutrition.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  isoDateTimeStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult } from "../toolResult.js";

const listIngredientsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  search: z.string().optional(),
  language: z.number().optional(),
});

const getIngredientSchema = z.object({
  id: positiveIntegerIdSchema,
});

const searchIngredientsSchema = z.object({
  term: z.string(),
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const getIngredientValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listIngredientImagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ingredient_id: z.number().optional(),
});

const getIngredientImageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listIngredientWeightUnitsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ingredient: z.number().optional(),
});

const getIngredientWeightUnitSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listMealsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  plan: z.number().optional(),
  order: z.number().optional(),
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

const listNutritionPlansSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  description: z.string().optional(),
});

const getNutritionPlanSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getNutritionPlanNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listNutritionDiaryEntriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  plan: z.number().optional(),
  date: isoDateStringSchema.optional(),
});

const getNutritionDiaryEntrySchema = z.object({
  id: positiveIntegerIdSchema,
});

const getNutritionDiaryNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMealSchema = z.object({
  plan: positiveIntegerIdSchema,
  time: z.string().nullable().optional(),
  name: z.string().max(25).optional(),
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
  amount: z.string(),
});

const updateMealItemSchema = z.object({
  id: positiveIntegerIdSchema,
  meal: positiveIntegerIdSchema.optional(),
  ingredient: positiveIntegerIdSchema.optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  amount: z.string().optional(),
});

const createNutritionPlanSchema = z.object({
  start: isoDateStringSchema.optional(),
  end: isoDateStringSchema.nullable().optional(),
  description: boundedStringSchema(1000).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z.number().nullable().optional(),
  goal_protein: z.number().nullable().optional(),
  goal_carbohydrates: z.number().nullable().optional(),
  goal_fat: z.number().nullable().optional(),
  goal_fiber: z.number().nullable().optional(),
});

const updateNutritionPlanSchema = z.object({
  id: positiveIntegerIdSchema,
  start: isoDateStringSchema.optional(),
  end: isoDateStringSchema.nullable().optional(),
  description: boundedStringSchema(1000).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z.number().nullable().optional(),
  goal_protein: z.number().nullable().optional(),
  goal_carbohydrates: z.number().nullable().optional(),
  goal_fat: z.number().nullable().optional(),
  goal_fiber: z.number().nullable().optional(),
});

const createNutritionDiaryEntrySchema = z.object({
  plan: positiveIntegerIdSchema,
  meal: positiveIntegerIdSchema.nullable().optional(),
  ingredient: positiveIntegerIdSchema,
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  datetime: isoDateTimeStringSchema.optional(),
  amount: z.string(),
});

const updateNutritionDiaryEntrySchema = z.object({
  id: positiveIntegerIdSchema,
  plan: positiveIntegerIdSchema.optional(),
  meal: positiveIntegerIdSchema.nullable().optional(),
  ingredient: positiveIntegerIdSchema.optional(),
  weight_unit: positiveIntegerIdSchema.nullable().optional(),
  datetime: isoDateTimeStringSchema.optional(),
  amount: z.string().optional(),
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

export function registerNutritionTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_ingredients",
    {
      description: "List ingredients",
      inputSchema: listIngredientsSchema,
    },
    async (args) =>
      runTool(logger, "list_ingredients", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            limit: args.limit,
            offset: args.offset,
            name__search: args.search,
            language: args.language,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient",
    {
      description: "Get ingredient by ID",
      inputSchema: getIngredientSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient", async () => {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "search_ingredients",
    {
      description: "Search ingredients",
      inputSchema: searchIngredientsSchema,
    },
    async (args) =>
      runTool(logger, "search_ingredients", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            name__search: args.term,
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_values",
    {
      description: "Get nutritional values for an ingredient",
      inputSchema: getIngredientValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_values", async () => {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/get_values/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_ingredient_images",
    {
      description: "List ingredient images",
      inputSchema: listIngredientImagesSchema,
    },
    async (args) =>
      runTool(logger, "list_ingredient_images", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientImage>>(
          "/api/v2/ingredient-image/",
          {
            limit: args.limit,
            offset: args.offset,
            ingredient_id: args.ingredient_id,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_image",
    {
      description: "Get ingredient image by ID",
      inputSchema: getIngredientImageSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_image", async () => {
        const data = await client.get<IngredientImage>(
          `/api/v2/ingredient-image/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_ingredient_weight_units",
    {
      description: "List ingredient weight units",
      inputSchema: listIngredientWeightUnitsSchema,
    },
    async (args) =>
      runTool(logger, "list_ingredient_weight_units", async () => {
        const data = await client.get<
          WgerPaginatedResponse<IngredientWeightUnit>
        >("/api/v2/ingredientweightunit/", {
          limit: args.limit,
          offset: args.offset,
          ingredient: args.ingredient,
        });
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_weight_unit",
    {
      description: "Get ingredient weight unit by ID",
      inputSchema: getIngredientWeightUnitSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_weight_unit", async () => {
        const data = await client.get<IngredientWeightUnit>(
          `/api/v2/ingredientweightunit/${args.id}/`,
        );
        return successResult(data);
      }),
  );

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
    "list_nutrition_plans",
    {
      description: "List nutrition plans",
      inputSchema: listNutritionPlansSchema,
    },
    async (args) =>
      runTool(logger, "list_nutrition_plans", async () => {
        const data = await client.get<WgerPaginatedResponse<NutritionPlan>>(
          "/api/v2/nutritionplan/",
          {
            limit: args.limit,
            offset: args.offset,
            description: args.description,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_plan",
    {
      description: "Get nutrition plan by ID",
      inputSchema: getNutritionPlanSchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_plan", async () => {
        const data = await client.get<NutritionPlan>(
          `/api/v2/nutritionplan/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_plan_nutritional_values",
    {
      description: "Get nutritional values for a nutrition plan",
      inputSchema: getNutritionPlanNutritionalValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_plan_nutritional_values", async () => {
        const data = await client.get<NutritionalValues>(
          `/api/v2/nutritionplan/${args.id}/nutritional_values/`,
        );
        return successResult(data);
      }),
  );

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
        });
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

  server.registerTool(
    "create_meal",
    {
      description: "Create a new meal",
      inputSchema: createMealSchema,
    },
    async (args) =>
      runTool(logger, "create_meal", async () => {
        const data = await client.post<Meal>("/api/v2/meal/", toJsonBody(args));
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
          toJsonBody(body),
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
          toJsonBody(args),
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
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_nutrition_plan",
    {
      description: "Create a new nutrition plan",
      inputSchema: createNutritionPlanSchema,
    },
    async (args) =>
      runTool(logger, "create_nutrition_plan", async () => {
        const data = await client.post<NutritionPlan>(
          "/api/v2/nutritionplan/",
          toJsonBody(args),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_nutrition_plan",
    {
      description: "Update an existing nutrition plan",
      inputSchema: updateNutritionPlanSchema,
    },
    async (args) =>
      runTool(logger, "update_nutrition_plan", async () => {
        const { id, ...body } = args;
        const data = await client.patch<NutritionPlan>(
          `/api/v2/nutritionplan/${id}/`,
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

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
          toJsonBody(args),
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
          toJsonBody(body),
        );
        return successResult(data);
      }),
  );

  logger.info("Nutrition tools registered");
}

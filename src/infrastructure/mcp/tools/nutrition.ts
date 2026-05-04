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
  NutritionPlanInfo,
  NutritionDiaryEntry,
  NutritionalValues,
} from "../../../domain/models/Nutrition.types.js";

const listIngredientsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  search: z.string().optional(),
  language: z.number().optional(),
});

const getIngredientSchema = z.object({
  id: z.number(),
});

const searchIngredientsSchema = z.object({
  term: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const getIngredientValuesSchema = z.object({
  id: z.number(),
});

const listIngredientImagesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  ingredient_id: z.number().optional(),
});

const getIngredientImageSchema = z.object({
  id: z.number(),
});

const listIngredientWeightUnitsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  ingredient: z.number().optional(),
});

const getIngredientWeightUnitSchema = z.object({
  id: z.number(),
});

const listMealsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  plan: z.number().optional(),
  order: z.number().optional(),
});

const getMealSchema = z.object({
  id: z.number(),
});

const getMealNutritionalValuesSchema = z.object({
  id: z.number(),
});

const listMealItemsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  meal: z.number().optional(),
  ingredient: z.number().optional(),
});

const getMealItemSchema = z.object({
  id: z.number(),
});

const getMealItemNutritionalValuesSchema = z.object({
  id: z.number(),
});

const listNutritionPlansSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  description: z.string().optional(),
});

const getNutritionPlanSchema = z.object({
  id: z.number(),
});

const getNutritionPlanNutritionalValuesSchema = z.object({
  id: z.number(),
});

const listNutritionDiaryEntriesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  plan: z.number().optional(),
  date: z.string().optional(),
});

const getNutritionDiaryEntrySchema = z.object({
  id: z.number(),
});

const getNutritionDiaryNutritionalValuesSchema = z.object({
  id: z.number(),
});

const createMealSchema = z.object({
  plan: z.number(),
  time: z.string().nullable().optional(),
  name: z.string().max(25).optional(),
});

const updateMealSchema = z.object({
  id: z.number(),
  plan: z.number().optional(),
  time: z.string().nullable().optional(),
  name: z.string().max(25).optional(),
});

const createMealItemSchema = z.object({
  meal: z.number(),
  ingredient: z.number(),
  weight_unit: z.number().nullable().optional(),
  amount: z.string(),
});

const updateMealItemSchema = z.object({
  id: z.number(),
  meal: z.number().optional(),
  ingredient: z.number().optional(),
  weight_unit: z.number().nullable().optional(),
  amount: z.string().optional(),
});

const createNutritionPlanSchema = z.object({
  start: z.string().optional(),
  end: z.string().nullable().optional(),
  description: z.string().max(80).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z.number().nullable().optional(),
  goal_protein: z.number().nullable().optional(),
  goal_carbohydrates: z.number().nullable().optional(),
  goal_fat: z.number().nullable().optional(),
  goal_fiber: z.number().nullable().optional(),
});

const updateNutritionPlanSchema = z.object({
  id: z.number(),
  start: z.string().optional(),
  end: z.string().nullable().optional(),
  description: z.string().max(80).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z.number().nullable().optional(),
  goal_protein: z.number().nullable().optional(),
  goal_carbohydrates: z.number().nullable().optional(),
  goal_fat: z.number().nullable().optional(),
  goal_fiber: z.number().nullable().optional(),
});

const createNutritionDiaryEntrySchema = z.object({
  plan: z.number(),
  meal: z.number().nullable().optional(),
  ingredient: z.number(),
  weight_unit: z.number().nullable().optional(),
  datetime: z.string().optional(),
  amount: z.string(),
});

const updateNutritionDiaryEntrySchema = z.object({
  id: z.number(),
  plan: z.number().optional(),
  meal: z.number().nullable().optional(),
  ingredient: z.number().optional(),
  weight_unit: z.number().nullable().optional(),
  datetime: z.string().optional(),
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
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            limit: args.limit,
            offset: args.offset,
            name__search: args.search,
            language: args.language,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_ingredient",
    {
      description: "Get ingredient by ID",
      inputSchema: getIngredientSchema,
    },
    async (args) => {
      try {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "search_ingredients",
    {
      description: "Search ingredients",
      inputSchema: searchIngredientsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            name__search: args.term,
            limit: args.limit,
            offset: args.offset,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_ingredient_values",
    {
      description: "Get nutritional values for an ingredient",
      inputSchema: getIngredientValuesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/get_values/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_ingredient_images",
    {
      description: "List ingredient images",
      inputSchema: listIngredientImagesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<IngredientImage>>(
          "/api/v2/ingredient-image/",
          {
            limit: args.limit,
            offset: args.offset,
            ingredient_id: args.ingredient_id,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_ingredient_image",
    {
      description: "Get ingredient image by ID",
      inputSchema: getIngredientImageSchema,
    },
    async (args) => {
      try {
        const data = await client.get<IngredientImage>(
          `/api/v2/ingredient-image/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_ingredient_weight_units",
    {
      description: "List ingredient weight units",
      inputSchema: listIngredientWeightUnitsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<
          WgerPaginatedResponse<IngredientWeightUnit>
        >("/api/v2/ingredientweightunit/", {
          limit: args.limit,
          offset: args.offset,
          ingredient: args.ingredient,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_ingredient_weight_unit",
    {
      description: "Get ingredient weight unit by ID",
      inputSchema: getIngredientWeightUnitSchema,
    },
    async (args) => {
      try {
        const data = await client.get<IngredientWeightUnit>(
          `/api/v2/ingredientweightunit/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_meals",
    {
      description: "List meals",
      inputSchema: listMealsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<Meal>>(
          "/api/v2/meal/",
          {
            limit: args.limit,
            offset: args.offset,
            plan: args.plan,
            order: args.order,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_meal",
    {
      description: "Get meal by ID",
      inputSchema: getMealSchema,
    },
    async (args) => {
      try {
        const data = await client.get<Meal>(`/api/v2/meal/${args.id}/`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_meal_nutritional_values",
    {
      description: "Get nutritional values for a meal",
      inputSchema: getMealNutritionalValuesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionalValues>(
          `/api/v2/meal/${args.id}/nutritional_values/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_meal_items",
    {
      description: "List meal items",
      inputSchema: listMealItemsSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<MealItem>>(
          "/api/v2/mealitem/",
          {
            limit: args.limit,
            offset: args.offset,
            meal: args.meal,
            ingredient: args.ingredient,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_meal_item",
    {
      description: "Get meal item by ID",
      inputSchema: getMealItemSchema,
    },
    async (args) => {
      try {
        const data = await client.get<MealItem>(`/api/v2/mealitem/${args.id}/`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_meal_item_nutritional_values",
    {
      description: "Get nutritional values for a meal item",
      inputSchema: getMealItemNutritionalValuesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionalValues>(
          `/api/v2/mealitem/${args.id}/nutritional_values/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_nutrition_plans",
    {
      description: "List nutrition plans",
      inputSchema: listNutritionPlansSchema,
    },
    async (args) => {
      try {
        const data = await client.get<WgerPaginatedResponse<NutritionPlanInfo>>(
          "/api/v2/nutritionplaninfo/",
          {
            limit: args.limit,
            offset: args.offset,
            description: args.description,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_nutrition_plan",
    {
      description: "Get nutrition plan by ID",
      inputSchema: getNutritionPlanSchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionPlanInfo>(
          `/api/v2/nutritionplaninfo/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_nutrition_plan_nutritional_values",
    {
      description: "Get nutritional values for a nutrition plan",
      inputSchema: getNutritionPlanNutritionalValuesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionalValues>(
          `/api/v2/nutritionplan/${args.id}/nutritional_values/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "list_nutrition_diary_entries",
    {
      description: "List nutrition diary entries",
      inputSchema: listNutritionDiaryEntriesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<
          WgerPaginatedResponse<NutritionDiaryEntry>
        >("/api/v2/nutritiondiary/", {
          limit: args.limit,
          offset: args.offset,
          plan: args.plan,
          datetime__date: args.date,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_nutrition_diary_entry",
    {
      description: "Get nutrition diary entry by ID",
      inputSchema: getNutritionDiaryEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionDiaryEntry>(
          `/api/v2/nutritiondiary/${args.id}/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "get_nutrition_diary_nutritional_values",
    {
      description: "Get nutritional values for a diary entry",
      inputSchema: getNutritionDiaryNutritionalValuesSchema,
    },
    async (args) => {
      try {
        const data = await client.get<NutritionalValues>(
          `/api/v2/nutritiondiary/${args.id}/nutritional_values/`,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_meal",
    {
      description: "Create a new meal",
      inputSchema: createMealSchema,
    },
    async (args) => {
      try {
        const data = await client.post<Meal>(
          "/api/v2/meal/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_meal",
    {
      description: "Update an existing meal",
      inputSchema: updateMealSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<Meal>(
          `/api/v2/meal/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_meal_item",
    {
      description: "Create a new meal item",
      inputSchema: createMealItemSchema,
    },
    async (args) => {
      try {
        const data = await client.post<MealItem>(
          "/api/v2/mealitem/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_meal_item",
    {
      description: "Update an existing meal item",
      inputSchema: updateMealItemSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<MealItem>(
          `/api/v2/mealitem/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_nutrition_plan",
    {
      description: "Create a new nutrition plan",
      inputSchema: createNutritionPlanSchema,
    },
    async (args) => {
      try {
        const data = await client.post<NutritionPlan>(
          "/api/v2/nutritionplan/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_nutrition_plan",
    {
      description: "Update an existing nutrition plan",
      inputSchema: updateNutritionPlanSchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<NutritionPlan>(
          `/api/v2/nutritionplan/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "create_nutrition_diary_entry",
    {
      description: "Create a new nutrition diary entry",
      inputSchema: createNutritionDiaryEntrySchema,
    },
    async (args) => {
      try {
        const data = await client.post<NutritionDiaryEntry>(
          "/api/v2/nutritiondiary/",
          toJsonBody(args),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "update_nutrition_diary_entry",
    {
      description: "Update an existing nutrition diary entry",
      inputSchema: updateNutritionDiaryEntrySchema,
    },
    async (args) => {
      try {
        const { id, ...body } = args;
        const data = await client.put<NutritionDiaryEntry>(
          `/api/v2/nutritiondiary/${id}/`,
          toJsonBody(body),
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, data }),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: false, error: message }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  logger.info("Nutrition tools registered");
}

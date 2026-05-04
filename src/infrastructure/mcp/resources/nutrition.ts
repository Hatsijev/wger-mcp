import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  IngredientInfo,
  Meal,
  MealItem,
  NutritionPlan,
  NutritionDiaryEntry,
} from "../../../domain/models/Nutrition.types.js";

export function registerNutritionResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "ingredients",
    "wger://ingredients",
    {
      mimeType: "application/json",
      description: "List of ingredients",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
        "/api/v2/ingredientinfo/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://ingredients",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "ingredient-by-id",
    new ResourceTemplate("wger://ingredients/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single ingredient",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<IngredientInfo>(
        `/api/v2/ingredientinfo/${id}/`,
      );
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "meals",
    "wger://meals",
    {
      mimeType: "application/json",
      description: "List of meals",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Meal>>(
        "/api/v2/meal/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://meals",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "meal-by-id",
    new ResourceTemplate("wger://meals/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single meal",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<Meal>(`/api/v2/meal/${id}/`);
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "meal-items",
    "wger://meal-items",
    {
      mimeType: "application/json",
      description: "List of meal items",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<MealItem>>(
        "/api/v2/mealitem/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://meal-items",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "meal-item-by-id",
    new ResourceTemplate("wger://meal-items/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single meal item",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<MealItem>(`/api/v2/mealitem/${id}/`);
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "nutrition-plans",
    "wger://nutrition-plans",
    {
      mimeType: "application/json",
      description: "List of nutrition plans",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<NutritionPlan>>(
        "/api/v2/nutritionplan/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://nutrition-plans",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "nutrition-plan-by-id",
    new ResourceTemplate("wger://nutrition-plans/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single nutrition plan",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<NutritionPlan>(
        `/api/v2/nutritionplan/${id}/`,
      );
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "nutrition-diary",
    "wger://nutrition-diary",
    {
      mimeType: "application/json",
      description: "List of nutrition diary entries",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<NutritionDiaryEntry>>(
        "/api/v2/nutritiondiary/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://nutrition-diary",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "nutrition-diary-entry-by-id",
    new ResourceTemplate("wger://nutrition-diary/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single nutrition diary entry",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<NutritionDiaryEntry>(
        `/api/v2/nutritiondiary/${id}/`,
      );
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  logger.info("Nutrition resources registered");
}

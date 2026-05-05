import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Meal, MealItem } from "../../../domain/models/Nutrition.types.js";
import {
  paginatedResponseSchema,
  mealResponseSchema,
  mealItemResponseSchema,
} from "../responseSchemas.js";

export function registerMealResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
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
        paginatedResponseSchema(mealResponseSchema),
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
      const data = await client.get<Meal>(
        `/api/v2/meal/${id}/`,
        undefined,
        mealResponseSchema,
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
        paginatedResponseSchema(mealItemResponseSchema),
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
      const data = await client.get<MealItem>(
        `/api/v2/mealitem/${id}/`,
        undefined,
        mealItemResponseSchema,
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

  logger.info("Meal resources registered");
}

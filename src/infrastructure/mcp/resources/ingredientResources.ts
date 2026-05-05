import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { IngredientInfo } from "../../../domain/models/Nutrition.types.js";
import {
  paginatedResponseSchema,
  ingredientInfoResponseSchema,
} from "../responseSchemas.js";

export function registerIngredientResources(
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
        paginatedResponseSchema(ingredientInfoResponseSchema),
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
        undefined,
        ingredientInfoResponseSchema,
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

  logger.info("Ingredient resources registered");
}

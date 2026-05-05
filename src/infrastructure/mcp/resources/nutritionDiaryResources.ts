import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { NutritionDiaryEntry } from "../../../domain/models/Nutrition.types.js";
import { paginatedResponseSchema, nutritionDiaryEntryResponseSchema } from "../responseSchemas.js";

export function registerNutritionDiaryResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
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
        paginatedResponseSchema(nutritionDiaryEntryResponseSchema),
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
        undefined,
        nutritionDiaryEntryResponseSchema,
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

  logger.info("Nutrition diary resources registered");
}

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { NutritionPlan } from "../../../domain/models/Nutrition.types.js";
import { paginatedResponseSchema, nutritionPlanResponseSchema } from "../responseSchemas.js";

export function registerNutritionPlanResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
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
        paginatedResponseSchema(nutritionPlanResponseSchema),
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
        undefined,
        nutritionPlanResponseSchema,
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

  logger.info("Nutrition plan resources registered");
}

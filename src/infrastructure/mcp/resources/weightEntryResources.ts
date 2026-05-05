import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { WeightEntry } from "../../../domain/models/Routine.types.js";
import {
  paginatedResponseSchema,
  weightEntryResponseSchema,
} from "../responseSchemas.js";

export function registerWeightEntryResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "weight-entries",
    "wger://weight-entries",
    {
      mimeType: "application/json",
      description: "List of weight entries",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<WeightEntry>>(
        "/api/v2/weightentry/",
        { limit: 20 },
        paginatedResponseSchema(weightEntryResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://weight-entries",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "weight-entry-by-id",
    new ResourceTemplate("wger://weight-entries/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single weight entry",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<WeightEntry>(
        `/api/v2/weightentry/${id}/`,
        undefined,
        weightEntryResponseSchema,
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

  logger.info("Weight entry resources registered");
}

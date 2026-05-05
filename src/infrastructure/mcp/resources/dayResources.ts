import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Day } from "../../../domain/models/Routine.types.js";
import { paginatedResponseSchema, dayResponseSchema } from "../responseSchemas.js";

export function registerDayResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "days",
    "wger://days",
    {
      mimeType: "application/json",
      description: "List of days",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Day>>(
        "/api/v2/day/",
        { limit: 20 },
        paginatedResponseSchema(dayResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://days",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "day-by-id",
    new ResourceTemplate("wger://days/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single day",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<Day>(`/api/v2/day/${id}/`, undefined, dayResponseSchema);
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

  logger.info("Day resources registered");
}

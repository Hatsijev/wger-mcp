import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Routine } from "../../../domain/models/Routine.types.js";
import {
  paginatedResponseSchema,
  routineResponseSchema,
} from "../responseSchemas.js";

export function registerRoutineResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "routines",
    "wger://routines",
    {
      mimeType: "application/json",
      description: "List of routines",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Routine>>(
        "/api/v2/routine/",
        { limit: 20 },
        paginatedResponseSchema(routineResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://routines",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "routine-by-id",
    new ResourceTemplate("wger://routines/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single routine",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<Routine>(
        `/api/v2/routine/${id}/`,
        undefined,
        routineResponseSchema,
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

  logger.info("Routine resources registered");
}

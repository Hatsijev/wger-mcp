import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { Slot } from "../../../domain/models/Routine.types.js";
import {
  paginatedResponseSchema,
  slotResponseSchema,
} from "../responseSchemas.js";

export function registerSlotResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "slots",
    "wger://slots",
    {
      mimeType: "application/json",
      description: "List of slots",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Slot>>(
        "/api/v2/slot/",
        { limit: 20 },
        paginatedResponseSchema(slotResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://slots",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "slot-by-id",
    new ResourceTemplate("wger://slots/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single slot",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<Slot>(
        `/api/v2/slot/${id}/`,
        undefined,
        slotResponseSchema,
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

  logger.info("Slot resources registered");
}

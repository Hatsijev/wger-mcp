import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { SlotEntry } from "../../../domain/models/Routine.types.js";
import { paginatedResponseSchema, slotEntryResponseSchema } from "../responseSchemas.js";

export function registerSlotEntryResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "slot-entries",
    "wger://slot-entries",
    {
      mimeType: "application/json",
      description: "List of slot entries",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<SlotEntry>>(
        "/api/v2/slot-entry/",
        { limit: 20 },
        paginatedResponseSchema(slotEntryResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://slot-entries",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "slot-entry-by-id",
    new ResourceTemplate("wger://slot-entries/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single slot entry",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<SlotEntry>(`/api/v2/slot-entry/${id}/`, undefined, slotEntryResponseSchema);
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

  logger.info("Slot entry resources registered");
}

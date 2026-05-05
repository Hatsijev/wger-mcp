import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { GalleryImage } from "../../../domain/models/Routine.types.js";
import { paginatedResponseSchema, galleryImageResponseSchema } from "../responseSchemas.js";

export function registerGalleryResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "gallery",
    "wger://gallery",
    {
      mimeType: "application/json",
      description: "List of gallery images",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<GalleryImage>>(
        "/api/v2/gallery/",
        { limit: 20 },
        paginatedResponseSchema(galleryImageResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://gallery",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "gallery-image-by-id",
    new ResourceTemplate("wger://gallery/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single gallery image",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<GalleryImage>(`/api/v2/gallery/${id}/`, undefined, galleryImageResponseSchema);
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

  logger.info("Gallery resources registered");
}

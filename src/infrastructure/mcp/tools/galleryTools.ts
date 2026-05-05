import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { GalleryImage, ImageRequest, PatchedImageRequest } from "../../../domain/models/Routine.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";

const listGalleryImagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const getGalleryImageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createGalleryImageSchema = z.object({
  date: isoDateStringSchema,
  image: boundedStringSchema(2000),
  description: boundedStringSchema(1000).optional(),
});

const updateGalleryImageSchema = z.object({
  id: positiveIntegerIdSchema,
  date: isoDateStringSchema.optional(),
  image: boundedStringSchema(2000).optional(),
  description: boundedStringSchema(1000).optional(),
});

export function registerGalleryTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_gallery_images",
    {
      description: "List gallery images",
      inputSchema: listGalleryImagesSchema,
    },
    async (args) =>
      runTool(logger, "list_gallery_images", async () => {
        const data = await client.get<WgerPaginatedResponse<GalleryImage>>(
          "/api/v2/gallery/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_gallery_image",
    {
      description: "Get gallery image by ID",
      inputSchema: getGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "get_gallery_image", async () => {
        const data = await client.get<GalleryImage>(
          `/api/v2/gallery/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "create_gallery_image",
    {
      description: "Create a new gallery image",
      inputSchema: createGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "create_gallery_image", async () => {
        const data = await client.post<GalleryImage>(
          "/api/v2/gallery/",
          toJsonBody(args) as ImageRequest,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "update_gallery_image",
    {
      description: "Update an existing gallery image",
      inputSchema: updateGalleryImageSchema,
    },
    async (args) =>
      runTool(logger, "update_gallery_image", async () => {
        const { id, ...body } = args;
        const data = await client.patch<GalleryImage>(
          `/api/v2/gallery/${id}/`,
          toJsonBody(body) as PatchedImageRequest,
        );
        return successResult(data);
      }),
  );

  logger.info("Gallery tools registered");
}

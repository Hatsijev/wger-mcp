import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listGalleryImagesEndpoint,
  getGalleryImageEndpoint,
  createGalleryImageEndpoint,
  updateGalleryImageEndpoint,
} from "../endpoints/galleryEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

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
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_gallery_images",
    { description: "List gallery images", inputSchema: listGalleryImagesSchema },
    endpointHandler(client, logger, "list_gallery_images", listGalleryImagesEndpoint),
  );

  server.registerTool(
    "get_gallery_image",
    { description: "Get gallery image by ID", inputSchema: getGalleryImageSchema },
    endpointHandler(client, logger, "get_gallery_image", getGalleryImageEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_gallery_image",
      { description: "Create a new gallery image", inputSchema: createGalleryImageSchema },
      endpointHandler(client, logger, "create_gallery_image", createGalleryImageEndpoint),
    );

    server.registerTool(
      "update_gallery_image",
      { description: "Update an existing gallery image", inputSchema: updateGalleryImageSchema },
      endpointHandler(client, logger, "update_gallery_image", updateGalleryImageEndpoint),
    );
  }

  logger.info("Gallery tools registered");
}

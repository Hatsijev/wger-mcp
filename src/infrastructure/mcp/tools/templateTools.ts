import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listTemplatesEndpoint,
  getTemplateEndpoint,
  listPublicTemplatesEndpoint,
  getPublicTemplateEndpoint,
} from "../endpoints/templateEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";

const listTemplatesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  created: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
});

const getTemplateSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listPublicTemplatesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  created: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
});

const getPublicTemplateSchema = z.object({
  id: positiveIntegerIdSchema,
});

export function registerTemplateTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_templates",
    { description: "List routine templates for the current user", inputSchema: listTemplatesSchema },
    endpointHandler(client, logger, "list_templates", listTemplatesEndpoint),
  );

  server.registerTool(
    "get_template",
    { description: "Get a routine template by ID", inputSchema: getTemplateSchema },
    endpointHandler(client, logger, "get_template", getTemplateEndpoint),
  );

  server.registerTool(
    "list_public_templates",
    { description: "List public routine templates", inputSchema: listPublicTemplatesSchema },
    endpointHandler(client, logger, "list_public_templates", listPublicTemplatesEndpoint),
  );

  server.registerTool(
    "get_public_template",
    { description: "Get a public routine template by ID", inputSchema: getPublicTemplateSchema },
    endpointHandler(client, logger, "get_public_template", getPublicTemplateEndpoint),
  );

  logger.info("Template tools registered");
}

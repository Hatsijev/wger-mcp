import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler, directToolHandler } from "../EndpointExecutor.js";
import {
  listLanguagesEndpoint,
  getLanguageEndpoint,
  listLicensesEndpoint,
  getLicenseEndpoint,
  listRepetitionUnitsEndpoint,
  getRepetitionUnitEndpoint,
  listWeightUnitsEndpoint,
  getWeightUnitEndpoint,
  getSchemaEndpoint,
} from "../endpoints/referenceEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";

const listLanguagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  full_name: z.string().optional(),
  short_name: z.string().optional(),
});

const getLanguageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listLicensesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  full_name: z.string().optional(),
  short_name: z.string().optional(),
  url: z.string().optional(),
});

const getLicenseSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listRepetitionUnitsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  name: z.string().optional(),
});

const getRepetitionUnitSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listWeightUnitsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  name: z.string().optional(),
});

const getWeightUnitSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getSchemaSchema = z.object({
  format: z.enum(["json", "yaml"]).optional(),
  lang: z.string().optional(),
});

export function registerReferenceTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_languages",
    {
      description: "List languages used in the application",
      inputSchema: listLanguagesSchema,
    },
    endpointHandler(client, logger, "list_languages", listLanguagesEndpoint),
  );

  server.registerTool(
    "get_language",
    { description: "Get a language by ID", inputSchema: getLanguageSchema },
    endpointHandler(client, logger, "get_language", getLanguageEndpoint),
  );

  server.registerTool(
    "list_licenses",
    { description: "List licenses", inputSchema: listLicensesSchema },
    endpointHandler(client, logger, "list_licenses", listLicensesEndpoint),
  );

  server.registerTool(
    "get_license",
    { description: "Get a license by ID", inputSchema: getLicenseSchema },
    endpointHandler(client, logger, "get_license", getLicenseEndpoint),
  );

  server.registerTool(
    "list_repetition_units",
    {
      description: "List repetition units",
      inputSchema: listRepetitionUnitsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_repetition_units",
      listRepetitionUnitsEndpoint,
    ),
  );

  server.registerTool(
    "get_repetition_unit",
    {
      description: "Get a repetition unit by ID",
      inputSchema: getRepetitionUnitSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_repetition_unit",
      getRepetitionUnitEndpoint,
    ),
  );

  server.registerTool(
    "list_weight_units",
    { description: "List weight units", inputSchema: listWeightUnitsSchema },
    endpointHandler(
      client,
      logger,
      "list_weight_units",
      listWeightUnitsEndpoint,
    ),
  );

  server.registerTool(
    "get_weight_unit",
    {
      description: "Get a weight unit by ID",
      inputSchema: getWeightUnitSchema,
    },
    endpointHandler(client, logger, "get_weight_unit", getWeightUnitEndpoint),
  );

  server.registerTool(
    "get_wger_version",
    { description: "Get the Wger application version" },
    directToolHandler(logger, "get_wger_version", () =>
      client.get("/api/v2/version/"),
    ),
  );

  server.registerTool(
    "get_wger_schema",
    {
      description: "Get the Wger OpenAPI schema",
      inputSchema: getSchemaSchema,
    },
    endpointHandler(client, logger, "get_wger_schema", getSchemaEndpoint),
  );

  server.registerTool(
    "get_min_app_version",
    { description: "Get the minimum required app version" },
    directToolHandler(logger, "get_min_app_version", () =>
      client.get("/api/v2/min-app-version/"),
    ),
  );

  server.registerTool(
    "get_min_server_version",
    { description: "Get the minimum required server version for sync" },
    directToolHandler(logger, "get_min_server_version", () =>
      client.get("/api/v2/min-server-version/"),
    ),
  );

  logger.info("Reference tools registered");
}

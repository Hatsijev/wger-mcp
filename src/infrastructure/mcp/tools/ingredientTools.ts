import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listIngredientsEndpoint,
  getIngredientEndpoint,
  searchIngredientsEndpoint,
  getIngredientValuesEndpoint,
  listIngredientImagesEndpoint,
  getIngredientImageEndpoint,
  listIngredientWeightUnitsEndpoint,
  getIngredientWeightUnitEndpoint,
} from "../endpoints/nutritionEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

const listIngredientsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  search: boundedStringSchema(100).optional(),
  language: positiveIntegerIdSchema.optional(),
});

const getIngredientSchema = z.object({
  id: positiveIntegerIdSchema,
});

const searchIngredientsSchema = z.object({
  term: boundedStringSchema(100),
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const getIngredientValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listIngredientImagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ingredient_id: positiveIntegerIdSchema.optional(),
});

const getIngredientImageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listIngredientWeightUnitsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ingredient: positiveIntegerIdSchema.optional(),
});

const getIngredientWeightUnitSchema = z.object({
  id: positiveIntegerIdSchema,
});

export function registerIngredientTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_ingredients",
    {
      description: "List ingredients",
      inputSchema: listIngredientsSchema,
    },
    endpointHandler(client, logger, "list_ingredients", listIngredientsEndpoint),
  );

  server.registerTool(
    "get_ingredient",
    {
      description: "Get ingredient by ID",
      inputSchema: getIngredientSchema,
    },
    endpointHandler(client, logger, "get_ingredient", getIngredientEndpoint),
  );

  server.registerTool(
    "search_ingredients",
    {
      description: "Search ingredients",
      inputSchema: searchIngredientsSchema,
    },
    endpointHandler(client, logger, "search_ingredients", searchIngredientsEndpoint),
  );

  server.registerTool(
    "get_ingredient_values",
    {
      description: "Get nutritional values for an ingredient",
      inputSchema: getIngredientValuesSchema,
    },
    endpointHandler(client, logger, "get_ingredient_values", getIngredientValuesEndpoint),
  );

  server.registerTool(
    "list_ingredient_images",
    {
      description: "List ingredient images",
      inputSchema: listIngredientImagesSchema,
    },
    endpointHandler(client, logger, "list_ingredient_images", listIngredientImagesEndpoint),
  );

  server.registerTool(
    "get_ingredient_image",
    {
      description: "Get ingredient image by ID",
      inputSchema: getIngredientImageSchema,
    },
    endpointHandler(client, logger, "get_ingredient_image", getIngredientImageEndpoint),
  );

  server.registerTool(
    "list_ingredient_weight_units",
    {
      description: "List ingredient weight units",
      inputSchema: listIngredientWeightUnitsSchema,
    },
    endpointHandler(client, logger, "list_ingredient_weight_units", listIngredientWeightUnitsEndpoint),
  );

  server.registerTool(
    "get_ingredient_weight_unit",
    {
      description: "Get ingredient weight unit by ID",
      inputSchema: getIngredientWeightUnitSchema,
    },
    endpointHandler(client, logger, "get_ingredient_weight_unit", getIngredientWeightUnitEndpoint),
  );

  logger.info("Ingredient tools registered");
}

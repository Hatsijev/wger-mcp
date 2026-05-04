import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  IngredientInfo,
  IngredientImage,
  IngredientWeightUnit,
} from "../../../domain/models/Nutrition.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult } from "../toolResult.js";

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
  ingredient: z.number().optional(),
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
    async (args) =>
      runTool(logger, "list_ingredients", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            limit: args.limit,
            offset: args.offset,
            name__search: args.search,
            language: args.language,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient",
    {
      description: "Get ingredient by ID",
      inputSchema: getIngredientSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient", async () => {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "search_ingredients",
    {
      description: "Search ingredients",
      inputSchema: searchIngredientsSchema,
    },
    async (args) =>
      runTool(logger, "search_ingredients", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientInfo>>(
          "/api/v2/ingredientinfo/",
          {
            name__search: args.term,
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_values",
    {
      description: "Get nutritional values for an ingredient",
      inputSchema: getIngredientValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_values", async () => {
        const data = await client.get<IngredientInfo>(
          `/api/v2/ingredientinfo/${args.id}/get_values/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_ingredient_images",
    {
      description: "List ingredient images",
      inputSchema: listIngredientImagesSchema,
    },
    async (args) =>
      runTool(logger, "list_ingredient_images", async () => {
        const data = await client.get<WgerPaginatedResponse<IngredientImage>>(
          "/api/v2/ingredient-image/",
          {
            limit: args.limit,
            offset: args.offset,
            ingredient_id: args.ingredient_id,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_image",
    {
      description: "Get ingredient image by ID",
      inputSchema: getIngredientImageSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_image", async () => {
        const data = await client.get<IngredientImage>(
          `/api/v2/ingredient-image/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_ingredient_weight_units",
    {
      description: "List ingredient weight units",
      inputSchema: listIngredientWeightUnitsSchema,
    },
    async (args) =>
      runTool(logger, "list_ingredient_weight_units", async () => {
        const data = await client.get<
          WgerPaginatedResponse<IngredientWeightUnit>
        >("/api/v2/ingredientweightunit/", {
          limit: args.limit,
          offset: args.offset,
          ingredient: args.ingredient,
        });
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_ingredient_weight_unit",
    {
      description: "Get ingredient weight unit by ID",
      inputSchema: getIngredientWeightUnitSchema,
    },
    async (args) =>
      runTool(logger, "get_ingredient_weight_unit", async () => {
        const data = await client.get<IngredientWeightUnit>(
          `/api/v2/ingredientweightunit/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  logger.info("Ingredient tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  NutritionPlan,
  NutritionalValues,
  NutritionPlanRequest,
  PatchedNutritionPlanRequest,
} from "../../../domain/models/Nutrition.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";
import { runTool, successResult, toJsonBody } from "../toolResult.js";
import {
  paginatedResponseSchema,
  nutritionPlanResponseSchema,
} from "../responseSchemas.js";

const listNutritionPlansSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  description: boundedStringSchema(80).optional(),
});

const getNutritionPlanSchema = z.object({
  id: positiveIntegerIdSchema,
});

const getNutritionPlanNutritionalValuesSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createNutritionPlanSchema = z.object({
  start: isoDateStringSchema.optional(),
  end: isoDateStringSchema.nullable().optional(),
  description: boundedStringSchema(80).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_protein: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_carbohydrates: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_fat: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_fiber: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
});

const updateNutritionPlanSchema = z.object({
  id: positiveIntegerIdSchema,
  start: isoDateStringSchema.optional(),
  end: isoDateStringSchema.nullable().optional(),
  description: boundedStringSchema(80).optional(),
  only_logging: z.boolean().optional(),
  goal_energy: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_protein: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_carbohydrates: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_fat: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
  goal_fiber: z
    .number()
    .int()
    .min(-2147483648)
    .max(2147483647)
    .nullable()
    .optional(),
});

export function registerNutritionPlanTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_nutrition_plans",
    {
      description: "List nutrition plans",
      inputSchema: listNutritionPlansSchema,
    },
    async (args) =>
      runTool(logger, "list_nutrition_plans", async () => {
        const data = await client.get<WgerPaginatedResponse<NutritionPlan>>(
          "/api/v2/nutritionplan/",
          {
            limit: args.limit,
            offset: args.offset,
            description: args.description,
          },
          paginatedResponseSchema(nutritionPlanResponseSchema),
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_plan",
    {
      description: "Get nutrition plan by ID",
      inputSchema: getNutritionPlanSchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_plan", async () => {
        const data = await client.get<NutritionPlan>(
          `/api/v2/nutritionplan/${args.id}/`,
          undefined,
          nutritionPlanResponseSchema,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_nutrition_plan_nutritional_values",
    {
      description: "Get nutritional values for a nutrition plan",
      inputSchema: getNutritionPlanNutritionalValuesSchema,
    },
    async (args) =>
      runTool(logger, "get_nutrition_plan_nutritional_values", async () => {
        const data = await client.get<NutritionalValues>(
          `/api/v2/nutritionplan/${args.id}/nutritional_values/`,
        );
        return successResult(data);
      }),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_nutrition_plan",
      {
        description: "Create a new nutrition plan",
        inputSchema: createNutritionPlanSchema,
      },
      async (args) =>
        runTool(logger, "create_nutrition_plan", async () => {
          const data = await client.post<NutritionPlan>(
            "/api/v2/nutritionplan/",
            toJsonBody(args) as NutritionPlanRequest,
            nutritionPlanResponseSchema,
          );
          return successResult(data);
        }),
    );

    server.registerTool(
      "update_nutrition_plan",
      {
        description: "Update an existing nutrition plan",
        inputSchema: updateNutritionPlanSchema,
      },
      async (args) =>
        runTool(logger, "update_nutrition_plan", async () => {
          const { id, ...body } = args;
          const data = await client.patch<NutritionPlan>(
            `/api/v2/nutritionplan/${id}/`,
            toJsonBody(body) as PatchedNutritionPlanRequest,
            nutritionPlanResponseSchema,
          );
          return successResult(data);
        }),
    );
  }

  logger.info("Nutrition plan tools registered");
}

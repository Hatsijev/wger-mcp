import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listNutritionPlansEndpoint,
  getNutritionPlanEndpoint,
  getNutritionPlanNutritionalValuesEndpoint,
  createNutritionPlanEndpoint,
  updateNutritionPlanEndpoint,
} from "../endpoints/nutritionEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

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
    endpointHandler(client, logger, "list_nutrition_plans", listNutritionPlansEndpoint),
  );

  server.registerTool(
    "get_nutrition_plan",
    {
      description: "Get nutrition plan by ID",
      inputSchema: getNutritionPlanSchema,
    },
    endpointHandler(client, logger, "get_nutrition_plan", getNutritionPlanEndpoint),
  );

  server.registerTool(
    "get_nutrition_plan_nutritional_values",
    {
      description: "Get nutritional values for a nutrition plan",
      inputSchema: getNutritionPlanNutritionalValuesSchema,
    },
    endpointHandler(client, logger, "get_nutrition_plan_nutritional_values", getNutritionPlanNutritionalValuesEndpoint),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_nutrition_plan",
      {
        description: "Create a new nutrition plan",
        inputSchema: createNutritionPlanSchema,
      },
      endpointHandler(client, logger, "create_nutrition_plan", createNutritionPlanEndpoint),
    );

    server.registerTool(
      "update_nutrition_plan",
      {
        description: "Update an existing nutrition plan",
        inputSchema: updateNutritionPlanSchema,
      },
      endpointHandler(client, logger, "update_nutrition_plan", updateNutritionPlanEndpoint),
    );
  }

  logger.info("Nutrition plan tools registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";
import { endpointHandler, directToolHandler } from "../EndpointExecutor.js";
import {
  listExercisesEndpoint,
  getExerciseEndpoint,
  searchExercisesEndpoint,
  listMusclesEndpoint,
  listEquipmentEndpoint,
  listExerciseCategoriesEndpoint,
} from "../endpoints/exerciseEndpoints.js";

const listExercisesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  category: positiveIntegerIdSchema.optional(),
  equipment: positiveIntegerIdSchema.optional(),
  language: positiveIntegerIdSchema.optional(),
});

const getExerciseSchema = z.object({
  id: positiveIntegerIdSchema,
});

const searchExercisesSchema = z.object({
  term: z.string().min(1),
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const listMusclesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const listEquipmentSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

const listExerciseCategoriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
});

export function registerExerciseTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_exercises",
    {
      description: "List exercises with pagination and optional filtering",
      inputSchema: listExercisesSchema,
    },
    endpointHandler(client, logger, "list_exercises", listExercisesEndpoint),
  );

  server.registerTool(
    "get_exercise",
    {
      description: "Get a single exercise by its ID",
      inputSchema: getExerciseSchema,
    },
    endpointHandler(client, logger, "get_exercise", getExerciseEndpoint),
  );

  server.registerTool(
    "search_exercises",
    {
      description: "Search exercises by name or description",
      inputSchema: searchExercisesSchema,
    },
    endpointHandler(
      client,
      logger,
      "search_exercises",
      searchExercisesEndpoint,
    ),
  );

  server.registerTool(
    "list_muscles",
    {
      description: "List all muscles",
      inputSchema: listMusclesSchema,
    },
    endpointHandler(client, logger, "list_muscles", listMusclesEndpoint),
  );

  server.registerTool(
    "list_equipment",
    {
      description: "List all equipment",
      inputSchema: listEquipmentSchema,
    },
    endpointHandler(client, logger, "list_equipment", listEquipmentEndpoint),
  );

  server.registerTool(
    "list_exercise_categories",
    {
      description: "List all exercise categories",
      inputSchema: listExerciseCategoriesSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_categories",
      listExerciseCategoriesEndpoint,
    ),
  );

  server.registerTool(
    "get_wger_status",
    {
      description: "Check connectivity to the Wger API instance",
    },
    directToolHandler(logger, "get_wger_status", () => client.getStatus()),
  );

  logger.info("Exercise tools registered");
}

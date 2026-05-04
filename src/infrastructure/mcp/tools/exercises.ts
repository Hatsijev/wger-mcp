import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  ExerciseInfo,
  Muscle,
  Equipment,
  ExerciseCategory,
} from "../../../domain/models/Exercise.types.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";
import { runTool, successResult } from "../toolResult.js";

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
    async (args) =>
      runTool(logger, "list_exercises", async () => {
        const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
          "/api/v2/exerciseinfo/",
          {
            limit: args.limit,
            offset: args.offset,
            category: args.category,
            equipment: args.equipment,
            language: args.language,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_exercise",
    {
      description: "Get a single exercise by its ID",
      inputSchema: getExerciseSchema,
    },
    async (args) =>
      runTool(logger, "get_exercise", async () => {
        const data = await client.get<ExerciseInfo>(
          `/api/v2/exerciseinfo/${args.id}/`,
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "search_exercises",
    {
      description: "Search exercises by name or description",
      inputSchema: searchExercisesSchema,
    },
    async (args) =>
      runTool(logger, "search_exercises", async () => {
        const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
          "/api/v2/exerciseinfo/",
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
    "list_muscles",
    {
      description: "List all muscles",
      inputSchema: listMusclesSchema,
    },
    async (args) =>
      runTool(logger, "list_muscles", async () => {
        const data = await client.get<WgerPaginatedResponse<Muscle>>(
          "/api/v2/muscle/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_equipment",
    {
      description: "List all equipment",
      inputSchema: listEquipmentSchema,
    },
    async (args) =>
      runTool(logger, "list_equipment", async () => {
        const data = await client.get<WgerPaginatedResponse<Equipment>>(
          "/api/v2/equipment/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "list_exercise_categories",
    {
      description: "List all exercise categories",
      inputSchema: listExerciseCategoriesSchema,
    },
    async (args) =>
      runTool(logger, "list_exercise_categories", async () => {
        const data = await client.get<WgerPaginatedResponse<ExerciseCategory>>(
          "/api/v2/exercisecategory/",
          {
            limit: args.limit,
            offset: args.offset,
          },
        );
        return successResult(data);
      }),
  );

  server.registerTool(
    "get_wger_status",
    {
      description: "Check connectivity to the Wger API instance",
    },
    async () =>
      runTool(logger, "get_wger_status", async () => {
        const data = await client.getStatus();
        return successResult(data);
      }),
  );

  logger.info("Exercise tools registered");
}

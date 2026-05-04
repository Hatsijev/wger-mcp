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

const listExercisesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  category: z.number().optional(),
  equipment: z.number().optional(),
  language: z.number().optional(),
});

const getExerciseSchema = z.object({
  id: z.number(),
});

const searchExercisesSchema = z.object({
  term: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const listMusclesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const listEquipmentSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const listExerciseCategoriesSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
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
    async (args) => {
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
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_exercise",
    {
      description: "Get a single exercise by its ID",
      inputSchema: getExerciseSchema,
    },
    async (args) => {
      const data = await client.get<ExerciseInfo>(
        `/api/v2/exerciseinfo/${args.id}/`,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "search_exercises",
    {
      description: "Search exercises by name or description",
      inputSchema: searchExercisesSchema,
    },
    async (args) => {
      const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
        "/api/v2/exerciseinfo/",
        {
          name__search: args.term,
          limit: args.limit,
          offset: args.offset,
        },
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "list_muscles",
    {
      description: "List all muscles",
      inputSchema: listMusclesSchema,
    },
    async (args) => {
      const data = await client.get<WgerPaginatedResponse<Muscle>>(
        "/api/v2/muscle/",
        {
          limit: args.limit,
          offset: args.offset,
        },
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "list_equipment",
    {
      description: "List all equipment",
      inputSchema: listEquipmentSchema,
    },
    async (args) => {
      const data = await client.get<WgerPaginatedResponse<Equipment>>(
        "/api/v2/equipment/",
        {
          limit: args.limit,
          offset: args.offset,
        },
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "list_exercise_categories",
    {
      description: "List all exercise categories",
      inputSchema: listExerciseCategoriesSchema,
    },
    async (args) => {
      const data = await client.get<WgerPaginatedResponse<ExerciseCategory>>(
        "/api/v2/exercisecategory/",
        {
          limit: args.limit,
          offset: args.offset,
        },
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_wger_status",
    {
      description: "Check connectivity to the Wger API instance",
    },
    async () => {
      const data = await client.getStatus();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, data }),
          },
        ],
      };
    },
  );

  logger.info("Exercise tools registered");
}

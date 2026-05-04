import { z } from "zod";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
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
  server: Server,
  client: WgerClient,
  logger: Logger,
): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_exercises",
          description: "List exercises with pagination",
          inputSchema: {
            type: "object" as const,
            properties: {
              limit: { type: "number" as const },
              offset: { type: "number" as const },
              category: { type: "number" as const },
              equipment: { type: "number" as const },
              language: { type: "number" as const },
            },
          },
        },
        {
          name: "get_exercise",
          description: "Get single exercise by ID",
          inputSchema: {
            type: "object" as const,
            properties: {
              id: { type: "number" as const },
            },
            required: ["id"],
          },
        },
        {
          name: "search_exercises",
          description: "Search exercises",
          inputSchema: {
            type: "object" as const,
            properties: {
              term: { type: "string" as const },
              limit: { type: "number" as const },
              offset: { type: "number" as const },
            },
            required: ["term"],
          },
        },
        {
          name: "list_muscles",
          description: "List all muscles",
          inputSchema: {
            type: "object" as const,
            properties: {
              limit: { type: "number" as const },
              offset: { type: "number" as const },
            },
          },
        },
        {
          name: "list_equipment",
          description: "List all equipment",
          inputSchema: {
            type: "object" as const,
            properties: {
              limit: { type: "number" as const },
              offset: { type: "number" as const },
            },
          },
        },
        {
          name: "list_exercise_categories",
          description: "List all exercise categories",
          inputSchema: {
            type: "object" as const,
            properties: {
              limit: { type: "number" as const },
              offset: { type: "number" as const },
            },
          },
        },
        {
          name: "get_wger_status",
          description: "Check Wger connectivity",
          inputSchema: {
            type: "object" as const,
            properties: {},
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments ?? {};

    try {
      switch (toolName) {
        case "list_exercises": {
          const parsed = listExercisesSchema.parse(args);
          const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
            "/api/v2/exerciseinfo/",
            {
              limit: parsed.limit,
              offset: parsed.offset,
              category: parsed.category,
              equipment: parsed.equipment,
              language: parsed.language,
            },
          );
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "get_exercise": {
          const parsed = getExerciseSchema.parse(args);
          const data = await client.get<ExerciseInfo>(
            `/api/v2/exerciseinfo/${parsed.id}/`,
          );
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "search_exercises": {
          const parsed = searchExercisesSchema.parse(args);
          const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
            "/api/v2/exerciseinfo/",
            {
              name__search: parsed.term,
              limit: parsed.limit,
              offset: parsed.offset,
            },
          );
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "list_muscles": {
          const parsed = listMusclesSchema.parse(args);
          const data = await client.get<WgerPaginatedResponse<Muscle>>(
            "/api/v2/muscle/",
            {
              limit: parsed.limit,
              offset: parsed.offset,
            },
          );
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "list_equipment": {
          const parsed = listEquipmentSchema.parse(args);
          const data = await client.get<WgerPaginatedResponse<Equipment>>(
            "/api/v2/equipment/",
            {
              limit: parsed.limit,
              offset: parsed.offset,
            },
          );
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "list_exercise_categories": {
          const parsed = listExerciseCategoriesSchema.parse(args);
          const data = await client.get<
            WgerPaginatedResponse<ExerciseCategory>
          >("/api/v2/exercisecategory/", {
            limit: parsed.limit,
            offset: parsed.offset,
          });
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        case "get_wger_status": {
          const data = await client.getStatus();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ok: true, data }),
              },
            ],
          };
        }
        default: {
          const errorText = JSON.stringify({
            ok: false,
            error: `Unknown tool: ${toolName}`,
          });
          return {
            content: [{ type: "text" as const, text: errorText }],
            isError: true,
          };
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Tool execution failed", { tool: toolName, error: message });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ ok: false, error: message }),
          },
        ],
        isError: true,
      };
    }
  });
}

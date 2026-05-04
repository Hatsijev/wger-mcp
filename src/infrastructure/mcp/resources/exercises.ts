import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
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

export function registerExerciseResources(
  server: Server,
  client: WgerClient,
  logger: Logger,
): void {
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "wger://exercises",
          name: "Exercises",
          mimeType: "application/json",
        },
        {
          uri: "wger://muscles",
          name: "Muscles",
          mimeType: "application/json",
        },
        {
          uri: "wger://equipment",
          name: "Equipment",
          mimeType: "application/json",
        },
        {
          uri: "wger://categories",
          name: "Exercise Categories",
          mimeType: "application/json",
        },
      ],
    };
  });

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    return {
      resourceTemplates: [
        {
          uriTemplate: "wger://exercises/{id}",
          name: "Exercise by ID",
          mimeType: "application/json",
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
      if (uri === "wger://exercises") {
        const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
          "/api/v2/exerciseinfo/",
          { limit: 20 },
        );
        return {
          contents: [
            { uri, mimeType: "application/json", text: JSON.stringify(data) },
          ],
        };
      }

      if (uri === "wger://muscles") {
        const data = await client.get<WgerPaginatedResponse<Muscle>>(
          "/api/v2/muscle/",
          { limit: 20 },
        );
        return {
          contents: [
            { uri, mimeType: "application/json", text: JSON.stringify(data) },
          ],
        };
      }

      if (uri === "wger://equipment") {
        const data = await client.get<WgerPaginatedResponse<Equipment>>(
          "/api/v2/equipment/",
          { limit: 20 },
        );
        return {
          contents: [
            { uri, mimeType: "application/json", text: JSON.stringify(data) },
          ],
        };
      }

      if (uri === "wger://categories") {
        const data = await client.get<WgerPaginatedResponse<ExerciseCategory>>(
          "/api/v2/exercisecategory/",
          { limit: 20 },
        );
        return {
          contents: [
            { uri, mimeType: "application/json", text: JSON.stringify(data) },
          ],
        };
      }

      const exerciseMatch = /^wger:\/\/exercises\/(\d+)$/.exec(uri);
      if (exerciseMatch !== null) {
        const id = Number(exerciseMatch[1]);
        const data = await client.get<ExerciseInfo>(
          `/api/v2/exerciseinfo/${id}/`,
        );
        return {
          contents: [
            { uri, mimeType: "application/json", text: JSON.stringify(data) },
          ],
        };
      }

      throw new Error(`Unknown resource URI: ${uri}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Resource read failed", { uri, error: message });
      throw new Error(`Failed to read resource ${uri}: ${message}`);
    }
  });
}

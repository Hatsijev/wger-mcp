import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
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
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "exercises",
    "wger://exercises",
    {
      mimeType: "application/json",
      description: "List of all exercises",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<ExerciseInfo>>(
        "/api/v2/exerciseinfo/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://exercises",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "muscles",
    "wger://muscles",
    {
      mimeType: "application/json",
      description: "List of all muscles",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Muscle>>(
        "/api/v2/muscle/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://muscles",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "equipment",
    "wger://equipment",
    {
      mimeType: "application/json",
      description: "List of all equipment",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Equipment>>(
        "/api/v2/equipment/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://equipment",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "categories",
    "wger://categories",
    {
      mimeType: "application/json",
      description: "List of all exercise categories",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<ExerciseCategory>>(
        "/api/v2/exercisecategory/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://categories",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "exercise-by-id",
    new ResourceTemplate("wger://exercises/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Get a single exercise by ID",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<ExerciseInfo>(
        `/api/v2/exerciseinfo/${id}/`,
      );
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  logger.info("Exercise resources registered");
}

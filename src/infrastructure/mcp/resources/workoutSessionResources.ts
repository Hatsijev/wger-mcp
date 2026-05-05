import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { WorkoutSession } from "../../../domain/models/Routine.types.js";
import {
  paginatedResponseSchema,
  workoutSessionResponseSchema,
} from "../responseSchemas.js";

export function registerWorkoutSessionResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "workout-sessions",
    "wger://workout-sessions",
    {
      mimeType: "application/json",
      description: "List of workout sessions",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<WorkoutSession>>(
        "/api/v2/workoutsession/",
        { limit: 20 },
        paginatedResponseSchema(workoutSessionResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://workout-sessions",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "workout-session-by-id",
    new ResourceTemplate("wger://workout-sessions/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single workout session",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<WorkoutSession>(
        `/api/v2/workoutsession/${id}/`,
        undefined,
        workoutSessionResponseSchema,
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

  logger.info("Workout session resources registered");
}

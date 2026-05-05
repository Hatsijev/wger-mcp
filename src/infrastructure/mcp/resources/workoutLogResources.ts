import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { validateResourceId } from "../toolResult.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import { WorkoutLog } from "../../../domain/models/Routine.types.js";
import { paginatedResponseSchema, workoutLogResponseSchema } from "../responseSchemas.js";

export function registerWorkoutLogResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "workout-logs",
    "wger://workout-logs",
    {
      mimeType: "application/json",
      description: "List of workout logs",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<WorkoutLog>>(
        "/api/v2/workoutlog/",
        { limit: 20 },
        paginatedResponseSchema(workoutLogResponseSchema),
      );
      return {
        contents: [
          {
            uri: "wger://workout-logs",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "workout-log-by-id",
    new ResourceTemplate("wger://workout-logs/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single workout log",
    },
    async (uri, variables) => {
      const id = validateResourceId(variables.id);
      const data = await client.get<WorkoutLog>(`/api/v2/workoutlog/${id}/`, undefined, workoutLogResponseSchema);
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

  logger.info("Workout log resources registered");
}

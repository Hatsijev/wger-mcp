import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Routine,
  Day,
  Slot,
  SlotEntry,
  WorkoutLog,
  WorkoutSession,
  WeightEntry,
  GalleryImage,
} from "../../../domain/models/Routine.types.js";

export function registerRoutineResources(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerResource(
    "routines",
    "wger://routines",
    {
      mimeType: "application/json",
      description: "List of routines",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Routine>>(
        "/api/v2/routine/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://routines",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "routine-by-id",
    new ResourceTemplate("wger://routines/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single routine",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<Routine>(`/api/v2/routine/${id}/`);
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

  server.registerResource(
    "days",
    "wger://days",
    {
      mimeType: "application/json",
      description: "List of days",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Day>>(
        "/api/v2/day/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://days",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "day-by-id",
    new ResourceTemplate("wger://days/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single day",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<Day>(`/api/v2/day/${id}/`);
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

  server.registerResource(
    "slots",
    "wger://slots",
    {
      mimeType: "application/json",
      description: "List of slots",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<Slot>>(
        "/api/v2/slot/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://slots",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "slot-by-id",
    new ResourceTemplate("wger://slots/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single slot",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<Slot>(`/api/v2/slot/${id}/`);
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

  server.registerResource(
    "slot-entries",
    "wger://slot-entries",
    {
      mimeType: "application/json",
      description: "List of slot entries",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<SlotEntry>>(
        "/api/v2/slot-entry/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://slot-entries",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "slot-entry-by-id",
    new ResourceTemplate("wger://slot-entries/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single slot entry",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<SlotEntry>(`/api/v2/slot-entry/${id}/`);
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
      const id = Number(variables.id);
      const data = await client.get<WorkoutLog>(`/api/v2/workoutlog/${id}/`);
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
      const id = Number(variables.id);
      const data = await client.get<WorkoutSession>(
        `/api/v2/workoutsession/${id}/`,
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

  server.registerResource(
    "weight-entries",
    "wger://weight-entries",
    {
      mimeType: "application/json",
      description: "List of weight entries",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<WeightEntry>>(
        "/api/v2/weightentry/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://weight-entries",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "weight-entry-by-id",
    new ResourceTemplate("wger://weight-entries/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single weight entry",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<WeightEntry>(`/api/v2/weightentry/${id}/`);
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

  server.registerResource(
    "gallery",
    "wger://gallery",
    {
      mimeType: "application/json",
      description: "List of gallery images",
    },
    async () => {
      const data = await client.get<WgerPaginatedResponse<GalleryImage>>(
        "/api/v2/gallery/",
        { limit: 20 },
      );
      return {
        contents: [
          {
            uri: "wger://gallery",
            mimeType: "application/json",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  );

  server.registerResource(
    "gallery-image-by-id",
    new ResourceTemplate("wger://gallery/{id}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Single gallery image",
    },
    async (uri, variables) => {
      const id = Number(variables.id);
      const data = await client.get<GalleryImage>(`/api/v2/gallery/${id}/`);
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

  logger.info("Routine resources registered");
}

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listTrophiesEndpoint,
  getTrophyEndpoint,
  listTrophyProgressEndpoint,
  listUserTrophiesEndpoint,
  getUserTrophyEndpoint,
  listUserStatisticsEndpoint,
  getUserStatisticsEndpoint,
} from "../endpoints/trophyEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";

const listTrophiesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  id: positiveIntegerIdSchema.optional(),
  id__in: z.string().optional(),
  is_active: z.boolean().optional(),
  is_hidden: z.boolean().optional(),
  is_progressive: z.boolean().optional(),
  is_repeatable: z.boolean().optional(),
  trophy_type: z
    .enum(["time", "volume", "count", "sequence", "date", "pr", "other"])
    .optional(),
  trophy_type__in: z.string().optional(),
});

const getTrophySchema = z.object({
  id: positiveIntegerIdSchema,
});

const listTrophyProgressSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const listUserTrophiesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  earned_at: z.string().optional(),
  earned_at__gt: z.string().optional(),
  earned_at__gte: z.string().optional(),
  earned_at__lt: z.string().optional(),
  earned_at__lte: z.string().optional(),
  id: positiveIntegerIdSchema.optional(),
  id__in: z.string().optional(),
  is_notified: z.boolean().optional(),
  trophy: positiveIntegerIdSchema.optional(),
  trophy__in: z.string().optional(),
  trophy__is_active: z.boolean().optional(),
  trophy__is_hidden: z.boolean().optional(),
  trophy__is_repeatable: z.boolean().optional(),
  trophy__trophy_type: z
    .enum(["time", "volume", "count", "sequence", "date", "pr", "other"])
    .optional(),
  trophy__trophy_type__in: z.string().optional(),
});

const getUserTrophySchema = z.object({
  id: positiveIntegerIdSchema,
});

const listUserStatisticsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getUserStatisticsSchema = z.object({
  id: positiveIntegerIdSchema,
});

export function registerTrophyTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
): void {
  server.registerTool(
    "list_trophies",
    { description: "List available trophies", inputSchema: listTrophiesSchema },
    endpointHandler(client, logger, "list_trophies", listTrophiesEndpoint),
  );

  server.registerTool(
    "get_trophy",
    { description: "Get a trophy by ID", inputSchema: getTrophySchema },
    endpointHandler(client, logger, "get_trophy", getTrophyEndpoint),
  );

  server.registerTool(
    "list_trophy_progress",
    {
      description: "List trophy progress for the current user",
      inputSchema: listTrophyProgressSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_trophy_progress",
      listTrophyProgressEndpoint,
    ),
  );

  server.registerTool(
    "list_user_trophies",
    {
      description: "List trophies earned by the current user",
      inputSchema: listUserTrophiesSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_user_trophies",
      listUserTrophiesEndpoint,
    ),
  );

  server.registerTool(
    "get_user_trophy",
    {
      description: "Get a user trophy by ID",
      inputSchema: getUserTrophySchema,
    },
    endpointHandler(client, logger, "get_user_trophy", getUserTrophyEndpoint),
  );

  server.registerTool(
    "list_user_statistics",
    {
      description: "List user statistics",
      inputSchema: listUserStatisticsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_user_statistics",
      listUserStatisticsEndpoint,
    ),
  );

  server.registerTool(
    "get_user_statistics",
    {
      description: "Get user statistics by ID",
      inputSchema: getUserStatisticsSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_user_statistics",
      getUserStatisticsEndpoint,
    ),
  );

  logger.info("Trophy tools registered");
}

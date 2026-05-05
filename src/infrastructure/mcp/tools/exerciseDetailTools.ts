import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listExerciseTranslationsEndpoint,
  getExerciseTranslationEndpoint,
  createExerciseTranslationEndpoint,
  updateExerciseTranslationEndpoint,
  listExerciseAliasesEndpoint,
  getExerciseAliasEndpoint,
  createExerciseAliasEndpoint,
  updateExerciseAliasEndpoint,
  listExerciseCommentsEndpoint,
  getExerciseCommentEndpoint,
  createExerciseCommentEndpoint,
  updateExerciseCommentEndpoint,
  listExerciseImagesEndpoint,
  getExerciseImageEndpoint,
  listExerciseVideosEndpoint,
  getExerciseVideoEndpoint,
} from "../endpoints/exerciseDetailEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

const listExerciseTranslationsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  exercise: positiveIntegerIdSchema.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  uuid: z.string().uuid().optional(),
  created: z.string().optional(),
});

const getExerciseTranslationSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createExerciseTranslationSchema = z.object({
  name: boundedStringSchema(200),
  exercise: positiveIntegerIdSchema,
  description: boundedStringSchema(2000),
  description_source: z.string().optional(),
  language: positiveIntegerIdSchema,
  license_author: z.string().nullable().optional(),
});

const updateExerciseTranslationSchema = z.object({
  id: positiveIntegerIdSchema,
  name: boundedStringSchema(200).optional(),
  exercise: positiveIntegerIdSchema.optional(),
  description: boundedStringSchema(2000).optional(),
  description_source: z.string().optional(),
  language: positiveIntegerIdSchema.optional(),
  license_author: z.string().nullable().optional(),
});

const listExerciseAliasesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  alias: z.string().optional(),
  translation: positiveIntegerIdSchema.optional(),
});

const getExerciseAliasSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createExerciseAliasSchema = z.object({
  translation: positiveIntegerIdSchema,
  alias: boundedStringSchema(200),
});

const updateExerciseAliasSchema = z.object({
  id: positiveIntegerIdSchema,
  translation: positiveIntegerIdSchema.optional(),
  alias: boundedStringSchema(200).optional(),
});

const listExerciseCommentsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  comment: z.string().optional(),
  translation: positiveIntegerIdSchema.optional(),
});

const getExerciseCommentSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createExerciseCommentSchema = z.object({
  translation: positiveIntegerIdSchema,
  comment: boundedStringSchema(200),
});

const updateExerciseCommentSchema = z.object({
  id: positiveIntegerIdSchema,
  translation: positiveIntegerIdSchema.optional(),
  comment: boundedStringSchema(200).optional(),
});

const listExerciseImagesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  exercise: positiveIntegerIdSchema.optional(),
  is_main: z.boolean().optional(),
  license: positiveIntegerIdSchema.optional(),
  license_author: z.string().optional(),
});

const getExerciseImageSchema = z.object({
  id: positiveIntegerIdSchema,
});

const listExerciseVideosSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  exercise: positiveIntegerIdSchema.optional(),
  is_main: z.boolean().optional(),
  license: positiveIntegerIdSchema.optional(),
  license_author: z.string().optional(),
});

const getExerciseVideoSchema = z.object({
  id: positiveIntegerIdSchema,
});

export function registerExerciseDetailTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_exercise_translations",
    {
      description: "List exercise translations",
      inputSchema: listExerciseTranslationsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_translations",
      listExerciseTranslationsEndpoint,
    ),
  );

  server.registerTool(
    "get_exercise_translation",
    {
      description: "Get an exercise translation by ID",
      inputSchema: getExerciseTranslationSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_exercise_translation",
      getExerciseTranslationEndpoint,
    ),
  );

  server.registerTool(
    "list_exercise_aliases",
    {
      description: "List exercise aliases",
      inputSchema: listExerciseAliasesSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_aliases",
      listExerciseAliasesEndpoint,
    ),
  );

  server.registerTool(
    "get_exercise_alias",
    {
      description: "Get an exercise alias by ID",
      inputSchema: getExerciseAliasSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_exercise_alias",
      getExerciseAliasEndpoint,
    ),
  );

  server.registerTool(
    "list_exercise_comments",
    {
      description: "List exercise comments",
      inputSchema: listExerciseCommentsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_comments",
      listExerciseCommentsEndpoint,
    ),
  );

  server.registerTool(
    "get_exercise_comment",
    {
      description: "Get an exercise comment by ID",
      inputSchema: getExerciseCommentSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_exercise_comment",
      getExerciseCommentEndpoint,
    ),
  );

  server.registerTool(
    "list_exercise_images",
    {
      description: "List exercise images",
      inputSchema: listExerciseImagesSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_images",
      listExerciseImagesEndpoint,
    ),
  );

  server.registerTool(
    "get_exercise_image",
    {
      description: "Get an exercise image by ID",
      inputSchema: getExerciseImageSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_exercise_image",
      getExerciseImageEndpoint,
    ),
  );

  server.registerTool(
    "list_exercise_videos",
    {
      description: "List exercise videos",
      inputSchema: listExerciseVideosSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_exercise_videos",
      listExerciseVideosEndpoint,
    ),
  );

  server.registerTool(
    "get_exercise_video",
    {
      description: "Get an exercise video by ID",
      inputSchema: getExerciseVideoSchema,
    },
    endpointHandler(
      client,
      logger,
      "get_exercise_video",
      getExerciseVideoEndpoint,
    ),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_exercise_translation",
      {
        description: "Create a new exercise translation",
        inputSchema: createExerciseTranslationSchema,
      },
      endpointHandler(
        client,
        logger,
        "create_exercise_translation",
        createExerciseTranslationEndpoint,
      ),
    );

    server.registerTool(
      "update_exercise_translation",
      {
        description: "Update an existing exercise translation",
        inputSchema: updateExerciseTranslationSchema,
      },
      endpointHandler(
        client,
        logger,
        "update_exercise_translation",
        updateExerciseTranslationEndpoint,
      ),
    );

    server.registerTool(
      "create_exercise_alias",
      {
        description: "Create a new exercise alias",
        inputSchema: createExerciseAliasSchema,
      },
      endpointHandler(
        client,
        logger,
        "create_exercise_alias",
        createExerciseAliasEndpoint,
      ),
    );

    server.registerTool(
      "update_exercise_alias",
      {
        description: "Update an existing exercise alias",
        inputSchema: updateExerciseAliasSchema,
      },
      endpointHandler(
        client,
        logger,
        "update_exercise_alias",
        updateExerciseAliasEndpoint,
      ),
    );

    server.registerTool(
      "create_exercise_comment",
      {
        description: "Create a new exercise comment",
        inputSchema: createExerciseCommentSchema,
      },
      endpointHandler(
        client,
        logger,
        "create_exercise_comment",
        createExerciseCommentEndpoint,
      ),
    );

    server.registerTool(
      "update_exercise_comment",
      {
        description: "Update an existing exercise comment",
        inputSchema: updateExerciseCommentSchema,
      },
      endpointHandler(
        client,
        logger,
        "update_exercise_comment",
        updateExerciseCommentEndpoint,
      ),
    );
  }

  logger.info("Exercise detail tools registered");
}

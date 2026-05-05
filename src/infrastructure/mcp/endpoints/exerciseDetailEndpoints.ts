import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  ExerciseImage,
  ExerciseVideoInfo,
  ExerciseInfoAlias,
  ExerciseComment,
  ExerciseTranslationBaseInfo,
  ExerciseTranslationRequest,
  PatchedExerciseTranslationRequest,
  ExerciseAliasRequest,
  PatchedExerciseAliasRequest,
  ExerciseCommentRequest,
  PatchedExerciseCommentRequest,
} from "../../../domain/models/Exercise.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  exerciseImageResponseSchema,
  exerciseVideoResponseSchema,
  exerciseAliasResponseSchema,
  exerciseCommentResponseSchema,
  exerciseTranslationResponseSchema,
} from "../responseSchemas.js";

// ── Exercise Translation ──

export const listExerciseTranslationsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    exercise?: number | undefined;
    name?: string | undefined;
    description?: string | undefined;
    uuid?: string | undefined;
    created?: string | undefined;
  },
  WgerPaginatedResponse<ExerciseTranslationBaseInfo>
> = {
  method: "GET",
  path: "/api/v2/exercise-translation/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    exercise: args.exercise,
    name: args.name,
    description: args.description,
    uuid: args.uuid,
    created: args.created,
  }),
  responseSchema: paginatedResponseSchema(exerciseTranslationResponseSchema),
};

export const getExerciseTranslationEndpoint: EndpointDescriptor<
  { id: number },
  ExerciseTranslationBaseInfo
> = {
  method: "GET",
  path: (args) => `/api/v2/exercise-translation/${args.id}/`,
  responseSchema: exerciseTranslationResponseSchema,
};

export const createExerciseTranslationEndpoint: EndpointDescriptor<
  {
    name: string;
    exercise: number;
    description: string;
    description_source?: string | undefined;
    language: number;
    license_author?: string | null | undefined;
  },
  ExerciseTranslationBaseInfo,
  ExerciseTranslationRequest
> = {
  method: "POST",
  path: "/api/v2/exercise-translation/",
  mapBody: (args) => args as ExerciseTranslationRequest,
  responseSchema: exerciseTranslationResponseSchema,
};

export const updateExerciseTranslationEndpoint: EndpointDescriptor<
  {
    id: number;
    name?: string | undefined;
    exercise?: number | undefined;
    description?: string | undefined;
    description_source?: string | undefined;
    language?: number | undefined;
    license_author?: string | null | undefined;
  },
  ExerciseTranslationBaseInfo,
  PatchedExerciseTranslationRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/exercise-translation/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedExerciseTranslationRequest,
  responseSchema: exerciseTranslationResponseSchema,
};

// ── Exercise Alias ──

export const listExerciseAliasesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    alias?: string | undefined;
    translation?: number | undefined;
  },
  WgerPaginatedResponse<ExerciseInfoAlias>
> = {
  method: "GET",
  path: "/api/v2/exercisealias/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    alias: args.alias,
    translation: args.translation,
  }),
  responseSchema: paginatedResponseSchema(exerciseAliasResponseSchema),
};

export const getExerciseAliasEndpoint: EndpointDescriptor<
  { id: number },
  ExerciseInfoAlias
> = {
  method: "GET",
  path: (args) => `/api/v2/exercisealias/${args.id}/`,
  responseSchema: exerciseAliasResponseSchema,
};

export const createExerciseAliasEndpoint: EndpointDescriptor<
  { translation: number; alias: string },
  ExerciseInfoAlias,
  ExerciseAliasRequest
> = {
  method: "POST",
  path: "/api/v2/exercisealias/",
  mapBody: (args) => args as ExerciseAliasRequest,
  responseSchema: exerciseAliasResponseSchema,
};

export const updateExerciseAliasEndpoint: EndpointDescriptor<
  { id: number; translation?: number | undefined; alias?: string | undefined },
  ExerciseInfoAlias,
  PatchedExerciseAliasRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/exercisealias/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedExerciseAliasRequest,
  responseSchema: exerciseAliasResponseSchema,
};

// ── Exercise Comment ──

export const listExerciseCommentsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    comment?: string | undefined;
    translation?: number | undefined;
  },
  WgerPaginatedResponse<ExerciseComment>
> = {
  method: "GET",
  path: "/api/v2/exercisecomment/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    comment: args.comment,
    translation: args.translation,
  }),
  responseSchema: paginatedResponseSchema(exerciseCommentResponseSchema),
};

export const getExerciseCommentEndpoint: EndpointDescriptor<
  { id: number },
  ExerciseComment
> = {
  method: "GET",
  path: (args) => `/api/v2/exercisecomment/${args.id}/`,
  responseSchema: exerciseCommentResponseSchema,
};

export const createExerciseCommentEndpoint: EndpointDescriptor<
  { translation: number; comment: string },
  ExerciseComment,
  ExerciseCommentRequest
> = {
  method: "POST",
  path: "/api/v2/exercisecomment/",
  mapBody: (args) => args as ExerciseCommentRequest,
  responseSchema: exerciseCommentResponseSchema,
};

export const updateExerciseCommentEndpoint: EndpointDescriptor<
  {
    id: number;
    translation?: number | undefined;
    comment?: string | undefined;
  },
  ExerciseComment,
  PatchedExerciseCommentRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/exercisecomment/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedExerciseCommentRequest,
  responseSchema: exerciseCommentResponseSchema,
};

// ── Exercise Image (read-only; uploads not supported via MCP text interface) ──

export const listExerciseImagesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    exercise?: number | undefined;
    is_main?: boolean | undefined;
    license?: number | undefined;
    license_author?: string | undefined;
  },
  WgerPaginatedResponse<ExerciseImage>
> = {
  method: "GET",
  path: "/api/v2/exerciseimage/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    exercise: args.exercise,
    is_main: args.is_main,
    license: args.license,
    license_author: args.license_author,
  }),
  responseSchema: paginatedResponseSchema(exerciseImageResponseSchema),
};

export const getExerciseImageEndpoint: EndpointDescriptor<
  { id: number },
  ExerciseImage
> = {
  method: "GET",
  path: (args) => `/api/v2/exerciseimage/${args.id}/`,
  responseSchema: exerciseImageResponseSchema,
};

// ── Exercise Video (read-only; uploads not supported via MCP text interface) ──

export const listExerciseVideosEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    exercise?: number | undefined;
    is_main?: boolean | undefined;
    license?: number | undefined;
    license_author?: string | undefined;
  },
  WgerPaginatedResponse<ExerciseVideoInfo>
> = {
  method: "GET",
  path: "/api/v2/video/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    exercise: args.exercise,
    is_main: args.is_main,
    license: args.license,
    license_author: args.license_author,
  }),
  responseSchema: paginatedResponseSchema(exerciseVideoResponseSchema),
};

export const getExerciseVideoEndpoint: EndpointDescriptor<
  { id: number },
  ExerciseVideoInfo
> = {
  method: "GET",
  path: (args) => `/api/v2/video/${args.id}/`,
  responseSchema: exerciseVideoResponseSchema,
};

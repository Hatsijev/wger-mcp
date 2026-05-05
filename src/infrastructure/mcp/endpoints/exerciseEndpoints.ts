import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  ExerciseInfo,
  Muscle,
  Equipment,
  ExerciseCategory,
} from "../../../domain/models/Exercise.types.js";
import {
  paginatedResponseSchema,
  exerciseInfoResponseSchema,
  muscleResponseSchema,
  equipmentResponseSchema,
  exerciseCategoryResponseSchema,
} from "../responseSchemas.js";
import { GetEndpointDescriptor } from "../EndpointDescriptor.js";

export const listExercisesEndpoint: GetEndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    category?: number | undefined;
    equipment?: number | undefined;
    language?: number | undefined;
  },
  WgerPaginatedResponse<ExerciseInfo>
> = {
  method: "GET",
  path: "/api/v2/exerciseinfo/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    category: args.category,
    equipment: args.equipment,
    language: args.language,
  }),
  responseSchema: paginatedResponseSchema(exerciseInfoResponseSchema),
};

export const getExerciseEndpoint: GetEndpointDescriptor<
  { id: number },
  ExerciseInfo
> = {
  method: "GET",
  path: (args) => `/api/v2/exerciseinfo/${args.id}/`,
  responseSchema: exerciseInfoResponseSchema,
};

export const searchExercisesEndpoint: GetEndpointDescriptor<
  { term: string; limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<ExerciseInfo>
> = {
  method: "GET",
  path: "/api/v2/exerciseinfo/",
  mapParams: (args) => ({
    name__search: args.term,
    limit: args.limit,
    offset: args.offset,
  }),
  responseSchema: paginatedResponseSchema(exerciseInfoResponseSchema),
};

export const listMusclesEndpoint: GetEndpointDescriptor<
  { limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<Muscle>
> = {
  method: "GET",
  path: "/api/v2/muscle/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
  }),
  responseSchema: paginatedResponseSchema(muscleResponseSchema),
};

export const listEquipmentEndpoint: GetEndpointDescriptor<
  { limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<Equipment>
> = {
  method: "GET",
  path: "/api/v2/equipment/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
  }),
  responseSchema: paginatedResponseSchema(equipmentResponseSchema),
};

export const listExerciseCategoriesEndpoint: GetEndpointDescriptor<
  { limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<ExerciseCategory>
> = {
  method: "GET",
  path: "/api/v2/exercisecategory/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
  }),
  responseSchema: paginatedResponseSchema(exerciseCategoryResponseSchema),
};

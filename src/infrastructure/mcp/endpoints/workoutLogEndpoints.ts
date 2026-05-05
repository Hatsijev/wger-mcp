import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  WorkoutLog,
  WorkoutLogRequest,
  PatchedWorkoutLogRequest,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import { paginatedResponseSchema, workoutLogResponseSchema } from "../responseSchemas.js";

export const listWorkoutLogsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    routine?: number | undefined;
    date?: string | undefined;
  },
  WgerPaginatedResponse<WorkoutLog>
> = {
  method: "GET",
  path: "/api/v2/workoutlog/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    routine: args.routine,
    date: args.date,
  }),
  responseSchema: paginatedResponseSchema(workoutLogResponseSchema),
};

export const getWorkoutLogEndpoint: EndpointDescriptor<{ id: number }, WorkoutLog> = {
  method: "GET",
  path: (args) => `/api/v2/workoutlog/${args.id}/`,
  responseSchema: workoutLogResponseSchema,
};

export const createWorkoutLogEndpoint: EndpointDescriptor<
  {
    date?: string | undefined;
    routine?: number | null | undefined;
    iteration?: number | null | undefined;
    slot_entry?: number | null | undefined;
    next_log?: number | null | undefined;
    exercise: number;
    repetitions_unit?: number | null | undefined;
    repetitions?: string | null | undefined;
    repetitions_target?: string | null | undefined;
    weight_unit?: number | null | undefined;
    weight?: string | null | undefined;
    weight_target?: string | null | undefined;
    rir?: string | null | undefined;
    rir_target?: string | null | undefined;
    rest?: number | null | undefined;
    rest_target?: number | null | undefined;
  },
  WorkoutLog,
  WorkoutLogRequest
> = {
  method: "POST",
  path: "/api/v2/workoutlog/",
  mapBody: (args) => args as WorkoutLogRequest,
  responseSchema: workoutLogResponseSchema,
};

export const updateWorkoutLogEndpoint: EndpointDescriptor<
  {
    id: number;
    date?: string | undefined;
    routine?: number | null | undefined;
    iteration?: number | null | undefined;
    slot_entry?: number | null | undefined;
    next_log?: number | null | undefined;
    exercise?: number | undefined;
    repetitions_unit?: number | null | undefined;
    repetitions?: string | null | undefined;
    repetitions_target?: string | null | undefined;
    weight_unit?: number | null | undefined;
    weight?: string | null | undefined;
    weight_target?: string | null | undefined;
    rir?: string | null | undefined;
    rir_target?: string | null | undefined;
    rest?: number | null | undefined;
    rest_target?: number | null | undefined;
  },
  WorkoutLog,
  PatchedWorkoutLogRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/workoutlog/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedWorkoutLogRequest,
  responseSchema: workoutLogResponseSchema,
};

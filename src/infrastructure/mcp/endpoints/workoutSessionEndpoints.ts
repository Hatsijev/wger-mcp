import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  WorkoutSession,
  WorkoutSessionRequest,
  PatchedWorkoutSessionRequest,
  ImpressionEnum,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  workoutSessionResponseSchema,
} from "../responseSchemas.js";

export const listWorkoutSessionsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    date?: string | undefined;
  },
  WgerPaginatedResponse<WorkoutSession>
> = {
  method: "GET",
  path: "/api/v2/workoutsession/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    date: args.date,
  }),
  responseSchema: paginatedResponseSchema(workoutSessionResponseSchema),
};

export const getWorkoutSessionEndpoint: EndpointDescriptor<
  { id: number },
  WorkoutSession
> = {
  method: "GET",
  path: (args) => `/api/v2/workoutsession/${args.id}/`,
  responseSchema: workoutSessionResponseSchema,
};

export const createWorkoutSessionEndpoint: EndpointDescriptor<
  {
    routine?: number | null | undefined;
    day?: number | null | undefined;
    date?: string | undefined;
    notes?: string | null | undefined;
    impression?: ImpressionEnum | undefined;
    time_start?: string | null | undefined;
    time_end?: string | null | undefined;
  },
  WorkoutSession,
  WorkoutSessionRequest
> = {
  method: "POST",
  path: "/api/v2/workoutsession/",
  mapBody: (args) => args as WorkoutSessionRequest,
  responseSchema: workoutSessionResponseSchema,
};

export const updateWorkoutSessionEndpoint: EndpointDescriptor<
  {
    id: number;
    routine?: number | null | undefined;
    day?: number | null | undefined;
    date?: string | undefined;
    notes?: string | null | undefined;
    impression?: ImpressionEnum | undefined;
    time_start?: string | null | undefined;
    time_end?: string | null | undefined;
  },
  WorkoutSession,
  PatchedWorkoutSessionRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/workoutsession/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedWorkoutSessionRequest,
  responseSchema: workoutSessionResponseSchema,
};

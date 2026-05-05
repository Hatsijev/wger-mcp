import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Routine,
  RoutineRequest,
  PatchedRoutineRequest,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  routineResponseSchema,
} from "../responseSchemas.js";

export const listRoutinesEndpoint: EndpointDescriptor<
  { limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<Routine>
> = {
  method: "GET",
  path: "/api/v2/routine/",
  mapParams: (args) => ({ limit: args.limit, offset: args.offset }),
  responseSchema: paginatedResponseSchema(routineResponseSchema),
};

export const getRoutineEndpoint: EndpointDescriptor<{ id: number }, Routine> = {
  method: "GET",
  path: (args) => `/api/v2/routine/${args.id}/`,
  responseSchema: routineResponseSchema,
};

export const getRoutineStructureEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET_RAW",
  path: (args) => `/api/v2/routine/${args.id}/structure/`,
};

export const getRoutineLogsEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET_RAW",
  path: (args) => `/api/v2/routine/${args.id}/logs/`,
};

export const getRoutineStatsEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET_RAW",
  path: (args) => `/api/v2/routine/${args.id}/stats/`,
};

export const getRoutineDateSequenceDisplayEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET_RAW",
  path: (args) => `/api/v2/routine/${args.id}/date-sequence-display/`,
};

export const getRoutineDateSequenceGymEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET_RAW",
  path: (args) => `/api/v2/routine/${args.id}/date-sequence-gym/`,
};

export const createRoutineEndpoint: EndpointDescriptor<
  {
    name?: string | undefined;
    description?: string | undefined;
    start: string;
    end: string;
    fit_in_week?: boolean | undefined;
    is_template?: boolean | undefined;
    is_public?: boolean | undefined;
  },
  Routine,
  RoutineRequest
> = {
  method: "POST",
  path: "/api/v2/routine/",
  mapBody: (args) => args as RoutineRequest,
  responseSchema: routineResponseSchema,
};

export const updateRoutineEndpoint: EndpointDescriptor<
  {
    id: number;
    name?: string | undefined;
    description?: string | undefined;
    start?: string | undefined;
    end?: string | undefined;
    fit_in_week?: boolean | undefined;
    is_template?: boolean | undefined;
    is_public?: boolean | undefined;
  },
  Routine,
  PatchedRoutineRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/routine/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedRoutineRequest,
  responseSchema: routineResponseSchema,
};

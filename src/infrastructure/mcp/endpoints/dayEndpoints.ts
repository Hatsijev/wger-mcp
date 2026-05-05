import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Day,
  DayRequest,
  PatchedDayRequest,
  DayTypeEnum,
} from "../../../domain/models/Routine.types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import { paginatedResponseSchema, dayResponseSchema } from "../responseSchemas.js";

export const listDaysEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    routine?: number | undefined;
  },
  WgerPaginatedResponse<Day>
> = {
  method: "GET",
  path: "/api/v2/day/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    routine: args.routine,
  }),
  responseSchema: paginatedResponseSchema(dayResponseSchema),
};

export const getDayEndpoint: EndpointDescriptor<{ id: number }, Day> = {
  method: "GET",
  path: (args) => `/api/v2/day/${args.id}/`,
  responseSchema: dayResponseSchema,
};

export const createDayEndpoint: EndpointDescriptor<
  {
    routine: number;
    order?: number | undefined;
    name?: string | undefined;
    description?: string | undefined;
    is_rest?: boolean | undefined;
    need_logs_to_advance?: boolean | undefined;
    type?: DayTypeEnum | undefined;
    config?: JsonValue | undefined;
  },
  Day,
  DayRequest
> = {
  method: "POST",
  path: "/api/v2/day/",
  mapBody: (args) => args as DayRequest,
  responseSchema: dayResponseSchema,
};

export const updateDayEndpoint: EndpointDescriptor<
  {
    id: number;
    routine?: number | undefined;
    order?: number | undefined;
    name?: string | undefined;
    description?: string | undefined;
    is_rest?: boolean | undefined;
    need_logs_to_advance?: boolean | undefined;
    type?: DayTypeEnum | undefined;
    config?: JsonValue | undefined;
  },
  Day,
  PatchedDayRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/day/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedDayRequest,
  responseSchema: dayResponseSchema,
};

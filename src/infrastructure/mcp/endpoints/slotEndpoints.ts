import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Slot,
  SlotRequest,
  PatchedSlotRequest,
} from "../../../domain/models/Routine.types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import { paginatedResponseSchema, slotResponseSchema } from "../responseSchemas.js";

export const listSlotsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    day?: number | undefined;
  },
  WgerPaginatedResponse<Slot>
> = {
  method: "GET",
  path: "/api/v2/slot/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    day: args.day,
  }),
  responseSchema: paginatedResponseSchema(slotResponseSchema),
};

export const getSlotEndpoint: EndpointDescriptor<{ id: number }, Slot> = {
  method: "GET",
  path: (args) => `/api/v2/slot/${args.id}/`,
  responseSchema: slotResponseSchema,
};

export const createSlotEndpoint: EndpointDescriptor<
  {
    day: number;
    order?: number | undefined;
    comment?: string | undefined;
    config?: JsonValue | undefined;
  },
  Slot,
  SlotRequest
> = {
  method: "POST",
  path: "/api/v2/slot/",
  mapBody: (args) => args as SlotRequest,
  responseSchema: slotResponseSchema,
};

export const updateSlotEndpoint: EndpointDescriptor<
  {
    id: number;
    day?: number | undefined;
    order?: number | undefined;
    comment?: string | undefined;
    config?: JsonValue | undefined;
  },
  Slot,
  PatchedSlotRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/slot/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedSlotRequest,
  responseSchema: slotResponseSchema,
};

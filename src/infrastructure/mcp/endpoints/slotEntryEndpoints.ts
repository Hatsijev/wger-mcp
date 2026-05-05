import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  SlotEntry,
  SlotEntryRequest,
  PatchedSlotEntryRequest,
  SlotEntryTypeEnum,
} from "../../../domain/models/Routine.types.js";
import { JsonValue } from "../../../domain/models/Json.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  slotEntryResponseSchema,
} from "../responseSchemas.js";

export const listSlotEntriesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    slot?: number | undefined;
  },
  WgerPaginatedResponse<SlotEntry>
> = {
  method: "GET",
  path: "/api/v2/slot-entry/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    slot: args.slot,
  }),
  responseSchema: paginatedResponseSchema(slotEntryResponseSchema),
};

export const getSlotEntryEndpoint: EndpointDescriptor<
  { id: number },
  SlotEntry
> = {
  method: "GET",
  path: (args) => `/api/v2/slot-entry/${args.id}/`,
  responseSchema: slotEntryResponseSchema,
};

export const createSlotEntryEndpoint: EndpointDescriptor<
  {
    slot: number;
    exercise: number;
    type?: SlotEntryTypeEnum | undefined;
    repetition_unit?: number | null | undefined;
    repetition_rounding?: string | null | undefined;
    weight_unit?: number | null | undefined;
    weight_rounding?: string | null | undefined;
    order?: number | undefined;
    comment?: string | undefined;
    config?: JsonValue | undefined;
  },
  SlotEntry,
  SlotEntryRequest
> = {
  method: "POST",
  path: "/api/v2/slot-entry/",
  mapBody: (args) => args as SlotEntryRequest,
  responseSchema: slotEntryResponseSchema,
};

export const updateSlotEntryEndpoint: EndpointDescriptor<
  {
    id: number;
    slot?: number | undefined;
    exercise?: number | undefined;
    type?: SlotEntryTypeEnum | undefined;
    repetition_unit?: number | null | undefined;
    repetition_rounding?: string | null | undefined;
    weight_unit?: number | null | undefined;
    weight_rounding?: string | null | undefined;
    order?: number | undefined;
    comment?: string | undefined;
    config?: JsonValue | undefined;
  },
  SlotEntry,
  PatchedSlotEntryRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/slot-entry/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedSlotEntryRequest,
  responseSchema: slotEntryResponseSchema,
};

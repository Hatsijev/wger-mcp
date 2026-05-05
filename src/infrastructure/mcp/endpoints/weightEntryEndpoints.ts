import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  WeightEntry,
  WeightEntryRequest,
  PatchedWeightEntryRequest,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  weightEntryResponseSchema,
} from "../responseSchemas.js";

export const listWeightEntriesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    date__gt?: string | undefined;
    date__gte?: string | undefined;
  },
  WgerPaginatedResponse<WeightEntry>
> = {
  method: "GET",
  path: "/api/v2/weightentry/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    date__gt: args.date__gt,
    date__gte: args.date__gte,
  }),
  responseSchema: paginatedResponseSchema(weightEntryResponseSchema),
};

export const getWeightEntryEndpoint: EndpointDescriptor<
  { id: number },
  WeightEntry
> = {
  method: "GET",
  path: (args) => `/api/v2/weightentry/${args.id}/`,
  responseSchema: weightEntryResponseSchema,
};

export const createWeightEntryEndpoint: EndpointDescriptor<
  { date: string; weight: string },
  WeightEntry,
  WeightEntryRequest
> = {
  method: "POST",
  path: "/api/v2/weightentry/",
  mapBody: (args) => args as WeightEntryRequest,
  responseSchema: weightEntryResponseSchema,
};

export const updateWeightEntryEndpoint: EndpointDescriptor<
  { id: number; date?: string | undefined; weight?: string | undefined },
  WeightEntry,
  PatchedWeightEntryRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/weightentry/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedWeightEntryRequest,
  responseSchema: weightEntryResponseSchema,
};

import { WgerPaginatedResponse } from "../../wger/types.js";
import { Routine } from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  routineResponseSchema,
} from "../responseSchemas.js";

export const listTemplatesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    created?: string | undefined;
    description?: string | undefined;
    name?: string | undefined;
  },
  WgerPaginatedResponse<Routine>
> = {
  method: "GET",
  path: "/api/v2/templates/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    created: args.created,
    description: args.description,
    name: args.name,
  }),
  responseSchema: paginatedResponseSchema(routineResponseSchema),
};

export const getTemplateEndpoint: EndpointDescriptor<{ id: number }, Routine> =
  {
    method: "GET",
    path: (args) => `/api/v2/templates/${args.id}/`,
    responseSchema: routineResponseSchema,
  };

export const listPublicTemplatesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    created?: string | undefined;
    description?: string | undefined;
    name?: string | undefined;
  },
  WgerPaginatedResponse<Routine>
> = {
  method: "GET",
  path: "/api/v2/public-templates/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    created: args.created,
    description: args.description,
    name: args.name,
  }),
  responseSchema: paginatedResponseSchema(routineResponseSchema),
};

export const getPublicTemplateEndpoint: EndpointDescriptor<
  { id: number },
  Routine
> = {
  method: "GET",
  path: (args) => `/api/v2/public-templates/${args.id}/`,
  responseSchema: routineResponseSchema,
};

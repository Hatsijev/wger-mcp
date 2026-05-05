import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Measurement,
  MeasurementRequest,
  PatchedMeasurementRequest,
  MeasurementCategory,
  MeasurementCategoryRequest,
  PatchedMeasurementCategoryRequest,
} from "../../../domain/models/Reference.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  measurementResponseSchema,
  measurementCategoryResponseSchema,
} from "../responseSchemas.js";

export const listMeasurementsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    category?: number | undefined;
    date?: string | undefined;
    date__gt?: string | undefined;
    date__gte?: string | undefined;
    date__lt?: string | undefined;
    date__lte?: string | undefined;
  },
  WgerPaginatedResponse<Measurement>
> = {
  method: "GET",
  path: "/api/v2/measurement/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    category: args.category,
    date: args.date,
    date__gt: args.date__gt,
    date__gte: args.date__gte,
    date__lt: args.date__lt,
    date__lte: args.date__lte,
  }),
  responseSchema: paginatedResponseSchema(measurementResponseSchema),
};

export const getMeasurementEndpoint: EndpointDescriptor<
  { id: number },
  Measurement
> = {
  method: "GET",
  path: (args) => `/api/v2/measurement/${args.id}/`,
  responseSchema: measurementResponseSchema,
};

export const createMeasurementEndpoint: EndpointDescriptor<
  {
    category: number;
    date?: string | undefined;
    value: number;
    notes?: string | undefined;
  },
  Measurement,
  MeasurementRequest
> = {
  method: "POST",
  path: "/api/v2/measurement/",
  mapBody: (args) => args as MeasurementRequest,
  responseSchema: measurementResponseSchema,
};

export const updateMeasurementEndpoint: EndpointDescriptor<
  {
    id: number;
    category?: number | undefined;
    date?: string | undefined;
    value?: number | undefined;
    notes?: string | undefined;
  },
  Measurement,
  PatchedMeasurementRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/measurement/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMeasurementRequest,
  responseSchema: measurementResponseSchema,
};

export const listMeasurementCategoriesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    name?: string | undefined;
    unit?: string | undefined;
  },
  WgerPaginatedResponse<MeasurementCategory>
> = {
  method: "GET",
  path: "/api/v2/measurement-category/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    name: args.name,
    unit: args.unit,
  }),
  responseSchema: paginatedResponseSchema(measurementCategoryResponseSchema),
};

export const getMeasurementCategoryEndpoint: EndpointDescriptor<
  { id: number },
  MeasurementCategory
> = {
  method: "GET",
  path: (args) => `/api/v2/measurement-category/${args.id}/`,
  responseSchema: measurementCategoryResponseSchema,
};

export const createMeasurementCategoryEndpoint: EndpointDescriptor<
  { name: string; unit: string },
  MeasurementCategory,
  MeasurementCategoryRequest
> = {
  method: "POST",
  path: "/api/v2/measurement-category/",
  mapBody: (args) => args as MeasurementCategoryRequest,
  responseSchema: measurementCategoryResponseSchema,
};

export const updateMeasurementCategoryEndpoint: EndpointDescriptor<
  { id: number; name?: string | undefined; unit?: string | undefined },
  MeasurementCategory,
  PatchedMeasurementCategoryRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/measurement-category/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMeasurementCategoryRequest,
  responseSchema: measurementCategoryResponseSchema,
};

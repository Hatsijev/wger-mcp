import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  MaxRepetitionsConfig,
  MaxRepetitionsConfigRequest,
  PatchedMaxRepetitionsConfigRequest,
  MaxRestConfig,
  MaxRestConfigRequest,
  PatchedMaxRestConfigRequest,
  MaxRiRConfig,
  MaxRiRConfigRequest,
  PatchedMaxRiRConfigRequest,
  MaxSetNrConfig,
  MaxSetNrConfigRequest,
  PatchedMaxSetNrConfigRequest,
  MaxWeightConfig,
  MaxWeightConfigRequest,
  PatchedMaxWeightConfigRequest,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  maxRepetitionsConfigResponseSchema,
  maxRestConfigResponseSchema,
  maxRiRConfigResponseSchema,
  maxSetNrConfigResponseSchema,
  maxWeightConfigResponseSchema,
} from "../responseSchemas.js";

// ── Max Repetitions Config ───────────────────────────────────────────────

export const listMaxRepetitionsConfigsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<MaxRepetitionsConfig>
> = {
  method: "GET",
  path: "/api/v2/max-repetitions-config/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(maxRepetitionsConfigResponseSchema),
};

export const getMaxRepetitionsConfigEndpoint: EndpointDescriptor<{ id: number }, MaxRepetitionsConfig> = {
  method: "GET",
  path: (args) => `/api/v2/max-repetitions-config/${args.id}/`,
  responseSchema: maxRepetitionsConfigResponseSchema,
};

export const createMaxRepetitionsConfigEndpoint: EndpointDescriptor<
  {
    slot_entry: number;
    iteration: number;
    value: string;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRepetitionsConfig,
  MaxRepetitionsConfigRequest
> = {
  method: "POST",
  path: "/api/v2/max-repetitions-config/",
  mapBody: (args) => args as MaxRepetitionsConfigRequest,
  responseSchema: maxRepetitionsConfigResponseSchema,
};

export const updateMaxRepetitionsConfigEndpoint: EndpointDescriptor<
  {
    id: number;
    slot_entry?: number | undefined;
    iteration?: number | undefined;
    value?: string | undefined;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRepetitionsConfig,
  PatchedMaxRepetitionsConfigRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/max-repetitions-config/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMaxRepetitionsConfigRequest,
  responseSchema: maxRepetitionsConfigResponseSchema,
};

export const deleteMaxRepetitionsConfigEndpoint: EndpointDescriptor<{ id: number }, never> = {
  method: "DELETE",
  path: (args) => `/api/v2/max-repetitions-config/${args.id}/`,
};

// ── Max Rest Config ──────────────────────────────────────────────────────

export const listMaxRestConfigsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<MaxRestConfig>
> = {
  method: "GET",
  path: "/api/v2/max-rest-config/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(maxRestConfigResponseSchema),
};

export const getMaxRestConfigEndpoint: EndpointDescriptor<{ id: number }, MaxRestConfig> = {
  method: "GET",
  path: (args) => `/api/v2/max-rest-config/${args.id}/`,
  responseSchema: maxRestConfigResponseSchema,
};

export const createMaxRestConfigEndpoint: EndpointDescriptor<
  {
    slot_entry: number;
    iteration: number;
    value: number;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRestConfig,
  MaxRestConfigRequest
> = {
  method: "POST",
  path: "/api/v2/max-rest-config/",
  mapBody: (args) => args as MaxRestConfigRequest,
  responseSchema: maxRestConfigResponseSchema,
};

export const updateMaxRestConfigEndpoint: EndpointDescriptor<
  {
    id: number;
    slot_entry?: number | undefined;
    iteration?: number | undefined;
    value?: number | undefined;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRestConfig,
  PatchedMaxRestConfigRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/max-rest-config/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMaxRestConfigRequest,
  responseSchema: maxRestConfigResponseSchema,
};

export const deleteMaxRestConfigEndpoint: EndpointDescriptor<{ id: number }, never> = {
  method: "DELETE",
  path: (args) => `/api/v2/max-rest-config/${args.id}/`,
};

// ── Max RiR Config ───────────────────────────────────────────────────────

export const listMaxRiRConfigsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<MaxRiRConfig>
> = {
  method: "GET",
  path: "/api/v2/max-rir-config/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(maxRiRConfigResponseSchema),
};

export const getMaxRiRConfigEndpoint: EndpointDescriptor<{ id: number }, MaxRiRConfig> = {
  method: "GET",
  path: (args) => `/api/v2/max-rir-config/${args.id}/`,
  responseSchema: maxRiRConfigResponseSchema,
};

export const createMaxRiRConfigEndpoint: EndpointDescriptor<
  {
    slot_entry: number;
    iteration: number;
    value: string;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRiRConfig,
  MaxRiRConfigRequest
> = {
  method: "POST",
  path: "/api/v2/max-rir-config/",
  mapBody: (args) => args as MaxRiRConfigRequest,
  responseSchema: maxRiRConfigResponseSchema,
};

export const updateMaxRiRConfigEndpoint: EndpointDescriptor<
  {
    id: number;
    slot_entry?: number | undefined;
    iteration?: number | undefined;
    value?: string | undefined;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxRiRConfig,
  PatchedMaxRiRConfigRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/max-rir-config/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMaxRiRConfigRequest,
  responseSchema: maxRiRConfigResponseSchema,
};

export const deleteMaxRiRConfigEndpoint: EndpointDescriptor<{ id: number }, never> = {
  method: "DELETE",
  path: (args) => `/api/v2/max-rir-config/${args.id}/`,
};

// ── Max Set Nr Config ────────────────────────────────────────────────────

export const listMaxSetNrConfigsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<MaxSetNrConfig>
> = {
  method: "GET",
  path: "/api/v2/max-sets-config/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(maxSetNrConfigResponseSchema),
};

export const getMaxSetNrConfigEndpoint: EndpointDescriptor<{ id: number }, MaxSetNrConfig> = {
  method: "GET",
  path: (args) => `/api/v2/max-sets-config/${args.id}/`,
  responseSchema: maxSetNrConfigResponseSchema,
};

export const createMaxSetNrConfigEndpoint: EndpointDescriptor<
  {
    slot_entry: number;
    iteration: number;
    value: number;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxSetNrConfig,
  MaxSetNrConfigRequest
> = {
  method: "POST",
  path: "/api/v2/max-sets-config/",
  mapBody: (args) => args as MaxSetNrConfigRequest,
  responseSchema: maxSetNrConfigResponseSchema,
};

export const updateMaxSetNrConfigEndpoint: EndpointDescriptor<
  {
    id: number;
    slot_entry?: number | undefined;
    iteration?: number | undefined;
    value?: number | undefined;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxSetNrConfig,
  PatchedMaxSetNrConfigRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/max-sets-config/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMaxSetNrConfigRequest,
  responseSchema: maxSetNrConfigResponseSchema,
};

export const deleteMaxSetNrConfigEndpoint: EndpointDescriptor<{ id: number }, never> = {
  method: "DELETE",
  path: (args) => `/api/v2/max-sets-config/${args.id}/`,
};

// ── Max Weight Config ────────────────────────────────────────────────────

export const listMaxWeightConfigsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<MaxWeightConfig>
> = {
  method: "GET",
  path: "/api/v2/max-weight-config/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(maxWeightConfigResponseSchema),
};

export const getMaxWeightConfigEndpoint: EndpointDescriptor<{ id: number }, MaxWeightConfig> = {
  method: "GET",
  path: (args) => `/api/v2/max-weight-config/${args.id}/`,
  responseSchema: maxWeightConfigResponseSchema,
};

export const createMaxWeightConfigEndpoint: EndpointDescriptor<
  {
    slot_entry: number;
    iteration: number;
    value: string;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxWeightConfig,
  MaxWeightConfigRequest
> = {
  method: "POST",
  path: "/api/v2/max-weight-config/",
  mapBody: (args) => args as MaxWeightConfigRequest,
  responseSchema: maxWeightConfigResponseSchema,
};

export const updateMaxWeightConfigEndpoint: EndpointDescriptor<
  {
    id: number;
    slot_entry?: number | undefined;
    iteration?: number | undefined;
    value?: string | undefined;
    operation?: string | undefined;
    step?: string | undefined;
    repeat?: boolean | undefined;
    requirements?: unknown | null | undefined;
  },
  MaxWeightConfig,
  PatchedMaxWeightConfigRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/max-weight-config/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMaxWeightConfigRequest,
  responseSchema: maxWeightConfigResponseSchema,
};

export const deleteMaxWeightConfigEndpoint: EndpointDescriptor<{ id: number }, never> = {
  method: "DELETE",
  path: (args) => `/api/v2/max-weight-config/${args.id}/`,
};

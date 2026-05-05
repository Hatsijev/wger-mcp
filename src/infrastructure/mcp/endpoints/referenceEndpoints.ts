import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Language,
  License,
  RepetitionUnit,
  WeightUnit,
  VersionResponse,
  SchemaResponse,
  MinVersionResponse,
} from "../../../domain/models/Reference.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  languageResponseSchema,
  licenseResponseSchema,
  repetitionUnitResponseSchema,
  weightUnitResponseSchema,
  versionResponseSchema,
  minVersionResponseSchema,
  schemaResponseSchema,
} from "../responseSchemas.js";

export const listLanguagesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    full_name?: string | undefined;
    short_name?: string | undefined;
  },
  WgerPaginatedResponse<Language>
> = {
  method: "GET",
  path: "/api/v2/language/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    full_name: args.full_name,
    short_name: args.short_name,
  }),
  responseSchema: paginatedResponseSchema(languageResponseSchema),
};

export const getLanguageEndpoint: EndpointDescriptor<{ id: number }, Language> =
  {
    method: "GET",
    path: (args) => `/api/v2/language/${args.id}/`,
    responseSchema: languageResponseSchema,
  };

export const listLicensesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    full_name?: string | undefined;
    short_name?: string | undefined;
    url?: string | undefined;
  },
  WgerPaginatedResponse<License>
> = {
  method: "GET",
  path: "/api/v2/license/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    full_name: args.full_name,
    short_name: args.short_name,
    url: args.url,
  }),
  responseSchema: paginatedResponseSchema(licenseResponseSchema),
};

export const getLicenseEndpoint: EndpointDescriptor<{ id: number }, License> = {
  method: "GET",
  path: (args) => `/api/v2/license/${args.id}/`,
  responseSchema: licenseResponseSchema,
};

export const listRepetitionUnitsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    name?: string | undefined;
  },
  WgerPaginatedResponse<RepetitionUnit>
> = {
  method: "GET",
  path: "/api/v2/setting-repetitionunit/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    name: args.name,
  }),
  responseSchema: paginatedResponseSchema(repetitionUnitResponseSchema),
};

export const getRepetitionUnitEndpoint: EndpointDescriptor<
  { id: number },
  RepetitionUnit
> = {
  method: "GET",
  path: (args) => `/api/v2/setting-repetitionunit/${args.id}/`,
  responseSchema: repetitionUnitResponseSchema,
};

export const listWeightUnitsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    name?: string | undefined;
  },
  WgerPaginatedResponse<WeightUnit>
> = {
  method: "GET",
  path: "/api/v2/setting-weightunit/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    name: args.name,
  }),
  responseSchema: paginatedResponseSchema(weightUnitResponseSchema),
};

export const getWeightUnitEndpoint: EndpointDescriptor<
  { id: number },
  WeightUnit
> = {
  method: "GET",
  path: (args) => `/api/v2/setting-weightunit/${args.id}/`,
  responseSchema: weightUnitResponseSchema,
};

export const getVersionEndpoint: EndpointDescriptor<
  Record<string, never>,
  VersionResponse
> = {
  method: "GET",
  path: "/api/v2/version/",
  responseSchema: versionResponseSchema,
};

export const getSchemaEndpoint: EndpointDescriptor<
  {
    format?: "json" | "yaml" | undefined;
    lang?: string | undefined;
  },
  SchemaResponse
> = {
  method: "GET",
  path: "/api/v2/schema",
  mapParams: (args) => ({ format: args.format, lang: args.lang }),
  responseSchema: schemaResponseSchema,
};

export const getMinAppVersionEndpoint: EndpointDescriptor<
  Record<string, never>,
  MinVersionResponse
> = {
  method: "GET",
  path: "/api/v2/min-app-version/",
  responseSchema: minVersionResponseSchema,
};

export const getMinServerVersionEndpoint: EndpointDescriptor<
  Record<string, never>,
  MinVersionResponse
> = {
  method: "GET",
  path: "/api/v2/min-server-version/",
  responseSchema: minVersionResponseSchema,
};

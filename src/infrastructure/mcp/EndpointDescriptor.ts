import type { ZodType } from "zod";

export interface GetEndpointDescriptor<TArgs, TResponse> {
  method: "GET";
  path: string | ((args: TArgs) => string);
  mapParams?: (args: TArgs) => Record<string, string | number | boolean | undefined>;
  responseSchema?: ZodType<TResponse>;
}

export interface PostEndpointDescriptor<TArgs, TResponse, TBody extends object> {
  method: "POST";
  path: string | ((args: TArgs) => string);
  mapBody: (args: TArgs) => TBody;
  responseSchema: ZodType<TResponse>;
}

export interface PatchEndpointDescriptor<TArgs, TResponse, TBody extends object> {
  method: "PATCH";
  path: string | ((args: TArgs) => string);
  mapBody: (args: TArgs) => TBody;
  responseSchema: ZodType<TResponse>;
}

export interface PutEndpointDescriptor<TArgs, TResponse, TBody extends object> {
  method: "PUT";
  path: string | ((args: TArgs) => string);
  mapBody: (args: TArgs) => TBody;
  responseSchema: ZodType<TResponse>;
}

export interface DeleteEndpointDescriptor<TArgs> {
  method: "DELETE";
  path: string | ((args: TArgs) => string);
}

export type EndpointDescriptor<TArgs, TResponse, TBody extends object = object> =
  | GetEndpointDescriptor<TArgs, TResponse>
  | PostEndpointDescriptor<TArgs, TResponse, TBody>
  | PatchEndpointDescriptor<TArgs, TResponse, TBody>
  | PutEndpointDescriptor<TArgs, TResponse, TBody>
  | DeleteEndpointDescriptor<TArgs>;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export interface JsonArray extends ReadonlyArray<JsonValue> {}

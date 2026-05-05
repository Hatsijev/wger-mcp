import { describe, it, expect } from "vitest";
import type { JsonValue } from "../Json.types.js";

describe("JsonValue type (runtime shape verification)", () => {
  it("1.2.1: accepts string, number, boolean, null", () => {
    const str: JsonValue = "hello";
    const num: JsonValue = 42;
    const bool: JsonValue = true;
    const nul: JsonValue = null;
    expect(str).toBe("hello");
    expect(num).toBe(42);
    expect(bool).toBe(true);
    expect(nul).toBeNull();
  });

  it("1.2.2: accepts nested JsonObject", () => {
    const obj: JsonValue = { a: { b: 1 } };
    expect(obj).toEqual({ a: { b: 1 } });
  });

  it("1.2.3: accepts JsonArray of mixed JsonValue", () => {
    const arr: JsonValue = [1, "a", null, { x: true }];
    expect(arr).toEqual([1, "a", null, { x: true }]);
  });
});

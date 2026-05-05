import { describe, it, expect } from "vitest";
import { successResult, errorResult, runTool, toJsonBody, validateResourceId } from "../toolResult.js";
import { ConsoleLogger } from "../../ConsoleLogger.js";

function getText(result: { content: Array<{ type: string; text?: string }> }): string {
  const item = result.content[0];
  if (item.type !== "text" || !item.text) throw new Error("Expected text content");
  return item.text;
}

describe("toolResult", () => {
  describe("successResult", () => {
    it("returns CallToolResult with ok:true and serialized data", () => {
      const result = successResult({ id: 1 });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");
      const parsed = JSON.parse(getText(result));
      expect(parsed.ok).toBe(true);
      expect(parsed.data).toEqual({ id: 1 });
    });
  });

  describe("errorResult", () => {
    it("returns CallToolResult with ok:false and error message", () => {
      const result = errorResult("Something failed");
      expect(result.content).toHaveLength(1);
      const parsed = JSON.parse(getText(result));
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toBe("Something failed");
    });
  });

  describe("runTool", () => {
    it("returns handler result on success", async () => {
      const logger = new ConsoleLogger("error");
      const result = await runTool(logger, "test_tool", async () => successResult("data"));
      expect(getText(result)).toContain("data");
    });

    it("returns errorResult when handler throws Error", async () => {
      const logger = new ConsoleLogger("error");
      const result = await runTool(logger, "test_tool", async () => {
        throw new Error("Handler failed");
      });
      const parsed = JSON.parse(getText(result));
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toBe("Handler failed");
    });

    it("returns errorResult when handler throws non-Error", async () => {
      const logger = new ConsoleLogger("error");
      const result = await runTool(logger, "test_tool", async () => {
        throw "string error";
      });
      const parsed = JSON.parse(getText(result));
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toBe("Unknown error");
    });
  });

  describe("toJsonBody", () => {
    it("6.9.1: strips undefined values", () => {
      const result = toJsonBody({ a: 1, b: "hello", c: undefined });
      expect(result).toEqual({ a: 1, b: "hello" });
    });

    it("6.9.2: preserves null, strips undefined", () => {
      const result = toJsonBody({ a: null, b: undefined });
      expect(result).toEqual({ a: null });
    });

    it("6.9.3: empty object returns empty object", () => {
      const result = toJsonBody({});
      expect(result).toEqual({});
    });

    it("6.9.4: preserves nested structures", () => {
      const result = toJsonBody({ a: { nested: true }, b: [1, 2] });
      expect(result).toEqual({ a: { nested: true }, b: [1, 2] });
    });

    it("6.9.5: preserves null as valid JsonValue", () => {
      const result = toJsonBody({ config: null });
      expect(result).toEqual({ config: null });
    });
  });

  describe("validateResourceId", () => {
    it("parses string to number", () => {
      expect(validateResourceId("42")).toBe(42);
    });

    it("parses array first element", () => {
      expect(validateResourceId(["42"])).toBe(42);
    });

    it("throws for undefined", () => {
      expect(() => validateResourceId(undefined as unknown as string)).toThrow();
    });

    it("throws for NaN", () => {
      expect(() => validateResourceId("abc")).toThrow(/Invalid resource ID/);
    });

    it("throws for zero", () => {
      expect(() => validateResourceId("0")).toThrow(/Invalid resource ID/);
    });

    it("throws for negative", () => {
      expect(() => validateResourceId("-1")).toThrow(/Invalid resource ID/);
    });

    it("throws for float", () => {
      expect(() => validateResourceId("1.5")).toThrow(/Invalid resource ID/);
    });
  });
});

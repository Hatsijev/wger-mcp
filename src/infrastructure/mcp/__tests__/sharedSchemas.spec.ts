import { describe, it, expect } from "vitest";
import {
  positiveIntegerIdSchema,
  paginationLimitSchema,
  paginationOffsetSchema,
  isoDateStringSchema,
  timeStringSchema,
  decimalAmountSchema,
  roundingDecimalSchema,
  boundedStringSchema,
  nonNegativeIntegerSchema,
  jsonConfigSchema,
} from "../sharedSchemas.js";

describe("sharedSchemas", () => {
  describe("positiveIntegerIdSchema", () => {
    it("accepts positive integers", () => {
      expect(positiveIntegerIdSchema.parse(1)).toBe(1);
      expect(positiveIntegerIdSchema.parse(999)).toBe(999);
    });

    it("rejects zero", () => {
      expect(() => positiveIntegerIdSchema.parse(0)).toThrow();
    });

    it("rejects negative", () => {
      expect(() => positiveIntegerIdSchema.parse(-1)).toThrow();
    });

    it("rejects floats", () => {
      expect(() => positiveIntegerIdSchema.parse(1.5)).toThrow();
    });

    it("rejects strings", () => {
      expect(() => positiveIntegerIdSchema.parse("1")).toThrow();
    });
  });

  describe("paginationLimitSchema", () => {
    it("accepts valid limits", () => {
      expect(paginationLimitSchema.parse(1)).toBe(1);
      expect(paginationLimitSchema.parse(100)).toBe(100);
    });

    it("rejects 0", () => {
      expect(() => paginationLimitSchema.parse(0)).toThrow();
    });

    it("rejects 101", () => {
      expect(() => paginationLimitSchema.parse(101)).toThrow();
    });

    it("is optional", () => {
      expect(paginationLimitSchema.parse(undefined)).toBeUndefined();
    });
  });

  describe("paginationOffsetSchema", () => {
    it("accepts 0", () => {
      expect(paginationOffsetSchema.parse(0)).toBe(0);
    });

    it("rejects negative", () => {
      expect(() => paginationOffsetSchema.parse(-1)).toThrow();
    });

    it("is optional", () => {
      expect(paginationOffsetSchema.parse(undefined)).toBeUndefined();
    });
  });

  describe("isoDateStringSchema", () => {
    it("accepts YYYY-MM-DD", () => {
      expect(isoDateStringSchema.parse("2024-01-15")).toBe("2024-01-15");
    });

    it("rejects invalid format", () => {
      expect(() => isoDateStringSchema.parse("01-15-2024")).toThrow();
      expect(() => isoDateStringSchema.parse("2024/01/15")).toThrow();
      expect(() => isoDateStringSchema.parse("not-a-date")).toThrow();
    });
  });

  describe("timeStringSchema", () => {
    it("accepts HH:MM", () => {
      expect(timeStringSchema.parse("08:00")).toBe("08:00");
    });

    it("accepts HH:MM:SS", () => {
      expect(timeStringSchema.parse("08:00:00")).toBe("08:00:00");
    });

    it("rejects invalid times", () => {
      expect(() => timeStringSchema.parse("not-a-time")).toThrow();
      expect(() => timeStringSchema.parse("8:00")).toThrow(); // missing leading zero
    });
  });

  describe("decimalAmountSchema", () => {
    it("accepts valid decimals", () => {
      expect(decimalAmountSchema.parse("150")).toBe("150");
      expect(decimalAmountSchema.parse("150.5")).toBe("150.5");
      expect(decimalAmountSchema.parse("-5.25")).toBe("-5.25");
    });

    it("rejects empty string", () => {
      expect(() => decimalAmountSchema.parse("")).toThrow();
    });

    it("rejects non-numeric", () => {
      expect(() => decimalAmountSchema.parse("abc")).toThrow();
    });

    it("rejects too many digits", () => {
      expect(() => decimalAmountSchema.parse("99999")).toThrow();
      expect(() => decimalAmountSchema.parse("1.123")).toThrow();
    });
  });

  describe("roundingDecimalSchema", () => {
    it("accepts valid rounding values", () => {
      expect(roundingDecimalSchema.parse("0.5")).toBe("0.5");
      expect(roundingDecimalSchema.parse("2.5")).toBe("2.5");
    });

    it("rejects too many digits", () => {
      expect(() => roundingDecimalSchema.parse("999.99")).toThrow();
    });
  });

  describe("boundedStringSchema", () => {
    it("accepts within limit", () => {
      expect(boundedStringSchema(25).parse("hello")).toBe("hello");
    });

    it("rejects over limit", () => {
      expect(() => boundedStringSchema(5).parse("hello world")).toThrow();
    });
  });

  describe("nonNegativeIntegerSchema", () => {
    it("accepts 0", () => {
      expect(nonNegativeIntegerSchema.parse(0)).toBe(0);
    });

    it("accepts INT_MAX", () => {
      expect(nonNegativeIntegerSchema.parse(2147483647)).toBe(2147483647);
    });

    it("rejects negative", () => {
      expect(() => nonNegativeIntegerSchema.parse(-1)).toThrow();
    });

    it("rejects over INT_MAX", () => {
      expect(() => nonNegativeIntegerSchema.parse(2147483648)).toThrow();
    });
  });

  describe("jsonConfigSchema", () => {
    it("accepts objects", () => {
      expect(jsonConfigSchema.parse({ sets: 3 })).toEqual({ sets: 3 });
    });

    it("accepts null", () => {
      expect(jsonConfigSchema.parse(null)).toBeNull();
    });

    it("accepts undefined", () => {
      expect(jsonConfigSchema.parse(undefined)).toBeUndefined();
    });

    it("accepts arrays", () => {
      expect(jsonConfigSchema.parse([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("accepts primitives", () => {
      expect(jsonConfigSchema.parse("hello")).toBe("hello");
      expect(jsonConfigSchema.parse(42)).toBe(42);
      expect(jsonConfigSchema.parse(true)).toBe(true);
    });

    it("rejects undefined at top level when required", () => {
      // jsonConfigSchema is optional, so undefined is fine
      expect(jsonConfigSchema.parse(undefined)).toBeUndefined();
    });
  });
});

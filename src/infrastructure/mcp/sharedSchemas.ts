import { z } from "zod";
import { JsonValue } from "../../domain/models/Json.types.js";

export const positiveIntegerIdSchema = z.number().int().positive();

export const paginationLimitSchema = z.number().int().min(1).max(100).optional();

export const paginationOffsetSchema = z.number().int().min(0).optional();

export const isoDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected ISO date (YYYY-MM-DD)");

export const isoDateTimeStringSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
    "Expected ISO date-time",
  );

export const timeStringSchema = z
  .string()
  .regex(/^\d{2}:\d{2}(?::\d{2})?$/, "Expected time (HH:MM or HH:MM:SS)");

export const decimalAmountSchema = z
  .string()
  .regex(
    /^-?\d{0,4}(?:\.\d{0,2})?$/,
    "Expected decimal with up to 4 integer and 2 fractional digits",
  );

export function boundedStringSchema(maxLength: number) {
  return z.string().max(maxLength);
}

export const jsonConfigSchema = z.custom<JsonValue>().nullable().optional();

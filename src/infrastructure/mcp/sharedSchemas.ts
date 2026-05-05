import { z } from "zod";

export const positiveIntegerIdSchema = z.number().int().positive();

export const paginationLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(100)
  .optional();

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
    /^-?\d{1,4}(?:\.\d{0,2})?$/,
    "Expected decimal with up to 4 integer and 2 fractional digits",
  );

export const roundingDecimalSchema = z
  .string()
  .regex(
    /^-?\d{0,2}(?:\.\d{0,2})?$/,
    "Expected decimal with up to 2 integer and 2 fractional digits",
  );

export const rirDecimalSchema = z
  .string()
  .regex(
    /^-?\d{0,1}(?:\.\d{0,1})?$/,
    "Expected RIR decimal with up to 1 integer and 1 fractional digit",
  );

export const weightDecimalSchema = z
  .string()
  .regex(
    /^-?\d{0,3}(?:\.\d{0,2})?$/,
    "Expected weight decimal with up to 3 integer and 2 fractional digits",
  );

export function boundedStringSchema(maxLength: number) {
  return z.string().max(maxLength);
}

import { JsonValue } from "../../domain/models/Json.types.js";

// Recursive JSON value schema for Zod v4.
// z.record() in Zod v4 requires explicit key type as first argument.
const jsonValueSchema = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), jsonValueSchema),
    z.array(jsonValueSchema),
  ]),
) as z.ZodType<JsonValue>;

export { jsonValueSchema };

export const nonNegativeIntegerSchema = z
  .number()
  .int()
  .min(0)
  .max(2_147_483_647);

export const jsonConfigSchema = jsonValueSchema.nullable().optional();

import { z } from "zod";
import dotenv from "dotenv";
import { Config } from "../domain/models/Config.types.js";
import { WgerValidationError } from "../domain/errors/WgerError.js";

dotenv.config({ quiet: true });

const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

const configSchema = z.object({
  wgerBaseUrl: z.string().url(),
  wgerApiToken: z.string().min(1),
  wgerLanguage: z.string().optional(),
  wgerRequestTimeoutMs: z.number().int().min(1000).max(300_000).default(30_000),
  logLevel: logLevelSchema.default("info"),
  enableWriteTools: z.boolean().default(true),
  enableDestructiveTools: z.boolean().default(false),
  enableAdminTools: z.boolean().default(false),
  enableRawWgerProxy: z.boolean().default(false),
});

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value.toLowerCase() === "true";
}

export function loadConfig(): Config {
  const raw = {
    wgerBaseUrl: process.env.WGER_BASE_URL,
    wgerApiToken: process.env.WGER_API_TOKEN,
    wgerLanguage: process.env.WGER_LANGUAGE,
    wgerRequestTimeoutMs: process.env.WGER_REQUEST_TIMEOUT_MS
      ? Number(process.env.WGER_REQUEST_TIMEOUT_MS)
      : undefined,
    logLevel: process.env.LOG_LEVEL,
    enableWriteTools: parseBoolean(process.env.ENABLE_WRITE_TOOLS),
    enableDestructiveTools: parseBoolean(process.env.ENABLE_DESTRUCTIVE_TOOLS),
    enableAdminTools: parseBoolean(process.env.ENABLE_ADMIN_TOOLS),
    enableRawWgerProxy: parseBoolean(process.env.ENABLE_RAW_WGER_PROXY),
  };

  const result = configSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new WgerValidationError(`Config validation failed: ${issues}`);
  }

  return result.data;
}

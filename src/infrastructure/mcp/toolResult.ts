import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Logger } from "../../application/ports/Logger.js";
import { WgerValidationError } from "../../domain/errors/WgerError.js";

export type ToolResult = CallToolResult;

export function successResult<T>(data: T): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ ok: true, data }),
      },
    ],
  };
}

export function errorResult(message: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ ok: false, error: message }),
      },
    ],
  };
}

export async function runTool(
  logger: Logger,
  toolName: string,
  handler: () => Promise<ToolResult>,
): Promise<ToolResult> {
  try {
    return await handler();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Tool execution failed", { tool: toolName, error: message });
    return errorResult(message);
  }
}

export function toJsonBody<T extends object>(obj: T): T {
  const result = {} as T;
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, string | number | boolean | null | undefined | object>)[key];
    if (value !== undefined) {
      (result as Record<string, string | number | boolean | null | object>)[key] = value;
    }
  }
  return result;
}

export function validateResourceId(
  value: string | ReadonlyArray<string>,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) {
    throw new WgerValidationError("Resource ID is missing");
  }
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
    throw new WgerValidationError(`Invalid resource ID: ${raw}`);
  }
  return id;
}

import { Logger } from "../../application/ports/Logger.js";
import { WgerValidationError } from "../../domain/errors/WgerError.js";

// Index signatures use `unknown` because the MCP SDK's CallToolResult type
// requires `{ [x: string]: unknown }`. This is an allowed SDK-boundary exception.
export interface ToolSuccessResult {
  readonly content: Array<{
    type: "text";
    text: string;
  }>;
  readonly [key: string]: unknown;
}

export interface ToolErrorResult {
  readonly content: Array<{
    type: "text";
    text: string;
  }>;
  readonly isError: true;
  readonly [key: string]: unknown;
}

export type ToolResult = ToolSuccessResult | ToolErrorResult;

export function successResult<T>(data: T): ToolSuccessResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ ok: true, data }),
      },
    ],
  };
}

export function errorResult(message: string): ToolErrorResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ ok: false, error: message }),
      },
    ],
    isError: true,
  };
}

export async function runTool<T extends ToolResult>(
  logger: Logger,
  toolName: string,
  handler: () => Promise<T>,
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Tool execution failed", { tool: toolName, error: message });
    return errorResult(message) as T;
  }
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

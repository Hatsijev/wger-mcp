import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { WgerClient } from "../wger/WgerClient.js";
import { Logger } from "../../application/ports/Logger.js";
import { EndpointDescriptor } from "./EndpointDescriptor.js";
import { runTool, successResult, toJsonBody } from "./toolResult.js";

function resolvePath<TArgs>(path: string | ((args: TArgs) => string), args: TArgs): string {
  return typeof path === "function" ? path(args) : path;
}

export function endpointHandler<TArgs extends object, TResponse, TBody extends object = object>(
  client: WgerClient,
  logger: Logger,
  toolName: string,
  descriptor: EndpointDescriptor<TArgs, TResponse, TBody>,
): (args: TArgs) => Promise<CallToolResult> {
  return async (args: TArgs) => {
    return runTool(logger, toolName, async () => {
      const path = resolvePath(descriptor.path, args);
      switch (descriptor.method) {
        case "GET": {
          const data = await client.get<TResponse>(
            path,
            descriptor.mapParams?.(args),
            descriptor.responseSchema,
          );
          return successResult(data);
        }
        case "POST": {
          const data = await client.post<TResponse>(
            path,
            toJsonBody(descriptor.mapBody(args)) as TBody,
            descriptor.responseSchema,
          );
          return successResult(data);
        }
        case "PATCH": {
          const data = await client.patch<TResponse>(
            path,
            toJsonBody(descriptor.mapBody(args)) as TBody,
            descriptor.responseSchema,
          );
          return successResult(data);
        }
        case "PUT": {
          const data = await client.put<TResponse>(
            path,
            toJsonBody(descriptor.mapBody(args)) as TBody,
            descriptor.responseSchema,
          );
          return successResult(data);
        }
        case "DELETE": {
          await client.delete(path);
          return successResult({ deleted: true });
        }
      }
    });
  };
}

export function directToolHandler<TResponse>(
  logger: Logger,
  toolName: string,
  handler: () => Promise<TResponse>,
): () => Promise<CallToolResult> {
  return async () => {
    return runTool(logger, toolName, async () => {
      const data = await handler();
      return successResult(data);
    });
  };
}

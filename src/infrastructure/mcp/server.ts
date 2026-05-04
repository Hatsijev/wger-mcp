import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../../domain/models/Config.types.js";
import { Logger } from "../../application/ports/Logger.js";
import { WgerClient } from "../wger/WgerClient.js";
import { registerExerciseTools } from "./tools/exercises.js";
import { registerExerciseResources } from "./resources/exercises.js";
import { registerRoutineTools } from "./tools/routines.js";
import { registerRoutineResources } from "./resources/routines.js";

export function createMcpServer(
  config: Config,
  logger: Logger,
  client: WgerClient,
): McpServer {
  const server = new McpServer(
    { name: "wger-mcp", version: "0.1.0" },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  registerExerciseTools(server, client, logger);
  registerExerciseResources(server, client, logger);
  registerRoutineTools(server, client, logger);
  registerRoutineResources(server, client, logger);

  logger.debug("MCP server instance created", {
    name: "wger-mcp",
    version: "0.1.0",
    enableDestructiveTools: config.enableDestructiveTools,
    enableAdminTools: config.enableAdminTools,
    enableRawWgerProxy: config.enableRawWgerProxy,
  });

  return server;
}

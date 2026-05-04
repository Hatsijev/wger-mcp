import { loadConfig } from "./infrastructure/config.js";
import { createMcpServer } from "./infrastructure/mcp/server.js";
import { ConsoleLogger } from "./infrastructure/ConsoleLogger.js";
import { WgerClient } from "./infrastructure/wger/WgerClient.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const logger = new ConsoleLogger(config.logLevel);
  const client = new WgerClient(config, logger);
  const server = createMcpServer(config, logger, client);

  logger.info("Wger MCP server starting");

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: Error) => {
  console.error("Fatal error starting Wger MCP server:", error.message);
  process.exit(1);
});

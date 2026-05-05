import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerTemplateTools } from "../templateTools.js";
import { WgerClient } from "../../../wger/WgerClient.js";
import { ConsoleLogger } from "../../../../infrastructure/ConsoleLogger.js";

function createMockClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    getStatus: vi.fn(),
  } as unknown as WgerClient;
}

function createMockServer() {
  const tools = new Map<string, (args: unknown) => Promise<unknown>>();
  const schemas = new Map<string, unknown>();
  return {
    registerTool: vi.fn(
      (
        name: string,
        schema: { inputSchema: unknown },
        handler: (args: unknown) => Promise<unknown>,
      ) => {
        tools.set(name, handler);
        schemas.set(name, schema.inputSchema);
      },
    ),
    getTool: (name: string) => tools.get(name),
    getSchema: (name: string) => schemas.get(name),
    tools,
    schemas,
  };
}

describe("registerTemplateTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers all template tools", () => {
    registerTemplateTools(server as never, client as never, logger);
    expect(server.tools.has("list_templates")).toBe(true);
    expect(server.tools.has("get_template")).toBe(true);
    expect(server.tools.has("list_public_templates")).toBe(true);
    expect(server.tools.has("get_public_template")).toBe(true);
  });

  it("list_templates calls client.get with correct params", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTemplateTools(server as never, client as never, logger);
    const handler = server.getTool("list_templates")!;
    await handler({ limit: 10, offset: 0, name: "Push" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/templates/",
      { limit: 10, offset: 0, name: "Push" },
      expect.anything(),
    );
  });

  it("get_template calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ id: 1, name: "T1" });
    registerTemplateTools(server as never, client as never, logger);
    const handler = server.getTool("get_template")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/templates/1/",
      undefined,
      expect.anything(),
    );
  });

  it("list_public_templates calls client.get with correct params", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTemplateTools(server as never, client as never, logger);
    const handler = server.getTool("list_public_templates")!;
    await handler({ limit: 10, offset: 0 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/public-templates/",
      { limit: 10, offset: 0 },
      expect.anything(),
    );
  });

  it("get_public_template calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ id: 1, name: "T1" });
    registerTemplateTools(server as never, client as never, logger);
    const handler = server.getTool("get_public_template")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/public-templates/1/",
      undefined,
      expect.anything(),
    );
  });
});

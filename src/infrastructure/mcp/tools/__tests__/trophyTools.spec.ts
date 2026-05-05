import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerTrophyTools } from "../trophyTools.js";
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

describe("registerTrophyTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers all trophy tools", () => {
    registerTrophyTools(server as never, client as never, logger);
    expect(server.tools.has("list_trophies")).toBe(true);
    expect(server.tools.has("get_trophy")).toBe(true);
    expect(server.tools.has("list_trophy_progress")).toBe(true);
    expect(server.tools.has("list_user_trophies")).toBe(true);
    expect(server.tools.has("get_user_trophy")).toBe(true);
    expect(server.tools.has("list_user_statistics")).toBe(true);
    expect(server.tools.has("get_user_statistics")).toBe(true);
  });

  it("list_trophies calls client.get with correct params", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("list_trophies")!;
    await handler({ limit: 10, offset: 0, trophy_type: "pr" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/trophy/",
      { limit: 10, offset: 0, trophy_type: "pr" },
      expect.anything(),
    );
  });

  it("get_trophy calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ id: 1, name: "T1" });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("get_trophy")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/trophy/1/",
      undefined,
      expect.anything(),
    );
  });

  it("list_trophy_progress calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("list_trophy_progress")!;
    await handler({ limit: 10, offset: 0 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/trophy/progress/",
      { limit: 10, offset: 0 },
      expect.anything(),
    );
  });

  it("list_user_trophies calls client.get with correct params", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("list_user_trophies")!;
    await handler({ limit: 10, offset: 0, is_notified: true });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/user-trophy/",
      { limit: 10, offset: 0, is_notified: true },
      expect.anything(),
    );
  });

  it("get_user_trophy calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("get_user_trophy")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/user-trophy/1/",
      undefined,
      expect.anything(),
    );
  });

  it("list_user_statistics calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ count: 0, results: [] });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("list_user_statistics")!;
    await handler({ limit: 10, offset: 0 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/user-statistics/",
      { limit: 10, offset: 0 },
      expect.anything(),
    );
  });

  it("get_user_statistics calls client.get with correct path", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerTrophyTools(server as never, client as never, logger);
    const handler = server.getTool("get_user_statistics")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/user-statistics/1/",
      undefined,
      expect.anything(),
    );
  });
});

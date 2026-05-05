import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerDayTools } from "../dayTools.js";
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

describe("registerDayTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerDayTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_days")).toBe(true);
    expect(server.tools.has("get_day")).toBe(true);
    expect(server.tools.has("create_day")).toBe(true);
    expect(server.tools.has("update_day")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerDayTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("list_days")).toBe(true);
    expect(server.tools.has("get_day")).toBe(true);
    expect(server.tools.has("create_day")).toBe(false);
  });

  it("list_days calls GET /api/v2/day/ with params", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerDayTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_days")!;
    await handler({ limit: 10, offset: 5, routine: 3 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/day/",
      expect.objectContaining({ limit: 10, offset: 5, routine: 3 }),
      expect.anything(),
    );
  });

  it("get_day calls GET /api/v2/day/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerDayTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_day")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/day/1/",
      undefined,
      expect.anything(),
    );
  });

  it("create_day calls POST /api/v2/day/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerDayTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_day")!;
    await handler({ routine: 1, name: "Leg Day" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/day/",
      expect.objectContaining({ routine: 1, name: "Leg Day" }),
      expect.anything(),
    );
  });

  it("update_day extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerDayTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_day")!;
    await handler({ id: 5, name: "Updated" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/day/5/",
      expect.objectContaining({ name: "Updated" }),
      expect.anything(),
    );
  });

  it("create_day schema rejects missing routine", () => {
    registerDayTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_day") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ name: "Leg Day" })).toThrow();
  });

  it("create_day schema accepts valid type enum", () => {
    registerDayTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_day") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ routine: 1, type: "amrap" })).not.toThrow();
  });

  it("create_day schema rejects invalid type", () => {
    registerDayTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_day") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ routine: 1, type: "invalid" })).toThrow();
  });
});

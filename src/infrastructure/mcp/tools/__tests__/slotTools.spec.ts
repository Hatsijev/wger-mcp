import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerSlotTools } from "../slotTools.js";
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

describe("registerSlotTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerSlotTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_slots")).toBe(true);
    expect(server.tools.has("get_slot")).toBe(true);
    expect(server.tools.has("create_slot")).toBe(true);
    expect(server.tools.has("update_slot")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerSlotTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_slot")).toBe(false);
  });

  it("list_slots calls GET /api/v2/slot/ with params", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerSlotTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_slots")!;
    await handler({ day: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/slot/",
      expect.objectContaining({ day: 1 }),
      expect.anything(),
    );
  });

  it("get_slot calls GET /api/v2/slot/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerSlotTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_slot")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/slot/1/",
      undefined,
      expect.anything(),
    );
  });

  it("create_slot calls POST /api/v2/slot/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerSlotTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_slot")!;
    await handler({ day: 1 });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/slot/",
      expect.objectContaining({ day: 1 }),
      expect.anything(),
    );
  });

  it("update_day extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerSlotTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_slot")!;
    await handler({ id: 5, comment: "Updated" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/slot/5/",
      expect.objectContaining({ comment: "Updated" }),
      expect.anything(),
    );
  });

  it("create_slot schema requires day", () => {
    registerSlotTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ comment: "Hi" })).toThrow();
  });

  it("create_slot schema rejects comment over 200 chars", () => {
    registerSlotTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ day: 1, comment: "x".repeat(201) })).toThrow();
  });
});

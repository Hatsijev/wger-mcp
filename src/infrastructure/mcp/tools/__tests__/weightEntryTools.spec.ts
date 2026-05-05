import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerWeightEntryTools } from "../weightEntryTools.js";
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

describe("registerWeightEntryTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerWeightEntryTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_weight_entries")).toBe(true);
    expect(server.tools.has("get_weight_entry")).toBe(true);
    expect(server.tools.has("create_weight_entry")).toBe(true);
    expect(server.tools.has("update_weight_entry")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerWeightEntryTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_weight_entry")).toBe(false);
  });

  it("list_weight_entries calls GET /api/v2/weightentry/ with date filters", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerWeightEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_weight_entries")!;
    await handler({ date__gt: "2024-01-01", date__gte: "2024-01-01" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/weightentry/",
      expect.objectContaining({
        date__gt: "2024-01-01",
        date__gte: "2024-01-01",
      }),
      expect.anything(),
    );
  });

  it("get_weight_entry calls GET /api/v2/weightentry/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerWeightEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_weight_entry")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/weightentry/1/",
      undefined,
      expect.anything(),
    );
  });

  it("create_weight_entry calls POST /api/v2/weightentry/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerWeightEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_weight_entry")!;
    await handler({ date: "2024-01-01", weight: "75.5" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/weightentry/",
      expect.objectContaining({ date: "2024-01-01", weight: "75.5" }),
      expect.anything(),
    );
  });

  it("update_weight_entry extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerWeightEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_weight_entry")!;
    await handler({ id: 5, weight: "76.0" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/weightentry/5/",
      expect.objectContaining({ weight: "76.0" }),
      expect.anything(),
    );
  });

  it("weight schema rejects more than 3 integer digits", () => {
    registerWeightEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_weight_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() =>
      schema.parse({ date: "2024-01-01", weight: "9999.99" }),
    ).toThrow();
    expect(() =>
      schema.parse({ date: "2024-01-01", weight: "999.99" }),
    ).not.toThrow();
  });

  it("create schema requires date and weight", () => {
    registerWeightEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_weight_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ date: "2024-01-01" })).toThrow();
    expect(() => schema.parse({ weight: "75.5" })).toThrow();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerSlotEntryTools } from "../slotEntryTools.js";
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

describe("registerSlotEntryTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerSlotEntryTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_slot_entries")).toBe(true);
    expect(server.tools.has("get_slot_entry")).toBe(true);
    expect(server.tools.has("create_slot_entry")).toBe(true);
    expect(server.tools.has("update_slot_entry")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerSlotEntryTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_slot_entry")).toBe(false);
  });

  it("list_slot_entries calls GET /api/v2/slot-entry/", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerSlotEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_slot_entries")!;
    await handler({ slot: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/slot-entry/",
      expect.objectContaining({ slot: 1 }),
      expect.anything(),
    );
  });

  it("get_slot_entry calls GET /api/v2/slot-entry/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerSlotEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_slot_entry")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/slot-entry/1/",
      undefined,
      expect.anything(),
    );
  });

  it("create_slot_entry calls POST /api/v2/slot-entry/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerSlotEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_slot_entry")!;
    await handler({ slot: 1, exercise: 2 });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/slot-entry/",
      expect.objectContaining({ slot: 1, exercise: 2 }),
      expect.anything(),
    );
  });

  it("update_slot_entry extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerSlotEntryTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_slot_entry")!;
    await handler({ id: 5, comment: "Updated" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/slot-entry/5/",
      expect.objectContaining({ comment: "Updated" }),
      expect.anything(),
    );
  });

  it("create_slot_entry schema requires slot and exercise", () => {
    registerSlotEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ slot: 1 })).toThrow();
  });

  it("create_slot_entry schema accepts valid type enum", () => {
    registerSlotEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() =>
      schema.parse({ slot: 1, exercise: 2, type: "dropset" }),
    ).not.toThrow();
  });

  it("create_slot_entry schema rejects invalid type", () => {
    registerSlotEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() =>
      schema.parse({ slot: 1, exercise: 2, type: "invalid" }),
    ).toThrow();
  });

  it("rounding fields use roundingDecimalSchema", () => {
    registerSlotEntryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_slot_entry") as {
      parse: (v: unknown) => unknown;
    };
    expect(() =>
      schema.parse({ slot: 1, exercise: 2, repetition_rounding: "999.99" }),
    ).toThrow();
    expect(() =>
      schema.parse({ slot: 1, exercise: 2, repetition_rounding: "2.5" }),
    ).not.toThrow();
  });
});

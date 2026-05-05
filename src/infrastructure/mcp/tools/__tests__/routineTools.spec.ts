import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerRoutineTools } from "../routineTools.js";
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

describe("registerRoutineTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers tools when enableWriteTools is true", () => {
    registerRoutineTools(server as never, client as never, logger, true);
    expect(server.tools.has("list_routines")).toBe(true);
    expect(server.tools.has("create_routine")).toBe(true);
    expect(server.tools.has("update_routine")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerRoutineTools(server as never, client as never, logger, false);
    expect(server.tools.has("list_routines")).toBe(true);
    expect(server.tools.has("create_routine")).toBe(false);
    expect(server.tools.has("update_routine")).toBe(false);
  });

  describe("create_routine schema", () => {
    it("6.1.1: minimal valid input", async () => {
      registerRoutineTools(server as never, client as never, logger, true);
      const schema = server.getSchema("create_routine") as {
        parse: (v: unknown) => unknown;
      };
      expect(() =>
        schema.parse({ start: "2025-01-01", end: "2025-12-31" }),
      ).not.toThrow();
    });

    it("6.1.3: name exceeds 25 chars rejected", async () => {
      registerRoutineTools(server as never, client as never, logger, true);
      const schema = server.getSchema("create_routine") as {
        parse: (v: unknown) => unknown;
      };
      expect(() =>
        schema.parse({
          start: "2025-01-01",
          end: "2025-12-31",
          name: "a".repeat(26),
        }),
      ).toThrow();
    });

    it("6.1.5: missing start rejected", async () => {
      registerRoutineTools(server as never, client as never, logger, true);
      const schema = server.getSchema("create_routine") as {
        parse: (v: unknown) => unknown;
      };
      expect(() => schema.parse({ end: "2025-12-31" })).toThrow();
    });
  });

  describe("update_routine", () => {
    it("6.14.1: extracts id from body", async () => {
      client.patch.mockResolvedValue({ id: 5, name: "Updated" });
      registerRoutineTools(server as never, client as never, logger, true);
      const handler = server.getTool("update_routine")!;
      await handler({ id: 5, name: "X" });
      expect(client.patch).toHaveBeenCalledWith(
        "/api/v2/routine/5/",
        { name: "X" },
        expect.anything(),
      );
    });
  });

  describe("special endpoints", () => {
    it("6.12.1: get_routine_structure", async () => {
      client.get.mockResolvedValue({ id: 1 });
      registerRoutineTools(server as never, client as never, logger, true);
      const handler = server.getTool("get_routine_structure")!;
      await handler({ id: 1 });
      expect(client.get).toHaveBeenCalledWith("/api/v2/routine/1/structure/");
    });

    it("6.12.2: get_routine_logs", async () => {
      client.get.mockResolvedValue({ id: 1 });
      registerRoutineTools(server as never, client as never, logger, true);
      const handler = server.getTool("get_routine_logs")!;
      await handler({ id: 1 });
      expect(client.get).toHaveBeenCalledWith("/api/v2/routine/1/logs/");
    });
  });

  describe("error handling", () => {
    it("6.10.1: API error returns structured error", async () => {
      client.get.mockRejectedValue(new Error("API down"));
      registerRoutineTools(server as never, client as never, logger, true);
      const handler = server.getTool("list_routines")!;
      const result = await handler({});
      const parsed = JSON.parse(
        (result as { content: Array<{ type: string; text: string }> })
          .content[0].text,
      );
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toBe("API down");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerExerciseTools } from "../exercises.js";
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

describe("registerExerciseTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 7 tools", () => {
    registerExerciseTools(server as never, client as never, logger);
    expect(server.registerTool).toHaveBeenCalledTimes(7);
    expect(server.tools.has("list_exercises")).toBe(true);
    expect(server.tools.has("get_exercise")).toBe(true);
    expect(server.tools.has("search_exercises")).toBe(true);
    expect(server.tools.has("list_muscles")).toBe(true);
    expect(server.tools.has("list_equipment")).toBe(true);
    expect(server.tools.has("list_exercise_categories")).toBe(true);
    expect(server.tools.has("get_wger_status")).toBe(true);
  });

  describe("list_exercises", () => {
    it("5.1.1: no arguments calls GET /api/v2/exerciseinfo/", async () => {
      client.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("list_exercises")!;
      await handler({});
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/exerciseinfo/",
        expect.objectContaining({}),
        expect.anything(),
      );
    });

    it("5.1.2: passes limit and offset", async () => {
      client.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("list_exercises")!;
      await handler({ limit: 10, offset: 20 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/exerciseinfo/",
        expect.objectContaining({ limit: 10, offset: 20 }),
        expect.anything(),
      );
    });

    it("5.1.4: passes all filter params", async () => {
      client.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("list_exercises")!;
      await handler({
        limit: 10,
        offset: 20,
        category: 3,
        equipment: 1,
        language: 2,
      });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/exerciseinfo/",
        expect.objectContaining({
          limit: 10,
          offset: 20,
          category: 3,
          equipment: 1,
          language: 2,
        }),
        expect.anything(),
      );
    });

    it("5.1.5: returns paginated response", async () => {
      const data = {
        count: 1,
        next: null,
        previous: null,
        results: [{ id: 1 }],
      };
      client.get.mockResolvedValue(data);
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("list_exercises")!;
      const result = await handler({});
      const parsed = JSON.parse(
        (result as { content: Array<{ type: string; text: string }> })
          .content[0].text,
      );
      expect(parsed.ok).toBe(true);
      expect(parsed.data).toEqual(data);
    });

    it("5.1.7: schema rejects string limit", async () => {
      registerExerciseTools(server as never, client as never, logger);
      const schema = server.getSchema("list_exercises") as {
        parse: (v: unknown) => unknown;
      };
      expect(() => schema.parse({ limit: "ten" })).toThrow();
    });
  });

  describe("get_exercise", () => {
    it("5.2.1: calls GET /api/v2/exerciseinfo/{id}/", async () => {
      client.get.mockResolvedValue({ id: 1 });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("get_exercise")!;
      await handler({ id: 1 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/exerciseinfo/1/",
        undefined,
        expect.anything(),
      );
    });

    it("5.2.5: schema requires id", async () => {
      registerExerciseTools(server as never, client as never, logger);
      const schema = server.getSchema("get_exercise") as {
        parse: (v: unknown) => unknown;
      };
      expect(() => schema.parse({})).toThrow();
    });

    it("5.2.6: schema rejects string id", async () => {
      registerExerciseTools(server as never, client as never, logger);
      const schema = server.getSchema("get_exercise") as {
        parse: (v: unknown) => unknown;
      };
      expect(() => schema.parse({ id: "1" })).toThrow();
    });
  });

  describe("search_exercises", () => {
    it("5.3.1: maps term to name__search", async () => {
      client.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("search_exercises")!;
      await handler({ term: "bench press" });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/exerciseinfo/",
        expect.objectContaining({ name__search: "bench press" }),
        expect.anything(),
      );
    });

    it("5.3.6: schema requires term", async () => {
      registerExerciseTools(server as never, client as never, logger);
      const schema = server.getSchema("search_exercises") as {
        parse: (v: unknown) => unknown;
      };
      expect(() => schema.parse({ limit: 10 })).toThrow();
    });
  });

  describe("get_wger_status", () => {
    it("5.7.1: calls getStatus and returns ok", async () => {
      client.getStatus.mockResolvedValue({ status: "ok" });
      registerExerciseTools(server as never, client as never, logger);
      const handler = server.getTool("get_wger_status")!;
      const result = await handler({});
      expect(client.getStatus).toHaveBeenCalled();
      const parsed = JSON.parse(
        (result as { content: Array<{ type: string; text: string }> })
          .content[0].text,
      );
      expect(parsed.ok).toBe(true);
      expect(parsed.data.status).toBe("ok");
    });
  });
});

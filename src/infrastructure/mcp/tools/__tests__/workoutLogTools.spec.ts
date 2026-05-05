import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerWorkoutLogTools } from "../workoutLogTools.js";
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
    registerTool: vi.fn((name: string, schema: { inputSchema: unknown }, handler: (args: unknown) => Promise<unknown>) => {
      tools.set(name, handler);
      schemas.set(name, schema.inputSchema);
    }),
    getTool: (name: string) => tools.get(name),
    getSchema: (name: string) => schemas.get(name),
    tools,
    schemas,
  };
}

describe("registerWorkoutLogTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerWorkoutLogTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_workout_logs")).toBe(true);
    expect(server.tools.has("get_workout_log")).toBe(true);
    expect(server.tools.has("create_workout_log")).toBe(true);
    expect(server.tools.has("update_workout_log")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerWorkoutLogTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_workout_log")).toBe(false);
  });

  it("list_workout_logs calls GET /api/v2/workoutlog/", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_workout_logs")!;
    await handler({ routine: 1, date: "2024-01-01" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/workoutlog/",
      expect.objectContaining({ routine: 1, date: "2024-01-01" }),
      expect.anything(),
    );
  });

  it("get_workout_log calls GET /api/v2/workoutlog/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_workout_log")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/workoutlog/1/", undefined, expect.anything());
  });

  it("create_workout_log calls POST /api/v2/workoutlog/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_workout_log")!;
    await handler({ exercise: 1, repetitions: "10" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/workoutlog/",
      expect.objectContaining({ exercise: 1, repetitions: "10" }),
      expect.anything(),
    );
  });

  it("update_workout_log extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_workout_log")!;
    await handler({ id: 5, repetitions: "12" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/workoutlog/5/",
      expect.objectContaining({ repetitions: "12" }),
      expect.anything(),
    );
  });

  it("rir schema rejects values with more than 1 integer + 1 decimal digit", () => {
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_workout_log") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ exercise: 1, rir: "99.99" })).toThrow();
    expect(() => schema.parse({ exercise: 1, rir: "9.9" })).not.toThrow();
  });

  it("rest and iteration use nonNegativeIntegerSchema", () => {
    registerWorkoutLogTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_workout_log") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ exercise: 1, rest: -1 })).toThrow();
    expect(() => schema.parse({ exercise: 1, rest: 60 })).not.toThrow();
  });
});

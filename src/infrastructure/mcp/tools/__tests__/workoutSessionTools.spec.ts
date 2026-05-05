import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerWorkoutSessionTools } from "../workoutSessionTools.js";
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

describe("registerWorkoutSessionTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_workout_sessions")).toBe(true);
    expect(server.tools.has("get_workout_session")).toBe(true);
    expect(server.tools.has("create_workout_session")).toBe(true);
    expect(server.tools.has("update_workout_session")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerWorkoutSessionTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_workout_session")).toBe(false);
  });

  it("list_workout_sessions calls GET /api/v2/workoutsession/", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_workout_sessions")!;
    await handler({ date: "2024-01-01" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/workoutsession/",
      expect.objectContaining({ date: "2024-01-01" }),
      expect.anything(),
    );
  });

  it("get_workout_session calls GET /api/v2/workoutsession/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_workout_session")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/workoutsession/1/", undefined, expect.anything());
  });

  it("create_workout_session calls POST /api/v2/workoutsession/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_workout_session")!;
    await handler({ date: "2024-01-01", time_start: "08:00" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/workoutsession/",
      expect.objectContaining({ date: "2024-01-01", time_start: "08:00" }),
      expect.anything(),
    );
  });

  it("update_workout_session extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_workout_session")!;
    await handler({ id: 5, notes: "Updated" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/workoutsession/5/",
      expect.objectContaining({ notes: "Updated" }),
      expect.anything(),
    );
  });

  it("impression schema accepts 1, 2, 3 only", () => {
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_workout_session") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ impression: "1" })).not.toThrow();
    expect(() => schema.parse({ impression: "4" })).toThrow();
  });

  it("time fields use timeStringSchema", () => {
    registerWorkoutSessionTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_workout_session") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ time_start: "not-a-time" })).toThrow();
    expect(() => schema.parse({ time_start: "08:00" })).not.toThrow();
  });
});

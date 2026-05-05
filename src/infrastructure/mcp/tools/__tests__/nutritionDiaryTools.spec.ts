import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerNutritionDiaryTools } from "../nutritionDiaryTools.js";
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

describe("registerNutritionDiaryTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 5 tools when enableWriteTools is true", () => {
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(5);
    expect(server.tools.has("list_nutrition_diary_entries")).toBe(true);
    expect(server.tools.has("get_nutrition_diary_entry")).toBe(true);
    expect(server.tools.has("get_nutrition_diary_nutritional_values")).toBe(true);
    expect(server.tools.has("create_nutrition_diary_entry")).toBe(true);
    expect(server.tools.has("update_nutrition_diary_entry")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerNutritionDiaryTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(3);
    expect(server.tools.has("create_nutrition_diary_entry")).toBe(false);
  });

  it("list_nutrition_diary_entries calls GET /api/v2/nutritiondiary/ with date mapped to datetime__date", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_nutrition_diary_entries")!;
    await handler({ plan: 1, date: "2024-01-01" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/nutritiondiary/",
      expect.objectContaining({ plan: 1, datetime__date: "2024-01-01" }),
      expect.anything(),
    );
  });

  it("get_nutrition_diary_entry calls GET /api/v2/nutritiondiary/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_nutrition_diary_entry")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/nutritiondiary/1/", undefined, expect.anything());
  });

  it("get_nutrition_diary_nutritional_values calls GET /api/v2/nutritiondiary/{id}/nutritional_values/", async () => {
    client.get.mockResolvedValue({ energy: 500 });
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_nutrition_diary_nutritional_values")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/nutritiondiary/1/nutritional_values/", undefined, expect.anything());
  });

  it("create_nutrition_diary_entry calls POST /api/v2/nutritiondiary/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_nutrition_diary_entry")!;
    await handler({ plan: 1, ingredient: 2, amount: "150.5" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/nutritiondiary/",
      expect.objectContaining({ plan: 1, ingredient: 2, amount: "150.5" }),
      expect.anything(),
    );
  });

  it("update_nutrition_diary_entry extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_nutrition_diary_entry")!;
    await handler({ id: 5, amount: "200" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/nutritiondiary/5/",
      expect.objectContaining({ amount: "200" }),
      expect.anything(),
    );
  });

  it("datetime uses isoDateTimeStringSchema", () => {
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_nutrition_diary_entry") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ plan: 1, ingredient: 2, amount: "150", datetime: "2024-01-01" })).toThrow();
    expect(() => schema.parse({ plan: 1, ingredient: 2, amount: "150", datetime: "2024-01-01T10:00:00" })).not.toThrow();
  });

  it("create schema requires plan, ingredient, amount", () => {
    registerNutritionDiaryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_nutrition_diary_entry") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ plan: 1, ingredient: 2 })).toThrow();
  });
});

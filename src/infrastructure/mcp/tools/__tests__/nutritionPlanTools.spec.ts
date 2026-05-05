import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerNutritionPlanTools } from "../nutritionPlanTools.js";
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

describe("registerNutritionPlanTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 5 tools when enableWriteTools is true", () => {
    registerNutritionPlanTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(5);
    expect(server.tools.has("list_nutrition_plans")).toBe(true);
    expect(server.tools.has("get_nutrition_plan")).toBe(true);
    expect(server.tools.has("get_nutrition_plan_nutritional_values")).toBe(true);
    expect(server.tools.has("create_nutrition_plan")).toBe(true);
    expect(server.tools.has("update_nutrition_plan")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerNutritionPlanTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(3);
    expect(server.tools.has("create_nutrition_plan")).toBe(false);
  });

  it("list_nutrition_plans calls GET /api/v2/nutritionplan/", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_nutrition_plans")!;
    await handler({ description: "Bulk" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/nutritionplan/",
      expect.objectContaining({ description: "Bulk" }),
      expect.anything(),
    );
  });

  it("get_nutrition_plan calls GET /api/v2/nutritionplan/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_nutrition_plan")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/nutritionplan/1/", undefined, expect.anything());
  });

  it("get_nutrition_plan_nutritional_values calls GET /api/v2/nutritionplan/{id}/nutritional_values/", async () => {
    client.get.mockResolvedValue({ energy: 2000 });
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_nutrition_plan_nutritional_values")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/nutritionplan/1/nutritional_values/", undefined, expect.anything());
  });

  it("create_nutrition_plan calls POST /api/v2/nutritionplan/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_nutrition_plan")!;
    await handler({ description: "Cut", goal_energy: 2000 });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/nutritionplan/",
      expect.objectContaining({ description: "Cut", goal_energy: 2000 }),
      expect.anything(),
    );
  });

  it("update_nutrition_plan extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_nutrition_plan")!;
    await handler({ id: 5, goal_energy: 2500 });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/nutritionplan/5/",
      expect.objectContaining({ goal_energy: 2500 }),
      expect.anything(),
    );
  });

  it("goal fields accept null", () => {
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_nutrition_plan") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ goal_energy: null })).not.toThrow();
  });

  it("description max length 80", () => {
    registerNutritionPlanTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_nutrition_plan") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ description: "a".repeat(81) })).toThrow();
    expect(() => schema.parse({ description: "a".repeat(80) })).not.toThrow();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerMealTools } from "../mealTools.js";
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

describe("registerMealTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 10 tools when enableWriteTools is true", () => {
    registerMealTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(10);
    expect(server.tools.has("list_meals")).toBe(true);
    expect(server.tools.has("get_meal")).toBe(true);
    expect(server.tools.has("get_meal_nutritional_values")).toBe(true);
    expect(server.tools.has("list_meal_items")).toBe(true);
    expect(server.tools.has("get_meal_item")).toBe(true);
    expect(server.tools.has("get_meal_item_nutritional_values")).toBe(true);
    expect(server.tools.has("create_meal")).toBe(true);
    expect(server.tools.has("update_meal")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerMealTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(6);
    expect(server.tools.has("create_meal")).toBe(false);
    expect(server.tools.has("update_meal")).toBe(false);
  });

  it("list_meals calls GET /api/v2/meal/", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerMealTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_meals")!;
    await handler({ plan: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/meal/",
      expect.objectContaining({ plan: 1 }),
      expect.anything(),
    );
  });

  it("get_meal calls GET /api/v2/meal/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerMealTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_meal")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/meal/1/",
      undefined,
      expect.anything(),
    );
  });

  it("get_meal_nutritional_values calls GET /api/v2/meal/{id}/nutritional_values/", async () => {
    client.get.mockResolvedValue({ energy: 100 });
    registerMealTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_meal_nutritional_values")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/meal/1/nutritional_values/",
      undefined,
      expect.anything(),
    );
  });

  it("list_meal_items calls GET /api/v2/mealitem/", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerMealTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_meal_items")!;
    await handler({ meal: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/mealitem/",
      expect.objectContaining({ meal: 1 }),
      expect.anything(),
    );
  });

  it("create_meal_item calls POST /api/v2/mealitem/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerMealTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_meal_item")!;
    await handler({ meal: 1, ingredient: 2, amount: "150" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/mealitem/",
      expect.objectContaining({ meal: 1, ingredient: 2, amount: "150" }),
      expect.anything(),
    );
  });

  it("create_meal schema requires plan", () => {
    registerMealTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_meal") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ name: "Breakfast" })).toThrow();
  });

  it("meal time accepts null", () => {
    registerMealTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_meal") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ plan: 1, time: null })).not.toThrow();
  });
});

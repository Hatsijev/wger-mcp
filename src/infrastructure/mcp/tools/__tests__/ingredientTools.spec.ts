import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerIngredientTools } from "../ingredientTools.js";
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

describe("registerIngredientTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 8 tools", () => {
    registerIngredientTools(server as never, client as never, logger);
    expect(server.registerTool).toHaveBeenCalledTimes(8);
    expect(server.tools.has("list_ingredients")).toBe(true);
    expect(server.tools.has("get_ingredient")).toBe(true);
    expect(server.tools.has("search_ingredients")).toBe(true);
    expect(server.tools.has("get_ingredient_values")).toBe(true);
    expect(server.tools.has("list_ingredient_images")).toBe(true);
    expect(server.tools.has("get_ingredient_image")).toBe(true);
    expect(server.tools.has("list_ingredient_weight_units")).toBe(true);
    expect(server.tools.has("get_ingredient_weight_unit")).toBe(true);
  });

  it("list_ingredients calls GET /api/v2/ingredientinfo/", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerIngredientTools(server as never, client as never, logger);
    const handler = server.getTool("list_ingredients")!;
    await handler({ search: "rice", language: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/ingredientinfo/",
      expect.objectContaining({ name__search: "rice", language: 1 }),
      expect.anything(),
    );
  });

  it("get_ingredient calls GET /api/v2/ingredientinfo/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerIngredientTools(server as never, client as never, logger);
    const handler = server.getTool("get_ingredient")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/ingredientinfo/1/", undefined, expect.anything());
  });

  it("search_ingredients maps term to name__search", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerIngredientTools(server as never, client as never, logger);
    const handler = server.getTool("search_ingredients")!;
    await handler({ term: "chicken" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/ingredientinfo/",
      expect.objectContaining({ name__search: "chicken" }),
      expect.anything(),
    );
  });

  it("get_ingredient_values calls GET /api/v2/ingredientinfo/{id}/get_values/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerIngredientTools(server as never, client as never, logger);
    const handler = server.getTool("get_ingredient_values")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith("/api/v2/ingredientinfo/1/get_values/", undefined, expect.anything());
  });

  it("list_ingredient_weight_units calls GET /api/v2/ingredientweightunit/", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerIngredientTools(server as never, client as never, logger);
    const handler = server.getTool("list_ingredient_weight_units")!;
    await handler({ ingredient: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/ingredientweightunit/",
      expect.objectContaining({ ingredient: 1 }),
      expect.anything(),
    );
  });

  it("search_ingredients schema requires term", () => {
    registerIngredientTools(server as never, client as never, logger);
    const schema = server.getSchema("search_ingredients") as { parse: (v: unknown) => unknown };
    expect(() => schema.parse({ limit: 10 })).toThrow();
  });
});

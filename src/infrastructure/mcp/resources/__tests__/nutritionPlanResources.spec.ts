import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerNutritionPlanResources } from "../nutritionPlanResources.js";
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
  const resources = new Map<string, () => Promise<unknown>>();
  const templates = new Map<
    string,
    (uri: URL, vars: Record<string, string>) => Promise<unknown>
  >();
  return {
    registerResource: vi.fn(
      (
        name: string,
        _uri: unknown,
        _meta: unknown,
        handler:
          | (() => Promise<unknown>)
          | ((uri: URL, vars: Record<string, string>) => Promise<unknown>),
      ) => {
        if (name.includes("by-id")) {
          templates.set(
            name,
            handler as (
              uri: URL,
              vars: Record<string, string>,
            ) => Promise<unknown>,
          );
        } else {
          resources.set(name, handler as () => Promise<unknown>);
        }
      },
    ),
    getResource: (name: string) => resources.get(name),
    getTemplate: (name: string) => templates.get(name),
    resources,
    templates,
  };
}

describe("registerNutritionPlanResources", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 2 resources", () => {
    registerNutritionPlanResources(server as never, client as never, logger);
    expect(server.registerResource).toHaveBeenCalledTimes(2);
  });

  it("nutrition-plans resource fetches with limit=20", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerNutritionPlanResources(server as never, client as never, logger);
    const handler = server.getResource("nutrition-plans")!;
    await handler();
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/nutritionplan/",
      { limit: 20 },
      expect.anything(),
    );
  });

  it("nutrition-plan-by-id template fetches single item", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerNutritionPlanResources(server as never, client as never, logger);
    const handler = server.getTemplate("nutrition-plan-by-id")!;
    await handler(new URL("wger://nutrition-plans/1"), { id: "1" });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/nutritionplan/1/",
      undefined,
      expect.anything(),
    );
  });
});

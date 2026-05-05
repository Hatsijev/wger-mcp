import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerExerciseResources } from "../exercises.js";
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
  return {
    registerResource: vi.fn((name: string, _uri: unknown, _meta: unknown, handler: () => Promise<unknown>) => {
      resources.set(name, handler);
    }),
    getResource: (name: string) => resources.get(name),
    resources,
  };
}

describe("registerExerciseResources", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("7.3.2: registers 5 resources", () => {
    registerExerciseResources(server as never, client as never, logger);
    expect(server.registerResource).toHaveBeenCalledTimes(5);
  });

  it("7.1.1: exercises resource fetches with limit=20", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerExerciseResources(server as never, client as never, logger);
    const handler = server.getResource("exercises")!;
    await handler();
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/exerciseinfo/",
      { limit: 20 },
      expect.anything(),
    );
  });

  it("7.1.2: muscles resource", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerExerciseResources(server as never, client as never, logger);
    const handler = server.getResource("muscles")!;
    await handler();
    expect(client.get).toHaveBeenCalledWith("/api/v2/muscle/", { limit: 20 }, expect.anything());
  });

  it("7.1.5: all static resources hardcode limit 20", async () => {
    client.get.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
    registerExerciseResources(server as never, client as never, logger);
    for (const name of ["exercises", "muscles", "equipment", "categories"]) {
      client.get.mockClear();
      const handler = server.getResource(name)!;
      await handler();
      expect(client.get).toHaveBeenCalledWith(expect.any(String), { limit: 20 }, expect.anything());
    }
  });
});

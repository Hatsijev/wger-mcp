import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerConfigTools } from "../configTools.js";
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

describe("registerConfigTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers read tools when enableWriteTools is false", () => {
    registerConfigTools(server as never, client as never, logger, false);
    expect(server.tools.has("list_max_repetitions_configs")).toBe(true);
    expect(server.tools.has("get_max_repetitions_config")).toBe(true);
    expect(server.tools.has("create_max_repetitions_config")).toBe(false);
    expect(server.tools.has("update_max_repetitions_config")).toBe(false);
    expect(server.tools.has("delete_max_repetitions_config")).toBe(false);
  });

  it("registers write tools when enableWriteTools is true", () => {
    registerConfigTools(server as never, client as never, logger, true);
    expect(server.tools.has("create_max_repetitions_config")).toBe(true);
    expect(server.tools.has("update_max_repetitions_config")).toBe(true);
    expect(server.tools.has("delete_max_repetitions_config")).toBe(true);
    expect(server.tools.has("create_max_rest_config")).toBe(true);
    expect(server.tools.has("create_max_rir_config")).toBe(true);
    expect(server.tools.has("create_max_set_nr_config")).toBe(true);
    expect(server.tools.has("create_max_weight_config")).toBe(true);
  });

  describe("max repetitions config", () => {
    it("list calls client.get", async () => {
      client.get.mockResolvedValue({ count: 0, results: [] });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("list_max_repetitions_configs")!;
      await handler({ limit: 10, offset: 0 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-repetitions-config/",
        { limit: 10, offset: 0 },
        expect.anything(),
      );
    });

    it("get calls client.get", async () => {
      client.get.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("get_max_repetitions_config")!;
      await handler({ id: 1 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-repetitions-config/1/",
        undefined,
        expect.anything(),
      );
    });

    it("create calls client.post", async () => {
      client.post.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("create_max_repetitions_config")!;
      await handler({ slot_entry: 1, iteration: 0, value: "10" });
      expect(client.post).toHaveBeenCalledWith(
        "/api/v2/max-repetitions-config/",
        { slot_entry: 1, iteration: 0, value: "10" },
        expect.anything(),
      );
    });

    it("update calls client.patch", async () => {
      client.patch.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("update_max_repetitions_config")!;
      await handler({ id: 1, value: "12" });
      expect(client.patch).toHaveBeenCalledWith(
        "/api/v2/max-repetitions-config/1/",
        { value: "12" },
        expect.anything(),
      );
    });

    it("delete calls client.delete", async () => {
      client.delete.mockResolvedValue(undefined);
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("delete_max_repetitions_config")!;
      await handler({ id: 1 });
      expect(client.delete).toHaveBeenCalledWith(
        "/api/v2/max-repetitions-config/1/",
      );
    });
  });

  describe("max rest config", () => {
    it("list calls client.get", async () => {
      client.get.mockResolvedValue({ count: 0, results: [] });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("list_max_rest_configs")!;
      await handler({ limit: 10, offset: 0 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-rest-config/",
        { limit: 10, offset: 0 },
        expect.anything(),
      );
    });

    it("create calls client.post", async () => {
      client.post.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("create_max_rest_config")!;
      await handler({ slot_entry: 1, iteration: 0, value: 60 });
      expect(client.post).toHaveBeenCalledWith(
        "/api/v2/max-rest-config/",
        { slot_entry: 1, iteration: 0, value: 60 },
        expect.anything(),
      );
    });
  });

  describe("max rir config", () => {
    it("list calls client.get", async () => {
      client.get.mockResolvedValue({ count: 0, results: [] });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("list_max_rir_configs")!;
      await handler({ limit: 10, offset: 0 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-rir-config/",
        { limit: 10, offset: 0 },
        expect.anything(),
      );
    });

    it("create calls client.post", async () => {
      client.post.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("create_max_rir_config")!;
      await handler({ slot_entry: 1, iteration: 0, value: "2" });
      expect(client.post).toHaveBeenCalledWith(
        "/api/v2/max-rir-config/",
        { slot_entry: 1, iteration: 0, value: "2" },
        expect.anything(),
      );
    });
  });

  describe("max set nr config", () => {
    it("list calls client.get", async () => {
      client.get.mockResolvedValue({ count: 0, results: [] });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("list_max_set_nr_configs")!;
      await handler({ limit: 10, offset: 0 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-sets-config/",
        { limit: 10, offset: 0 },
        expect.anything(),
      );
    });

    it("create calls client.post", async () => {
      client.post.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("create_max_set_nr_config")!;
      await handler({ slot_entry: 1, iteration: 0, value: 3 });
      expect(client.post).toHaveBeenCalledWith(
        "/api/v2/max-sets-config/",
        { slot_entry: 1, iteration: 0, value: 3 },
        expect.anything(),
      );
    });
  });

  describe("max weight config", () => {
    it("list calls client.get", async () => {
      client.get.mockResolvedValue({ count: 0, results: [] });
      registerConfigTools(server as never, client as never, logger, false);
      const handler = server.getTool("list_max_weight_configs")!;
      await handler({ limit: 10, offset: 0 });
      expect(client.get).toHaveBeenCalledWith(
        "/api/v2/max-weight-config/",
        { limit: 10, offset: 0 },
        expect.anything(),
      );
    });

    it("create calls client.post", async () => {
      client.post.mockResolvedValue({ id: 1 });
      registerConfigTools(server as never, client as never, logger, true);
      const handler = server.getTool("create_max_weight_config")!;
      await handler({ slot_entry: 1, iteration: 0, value: "100.0" });
      expect(client.post).toHaveBeenCalledWith(
        "/api/v2/max-weight-config/",
        { slot_entry: 1, iteration: 0, value: "100.0" },
        expect.anything(),
      );
    });
  });
});

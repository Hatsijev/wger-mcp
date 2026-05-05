import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerGalleryTools } from "../galleryTools.js";
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

describe("registerGalleryTools", () => {
  let client: ReturnType<typeof createMockClient>;
  let server: ReturnType<typeof createMockServer>;
  let logger: ConsoleLogger;

  beforeEach(() => {
    client = createMockClient();
    server = createMockServer();
    logger = new ConsoleLogger("error");
  });

  it("registers 4 tools when enableWriteTools is true", () => {
    registerGalleryTools(server as never, client as never, logger, true);
    expect(server.registerTool).toHaveBeenCalledTimes(4);
    expect(server.tools.has("list_gallery_images")).toBe(true);
    expect(server.tools.has("get_gallery_image")).toBe(true);
    expect(server.tools.has("create_gallery_image")).toBe(true);
    expect(server.tools.has("update_gallery_image")).toBe(true);
  });

  it("skips write tools when enableWriteTools is false", () => {
    registerGalleryTools(server as never, client as never, logger, false);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    expect(server.tools.has("create_gallery_image")).toBe(false);
  });

  it("list_gallery_images calls GET /api/v2/gallery/", async () => {
    client.get.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    registerGalleryTools(server as never, client as never, logger, true);
    const handler = server.getTool("list_gallery_images")!;
    await handler({});
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/gallery/",
      expect.objectContaining({}),
      expect.anything(),
    );
  });

  it("get_gallery_image calls GET /api/v2/gallery/{id}/", async () => {
    client.get.mockResolvedValue({ id: 1 });
    registerGalleryTools(server as never, client as never, logger, true);
    const handler = server.getTool("get_gallery_image")!;
    await handler({ id: 1 });
    expect(client.get).toHaveBeenCalledWith(
      "/api/v2/gallery/1/",
      undefined,
      expect.anything(),
    );
  });

  it("create_gallery_image calls POST /api/v2/gallery/", async () => {
    client.post.mockResolvedValue({ id: 1 });
    registerGalleryTools(server as never, client as never, logger, true);
    const handler = server.getTool("create_gallery_image")!;
    await handler({ date: "2024-01-01", image: "https://example.com/img.jpg" });
    expect(client.post).toHaveBeenCalledWith(
      "/api/v2/gallery/",
      expect.objectContaining({
        date: "2024-01-01",
        image: "https://example.com/img.jpg",
      }),
      expect.anything(),
    );
  });

  it("update_gallery_image extracts id and calls PATCH", async () => {
    client.patch.mockResolvedValue({ id: 5 });
    registerGalleryTools(server as never, client as never, logger, true);
    const handler = server.getTool("update_gallery_image")!;
    await handler({ id: 5, description: "Updated" });
    expect(client.patch).toHaveBeenCalledWith(
      "/api/v2/gallery/5/",
      expect.objectContaining({ description: "Updated" }),
      expect.anything(),
    );
  });

  it("create schema requires date and image", () => {
    registerGalleryTools(server as never, client as never, logger, true);
    const schema = server.getSchema("create_gallery_image") as {
      parse: (v: unknown) => unknown;
    };
    expect(() => schema.parse({ date: "2024-01-01" })).toThrow();
  });
});

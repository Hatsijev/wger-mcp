import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WgerClient } from "../WgerClient.js";
import { WgerError, WgerAuthError } from "../../../domain/errors/WgerError.js";
import { ConsoleLogger } from "../../ConsoleLogger.js";
import type { Config } from "../../../domain/models/Config.types.js";

const baseConfig: Config = {
  wgerBaseUrl: "https://wger.de",
  wgerApiToken: "test-token",
  wgerRequestTimeoutMs: 30000,
  logLevel: "error",
  enableWriteTools: true,
  enableDestructiveTools: false,
  enableAdminTools: false,
  enableRawWgerProxy: false,
};

function createClient(config?: Partial<Config>): WgerClient {
  return new WgerClient(
    { ...baseConfig, ...config } as Config,
    new ConsoleLogger("error"),
  );
}

describe("WgerClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mockResponse(body: unknown, status = 200, ok = true) {
    return {
      ok,
      status,
      clone: () => ({
        text: () =>
          Promise.resolve(
            typeof body === "string" ? body : JSON.stringify(body),
          ),
      }),
      json: () => Promise.resolve(body),
      text: () =>
        Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
    };
  }

  describe("constructor", () => {
    it("4.1.1: strips trailing slash from base URL", () => {
      const client = createClient({ wgerBaseUrl: "https://wger.de/" });
      // @ts-expect-error accessing private field for test
      expect(client._baseUrl).toBe("https://wger.de");
    });

    it("4.1.2: no trailing slash stays unchanged", () => {
      const client = createClient({ wgerBaseUrl: "https://wger.de" });
      // @ts-expect-error accessing private field for test
      expect(client._baseUrl).toBe("https://wger.de");
    });

    it("4.1.3: multiple trailing slashes stripped", () => {
      const client = createClient({ wgerBaseUrl: "https://wger.de///" });
      // @ts-expect-error accessing private field for test
      expect(client._baseUrl).toBe("https://wger.de");
    });
  });

  describe("GET", () => {
    it("4.2.1: get with no params", async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const client = createClient();
      await client.get("/api/v2/exerciseinfo/");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://wger.de/api/v2/exerciseinfo/",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("4.2.2: get with limit and offset", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/api/v2/exerciseinfo/", { limit: 10, offset: 0 });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("limit=10");
      expect(url).toContain("offset=0");
    });

    it("4.2.3: undefined params are omitted", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/api/v2/exerciseinfo/", {
        limit: 10,
        offset: undefined,
      });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("limit=10");
      expect(url).not.toContain("offset");
    });

    it("4.2.4: mixed defined and undefined params", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/path", { limit: 10, offset: undefined, category: 5 });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("limit=10");
      expect(url).toContain("category=5");
      expect(url).not.toContain("offset");
    });

    it("4.2.5: empty params object produces no query string", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/path", {});
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).not.toContain("?");
    });

    it("4.2.6: space in search param is encoded", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/path", { name__search: "bench press" });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("bench+press");
    });

    it("4.2.7: boolean serialized as true/false", async () => {
      fetchMock.mockResolvedValue(mockResponse({ count: 1, results: [] }));
      const client = createClient();
      await client.get("/path", { flag: true });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("flag=true");
    });
  });

  describe("authentication headers", () => {
    it("4.3.1: Authorization header on all methods", async () => {
      fetchMock.mockResolvedValue(mockResponse({}));
      const client = createClient();
      await client.get("/path");
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.headers.Authorization).toBe("Token test-token");

      await client.post("/path", {});
      const postOpts = fetchMock.mock.calls[1][1];
      expect(postOpts.headers.Authorization).toBe("Token test-token");
    });

    it("4.3.2: Content-Type header on all requests", async () => {
      fetchMock.mockResolvedValue(mockResponse({}));
      const client = createClient();
      await client.get("/path");
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("POST/PUT/PATCH", () => {
    it("4.4.1: post sends JSON body", async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const client = createClient();
      await client.post("/api/v2/routine/", { name: "Test" });
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.method).toBe("POST");
      expect(opts.body).toBe('{"name":"Test"}');
    });

    it("4.4.2: put sends JSON body", async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const client = createClient();
      await client.put("/api/v2/routine/1/", { name: "Updated" });
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.method).toBe("PUT");
      expect(opts.body).toBe('{"name":"Updated"}');
    });

    it("4.4.3: patch sends JSON body", async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const client = createClient();
      await client.patch("/api/v2/routine/1/", { name: "Patched" });
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.method).toBe("PATCH");
      expect(opts.body).toBe('{"name":"Patched"}');
    });

    it("4.4.4: POST URL is baseUrl + path without query params", async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const client = createClient();
      await client.post("/api/v2/routine/", { name: "Test" });
      const url = fetchMock.mock.calls[0][0];
      expect(url).toBe("https://wger.de/api/v2/routine/");
    });
  });

  describe("DELETE", () => {
    it("4.5.1: delete sends DELETE with no body", async () => {
      fetchMock.mockResolvedValue(mockResponse({}, 204));
      const client = createClient();
      await client.delete("/api/v2/routine/1/");
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.method).toBe("DELETE");
      expect(opts.body).toBeUndefined();
    });

    it("4.10.1: DELETE 204 returns void", async () => {
      fetchMock.mockResolvedValue(mockResponse({}, 204));
      const client = createClient();
      const result = await client.delete("/api/v2/routine/1/");
      expect(result).toBeUndefined();
    });

    it("4.10.2: DELETE 404 throws WgerError", async () => {
      fetchMock.mockResolvedValue(mockResponse("Not found", 404, false));
      const client = createClient();
      await expect(client.delete("/api/v2/routine/1/")).rejects.toThrow(
        WgerError,
      );
    });

    it("4.10.3: DELETE 401 throws WgerAuthError", async () => {
      fetchMock.mockResolvedValue(mockResponse("Unauthorized", 401, false));
      const client = createClient();
      await expect(client.delete("/api/v2/routine/1/")).rejects.toThrow(
        WgerAuthError,
      );
    });
  });

  describe("getStatus", () => {
    it("4.6.1: getStatus succeeds", async () => {
      fetchMock.mockResolvedValue(
        mockResponse({ count: 1, results: [{ id: 1 }] }),
      );
      const client = createClient();
      const status = await client.getStatus();
      expect(status.status).toBe("ok");
    });

    it("4.6.2: getStatus propagates errors", async () => {
      fetchMock.mockRejectedValue(new Error("Network fail"));
      const client = createClient();
      await expect(client.getStatus()).rejects.toThrow();
    });
  });

  describe("network errors", () => {
    it("4.7.1: fetch throws TypeError → WgerError with cause", async () => {
      const cause = new TypeError("Failed to fetch");
      fetchMock.mockRejectedValue(cause);
      const client = createClient();
      await expect(client.get("/path")).rejects.toThrow(WgerError);
      try {
        await client.get("/path");
      } catch (e) {
        expect((e as WgerError).message).toContain("Network error");
        expect((e as WgerError).cause).toBe(cause);
      }
    });

    it("4.7.2: fetch throws non-Error → WgerError without cause", async () => {
      fetchMock.mockRejectedValue("string error");
      const client = createClient();
      await expect(client.get("/path")).rejects.toThrow(WgerError);
    });
  });

  describe("HTTP error responses", () => {
    it("4.8.1: 401 throws WgerAuthError", async () => {
      fetchMock.mockResolvedValue(mockResponse("Unauthorized", 401, false));
      const client = createClient();
      await expect(client.get("/path")).rejects.toThrow(WgerAuthError);
    });

    it("4.8.2: 400 throws WgerError", async () => {
      fetchMock.mockResolvedValue(mockResponse("Bad request", 400, false));
      const client = createClient();
      await expect(client.get("/path")).rejects.toThrow(WgerError);
    });

    it("4.8.3-6: various error statuses throw WgerError", async () => {
      const statuses = [403, 404, 500, 429];
      for (const status of statuses) {
        fetchMock.mockResolvedValue(mockResponse("Error", status, false));
        const client = createClient();
        await expect(client.get("/path")).rejects.toThrow(WgerError);
      }
    });
  });

  describe("JSON parsing errors", () => {
    it("4.9.1: invalid JSON throws WgerError", async () => {
      const res = {
        ok: true,
        status: 200,
        clone: () => ({ text: () => Promise.resolve("Not JSON") }),
        json: () => Promise.reject(new SyntaxError("Unexpected token")),
        text: () => Promise.resolve("Not JSON"),
      };
      fetchMock.mockResolvedValue(res);
      const client = createClient();
      await expect(client.get("/path")).rejects.toThrow(WgerError);
      await expect(client.get("/path")).rejects.toThrow(/Failed to parse/);
    });
  });

  describe("timeout", () => {
    it("uses AbortController signal", async () => {
      fetchMock.mockImplementation(() => new Promise(() => {}));
      const client = createClient();
      client.get("/path");
      const opts = fetchMock.mock.calls[0][1];
      expect(opts.signal).toBeInstanceOf(AbortSignal);
    });

    it("configurable timeout from config", () => {
      const client = createClient({ wgerRequestTimeoutMs: 60000 });
      // @ts-expect-error accessing private field for test
      expect(client._timeoutMs).toBe(60000);
    });
  });

  describe("response schema validation", () => {
    it("validates response when schema provided", async () => {
      fetchMock.mockResolvedValue(
        mockResponse({ count: 1, next: null, previous: null, results: [] }),
      );
      const client = createClient();
      const schema = {
        safeParse: (data: unknown) => ({ success: true, data }),
      };
      const result = await client.get("/path", {}, schema as never);
      expect(result).toEqual({
        count: 1,
        next: null,
        previous: null,
        results: [],
      });
    });

    it("throws when response schema validation fails", async () => {
      fetchMock.mockResolvedValue(mockResponse({ invalid: true }));
      const client = createClient();
      const schema = {
        safeParse: () => ({
          success: false,
          error: { issues: [{ path: ["count"], message: "Required" }] },
        }),
      };
      await expect(client.get("/path", {}, schema as never)).rejects.toThrow(
        WgerError,
      );
    });
  });
});

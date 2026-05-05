import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
}));

describe("main entry point", () => {
  const originalEnv = process.env;
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "test-token";
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ count: 1, results: [{ id: 1 }] }),
        clone: () => ({ text: () => Promise.resolve("{}") }),
        text: () => Promise.resolve("{}"),
      }),
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
    vi.resetModules();
    exitSpy.mockRestore();
  });

  it("10.1.1: happy path loads config and creates server", async () => {
    const { main } = await import("./index.js");
    await expect(main()).resolves.toBeUndefined();
  });

  it("10.1.2: missing env vars throws", async () => {
    delete process.env.WGER_BASE_URL;
    delete process.env.WGER_API_TOKEN;
    vi.resetModules();
    const { main } = await import("./index.js");
    await expect(main()).rejects.toThrow();
  });
});

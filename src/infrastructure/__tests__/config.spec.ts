import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../config.js";
import { WgerValidationError } from "../../domain/errors/WgerError.js";

describe("loadConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Clear relevant env vars before each test
    delete process.env.WGER_BASE_URL;
    delete process.env.WGER_API_TOKEN;
    delete process.env.WGER_LANGUAGE;
    delete process.env.WGER_REQUEST_TIMEOUT_MS;
    delete process.env.LOG_LEVEL;
    delete process.env.ENABLE_WRITE_TOOLS;
    delete process.env.ENABLE_DESTRUCTIVE_TOOLS;
    delete process.env.ENABLE_ADMIN_TOOLS;
    delete process.env.ENABLE_RAW_WGER_PROXY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("2.1.1: all required env vars set", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc123";
    const config = loadConfig();
    expect(config.wgerBaseUrl).toBe("https://wger.de");
    expect(config.wgerApiToken).toBe("abc123");
    expect(config.logLevel).toBe("info");
    expect(config.enableWriteTools).toBe(true);
    expect(config.enableDestructiveTools).toBe(false);
    expect(config.enableAdminTools).toBe(false);
    expect(config.enableRawWgerProxy).toBe(false);
  });

  it("2.1.2: all env vars set including optionals", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc123";
    process.env.WGER_LANGUAGE = "en";
    process.env.WGER_REQUEST_TIMEOUT_MS = "60000";
    process.env.LOG_LEVEL = "debug";
    process.env.ENABLE_DESTRUCTIVE_TOOLS = "true";
    const config = loadConfig();
    expect(config.wgerLanguage).toBe("en");
    expect(config.wgerRequestTimeoutMs).toBe(60000);
    expect(config.logLevel).toBe("debug");
    expect(config.enableDestructiveTools).toBe(true);
  });

  it("2.1.3: WGER_BASE_URL with trailing slash", () => {
    process.env.WGER_BASE_URL = "https://wger.de/";
    process.env.WGER_API_TOKEN = "abc";
    const config = loadConfig();
    expect(config.wgerBaseUrl).toBe("https://wger.de/");
  });

  it("2.1.4: ENABLE_DESTRUCTIVE_TOOLS=true (lowercase)", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.ENABLE_DESTRUCTIVE_TOOLS = "true";
    const config = loadConfig();
    expect(config.enableDestructiveTools).toBe(true);
  });

  it("2.1.5: ENABLE_DESTRUCTIVE_TOOLS=TRUE (uppercase)", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.ENABLE_DESTRUCTIVE_TOOLS = "TRUE";
    const config = loadConfig();
    expect(config.enableDestructiveTools).toBe(true);
  });

  it("2.1.6: LOG_LEVEL unset uses default info", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    const config = loadConfig();
    expect(config.logLevel).toBe("info");
  });

  it("2.2.1: WGER_BASE_URL missing throws", () => {
    process.env.WGER_API_TOKEN = "abc";
    expect(() => loadConfig()).toThrow(WgerValidationError);
    expect(() => loadConfig()).toThrow(/wgerBaseUrl/);
  });

  it("2.2.2: WGER_BASE_URL invalid URL throws", () => {
    process.env.WGER_BASE_URL = "not-a-url";
    process.env.WGER_API_TOKEN = "abc";
    expect(() => loadConfig()).toThrow(WgerValidationError);
  });

  it("2.2.3: WGER_API_TOKEN missing throws", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    expect(() => loadConfig()).toThrow(WgerValidationError);
    expect(() => loadConfig()).toThrow(/wgerApiToken/);
  });

  it("2.2.4: WGER_API_TOKEN empty string throws", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "";
    expect(() => loadConfig()).toThrow(WgerValidationError);
  });

  it("2.2.5: LOG_LEVEL set to verbose throws", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.LOG_LEVEL = "verbose";
    expect(() => loadConfig()).toThrow(WgerValidationError);
  });

  it("2.2.6: both required fields missing mentions both", () => {
    expect(() => loadConfig()).toThrow(WgerValidationError);
    try {
      loadConfig();
    } catch (e) {
      const msg = (e as WgerValidationError).message;
      expect(msg).toMatch(/wgerBaseUrl/);
      expect(msg).toMatch(/wgerApiToken/);
    }
  });

  it("2.2.7: ENABLE_DESTRUCTIVE_TOOLS=1 is false", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.ENABLE_DESTRUCTIVE_TOOLS = "1";
    const config = loadConfig();
    expect(config.enableDestructiveTools).toBe(false);
  });

  it("2.2.8: ENABLE_DESTRUCTIVE_TOOLS=false is false", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.ENABLE_DESTRUCTIVE_TOOLS = "false";
    const config = loadConfig();
    expect(config.enableDestructiveTools).toBe(false);
  });

  it("2.2.9: ENABLE_ADMIN_TOOLS undefined is false", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    delete process.env.ENABLE_ADMIN_TOOLS;
    const config = loadConfig();
    expect(config.enableAdminTools).toBe(false);
  });

  it("2.3.1-8: parseBoolean edge cases via config", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";

    const cases: Array<[string | undefined, boolean]> = [
      [undefined, false],
      ["true", true],
      ["True", true],
      ["TRUE", true],
      ["false", false],
      ["yes", false],
      ["1", false],
      ["", false],
    ];

    for (const [value, expected] of cases) {
      process.env.ENABLE_DESTRUCTIVE_TOOLS = value;
      const config = loadConfig();
      expect(config.enableDestructiveTools).toBe(expected);
    }
  });

  it("validates WGER_REQUEST_TIMEOUT_MS bounds", () => {
    process.env.WGER_BASE_URL = "https://wger.de";
    process.env.WGER_API_TOKEN = "abc";
    process.env.WGER_REQUEST_TIMEOUT_MS = "500";
    expect(() => loadConfig()).toThrow(WgerValidationError);

    process.env.WGER_REQUEST_TIMEOUT_MS = "400000";
    expect(() => loadConfig()).toThrow(WgerValidationError);

    process.env.WGER_REQUEST_TIMEOUT_MS = "30000";
    const config = loadConfig();
    expect(config.wgerRequestTimeoutMs).toBe(30000);
  });
});

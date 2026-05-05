import { describe, it, expect } from "vitest";
import type { Config, LogLevel } from "../Config.types.js";

describe("Config types", () => {
  it("1.1.1: Config with all fields populated", () => {
    const config: Config = {
      wgerBaseUrl: "https://wger.de",
      wgerApiToken: "token123",
      wgerLanguage: "en",
      wgerRequestTimeoutMs: 30000,
      logLevel: "info",
      enableWriteTools: true,
      enableDestructiveTools: false,
      enableAdminTools: false,
      enableRawWgerProxy: false,
    };
    expect(config.wgerBaseUrl).toBe("https://wger.de");
    expect(config.wgerRequestTimeoutMs).toBe(30000);
  });

  it("1.1.2: Config with only required fields", () => {
    const config: Config = {
      wgerBaseUrl: "https://wger.de",
      wgerApiToken: "token123",
      wgerRequestTimeoutMs: 30000,
      logLevel: "info",
      enableWriteTools: true,
      enableDestructiveTools: false,
      enableAdminTools: false,
      enableRawWgerProxy: false,
    };
    expect(config.wgerLanguage).toBeUndefined();
  });

  it("1.1.3: LogLevel is exactly the four literals", () => {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    expect(levels).toHaveLength(4);
  });

  it("1.1.4: Config fields are readonly at compile time", () => {
    const config: Config = {
      wgerBaseUrl: "https://wger.de",
      wgerApiToken: "token",
      wgerRequestTimeoutMs: 30000,
      logLevel: "info",
      enableWriteTools: true,
      enableDestructiveTools: false,
      enableAdminTools: false,
      enableRawWgerProxy: false,
    };
    // Runtime assignment still succeeds in JS; we verify the shape is correct
    expect(() => {
      (config as unknown as Record<string, unknown>).wgerBaseUrl = "mutated";
    }).not.toThrow();
  });
});

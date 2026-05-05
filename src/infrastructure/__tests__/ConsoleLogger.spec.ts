import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ConsoleLogger } from "../ConsoleLogger.js";

describe("ConsoleLogger", () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  it("3.1.1: debug filtered when level is error", () => {
    const logger = new ConsoleLogger("error");
    logger.debug("msg");
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("3.1.2: info filtered when level is error", () => {
    const logger = new ConsoleLogger("error");
    logger.info("msg");
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("3.1.3: warn filtered when level is error", () => {
    const logger = new ConsoleLogger("error");
    logger.warn("msg");
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("3.1.4: error passes when level is error", () => {
    const logger = new ConsoleLogger("error");
    logger.error("msg");
    expect(stderrSpy).toHaveBeenCalledTimes(1);
  });

  it("3.1.5: debug level allows all four methods", () => {
    const logger = new ConsoleLogger("debug");
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");
    expect(stderrSpy).toHaveBeenCalledTimes(4);
  });

  it("3.1.6: info filtered when level is warn", () => {
    const logger = new ConsoleLogger("warn");
    logger.info("msg");
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("3.1.7: warn passes when level is warn", () => {
    const logger = new ConsoleLogger("warn");
    logger.warn("msg");
    expect(stderrSpy).toHaveBeenCalledTimes(1);
  });

  it("3.1.8: info passes when level is info", () => {
    const logger = new ConsoleLogger("info");
    logger.info("msg");
    expect(stderrSpy).toHaveBeenCalledTimes(1);
  });

  it("3.2.1: info outputs to stderr", () => {
    const logger = new ConsoleLogger("info");
    logger.info("hello");
    expect(stderrSpy).toHaveBeenCalledWith("[INFO] hello");
  });

  it("3.2.2: error outputs [ERROR] prefix", () => {
    const logger = new ConsoleLogger("info");
    logger.error("fail");
    expect(stderrSpy).toHaveBeenCalledWith("[ERROR] fail");
  });

  it("3.2.3: debug with meta serializes meta", () => {
    const logger = new ConsoleLogger("debug");
    logger.debug("msg", { key: "value" });
    expect(stderrSpy).toHaveBeenCalledWith('[DEBUG] msg {"key":"value"}');
  });

  it("3.2.4: meta with various types serializes correctly", () => {
    const logger = new ConsoleLogger("debug");
    logger.info("msg", {
      count: 42,
      active: true,
      extra: null,
      missing: undefined,
    });
    const call = stderrSpy.mock.calls[0][0] as string;
    expect(call).toContain('"count":42');
    expect(call).toContain('"active":true');
    expect(call).toContain('"extra":null');
    expect(call).not.toContain('"missing"');
  });

  it("3.2.5: warn without meta has no trailing space or braces", () => {
    const logger = new ConsoleLogger("info");
    logger.warn("msg");
    expect(stderrSpy).toHaveBeenCalledWith("[WARN] msg");
  });
});

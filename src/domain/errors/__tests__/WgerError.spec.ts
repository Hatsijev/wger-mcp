import { describe, it, expect } from "vitest";
import { WgerError, WgerValidationError, WgerAuthError } from "../WgerError.js";

describe("WgerError", () => {
  it("1.5.1: constructed with message only", () => {
    const error = new WgerError("Something went wrong");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("WgerError");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBeUndefined();
  });

  it("1.5.2: constructed with statusCode option", () => {
    const error = new WgerError("Not found", { statusCode: 404 });
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("1.5.3: constructed with cause option", () => {
    const cause = new Error("Original error");
    const error = new WgerError("Wrapped", { cause });
    expect(error.cause).toBe(cause);
  });

  it("1.5.4: WgerValidationError extends WgerError", () => {
    const error = new WgerValidationError("Invalid input");
    expect(error).toBeInstanceOf(WgerError);
    expect(error.name).toBe("WgerValidationError");
    expect(error.message).toBe("Invalid input");
  });

  it("1.5.5: WgerAuthError always sets statusCode to 401", () => {
    const error = new WgerAuthError("Auth failed", { statusCode: 500 });
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Auth failed");
  });

  it("1.5.6: WgerAuthError extends WgerError", () => {
    const error = new WgerAuthError("Unauthorized");
    expect(error).toBeInstanceOf(WgerError);
    expect(error.name).toBe("WgerAuthError");
  });
});

import { z } from "zod";
import { Config } from "../../domain/models/Config.types.js";
import { Logger } from "../../application/ports/Logger.js";
import { WgerError, WgerAuthError } from "../../domain/errors/WgerError.js";
import { WgerStatusResponse } from "./types.js";


const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

export class WgerClient {
  private readonly _baseUrl: string;
  private readonly _token: string;
  private readonly _logger: Logger;
  private readonly _timeoutMs: number;

  constructor(config: Config, logger: Logger) {
    this._baseUrl = config.wgerBaseUrl.replace(/\/$/, "");
    this._token = config.wgerApiToken;
    this._logger = logger;
    this._timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    const url = this._buildUrl(path, params);
    this._logger.debug("Wger API GET request", { url });
    return this._request<T>("GET", url, undefined, responseSchema);
  }

  async post<T, B extends object = object>(
    path: string,
    body: B,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API POST request", { url });
    return this._request<T>("POST", url, body, responseSchema);
  }

  async put<T, B extends object = object>(
    path: string,
    body: B,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API PUT request", { url });
    return this._request<T>("PUT", url, body, responseSchema);
  }

  async patch<T, B extends object = object>(
    path: string,
    body: B,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API PATCH request", { url });
    return this._request<T>("PATCH", url, body, responseSchema);
  }

  async delete(path: string): Promise<void> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API DELETE request", { url });
    await this._requestWithoutBody("DELETE", url);
  }

  async getStatus(): Promise<WgerStatusResponse> {
    await this.get<{ readonly id: number }>("/api/v2/exerciseinfo/", { limit: 1 });
    return { status: "ok" };
  }

  private _buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(`${this._baseUrl}${path}`);
    if (params !== undefined) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async _requestWithoutBody(
    method: string,
    url: string,
  ): Promise<void> {
    const response = await this._executeFetch(method, url);
    if (!response.ok) {
      await this._handleErrorResponse(method, url, response);
    }
  }

  private async _request<T>(
    method: string,
    url: string,
    body?: object,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    const response = await this._executeFetch(method, url, body);
    if (!response.ok) {
      await this._handleErrorResponse(method, url, response);
    }

    return this._parseJson<T>(method, url, response, responseSchema);
  }

  private async _executeFetch(
    method: string,
    url: string,
    body?: object,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Token ${this._token}`,
      "Content-Type": "application/json",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this._timeoutMs);

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        this._logger.error("Wger API request timed out", { method, url, timeoutMs: this._timeoutMs });
        throw new WgerError(`Request timed out after ${this._timeoutMs}ms`, { statusCode: 408 });
      }
      const message = error instanceof Error ? error.message : "Network error";
      this._logger.error("Wger API request failed", {
        method,
        url,
        error: message,
      });
      throw new WgerError(`Network error: ${message}`, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  private async _handleErrorResponse(
    method: string,
    url: string,
    response: Response,
  ): Promise<never> {
    const statusCode = response.status;
    const bodyPreview = await this._safePreviewBody(response);
    this._logger.error("Wger API error response", { method, url, statusCode });
    this._logger.debug("Wger API error response body", { method, url, bodyPreview });
    if (statusCode === 401) {
      throw new WgerAuthError(
        `Authentication failed (${statusCode}). Ensure WGER_API_TOKEN is valid.`,
        { statusCode },
      );
    }
    throw new WgerError(`Wger API error (${statusCode})`, { statusCode });
  }

  private async _safePreviewBody(response: Response): Promise<string> {
    try {
      const text = await response.clone().text();
      return text.length > 200 ? `${text.slice(0, 200)}...` : text;
    } catch {
      return "<unreadable>";
    }
  }

  private async _parseJson<T>(
    method: string,
    url: string,
    response: Response,
    responseSchema?: z.ZodType<T>,
  ): Promise<T> {
    try {
      const raw: T = (await response.json()) as T;
      if (responseSchema !== undefined) {
        const result = responseSchema.safeParse(raw);
        if (!result.success) {
          const issues = result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ");
          this._logger.error("Wger API response validation failed", {
            method,
            url,
            issues,
          });
          throw new WgerError(`Response validation failed: ${issues}`);
        }
        return result.data;
      }
      return raw;
    } catch (error) {
      if (error instanceof WgerError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Invalid JSON";
      this._logger.error("Wger API JSON parse error", {
        method,
        url,
        error: message,
      });
      throw new WgerError(`Failed to parse response: ${message}`, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}

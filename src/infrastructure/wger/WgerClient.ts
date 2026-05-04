import { Config } from "../../domain/models/Config.types.js";
import { Logger } from "../../application/ports/Logger.js";
import { WgerError, WgerAuthError } from "../../domain/errors/WgerError.js";
import { WgerStatusResponse } from "./types.js";
import { JsonValue } from "../../domain/models/Json.types.js";

export class WgerClient {
  private readonly _baseUrl: string;
  private readonly _token: string;
  private readonly _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._baseUrl = config.wgerBaseUrl.replace(/\/$/, "");
    this._token = config.wgerApiToken;
    this._logger = logger;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const url = this._buildUrl(path, params);
    this._logger.debug("Wger API GET request", { url });
    return this._request<T>("GET", url);
  }

  async post<T>(path: string, body: JsonValue): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API POST request", { url });
    return this._request<T>("POST", url, body);
  }

  async put<T>(path: string, body: JsonValue): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API PUT request", { url });
    return this._request<T>("PUT", url, body);
  }

  async patch<T>(path: string, body: JsonValue): Promise<T> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API PATCH request", { url });
    return this._request<T>("PATCH", url, body);
  }

  async delete(path: string): Promise<void> {
    const url = `${this._baseUrl}${path}`;
    this._logger.debug("Wger API DELETE request", { url });
    await this._requestWithoutBody("DELETE", url);
  }

  async getStatus(): Promise<WgerStatusResponse> {
    await this.get<JsonValue>("/api/v2/exerciseinfo/", { limit: 1 });
    return { status: "ok", version: "2.5.0" };
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
    body?: JsonValue,
  ): Promise<T> {
    const response = await this._executeFetch(method, url, body);
    if (!response.ok) {
      await this._handleErrorResponse(method, url, response);
    }

    return this._parseJson<T>(method, url, response);
  }

  private async _executeFetch(
    method: string,
    url: string,
    body?: JsonValue,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Token ${this._token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    try {
      return await fetch(url, options);
    } catch (error) {
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
    const text = await response.text();
    this._logger.error("Wger API error response", {
      method,
      url,
      statusCode,
      body: text,
    });
    if (statusCode === 401) {
      throw new WgerAuthError(`Authentication failed: ${text}`, { statusCode });
    }
    throw new WgerError(`Wger API error (${statusCode}): ${text}`, {
      statusCode,
    });
  }

  private async _parseJson<T>(
    method: string,
    url: string,
    response: Response,
  ): Promise<T> {
    try {
      const data: T = (await response.json()) as T;
      return data;
    } catch (error) {
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

export interface Config {
  readonly wgerBaseUrl: string;
  readonly wgerApiToken: string;
  readonly wgerLanguage?: string | undefined;
  readonly wgerRequestTimeoutMs: number;
  readonly logLevel: LogLevel;
  readonly enableWriteTools: boolean;
  readonly enableDestructiveTools: boolean;
  readonly enableAdminTools: boolean;
  readonly enableRawWgerProxy: boolean;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

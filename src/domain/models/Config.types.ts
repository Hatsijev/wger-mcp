export interface Config {
  readonly wgerBaseUrl: string;
  readonly wgerApiToken: string;
  readonly wgerLanguage?: string | undefined;
  readonly logLevel: LogLevel;
  readonly enableDestructiveTools: boolean;
  readonly enableAdminTools: boolean;
  readonly enableRawWgerProxy: boolean;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

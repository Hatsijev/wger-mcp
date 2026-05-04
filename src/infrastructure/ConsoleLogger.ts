import { Logger, LogMeta } from "../application/ports/Logger.js";
import { LogLevel } from "../domain/models/Config.types.js";

const LEVEL_PRIORITY: Readonly<Record<LogLevel, number>> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class ConsoleLogger implements Logger {
  private readonly _minPriority: number;

  constructor(logLevel: LogLevel) {
    this._minPriority = LEVEL_PRIORITY[logLevel];
  }

  public debug(message: string, meta?: LogMeta): void {
    this._log("debug", message, meta);
  }

  public info(message: string, meta?: LogMeta): void {
    this._log("info", message, meta);
  }

  public warn(message: string, meta?: LogMeta): void {
    this._log("warn", message, meta);
  }

  public error(message: string, meta?: LogMeta): void {
    this._log("error", message, meta);
  }

  private _log(level: LogLevel, message: string, meta?: LogMeta): void {
    if (LEVEL_PRIORITY[level] < this._minPriority) {
      return;
    }

    const levelLabel: string = level.toUpperCase();
    const metaString: string =
      meta !== undefined ? ` ${JSON.stringify(meta)}` : "";
    const output: string = `[${levelLabel}] ${message}${metaString}`;

    if (level === "error") {
      console.error(output);
    } else {
      console.log(output);
    }
  }
}

export interface WgerErrorOptions {
  readonly cause?: Error | undefined;
  readonly statusCode?: number | undefined;
}

export class WgerError extends Error {
  public readonly statusCode: number | undefined;

  constructor(message: string, options?: WgerErrorOptions) {
    super(message, { cause: options?.cause });
    this.name = "WgerError";
    this.statusCode = options?.statusCode;
  }
}

export class WgerValidationError extends WgerError {
  constructor(message: string, options?: WgerErrorOptions) {
    super(message, options);
    this.name = "WgerValidationError";
  }
}

export class WgerAuthError extends WgerError {
  constructor(message: string, options?: WgerErrorOptions) {
    super(message, { ...options, statusCode: 401 });
    this.name = "WgerAuthError";
  }
}

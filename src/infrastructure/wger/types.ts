export interface WgerPaginatedResponse<T> {
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
  readonly results: ReadonlyArray<T>;
}

export interface WgerStatusResponse {
  readonly status: string;
  readonly version: string;
}

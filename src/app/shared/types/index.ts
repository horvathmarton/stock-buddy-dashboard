export type ErrorResponse = {
  error: Record<string, string[] | string>;
  status: number;
  detail: string;
};

export type ApiPaginationResponse<T = unknown> = {
  count?: number;
  results: T[];
};

export type Currency = 'USD' | 'EUR' | 'HUF';

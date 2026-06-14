const API_BASE_URL =
  import.meta.env.VITE_AI_API_BASE_URL ?? "https://backendnodejs-hackaton-production.up.railway.app";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body.error ?? "request_failed",
      body.message ?? `HTTP ${res.status}`,
      body.details,
    );
  }

  return body as T;
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

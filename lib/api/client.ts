export interface ApiRequestConfig extends RequestInit {
  json?: unknown;
}

export async function apiRequest<T>(
  path: string,
  { json, headers, ...init }: ApiRequestConfig = {}
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: json ? JSON.stringify(json) : init.body
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

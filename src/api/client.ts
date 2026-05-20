// src/api/client.ts

// Унифицированный ответ для JSON-моков.
export type ApiListResponse<T> = {
  data?: T[];
  skills?: T[];
};

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load "${path}": ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
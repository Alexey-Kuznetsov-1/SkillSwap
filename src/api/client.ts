// Унифицированный ответ для JSON-моков в формате { data: [] }.
export type ApiListResponse<T> = {
  data: T[];
};

export async function fetchJson<T>(path: string): Promise<T> {
  // Базовый helper для чтения локальных mock-файлов.
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load "${path}": ${response.status} ${response.statusText}`);
  }

  // Приведение типа оставляем на уровне API-слоя.
  return (await response.json()) as T;
}

/// <reference types="vite/client" />

// log para verificar se a url do .env foi reconhecida.
// deve retornar "VITE_API_URL: http://localhost:8000"
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL)


const BASE_URL = import.meta.env.VITE_API_URL ?? '';

function getToken(): string | null {
  return sessionStorage.getItem('bbts_token');
}

// Converte snake_case → camelCase recursivamente
function toCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const token = getToken();

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem('bbts_token');
      sessionStorage.removeItem('bbts_user');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.detail ?? error.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json().then((data) => toCamel(data) as T);
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...options }),
};
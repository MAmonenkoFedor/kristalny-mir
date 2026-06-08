import { apiUrl } from './defaults';

const KEY = 'km_admin_jwt';

export const tokenStore = {
  get: (): string | null => (typeof window === 'undefined' ? null : localStorage.getItem(KEY)),
  set: (t: string) => localStorage.setItem(KEY, t),
  clear: () => localStorage.removeItem(KEY),
};

function headers(withJson = true): Record<string, string> {
  const h: Record<string, string> = {};
  if (withJson) h['Content-Type'] = 'application/json';
  const t = tokenStore.get();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

async function parseError(r: Response): Promise<string> {
  const e = await r.json().catch(() => ({}));
  const m = (e as { message?: string | string[] }).message;
  if (Array.isArray(m)) return m.join(', ');
  return m || `Ошибка (${r.status})`;
}

export async function login(email: string, password: string) {
  const r = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error(await parseError(r));
  const data = (await r.json()) as { token: string; user: { email: string } };
  tokenStore.set(data.token);
  return data;
}

export async function checkAuth(): Promise<boolean> {
  if (!tokenStore.get()) return false;
  const r = await fetch(`${apiUrl}/auth/me`, { headers: headers(false) });
  if (!r.ok) {
    tokenStore.clear();
    return false;
  }
  return true;
}

export async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(`${apiUrl}${path}`, { headers: headers(false), cache: 'no-store' });
  if (r.status === 401) {
    tokenStore.clear();
    throw new Error('Сессия истекла, войдите заново');
  }
  if (!r.ok) throw new Error(await parseError(r));
  return r.json() as Promise<T>;
}

export async function apiSend<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const r = await fetch(`${apiUrl}${path}`, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401) {
    tokenStore.clear();
    throw new Error('Сессия истекла, войдите заново');
  }
  if (!r.ok) throw new Error(await parseError(r));
  return r.json() as Promise<T>;
}

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const t = tokenStore.get();
  const r = await fetch(`${apiUrl}/uploads`, {
    method: 'POST',
    headers: t ? { Authorization: `Bearer ${t}` } : {},
    body: fd,
  });
  if (!r.ok) throw new Error(await parseError(r));
  const d = (await r.json()) as { url: string };
  return d.url;
}

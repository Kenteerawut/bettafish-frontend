const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE in env");

  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as any),
  };

  // JSON body => ใส่ Content-Type
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // แนบ token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return data;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  /** @param {{ status:number, message:string, details?:any }} params */
  constructor({ status, message, details }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getAccessToken() {
  return localStorage.getItem('authToken');
}

export function setAccessToken(token) {
  if (!token) {
    localStorage.removeItem('authToken');
    return;
  }
  localStorage.setItem('authToken', token);
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * @param {string} path
 * @param {RequestInit & { body?: any, skipAuth?: boolean }} options
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(options.headers || {});

  const skipAuth = Boolean(options.skipAuth);
  if (!skipAuth && !headers.has('Authorization')) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: 'include',
  });

  const json = await readJsonSafe(res);

  if (!res.ok) {
    if (res.status === 401) {
      setAccessToken(null);
      localStorage.removeItem('me');
      try {
        window.dispatchEvent(new Event('auth:logout'));
      } catch {
        // ignore
      }
    }
    const message = json?.error?.message || json?.message || res.statusText || 'Request failed';
    throw new ApiError({ status: res.status, message, details: json?.error?.details || json?.details });
  }

  return json;
}

export async function authLogin(email, password) {
  const json = await apiFetch('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: { email, password },
  });
  return json?.data;
}

export async function authRefresh() {
  const json = await apiFetch('/auth/refresh', {
    method: 'POST',
    skipAuth: true,
  });
  return json?.data;
}

export async function authLogout() {
  const json = await apiFetch('/auth/logout', {
    method: 'POST',
    skipAuth: true,
  });
  return json?.data;
}

export async function fetchMe() {
  const json = await apiFetch('/me', { method: 'GET' });
  return json?.data;
}

export async function authRegister({ email, password, name }) {
  const json = await apiFetch('/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: { email, password, name },
  });
  return json?.data;
}

export async function authVerifyEmail(token) {
  const json = await apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    skipAuth: true,
  });
  return json?.data;
}

export async function authResendVerification(email) {
  const json = await apiFetch('/auth/resend-verification', {
    method: 'POST',
    skipAuth: true,
    body: { email },
  });
  return json?.data;
}

export async function authGoogle(idToken) {
  const json = await apiFetch('/auth/google', {
    method: 'POST',
    skipAuth: true,
    body: { idToken },
  });
  return json?.data;
}

export async function scholarshipGetRegistration() {
  const json = await apiFetch('/scholarships/registration', { method: 'GET' });
  return json?.data;
}

export async function scholarshipGetMyApplication() {
  const json = await apiFetch('/scholarships/my-application', { method: 'GET' });
  return json?.data;
}

export async function scholarshipSubmitApplication(payload) {
  const json = await apiFetch('/scholarships/applications', {
    method: 'POST',
    body: payload,
  });
  return json?.data;
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const json = await apiFetch('/files', {
    method: 'POST',
    body: form,
  });
  return json?.data;
}

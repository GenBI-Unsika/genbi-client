const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

let inFlightCount = 0;
const inFlightListeners = new Set();

function notifyInFlight() {
  for (const listener of inFlightListeners) {
    try {
      listener(inFlightCount);
    } catch {
      // ignore listener errors
    }
  }
}

export function getApiInFlightCount() {
  return inFlightCount;
}

export function subscribeApiInFlight(listener) {
  if (typeof listener !== 'function') return () => { };
  inFlightListeners.add(listener);
  try {
    listener(inFlightCount);
  } catch {
    // ignore
  }
  return () => {
    inFlightListeners.delete(listener);
  };
}

function beginRequest() {
  inFlightCount += 1;
  notifyInFlight();
}

function endRequest() {
  inFlightCount = Math.max(0, inFlightCount - 1);
  notifyInFlight();
}

function normalizeErrorMessage(message, status) {
  if (!message) return 'Terjadi kesalahan. Silakan coba lagi.';
  const raw = String(message);
  const lower = raw.toLowerCase();

  const isInternalError =
    lower.includes("can't reach database server") ||
    lower.includes('p1001') ||
    lower.includes('localhost:3306') ||
    lower.includes('127.0.0.1:3306') ||
    lower.includes('econnrefused') ||
    lower.includes('prisma') ||
    lower.includes('mysql') ||
    lower.includes('mariadb') ||
    lower.includes('internal server error') ||
    lower.includes('syntax error') ||
    lower.includes('undefined') ||
    lower.includes('null pointer') ||
    lower.includes('stack trace') ||
    lower.includes('at line') ||
    lower.includes('fetch failed') ||
    lower.includes('network error');

  if (isInternalError) {
    if (isDev) {  }
    return 'Terjadi gangguan pada sistem. Tim kami sedang menangani masalah ini.';
  }

  if (status === 500) {
    if (isDev) {  }
    return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
  }

  if (status === 502 || status === 503 || status === 504) {
    return 'Layanan sedang tidak tersedia. Silakan coba lagi beberapa saat.';
  }

  if (status === 404) {
    return 'Data yang Anda cari tidak ditemukan.';
  }

  if (status === 403) {
    return 'Anda tidak memiliki izin untuk mengakses halaman ini.';
  }

  if (status === 401) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.';
  }

  if (status === 400) {
    if (lower.includes('validation') || lower.includes('wajib') || lower.includes('harus') || lower.includes('tidak valid')) {
      return raw;
    }
    return 'Data yang dikirim tidak valid. Periksa kembali form Anda.';
  }

  const looksUserFriendly = !lower.includes('error') && !lower.includes('exception') && !lower.includes('failed') && raw.length < 200;

  if (looksUserFriendly) {
    return raw;
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
}

export class ApiError extends Error {
  
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

async function readBodySafe(res) {
  try {
    const json = await readJsonSafe(res.clone());
    if (json) return json;
  } catch {
    // ignore
  }

  try {
    const text = await res.clone().text();
    if (!text) return null;
    return { _rawText: text };
  } catch {
    return null;
  }
}

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

  beginRequest();

  let res;
  let json;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include',
    });

    json = await readBodySafe(res);
  } finally {
    endRequest();
  }

  if (!res.ok) {
    if (res.status === 401) {
      const rawMessage = json?.error?.message || json?.message || res.statusText || 'Unauthorized';
      const lower = String(rawMessage).toLowerCase();
      const reason = lower.includes('expired') ? 'token_expired' : 'unauthorized';
      const logoutMessage = lower.includes('expired') ? 'Sesi kamu sudah berakhir. Silakan login lagi.' : 'Sesi kamu sudah berakhir. Silakan login lagi.';

      setAccessToken(null);
      localStorage.removeItem('me');
      try {
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason, message: logoutMessage } }));
      } catch {
        try {
          window.dispatchEvent(new Event('auth:logout'));
        } catch {
          // ignore
        }
      }
    }
    const message = json?.error?.message || json?.message || json?._rawText || res.statusText || 'Request failed';
    const normalizedMessage = normalizeErrorMessage(message, res.status);

    if (isDev && json?._rawText && res.status >= 500) {
    }

    if (isDev && res.status >= 500) {
    }
    throw new ApiError({ status: res.status, message: normalizedMessage, details: json?.error?.details || json?.details });
  }

  return json;
}

export async function apiPost(path, body, options = {}) {
  return apiFetch(path, { ...options, method: 'POST', body });
}

export async function apiPatch(path, body, options = {}) {
  return apiFetch(path, { ...options, method: 'PATCH', body });
}

export async function apiPut(path, body, options = {}) {
  return apiFetch(path, { ...options, method: 'PUT', body });
}

export async function apiDelete(path, options = {}) {
  return apiFetch(path, { ...options, method: 'DELETE' });
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

export function apiUrl(path) {
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function uploadFileStaging(file) {
  const form = new FormData();
  form.append('file', file);
  const json = await apiFetch('/files/staging', {
    method: 'POST',
    body: form,
  });
  return json?.data;
}

export async function finalizeUpload(tempId, folder) {
  const json = await apiFetch('/files/finalize', {
    method: 'POST',
    body: { tempId, folder },
  });
  return json?.data;
}

export async function finalizeBulkUpload(files) {
  const json = await apiFetch('/files/finalize-bulk', {
    method: 'POST',
    body: { files },
  });
  return json?.data;
}

export async function deleteStagingFile(tempId) {
  const json = await apiFetch(`/files/temp/${tempId}`, {
    method: 'DELETE',
  });
  return json?.data;
}

export function getTempPreviewUrl(tempId) {
  return apiUrl(`/files/temp/${tempId}`);
}

export function getPublicFileUrl(fileId) {
  if (!fileId) return '';
  return apiUrl(`/files/${fileId}/public`);
}

export function isPublicFileUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /\/api\/v1\/files\/\d+\/public/.test(url);
}

export function normalizeFileUrl(url) {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/api/v1/files/') && url.includes('/public')) {
    return apiUrl(url.replace('/api/v1', ''));
  }

  if (url.startsWith('/api/v1/')) {
    return apiUrl(url.replace('/api/v1', ''));
  }

  if (url.includes('/files/temp/')) {
    return apiUrl(url.startsWith('/') ? url : `/${url}`);
  }

  return url;
}

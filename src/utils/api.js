const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Environment check - only show technical errors in development
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

// === Global loading tracker (used for TopLoadingBar) ===
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

/**
 * Subscribe to API loading state changes.
 * @param {(count:number)=>void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribeApiInFlight(listener) {
  if (typeof listener !== 'function') return () => {};
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

/**
 * Normalize error messages for user display
 * Technical errors are hidden from users in production
 */
function normalizeErrorMessage(message, status) {
  if (!message) return 'Terjadi kesalahan. Silakan coba lagi.';
  const raw = String(message);
  const lower = raw.toLowerCase();

  // === INTERNAL/TECHNICAL ERRORS - Never show to users ===
  const isInternalError =
    // Database errors
    lower.includes("can't reach database server") ||
    lower.includes('p1001') ||
    lower.includes('localhost:3306') ||
    lower.includes('127.0.0.1:3306') ||
    lower.includes('econnrefused') ||
    lower.includes('prisma') ||
    lower.includes('mysql') ||
    lower.includes('mariadb') ||
    // Server errors
    lower.includes('internal server error') ||
    lower.includes('syntax error') ||
    lower.includes('undefined') ||
    lower.includes('null pointer') ||
    lower.includes('stack trace') ||
    lower.includes('at line') ||
    // Network errors
    lower.includes('fetch failed') ||
    lower.includes('network error');

  if (isInternalError) {
    if (isDev) console.error('[API Error - Hidden from UI]:', raw);
    return 'Terjadi gangguan pada sistem. Tim kami sedang menangani masalah ini.';
  }

  if (status === 500) {
    if (isDev) console.error('[500 Error]:', raw);
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
    // Bad request might have user-relevant validation messages
    // But filter out technical ones
    if (lower.includes('validation') || lower.includes('wajib') || lower.includes('harus') || lower.includes('tidak valid')) {
      return raw;
    }
    return 'Data yang dikirim tidak valid. Periksa kembali form Anda.';
  }

  const looksUserFriendly = !lower.includes('error') && !lower.includes('exception') && !lower.includes('failed') && raw.length < 200;

  if (looksUserFriendly) {
    return raw;
  }

  // Default fallback
  return 'Terjadi kesalahan. Silakan coba lagi.';
}

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
    // If it's JSON, parse it.
    return await res.json();
  } catch {
    return null;
  }
}

async function readBodySafe(res) {
  // Note: response bodies can only be read once, so always use clone().
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

    // Extra diagnostics in dev when server returns non-JSON error bodies
    if (isDev && json?._rawText && res.status >= 500) {
      // eslint-disable-next-line no-console
      console.error('[API Error - Non-JSON Body]:', {
        url,
        status: res.status,
        contentType: res.headers.get('content-type'),
        body: json._rawText.slice(0, 2000),
      });
    }

    // Extra diagnostics in dev when server returns empty body or JSON error payload
    if (isDev && res.status >= 500) {
      // eslint-disable-next-line no-console
      console.error('[API Error - Debug]:', {
        url,
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get('content-type'),
        hasBody: Boolean(json),
        serverMessage: json?.error?.message || json?.message,
        serverCode: json?.error?.code || json?.code,
        serverStack: json?.error?.stack,
      });
    }
    throw new ApiError({ status: res.status, message: normalizedMessage, details: json?.error?.details || json?.details });
  }

  return json;
}

// FUNGSI HELPER CRUD

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

// FUNGSI AUTH

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

/**
 * Dapatkan URL API untuk path tertentu
 */
export function apiUrl(path) {
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Upload file ke staging/temporary storage untuk preview
 * File akan expired setelah 30 menit jika tidak di-finalize
 * @param {File} file - File object dari input
 * @returns {Promise<Object>} - { tempId, name, mimeType, size, previewUrl, expiresAt, isStaged }
 */
export async function uploadFileStaging(file) {
  const form = new FormData();
  form.append('file', file);
  const json = await apiFetch('/files/staging', {
    method: 'POST',
    body: form,
  });
  return json?.data;
}

/**
 * Finalisasi file staged - upload ke Google Drive
 * @param {string} tempId - ID file temp dari upload staging
 * @param {string} [folder] - Nama folder opsional
 * @returns {Promise<Object>} - Object file final dengan URL
 */
export async function finalizeUpload(tempId, folder) {
  const json = await apiFetch('/files/finalize', {
    method: 'POST',
    body: { tempId, folder },
  });
  return json?.data;
}

/**
 * Finalisasi banyak file staged sekaligus
 * @param {Array<{tempId: string, folder?: string}>} files
 * @returns {Promise<Object>} - { uploaded: [], errors: [], totalSuccess, totalErrors }
 */
export async function finalizeBulkUpload(files) {
  const json = await apiFetch('/files/finalize-bulk', {
    method: 'POST',
    body: { files },
  });
  return json?.data;
}

/**
 * Hapus file staged
 * @param {string} tempId
 */
export async function deleteStagingFile(tempId) {
  const json = await apiFetch(`/files/temp/${tempId}`, {
    method: 'DELETE',
  });
  return json?.data;
}

/**
 * Dapatkan URL preview file temp
 * @param {string} tempId
 * @returns {string}
 */
export function getTempPreviewUrl(tempId) {
  return apiUrl(`/files/temp/${tempId}`);
}

/**
 * Get the public proxy URL for a permanent file
 * This URL does not expire and works for public viewing
 * @param {number|string} fileId - The FileObject ID
 * @returns {string} The public proxy URL
 */
export function getPublicFileUrl(fileId) {
  if (!fileId) return '';
  return apiUrl(`/files/${fileId}/public`);
}

/**
 * Check if a URL is a public file proxy URL
 * @param {string} url - The URL to check
 * @returns {boolean}
 */
export function isPublicFileUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /\/api\/v1\/files\/\d+\/public/.test(url);
}

/**
 * Convert various file URL formats to the best displayable URL
 * Handles relative URLs from server and converts them to absolute URLs
 * Prioritizes public proxy URLs over direct Drive URLs
 * @param {string} url - The original URL
 * @returns {string} The best URL for display
 */
export function normalizeFileUrl(url) {
  if (!url) return '';

  // If already an absolute URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative public proxy URL from the server, convert to absolute
  // Pattern: /api/v1/files/{id}/public
  if (url.startsWith('/api/v1/files/') && url.includes('/public')) {
    return apiUrl(url.replace('/api/v1', ''));
  }

  // If it's another API path (like /api/v1/files/temp/xxx), convert to absolute
  if (url.startsWith('/api/v1/')) {
    return apiUrl(url.replace('/api/v1', ''));
  }

  // If it's a temp preview URL without prefix, build full URL
  if (url.includes('/files/temp/')) {
    return apiUrl(url.startsWith('/') ? url : `/${url}`);
  }

  // Return other URLs as-is (legacy support, external URLs, etc.)
  return url;
}

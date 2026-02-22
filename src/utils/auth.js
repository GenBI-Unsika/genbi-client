import { authGoogle, authLogin, authLogout, authRefresh, authRegister, authResendVerification, authVerifyEmail, fetchMe, getAccessToken, setAccessToken } from './api.js';

let refreshInFlight = null;
let lastRefreshFailureAt = 0;
const REFRESH_RETRY_COOLDOWN_MS = 30_000;

const HAS_SESSION_KEY = 'hasAuthSession';

function getHasSessionFlag() {
  try {
    return localStorage.getItem(HAS_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function setHasSessionFlag(next) {
  try {
    if (next) localStorage.setItem(HAS_SESSION_KEY, '1');
    else localStorage.removeItem(HAS_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function isAuthed() {
  return Boolean(getAccessToken());
}

export function getMe() {
  try {
    return JSON.parse(localStorage.getItem('me') || '{}') || {};
  } catch {
    return {};
  }
}

export function setMe(next) {
  localStorage.setItem('me', JSON.stringify(next || {}));
}

export async function login(email, password) {
  const data = await authLogin(email, password);
  setAccessToken(data?.accessToken);
  setMe(data?.user);
  setHasSessionFlag(true);
  return true;
}

export async function loginWithGoogle(idToken) {
  const data = await authGoogle(idToken);
  setAccessToken(data?.accessToken);
  setMe(data?.user);
  setHasSessionFlag(true);
  return true;
}

export async function register({ email, password, name }) {
  return authRegister({ email, password, name });
}

export async function verifyEmail(token) {
  return authVerifyEmail(token);
}

export async function resendVerification(email) {
  return authResendVerification(email);
}

export async function logout() {
  try {
    await authLogout();
  } finally {
    setAccessToken(null);
    localStorage.removeItem('me');
    setHasSessionFlag(false);
  }
}

export async function ensureAuthed() {
  if (getAccessToken()) return true;

  if (!getHasSessionFlag()) return false;

  if (Date.now() - lastRefreshFailureAt < REFRESH_RETRY_COOLDOWN_MS) return false;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const data = await authRefresh();
      setAccessToken(data?.accessToken);
      setMe(data?.user);
      setHasSessionFlag(Boolean(data?.accessToken));
      return Boolean(data?.accessToken);
    } catch {
      lastRefreshFailureAt = Date.now();
      setAccessToken(null);
      localStorage.removeItem('me');
      setHasSessionFlag(false);
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function syncMe() {
  const me = await fetchMe();
  setMe(me);
  return me;
}

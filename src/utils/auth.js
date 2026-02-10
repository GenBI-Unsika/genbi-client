import { authGoogle, authLogin, authLogout, authRefresh, authRegister, authResendVerification, authVerifyEmail, fetchMe, getAccessToken, setAccessToken } from './api.js';

let refreshInFlight = null;
let lastRefreshFailureAt = 0;
const REFRESH_RETRY_COOLDOWN_MS = 30_000;

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
  return true;
}

export async function loginWithGoogle(idToken) {
  const data = await authGoogle(idToken);
  setAccessToken(data?.accessToken);
  setMe(data?.user);
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
  }
}

export async function ensureAuthed() {
  if (getAccessToken()) return true;

  // Avoid spamming refresh when the user is clearly logged out.
  // Still allows session restore when a refresh cookie exists.
  if (Date.now() - lastRefreshFailureAt < REFRESH_RETRY_COOLDOWN_MS) return false;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const data = await authRefresh();
      setAccessToken(data?.accessToken);
      setMe(data?.user);
      return Boolean(data?.accessToken);
    } catch {
      lastRefreshFailureAt = Date.now();
      setAccessToken(null);
      localStorage.removeItem('me');
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

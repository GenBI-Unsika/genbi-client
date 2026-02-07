import { apiFetch } from './api.js';

const VISITOR_ID_KEY = 'genbiVisitorId';

function randomId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `v_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing && existing.length >= 8) return existing;
  const next = randomId();
  localStorage.setItem(VISITOR_ID_KEY, next);
  return next;
}

/**
 * Track a page view to the backend analytics endpoint.
 * This is intentionally best-effort: failures should not affect UX.
 */
export async function trackPageView({ path, referrer } = {}) {
  const visitorId = getVisitorId();
  const payload = {
    path,
    referrer,
    visitorId,
  };

  const res = await apiFetch('/analytics/track', {
    method: 'POST',
    skipAuth: true,
    body: payload,
    // allow sending during page unload (browser-dependent)
    keepalive: true,
  });

  const returnedVisitorId = res?.data?.visitorId;
  if (returnedVisitorId && returnedVisitorId !== visitorId) {
    localStorage.setItem(VISITOR_ID_KEY, returnedVisitorId);
  }

  return res;
}

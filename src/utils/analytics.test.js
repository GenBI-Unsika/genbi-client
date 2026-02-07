import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api.js', () => {
  return {
    apiFetch: vi.fn(async () => ({ data: {} })),
  };
});

import { apiFetch } from './api.js';
import { getVisitorId, trackPageView } from './analytics.js';

describe('analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('getVisitorId persists and reuses visitor id', () => {
    const first = getVisitorId();
    const second = getVisitorId();

    expect(first).toBeTruthy();
    expect(first.length).toBeGreaterThanOrEqual(8);
    expect(second).toBe(first);
  });

  it('trackPageView posts to analytics endpoint (best effort)', async () => {
    await trackPageView({ path: '/x', referrer: 'https://example.test/' });

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith(
      '/analytics/track',
      expect.objectContaining({
        method: 'POST',
        skipAuth: true,
        keepalive: true,
        body: expect.objectContaining({
          path: '/x',
          referrer: 'https://example.test/',
          visitorId: expect.any(String),
        }),
      }),
    );
  });
});

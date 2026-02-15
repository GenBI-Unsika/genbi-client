/**
 * useFormDraft — localStorage auto-save for long forms
 *
 * Saves form data to localStorage on every change (debounced),
 * restores it on mount, and clears it on explicit discard or successful submit.
 *
 * Does NOT save File objects or blob URLs (they can't be serialized).
 * Only saves serializable text/select/checkbox fields + step position.
 *
 * Usage:
 *   const { restoreDraft, saveDraft, clearDraft, hasDraft } = useFormDraft('scholarship-register');
 *
 *   // On mount: restore
 *   useEffect(() => {
 *     const saved = restoreDraft();
 *     if (saved) setForm(prev => ({ ...prev, ...saved.form }));
 *   }, []);
 *
 *   // On change: save (debounced internally)
 *   useEffect(() => { saveDraft({ form, step }); }, [form, step]);
 *
 *   // On submit success: clear
 *   clearDraft();
 */

import { useCallback, useRef, useEffect } from 'react';

const DRAFT_PREFIX = 'genbi_draft_';
const DEBOUNCE_MS = 800; // save at most once every 800ms

/**
 * Fields that should NOT be persisted (security / non-serializable)
 */
const EXCLUDED_FIELDS = new Set(['password', 'confirmPassword', 'files', 'agree']);

/**
 * Sanitize form data for storage — strip non-serializable values
 */
function sanitizeForStorage(data) {
  if (!data || typeof data !== 'object') return data;

  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip excluded fields
    if (EXCLUDED_FIELDS.has(key)) continue;
    // Skip File objects, Blobs, functions
    if (value instanceof File || value instanceof Blob || typeof value === 'function') continue;
    // Skip null/undefined
    if (value === null || value === undefined) continue;

    // Recursively clean nested objects (1 level only)
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = sanitizeForStorage(value);
      if (Object.keys(nested).length > 0) cleaned[key] = nested;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Custom hook for localStorage form draft persistence
 * @param {string} formKey — unique key per form (e.g. 'scholarship-register')
 * @param {object} [options]
 * @param {number} [options.debounceMs=800] — debounce interval in ms
 * @param {number} [options.maxAgeMs=7*24*60*60*1000] — max draft age (default: 7 days)
 */
export function useFormDraft(formKey, options = {}) {
  const { debounceMs = DEBOUNCE_MS, maxAgeMs = 7 * 24 * 60 * 60 * 1000 } = options;
  const storageKey = `${DRAFT_PREFIX}${formKey}`;
  const timerRef = useRef(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /**
   * Restore draft from localStorage
   * @returns {object|null} — { form, step, savedAt } or null if no draft / expired
   */
  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      // Check expiry
      if (parsed.savedAt && Date.now() - parsed.savedAt > maxAgeMs) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return parsed;
    } catch {
      // Corrupted data — clear it
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
      return null;
    }
  }, [storageKey, maxAgeMs]);

  /**
   * Save draft to localStorage (debounced)
   * @param {object} data — { form: { ... }, step: number, ...extraMeta }
   */
  const saveDraft = useCallback(
    (data) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        try {
          const payload = {
            form: sanitizeForStorage(data.form || data),
            step: data.step ?? 0,
            savedAt: Date.now(),
          };

          // Also save staged file metadata (tempIds & names, NOT the file content)
          if (data.stagedFiles) {
            const stagedMeta = {};
            for (const [key, value] of Object.entries(data.stagedFiles)) {
              if (value?.tempId) {
                stagedMeta[key] = {
                  tempId: value.tempId,
                  name: value.name,
                  size: value.size,
                  mimeType: value.mimeType,
                };
              }
            }
            if (Object.keys(stagedMeta).length > 0) {
              payload.stagedFiles = stagedMeta;
            }
          }

          // Save videoUrl separately if present in files
          if (data.form?.files?.videoUrl) {
            payload.videoUrl = data.form.files.videoUrl;
          }

          localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch (e) {
          // localStorage full or blocked — fail silently
          // Failed to save draft
        }
      }, debounceMs);
    },
    [storageKey, debounceMs],
  );

  /**
   * Save draft immediately (no debounce) — use before navigation
   * @param {object} data
   */
  const saveDraftNow = useCallback(
    (data) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      try {
        const payload = {
          form: sanitizeForStorage(data.form || data),
          step: data.step ?? 0,
          savedAt: Date.now(),
        };
        if (data.stagedFiles) {
          const stagedMeta = {};
          for (const [key, value] of Object.entries(data.stagedFiles)) {
            if (value?.tempId) {
              stagedMeta[key] = { tempId: value.tempId, name: value.name, size: value.size, mimeType: value.mimeType };
            }
          }
          if (Object.keys(stagedMeta).length > 0) payload.stagedFiles = stagedMeta;
        }
        if (data.form?.files?.videoUrl) payload.videoUrl = data.form.files.videoUrl;
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  /**
   * Clear saved draft (call on successful submit)
   */
  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  /**
   * Check if a draft exists without restoring it
   */
  const hasDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed?.savedAt && Date.now() - parsed.savedAt > maxAgeMs) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [storageKey, maxAgeMs]);

  /**
   * Get human-readable time since draft was saved
   * @returns {string|null}
   */
  const getDraftAge = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.savedAt) return null;

      const diffMs = Date.now() - parsed.savedAt;
      const minutes = Math.floor(diffMs / 60000);
      if (minutes < 1) return 'Baru saja';
      if (minutes < 60) return `${minutes} menit lalu`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} jam lalu`;
      const days = Math.floor(hours / 24);
      return `${days} hari lalu`;
    } catch {
      return null;
    }
  }, [storageKey]);

  return {
    restoreDraft,
    saveDraft,
    saveDraftNow,
    clearDraft,
    hasDraft,
    getDraftAge,
  };
}

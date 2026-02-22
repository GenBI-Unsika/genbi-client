

import { useCallback, useRef, useEffect } from 'react';

const DRAFT_PREFIX = 'genbi_draft_';
const DEBOUNCE_MS = 800;

const EXCLUDED_FIELDS = new Set(['password', 'confirmPassword', 'files', 'agree']);

function sanitizeForStorage(data) {
  if (!data || typeof data !== 'object') return data;

  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (EXCLUDED_FIELDS.has(key)) continue;
    if (value instanceof File || value instanceof Blob || typeof value === 'function') continue;
    if (value === null || value === undefined) continue;

    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = sanitizeForStorage(value);
      if (Object.keys(nested).length > 0) cleaned[key] = nested;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export function useFormDraft(formKey, options = {}) {
  const { debounceMs = DEBOUNCE_MS, maxAgeMs = 7 * 24 * 60 * 60 * 1000 } = options;
  const storageKey = `${DRAFT_PREFIX}${formKey}`;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      if (parsed.savedAt && Date.now() - parsed.savedAt > maxAgeMs) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return parsed;
    } catch {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        
      }
      return null;
    }
  }, [storageKey, maxAgeMs]);

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

          if (data.form?.files?.videoUrl) {
            payload.videoUrl = data.form.files.videoUrl;
          }

          localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch (e) {
        }
      }, debounceMs);
    },
    [storageKey, debounceMs],
  );

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
        
      }
    },
    [storageKey],
  );

  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      
    }
  }, [storageKey]);

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

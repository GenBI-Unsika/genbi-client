import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { scholarshipGetMyApplication, scholarshipGetRegistration } from './api.js';

function isPositiveInt(n) {
  return Number.isInteger(n) && n > 0;
}

function isReasonableYear(n) {
  return Number.isInteger(n) && n >= 2000 && n <= 2100;
}

export function resolveScholarshipSelectionPath({ app, registration }) {
  if (!app) {
    if (registration?.open) return '/scholarship/register';
    return '/scholarship';
  }

  const administrasiStatus = app?.administrasiStatus;
  if (administrasiStatus !== 'LOLOS_ADMINISTRASI') {
    return '/scholarship/selection/admin';
  }

  const interviewStatus = app?.interviewStatus;
  const interviewDone = interviewStatus === 'LOLOS_WAWANCARA' || interviewStatus === 'GAGAL_WAWANCARA';
  if (!interviewDone) {
    return '/scholarship/selection/interview';
  }

  return '/scholarship/selection/announcement';
}

export function useScholarshipSelectionGate() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [reg, myApp] = await Promise.all([scholarshipGetRegistration().catch(() => null), scholarshipGetMyApplication().catch(() => null)]);
        if (!alive) return;

        const normalizedReg = reg
          ? {
              open: Boolean(reg.open),
              year: isReasonableYear(Number(reg.year)) ? Number(reg.year) : null,
              batch: isPositiveInt(Number(reg.batch)) ? Number(reg.batch) : null,
            }
          : { open: false, batch: null };

        setRegistration(normalizedReg);
        setApp(myApp || null);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Gagal memuat status seleksi.');
        setRegistration({ open: false, batch: null });
        setApp(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const resolvedPath = useMemo(() => {
    if (loading) return null;
    return resolveScholarshipSelectionPath({ app, registration });
  }, [loading, app, registration]);

  useEffect(() => {
    if (loading) return;
    if (!resolvedPath) return;

    const here = location.pathname;
    if (here !== resolvedPath) {
      if (here === '/scholarship/selection/admin' && resolvedPath === '/scholarship/selection/interview' && app?.id) {
        const celebrationKey = `scholarship_admin_celebrated_${app.id}`;
        const hasCelebrated = localStorage.getItem(celebrationKey);

        if (!hasCelebrated) {
          return;
        }
      }

      navigate(resolvedPath, { replace: true });
    }
  }, [loading, resolvedPath, location.pathname, navigate, app?.id]);

  const stageIndex = useMemo(() => {
    if (!resolvedPath) return 0;
    if (resolvedPath.endsWith('/admin')) return 0;
    if (resolvedPath.endsWith('/interview')) return 1;
    if (resolvedPath.endsWith('/announcement')) return 2;
    return 0;
  }, [resolvedPath]);

  return {
    loading,
    error,
    app,
    registration,
    resolvedPath,
    stageIndex,
  };
}

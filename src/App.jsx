import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import VisionMissionSection from './components/VisionMissionSection';
import ScholarshipSection from './components/ScholarshipSection';
import ActivitiesSection from './components/ActivitiesSection';
import ArticlesSection from './components/ArticlesSection';
import FAQSection from './components/FAQSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import TopLoadingBar from './components/TopLoadingBar';

// Halaman detail/baru (wrapper yang sudah kamu punya)
import EventDetailRoute from './router/EventDetailRoute';
import RegistrationRoute from './router/RegistrationRoute';

import ProfileLayout from './components/ProfileLayout';

import { ensureAuthed, isAuthed, logout as authLogout, syncMe } from './utils/auth.js';
import { trackPageView } from './utils/analytics.js';

import './App.css';

// Route-level code splitting (lazy load halaman).
const SignInPage = React.lazy(() => import('./pages/SignInPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const TwoFactorAuthPage = React.lazy(() => import('./pages/TwoFactorAuthPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'));

const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ActivityHistoryPage = React.lazy(() => import('./pages/ActivityHistoryPage'));
const TransactionPage = React.lazy(() => import('./pages/TransactionsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const HistoryPage = React.lazy(() => import('./pages/HistoryPage'));
const TeamsPage = React.lazy(() => import('./pages/TeamsPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const ProkerPage = React.lazy(() => import('./pages/ProkerPage'));
const ScholarshipPageDetailed = React.lazy(() => import('./pages/ScholarshipPage'));
const ArticlesPage = React.lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));

const ScholarshipRegister = React.lazy(() => import('./pages/scholarship/ScholarshipRegister'));
const ScholarshipSelectionAdmin = React.lazy(() => import('./pages/scholarship/ScholarshipSelectionAdmin'));
const ScholarshipSelectionInterview = React.lazy(() => import('./pages/scholarship/ScholarshipSelectionInterview'));
const ScholarshipSelectionAnnouncement = React.lazy(() => import('./pages/scholarship/ScholarshipSelectionAnnouncement'));
const ScholarshipAnnouncementPublic = React.lazy(() => import('./pages/scholarship/ScholarshipAnnouncementPublic'));
const ScholarshipRegisterSuccess = React.lazy(() => import('./pages/scholarship/ScholarshipRegisterSuccess'));

const pathForKey = (key) => {
  switch (key) {
    case 'home':
      return '/';
    case 'history':
      return '/history';
    case 'teams':
      return '/teams';
    case 'events':
      return '/events';
    case 'proker':
      return '/proker';
    case 'scholarship':
      return '/scholarship';
    case 'articles':
      return '/articles';

    // otentikasi
    case 'signin':
      return '/signin';
    case 'signup':
      return '/signup';
    case 'forgot-password':
      return '/forgot-password';
    case 'two-factor':
      return '/two-factor';
    case 'verify-email':
      return '/verify-email';

    // profil (sidebar)
    case 'profile':
      return '/profile';
    case 'activity-history':
      return '/profile/activity-history';
    case 'transactions':
      return '/profile/transactions';
    case 'settings':
      return '/profile/settings';

    default:
      return '/';
  }
};

const HomePage = ({ isLoggedIn }) => (
  <PageTransition>
    <HeroSection />
    <AboutSection />
    <VisionMissionSection />
    <ScholarshipSection />
    <ActivitiesSection />
    <ArticlesSection />
    {isLoggedIn && <FAQSection />}
    <TestimonialsSection />
    {!isLoggedIn && <CTASection />}
    <Footer ctaOverlap={!isLoggedIn} />
  </PageTransition>
);

const ProfileRoutesLayout = ({ onNavigate, onLogout }) => {
  const location = useLocation();
  // tentukan currentKey buat highlight di sidebar ProfileLayout
  const currentKey = location.pathname.startsWith('/profile/activity-history')
    ? 'activity-history'
    : location.pathname.startsWith('/profile/transactions')
      ? 'transactions'
      : location.pathname.startsWith('/profile/settings')
        ? 'settings'
        : 'profile';

  return (
    <ProfileLayout currentPage={currentKey} onNavigate={onNavigate} onLogout={onLogout}>
      <Outlet />
    </ProfileLayout>
  );
};

const RequireAuth = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        if (isAuthed()) {
          setOk(true);
          return;
        }
        const nextOk = await ensureAuthed();
        setOk(nextOk);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return null;
  if (!ok) return <Navigate to="/signin" replace />;
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthed());

  const navigate = useNavigate();
  const location = useLocation();
  const forcedLogoutToastShown = useRef(false);
  const lastTrackedRef = useRef({ key: '', at: 0 });
  const profileNotificationShown = useRef(false); // Track per session

  const profileReminderKeyForUser = useCallback((user) => {
    const raw = user?.id ?? user?.userId ?? user?.uuid ?? user?.email ?? 'anon';
    return String(raw);
  }, []);

  const checkProfileCompletion = useCallback(
    (user, { reason = 'session' } = {}) => {
      if (!user || !user.profile) return;

      // Jangan tampilkan jika sudah pernah ditampilkan dalam session ini
      if (profileNotificationShown.current) return;

      try {
        const { npm, facultyId, studyProgramId, birthDate, gender } = user.profile;

        // Cek jika field profil penting belum diisi
        if (!npm || !facultyId || !studyProgramId || !birthDate || !gender) {
          const now = Date.now();

          // Throttle per user supaya tidak muncul tiap refresh.
          // - reason: 'login'   => boleh tampil (kecuali di-dismiss)
          // - reason: 'session' => maksimal 1x per 7 hari
          const userKey = profileReminderKeyForUser(user);
          const dismissedUntilKey = `profile-reminder-dismissed-until:${userKey}`;
          const lastShownAtKey = `profile-reminder-last-shown-at:${userKey}`;
          const legacyDismissedUntil = localStorage.getItem('profile-reminder-dismissed-until');

          let dismissedUntil = null;
          let lastShownAt = null;
          try {
            dismissedUntil = localStorage.getItem(dismissedUntilKey) ?? legacyDismissedUntil;
            lastShownAt = localStorage.getItem(lastShownAtKey);
          } catch {
            // ignore storage errors
          }

          const dismissedUntilMs = Number.parseInt(dismissedUntil || '', 10);
          if (Number.isFinite(dismissedUntilMs) && now < dismissedUntilMs) return;

          const throttleMs = reason === 'login' ? 0 : 7 * 24 * 60 * 60 * 1000;
          const lastShownAtMs = Number.parseInt(lastShownAt || '', 10);
          if (throttleMs > 0 && Number.isFinite(lastShownAtMs) && now - lastShownAtMs < throttleMs) return;

          // Tandai bahwa notifikasi sudah ditampilkan di session ini
          profileNotificationShown.current = true;

          try {
            localStorage.setItem(lastShownAtKey, String(now));
          } catch {
            // ignore
          }

          toast.custom(
            (t) => (
              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-xl w-full bg-white shadow-lg rounded-xl pointer-events-auto border border-gray-200 mx-3 sm:mx-0`}>
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex gap-2.5 items-start flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-gray-900 mb-0.5">Lengkapi Profil Anda</p>
                        <p className="text-body-sm text-gray-600 leading-relaxed">Mohon lengkapi data diri Anda untuk mengakses semua fitur GenBI.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          navigate('/profile');
                        }}
                        className="flex-1 sm:flex-none px-3.5 py-2 text-btn font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
                      >
                        Lengkapi Sekarang
                      </button>
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          // Simpan timestamp: jangan tampilkan lagi selama 7 hari
                          const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
                          try {
                            localStorage.setItem(dismissedUntilKey, sevenDaysLater.toString());
                            localStorage.setItem(lastShownAtKey, String(Date.now()));
                            // legacy key (backward compatibility)
                            localStorage.setItem('profile-reminder-dismissed-until', sevenDaysLater.toString());
                          } catch {
                            // ignore
                          }
                        }}
                        className="flex-1 sm:flex-none px-3.5 py-2 text-btn font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Nanti
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
            {
              id: 'profile-incomplete-warning',
              duration: 8000,
              position: 'top-center',
            },
          );
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    },
    [navigate, profileReminderKeyForUser],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      if (isAuthed()) {
        if (alive) setIsLoggedIn(true);
        // Sinkronisasi data profil (termasuk avatar) saat aplikasi dimuat
        try {
          const user = await syncMe();
          if (alive && user) checkProfileCompletion(user, { reason: 'session' });
        } catch (e) {
          // Gagal diam-diam - user masih bisa menggunakan aplikasi dengan data cache
          console.debug('Failed to sync user profile:', e?.message);
        }
        return;
      }
      try {
        const ok = await ensureAuthed();
        if (alive) setIsLoggedIn(ok);
        if (ok && alive) {
          const user = await syncMe();
          if (user) checkProfileCompletion(user, { reason: 'session' });
        }
      } catch (e) {
        // Gagal diam-diam - user hanya belum login
        console.debug('Auth refresh failed:', e?.message);
        if (alive) setIsLoggedIn(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [checkProfileCompletion]);

  // Lacak tampilan halaman (analitik website publik)
  useEffect(() => {
    const key = `${location.pathname}`;
    const now = Date.now();
    // React 18 StrictMode menjalankan effect dua kali di dev; dedupe dalam jendela waktu singkat.
    if (lastTrackedRef.current.key === key && now - lastTrackedRef.current.at < 1500) return;
    lastTrackedRef.current = { key, at: now };

    trackPageView({ path: location.pathname, referrer: document.referrer }).catch(() => {
      // abaikan error tracking
    });
  }, [location.pathname]);

  useEffect(() => {
    const onForcedLogout = (e) => {
      setIsLoggedIn(false);

      const message = e?.detail?.message || 'Sesi kamu sudah berakhir. Silakan login lagi.';
      if (!forcedLogoutToastShown.current) {
        forcedLogoutToastShown.current = true;
        toast.error(message, { id: 'auth-expired', duration: 6000 });
        window.setTimeout(() => {
          forcedLogoutToastShown.current = false;
        }, 2000);
      }

      const path = window.location.pathname;
      const isAuthRelated = path.startsWith('/signin') || path.startsWith('/signup') || path.startsWith('/forgot-password') || path.startsWith('/two-factor') || path.startsWith('/verify-email');
      const shouldRedirect = path.startsWith('/profile') || path.startsWith('/scholarship/register') || path.startsWith('/scholarship/selection') || path.endsWith('/register');

      if (!isAuthRelated && shouldRedirect) navigate('/signin', { replace: true });
    };
    window.addEventListener('auth:logout', onForcedLogout);
    return () => {
      window.removeEventListener('auth:logout', onForcedLogout);
    };
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    // Cek kelengkapan profil setelah login
    setTimeout(async () => {
      const user = await syncMe();
      checkProfileCompletion(user, { reason: 'login' });
    }, 1000);
  };

  const handleLogout = async () => {
    await authLogout();
    setIsLoggedIn(false);
    navigate('/');
  };

  const onNavigate = (key) => {
    const path = pathForKey(key);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopLoadingBar />
      {!location.pathname.startsWith('/scholarship/announcement') && (
        <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} onLogout={handleLogout} />
      )}

      <React.Suspense fallback={<div className="py-16 text-center text-gray-500">Memuat...</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Beranda */}
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />

            {/* Halaman publik */}
            <Route
              path="/history"
              element={
                <PageTransition>
                  <HistoryPage />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/teams"
              element={
                <PageTransition>
                  <TeamsPage />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/events"
              element={
                <PageTransition>
                  <EventsPage />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/proker"
              element={
                <PageTransition>
                  <ProkerPage />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship"
              element={
                <PageTransition>
                  <ScholarshipPageDetailed />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship/register"
              element={
                <PageTransition>
                  <ScholarshipRegister />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship/success"
              element={
                <PageTransition>
                  <ScholarshipRegisterSuccess />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship/selection/admin"
              element={
                <PageTransition>
                  <ScholarshipSelectionAdmin />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship/selection/interview"
              element={
                <PageTransition>
                  <ScholarshipSelectionInterview />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/scholarship/selection/announcement"
              element={
                <PageTransition>
                  <ScholarshipSelectionAnnouncement />
                  <Footer />
                </PageTransition>
              }
            />

            <Route
              path="/scholarship/announcement"
              element={
                <PageTransition>
                  <ScholarshipAnnouncementPublic />
                </PageTransition>
              }
            />
            <Route
              path="/articles"
              element={
                <PageTransition>
                  <ArticlesPage />
                  <Footer />
                </PageTransition>
              }
            />

            {/* Detail / konten */}
            <Route path="/events/:eventId" element={<EventDetailRoute />} />
            <Route path="/events/:eventId/register" element={<RegistrationRoute />} />
            <Route
              path="/articles/:slug"
              element={
                <PageTransition>
                  <ArticleDetailPage />
                  <Footer />
                </PageTransition>
              }
            />
            <Route
              path="/proker/:eventId"
              element={
                <PageTransition>
                  <EventDetailRoute />
                  <Footer />
                </PageTransition>
              }
            />

            {/* Otentikasi */}
            <Route
              path="/signin"
              element={
                <PageTransition>
                  <SignInPage onNavigate={onNavigate} onLogin={handleLoginSuccess} />
                </PageTransition>
              }
            />
            <Route
              path="/signup"
              element={
                <PageTransition>
                  <SignUpPage onNavigate={onNavigate} onLogin={handleLoginSuccess} />
                </PageTransition>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageTransition>
                  <ForgotPasswordPage onNavigate={onNavigate} />
                </PageTransition>
              }
            />
            <Route
              path="/two-factor"
              element={
                <PageTransition>
                  <TwoFactorAuthPage onNavigate={onNavigate} />
                </PageTransition>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PageTransition>
                  <VerifyEmailPage onNavigate={onNavigate} />
                </PageTransition>
              }
            />

            {/* Profil (terlindungi) */}
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfileRoutesLayout onNavigate={onNavigate} onLogout={handleLogout} />
                </RequireAuth>
              }
            >
              <Route index element={<ProfilePage />} />
              <Route path="activity-history" element={<ActivityHistoryPage />} />
              <Route path="transactions" element={<TransactionPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Legacy profile paths (compatibility redirects) */}
            <Route path="/riwayat-aktivitas" element={<Navigate to="/profile/activity-history" replace />} />
            <Route path="/transaksi" element={<Navigate to="/profile/transactions" replace />} />
            <Route path="/pengaturan" element={<Navigate to="/profile/settings" replace />} />

            {/* 404 (opsional) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </AnimatePresence>
      </React.Suspense>
    </div>
  );
}

export default App;

import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  <>
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
  </>
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

  useEffect(() => {
    let alive = true;
    (async () => {
      if (isAuthed()) {
        if (alive) setIsLoggedIn(true);
        // Sinkronisasi data profil (termasuk avatar) saat aplikasi dimuat
        try {
          await syncMe();
        } catch (e) {
          // Gagal diam-diam - user masih bisa menggunakan aplikasi dengan data cache
          console.debug('Failed to sync user profile:', e?.message);
        }
        return;
      }
      try {
        const ok = await ensureAuthed();
        if (alive) setIsLoggedIn(ok);
      } catch (e) {
        // Gagal diam-diam - user hanya belum login
        console.debug('Auth refresh failed:', e?.message);
        if (alive) setIsLoggedIn(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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
    setTimeout(() => {
      checkProfileCompletion();
    }, 1000);
  };

  const checkProfileCompletion = async () => {
    try {
      const user = await syncMe();
      if (user && user.profile) {
        const { npm, facultyId, studyProgramId, birthDate, gender } = user.profile;

        // Cek jika field profil penting belum diisi
        if (!npm || !facultyId || !studyProgramId || !birthDate || !gender) {
          toast(
            (t) => (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Lengkapi Profil Anda</p>
                  <p className="text-sm text-gray-600">Data profil Anda belum lengkap</p>
                </div>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate('/profile');
                  }}
                  className="flex-shrink-0 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600"
                >
                  Lengkapi Sekarang
                </button>
              </div>
            ),
            {
              duration: 6000,
              position: 'top-center',
              style: {
                minWidth: '400px',
              },
            },
          );
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
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
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} onLogout={handleLogout} />

      <React.Suspense fallback={<div className="py-16 text-center text-gray-500">Memuat...</div>}>
        <Routes>
          {/* Beranda */}
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />

          {/* Halaman publik */}
          <Route
            path="/history"
            element={
              <>
                <HistoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/teams"
            element={
              <>
                <TeamsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <EventsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/proker"
            element={
              <>
                <ProkerPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship"
            element={
              <>
                <ScholarshipPageDetailed />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship/register"
            element={
              <>
                <ScholarshipRegister />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship/success"
            element={
              <>
                <ScholarshipRegisterSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship/selection/admin"
            element={
              <>
                <ScholarshipSelectionAdmin />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship/selection/interview"
            element={
              <>
                <ScholarshipSelectionInterview />
                <Footer />
              </>
            }
          />
          <Route
            path="/scholarship/selection/announcement"
            element={
              <>
                <ScholarshipSelectionAnnouncement />
                <Footer />
              </>
            }
          />
          <Route
            path="/articles"
            element={
              <>
                <ArticlesPage />
                <Footer />
              </>
            }
          />

          {/* Detail / konten */}
          <Route path="/events/:eventId" element={<EventDetailRoute />} />
          <Route path="/events/:eventId/register" element={<RegistrationRoute />} />
          <Route
            path="/articles/:slug"
            element={
              <>
                <ArticleDetailPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/proker/:eventId"
            element={
              <>
                <EventDetailRoute />
                <Footer />
              </>
            }
          />

          {/* Otentikasi */}
          <Route path="/signin" element={<SignInPage onNavigate={onNavigate} onLogin={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignUpPage onNavigate={onNavigate} onLogin={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={onNavigate} />} />
          <Route path="/two-factor" element={<TwoFactorAuthPage onNavigate={onNavigate} />} />
          <Route path="/verify-email" element={<VerifyEmailPage onNavigate={onNavigate} />} />

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

          {/* 404 (opsional) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </React.Suspense>
    </div>
  );
}

export default App;

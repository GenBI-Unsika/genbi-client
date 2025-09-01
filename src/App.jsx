import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';

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

import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import TransactionPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';

import HistoryPage from './pages/HistoryPage';
import TeamsPage from './pages/TeamsPage';
import EventsPage from './pages/EventsPage';
import ProkerPage from './pages/ProkerPage';
import ScholarshipPageDetailed from './pages/ScholarshipPage';
import ArticlesPage from './pages/ArticlesPage';

// Halaman detail/baru (wrapper yang sudah kamu punya)
import EventDetailRoute from './router/EventDetailRoute';
import RegistrationRoute from './router/RegistrationRoute';
import ArticleContentRoute from './router/ArticleContentRoute';
import ArticleDetailRoute from './router/ArticleDetailRoute';

import ProfileLayout from './components/ProfileLayout';

import './App.css';

/* ---------- Helper: map key dari Header ke path router ---------- */
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

    // auth
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

    // profile (sidebar)
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

/* ---------- Home (landing) gabungan section seperti sebelumnya ---------- */
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
    <Footer />
  </>
);

/* ---------- Layout untuk halaman profile (nested routes) ---------- */
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

/* ---------- Proteksi route profile saat belum login ---------- */
const RequireAuth = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginToggle = () => {
    const next = !isLoggedIn;
    setIsLoggedIn(next);
    if (next) {
      navigate('/'); // setelah login balik ke home (bebas diubah)
    } else {
      navigate('/'); // logout → home
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const onNavigate = (key) => {
    const path = pathForKey(key);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} onNavigate={onNavigate} onLogout={handleLogout} />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />

        {/* Public pages */}
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
        <Route path="/articles/:slug" element={<ArticleContentRoute />} />
        <Route path="/proker/:slug" element={<ArticleDetailRoute />} />

        {/* Auth */}
        <Route path="/signin" element={<SignInPage onNavigate={onNavigate} onLogin={handleLoginToggle} />} />
        <Route path="/signup" element={<SignUpPage onNavigate={onNavigate} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={onNavigate} />} />
        <Route path="/two-factor" element={<TwoFactorAuthPage onNavigate={onNavigate} />} />
        <Route path="/verify-email" element={<VerifyEmailPage onNavigate={onNavigate} />} />

        {/* Profile (protected) */}
        <Route
          path="/profile"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
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
    </div>
  );
}

export default App;

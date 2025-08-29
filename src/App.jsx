import { useState } from "react";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import VisionMissionSection from "./components/VisionMissionSection";
import ScholarshipSection from "./components/ScholarshipSection";
import ActivitiesSection from "./components/ActivitiesSection";
import ArticlesSection from "./components/ArticlesSection";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TwoFactorAuthPage from "./pages/TwoFactorAuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import ActivityHistoryPage from "./pages/ActivityHistoryPage";
import TransactionPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";

// Halaman baru
import HistoryPage from "./pages/HistoryPage";
import TeamsPage from "./pages/TeamsPage";
import EventsPage from "./pages/EventsPage";
import ProkerPage from "./pages/ProkerPage";
import ScholarshipPageDetailed from "./pages/ScholarshipPage";
import ArticlesPage from "./pages/ArticlesPage";

import ProfileLayout from "./components/ProfileLayout";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) setCurrentPage("home");
  };

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      // Auth pages
      case "signin":
        return (
          <SignInPage onNavigate={navigateTo} onLogin={handleLoginToggle} />
        );
      case "signup":
        return <SignUpPage onNavigate={navigateTo} />;
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={navigateTo} />;
      case "two-factor":
        return <TwoFactorAuthPage onNavigate={navigateTo} />;
      case "verify-email":
        return <VerifyEmailPage onNavigate={navigateTo} />;

      // Profile pages
      case "profile":
      case "activity-history":
      case "transactions":
      case "settings":
        return (
          <ProfileLayout
            currentPage={currentPage}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          >
            {currentPage === "profile" && <ProfilePage />}
            {currentPage === "activity-history" && <ActivityHistoryPage />}
            {currentPage === "transactions" && <TransactionPage />}
            {currentPage === "settings" && <SettingsPage />}
          </ProfileLayout>
        );

      // ===== FIX: Samakan keys dengan Header =====
      // (Header mengirim "history", "teams", "events", "proker", "scholarship", "articles")
      case "history":
        return (
          <>
            <HistoryPage />
            <Footer />
          </>
        );
      case "teams":
        return (
          <>
            <TeamsPage />
            <Footer />
          </>
        );
      case "events":
        return (
          <>
            <EventsPage />
            <Footer />
          </>
        );
      case "proker":
        return (
          <>
            <ProkerPage />
            <Footer />
          </>
        );
      case "scholarship":
        return (
          <>
            <ScholarshipPageDetailed />
            <Footer />
          </>
        );
      case "articles":
        return (
          <>
            <ArticlesPage />
            <Footer />
          </>
        );

      // Default home page
      default:
        return (
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
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginToggle={handleLoginToggle}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

export default App;

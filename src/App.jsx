'use client';

import { useState } from 'react';
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
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} />
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
    </div>
  );
}

export default App;

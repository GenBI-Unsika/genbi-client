import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search as SearchIcon, Bell, LogIn, UserPlus } from 'lucide-react';

const Header = ({ isLoggedIn, onLoginToggle, onLogin, onRegister, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [mAboutOpen, setMAboutOpen] = useState(false);
  const [mActivityOpen, setMActivityOpen] = useState(false);

  // Back-compat handler fallback
  const handleLogin = onLogin || onLoginToggle || (() => {});
  const handleRegister = onRegister || onLoginToggle || (() => {});
  const handleLogout = onLogout || onLoginToggle || (() => {});

  const aboutRef = useRef(null);
  const actRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
      if (actRef.current && !actRef.current.contains(e.target)) setActivityOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <header className="bg-primary-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2" aria-label="GenBI Unsika - Beranda">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-primary-700 font-semibold text-lg">GenBI Unsika</span>
          </a>

          {/* Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            <a href="#" className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium cursor-pointer">
              Beranda
            </a>

            {/* Tentang Kami dropdown */}
            <div className="relative" ref={aboutRef} onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium inline-flex items-center gap-1 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={aboutOpen}
                onClick={() => setAboutOpen((v) => !v)}
              >
                Tentang Kami
                <ChevronDown className={`w-4 h-4 transition ${aboutOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {aboutOpen && (
                <div role="menu" className="absolute left-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 p-2">
                  <a href="#sejarah" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer" role="menuitem">
                    Sejarah
                  </a>
                  <a href="#teams" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer" role="menuitem">
                    Teams
                  </a>
                </div>
              )}
            </div>

            <a href="#beasiswa" className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium cursor-pointer">
              Beasiswa
            </a>

            {/* Aktivitas dropdown */}
            <div className="relative" ref={actRef} onMouseEnter={() => setActivityOpen(true)} onMouseLeave={() => setActivityOpen(false)}>
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium inline-flex items-center gap-1 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={activityOpen}
                onClick={() => setActivityOpen((v) => !v)}
              >
                Aktivitas
                <ChevronDown className={`w-4 h-4 transition ${activityOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {activityOpen && (
                <div role="menu" className="absolute left-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 p-2">
                  <a href="#event" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer" role="menuitem">
                    Event
                  </a>
                  <a href="#proker" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer" role="menuitem">
                    Proker
                  </a>
                </div>
              )}
            </div>

            <a href="#artikel" className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium cursor-pointer">
              Artikel
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search (desktop) */}
            <label className="relative hidden md:block">
              <span className="sr-only">Cari</span>
              <input type="text" placeholder="Cari…" className="pl-10 pr-3 py-2 w-56 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            </label>

            {/* Notifications */}
            {isLoggedIn && (
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer" aria-label="Notifikasi" title="Notifikasi">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary-500" />
              </button>
            )}

            {/* Auth actions */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full" aria-hidden="true" />
                <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-primary-600 cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={handleLogin} className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Masuk
                </button>
                <button onClick={handleRegister} className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  Daftar Akun
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer" aria-label="Buka menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col">
              <a href="#" className="px-1 py-2 rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer">
                Beranda
              </a>

              {/* Tentang Kami (accordion) */}
              <button
                className="flex items-center justify-between w-full px-1 py-2 text-left rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer"
                onClick={() => setMAboutOpen((v) => !v)}
                aria-expanded={mAboutOpen}
                aria-controls="m-about"
              >
                <span>Tentang Kami</span>
                <ChevronDown className={`w-4 h-4 transition ${mAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mAboutOpen && (
                <div id="m-about" className="pl-3 pb-2">
                  <a href="#sejarah" className="block py-2 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Sejarah
                  </a>
                  <a href="#teams" className="block py-2 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Teams
                  </a>
                </div>
              )}

              <a href="#beasiswa" className="px-1 py-2 rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer">
                Beasiswa
              </a>

              {/* Aktivitas (accordion) */}
              <button
                className="flex items-center justify-between w-full px-1 py-2 text-left rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer"
                onClick={() => setMActivityOpen((v) => !v)}
                aria-expanded={mActivityOpen}
                aria-controls="m-activity"
              >
                <span>Aktivitas</span>
                <ChevronDown className={`w-4 h-4 transition ${mActivityOpen ? 'rotate-180' : ''}`} />
              </button>
              {mActivityOpen && (
                <div id="m-activity" className="pl-3 pb-2">
                  <a href="#event" className="block py-2 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Event
                  </a>
                  <a href="#proker" className="block py-2 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Proker
                  </a>
                </div>
              )}

              <a href="#artikel" className="px-1 py-2 rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer">
                Artikel
              </a>

              {/* Auth actions (mobile) */}
              {!isLoggedIn ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={handleLogin} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Masuk
                  </button>
                  <button onClick={handleRegister} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    Daftar Akun
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button onClick={handleLogout} className="cursor-pointer inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

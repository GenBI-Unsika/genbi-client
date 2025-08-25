import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search as SearchIcon, Bell, LogIn, UserPlus } from 'lucide-react';

/* Hover intent */
function useHoverIntent(delay = 160) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const onEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const onLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), delay);
  };
  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);
  return { open, setOpen, onEnter, onLeave };
}

/* Dropdown (desktop) */
function Dropdown({ label, items = [] }) {
  const { open, setOpen, onEnter, onLeave } = useHoverIntent(160);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [setOpen]);

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className="px-3.5 py-2.5 rounded-lg text-primary-500 hover:text-primary-600 hover:bg-primary-500 font-regular inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 mt-3 w-60 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 p-2.5">
          {items.map((it) => (
            <a key={it.href} href={it.href} role="menuitem" className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const Header = ({ isLoggedIn, onLoginToggle, onLogin, onRegister, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mAboutOpen, setMAboutOpen] = useState(false);
  const [mActivityOpen, setMActivityOpen] = useState(false);

  const handleLogin = onLogin || onLoginToggle || (() => {});
  const handleRegister = onRegister || onLoginToggle || (() => {});
  const handleLogout = onLogout || onLoginToggle || (() => {});

  return (
    <header className="sticky top-0 z-50 bg-primary-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 md:py-3 gap-3">
          {/* Logo (lebih besar) */}
          <a href="#" className="flex items-center gap-3 sm:gap-4 whitespace-nowrap" aria-label="GenBI Unsika - Beranda">
            <img src="./genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-6 md:h-8 lg:h-12 w-auto flex-shrink-0" loading="eager" decoding="async" />
          </a>

          {/* Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6 flex-nowrap">
            <a href="#" className="px-3.5 py-2.5 rounded-lg text-primary-500 hover:text-primary-600 hover:bg-primary-500 font-regular cursor-pointer whitespace-nowrap">
              Beranda
            </a>

            <Dropdown
              label="Tentang Kami"
              items={[
                { label: 'Sejarah', href: '#sejarah' },
                { label: 'Teams', href: '#teams' },
              ]}
            />

            <a href="#beasiswa" className="px-3.5 py-2.5 rounded-lg text-primary-500 hover:text-primary-900 hover:bg-primary-200 font-regular cursor-pointer whitespace-nowrap">
              Beasiswa
            </a>

            <Dropdown
              label="Aktivitas"
              items={[
                { label: 'Event', href: '#event' },
                { label: 'Proker', href: '#proker' },
              ]}
            />

            <a href="#artikel" className="px-3.5 py-2.5 rounded-lg text-primary-500 hover:text-primary-600 hover:bg-primary-500 font-regular cursor-pointer whitespace-nowrap">
              Artikel
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search (desktop) */}
            <label className="relative hidden md:block">
              <span className="sr-only">Cari</span>
              <input
                type="text"
                placeholder="Telusuri..."
                className="pl-9 pr-3 h-9 w-60 lg:w-64 py-2
               bg-white border border-primary-200 rounded-lg
               text-sm placeholder:text-xs placeholder:text-primary-500
               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" aria-hidden="true" />
            </label>

            {/* Notifications */}
            {isLoggedIn && (
              <button className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer" aria-label="Notifikasi" title="Notifikasi">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary-500" />
              </button>
            )}

            {/* Auth actions */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3 whitespace-nowrap">
                <div className="w-9 h-9 bg-primary-500 rounded-full" aria-hidden="true" />
                <button onClick={handleLogout} className="px-3.5 py-2.5 text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2.5 whitespace-nowrap">
                <button onClick={handleLogin} className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-regular rounded-lg border border-primary-200 text-primary-500 hover:bg-primary-400">
                  {/* <LogIn className="w-4 h-4" aria-hidden="true" /> */}
                  Masuk
                </button>
                <button onClick={handleRegister} className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-regular rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  {/* <UserPlus className="w-4 h-4" aria-hidden="true" /> */}
                  Daftar Akun
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-2.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer" aria-label="Buka menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col">
              <a href="#" className="px-2 py-3 rounded-lg text-primary-500 hover:text-primary-600 cursor-pointer">
                Beranda
              </a>

              {/* Tentang Kami (accordion) */}
              <button
                className="flex items-center justify-between w-full px-2 py-3 text-left rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer"
                onClick={() => setMAboutOpen((v) => !v)}
                aria-expanded={mAboutOpen}
                aria-controls="m-about"
              >
                <span>Tentang Kami</span>
                <ChevronDown className={`w-4 h-4 transition ${mAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mAboutOpen && (
                <div id="m-about" className="pl-3 pb-2">
                  <a href="#sejarah" className="block py-2.5 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Sejarah
                  </a>
                  <a href="#teams" className="block py-2.5 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Teams
                  </a>
                </div>
              )}

              <a href="#beasiswa" className="px-2 py-3 rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer">
                Beasiswa
              </a>

              {/* Aktivitas (accordion) */}
              <button
                className="flex items-center justify-between w-full px-2 py-3 text-left rounded-lg text-gray-700 hover:text-primary-600 cursor-pointer"
                onClick={() => setMActivityOpen((v) => !v)}
                aria-expanded={mActivityOpen}
                aria-controls="m-activity"
              >
                <span>Aktivitas</span>
                <ChevronDown className={`w-4 h-4 transition ${mActivityOpen ? 'rotate-180' : ''}`} />
              </button>
              {mActivityOpen && (
                <div id="m-activity" className="pl-3 pb-2">
                  <a href="#event" className="block py-2.5 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Event
                  </a>
                  <a href="#proker" className="block py-2.5 text-gray-600 hover:text-primary-600 cursor-pointer">
                    Proker
                  </a>
                </div>
              )}

              <a href="#artikel" className="px-2 py-3 rounded-lg text-primary-500 hover:text-primary-600 cursor-pointer">
                Artikel
              </a>

              {/* Auth actions (mobile) */}
              {!isLoggedIn ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={handleLogin} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-regular rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Masuk
                  </button>
                  <button onClick={handleRegister} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-regular rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                    Daftar Akun
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button onClick={handleLogout} className="cursor-pointer inline-flex items-center justify-center w-full px-3.5 py-2.5 text-sm font-regular rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
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

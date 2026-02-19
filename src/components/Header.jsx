import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search as SearchIcon, UserPlus } from 'lucide-react';
import { CourseDownIcon, CourseUpIcon, LoginIcon, LogoutIcon, DropdownIcon, UserPlusIcon, ProfileIcon, HistoryIcon, SettingsIcon } from './icons/CustomIcons.jsx';
import { getMe } from '../utils/auth.js';
import { apiFetch } from '../utils/api.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;

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

function Dropdown({ label, items = [], onSelect }) {
  const { open, setOpen, onEnter, onLeave } = useHoverIntent(160);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [setOpen]);

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className="px-3.5 py-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100/60 font-medium inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors duration-150"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <DropdownIcon className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 p-1.5"
        >
          {items.map((it) => (
            <button
              key={it.page}
              role="menuitem"
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-900 cursor-pointer whitespace-nowrap transition-colors duration-150"
              onClick={() => {
                onSelect(it.page);
                setOpen(false);
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const Header = ({ isLoggedIn, onLoginToggle, onNavigate, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mAboutOpen, setMAboutOpen] = useState(false);
  const [mActivityOpen, setMActivityOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { confirm } = useConfirm();
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        const json = await apiFetch(`/public/search?q=${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          skipAuth: true,
        });
        setSearchResults(json?.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleNavigation = (page) => {
    if (onNavigate) onNavigate(page);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Keluar?',
      message: 'Anda akan keluar dari sesi ini.',
      confirmLabel: 'Keluar',
      type: 'danger',
    });
    if (confirmed && onLogout) {
      onLogout();
      setIsProfileDropdownOpen(false);
    }
  };

  const handleSignInClick = () => {
    if (onLoginToggle) return onLoginToggle();
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
  };

  const handleSearchResultClick = (result) => {
    if (result.href) navigate(result.href);
    setShowResults(false);
    setSearchQuery('');
  };

  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Pengguna';
  const userEmail = user?.email || '';
  const userAvatar =
    user?.profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=128`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-50 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main bar ── */}
        <div className="flex items-center justify-between gap-4 py-3 md:py-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">

          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigation('home')}
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer lg:justify-self-start"
            aria-label="GenBI Unsika - Beranda"
          >
            <img
              src="/genbi-unsika.webp"
              alt="Logo GenBI Unsika"
              className="h-8 md:h-9 w-auto flex-shrink-0"
              loading="eager"
              decoding="async"
            />
            <span className="text-sm sm:text-base lg:text-lg font-bold text-primary-700 leading-tight">
              GenBI Unsika
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 text-sm">
            <button
              onClick={() => handleNavigation('home')}
              className="px-3.5 py-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100/60 font-medium cursor-pointer whitespace-nowrap transition-colors duration-150"
            >
              Beranda
            </button>

            <Dropdown
              label="Tentang Kami"
              items={[
                { label: 'Sejarah', page: 'history' },
                { label: 'Tim', page: 'teams' },
              ]}
              onSelect={handleNavigation}
            />

            <button
              onClick={() => handleNavigation('scholarship')}
              className="px-3.5 py-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100/60 font-medium cursor-pointer whitespace-nowrap transition-colors duration-150"
            >
              Beasiswa
            </button>

            <Dropdown
              label="Aktivitas"
              items={[
                { label: 'Event', page: 'events' },
                { label: 'Proker', page: 'proker' },
              ]}
              onSelect={handleNavigation}
            />

            <button
              onClick={() => handleNavigation('articles')}
              className="px-3.5 py-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100/60 font-medium cursor-pointer whitespace-nowrap transition-colors duration-150"
            >
              Artikel
            </button>
          </nav>

          {/* Right section: search + auth */}
          <div className="flex items-center gap-2 lg:justify-self-end">

            {/* Desktop search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <label>
                <span className="sr-only">Cari</span>
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder="Telusuri..."
                  className="pl-9 pr-3 h-9 w-56 lg:w-64 bg-white border border-primary-200 rounded-lg text-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </label>

              {showResults && (
                <div className="absolute right-0 mt-2 w-[min(400px,calc(100vw-2rem))] bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Hasil Pencarian
                    </span>
                    {isSearching && (
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="max-h-[min(70vh,480px)] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                        >
                          <div className="w-11 h-11 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary-200">
                                <SearchIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors uppercase">
                              {result.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{result.type}</p>
                          </div>
                        </button>
                      ))
                    ) : !isSearching ? (
                      <div className="px-4 py-8 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <SearchIcon className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Tidak ada hasil ditemukan untuk &ldquo;{searchQuery}&rdquo;
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-primary-200 transition"
                  aria-label="Profile menu"
                >
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
                    </div>

                    <div className="py-1">
                      {[
                        { label: 'Profil Saya', path: '/profile', icon: <ProfileIcon className="w-4 h-4" /> },
                        { label: 'Riwayat Aktivitas', path: '/profile/activity-history', icon: <HistoryIcon className="w-4 h-4" /> },
                        { label: 'Pengaturan', path: '/profile/settings', icon: <SettingsIcon className="w-4 h-4" /> },
                      ].map(({ label, path, icon }) => (
                        <button
                          key={path}
                          onClick={() => handleProfileNavigation(path)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left group"
                        >
                          <span className="text-gray-400 group-hover:text-primary-500 transition-colors">{icon}</span>
                          <span className="group-hover:text-primary-700 transition-colors">{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 whitespace-nowrap">
                <button
                  onClick={handleSignInClick}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors duration-150"
                >
                  <LoginIcon className="w-4 h-4" />
                  Masuk
                </button>
                <button
                  onClick={handleRegister}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Daftar Akun
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100/60 cursor-pointer transition-colors duration-150"
              aria-label="Buka menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              {/* Divider antara header dan menu */}
              <div className="h-px bg-gray-200 mx-0" />

              <div className="py-3 max-h-[calc(100dvh-56px)] overflow-y-auto">

                {/* Mobile search */}
                <div className="px-3 pb-3">
                  <div className="relative">
                    <SearchIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Telusuri..."
                      className="w-full pl-9 pr-3 h-10 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Nav items */}
                <div className="flex flex-col px-2">

                  <button
                    onClick={() => { handleNavigation('home'); setIsMenuOpen(false); }}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-primary-800 hover:bg-primary-100/60 font-medium cursor-pointer text-left transition-colors duration-150"
                  >
                    Beranda
                  </button>

                  {/* Tentang Kami */}
                  <button
                    onClick={() => setMAboutOpen((v) => !v)}
                    aria-expanded={mAboutOpen}
                    aria-controls="m-about"
                    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-primary-800 hover:bg-primary-100/60 font-medium cursor-pointer transition-colors duration-150"
                  >
                    <span>Tentang Kami</span>
                    <DropdownIcon className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${mAboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mAboutOpen && (
                      <MotionDiv
                        id="m-about"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-3 border-l-2 border-primary-300 mb-1 flex flex-col gap-0.5">
                          {[
                            { label: 'Sejarah', page: 'history' },
                            { label: 'Tim', page: 'teams' },
                          ].map(({ label, page }) => (
                            <button
                              key={page}
                              onClick={() => { handleNavigation(page); setIsMenuOpen(false); }}
                              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-primary-600 hover:text-primary-900 hover:bg-primary-50 cursor-pointer transition-colors duration-150"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => { handleNavigation('scholarship'); setIsMenuOpen(false); }}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-primary-800 hover:bg-primary-100/60 font-medium cursor-pointer text-left transition-colors duration-150"
                  >
                    Beasiswa
                  </button>

                  {/* Aktivitas */}
                  <button
                    onClick={() => setMActivityOpen((v) => !v)}
                    aria-expanded={mActivityOpen}
                    aria-controls="m-activity"
                    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-primary-800 hover:bg-primary-100/60 font-medium cursor-pointer transition-colors duration-150"
                  >
                    <span>Aktivitas</span>
                    <DropdownIcon className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${mActivityOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mActivityOpen && (
                      <MotionDiv
                        id="m-activity"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-3 border-l-2 border-primary-300 mb-1 flex flex-col gap-0.5">
                          {[
                            { label: 'Event', page: 'events' },
                            { label: 'Proker', page: 'proker' },
                          ].map(({ label, page }) => (
                            <button
                              key={page}
                              onClick={() => { handleNavigation(page); setIsMenuOpen(false); }}
                              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-primary-600 hover:text-primary-900 hover:bg-primary-50 cursor-pointer transition-colors duration-150"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => { handleNavigation('articles'); setIsMenuOpen(false); }}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-primary-800 hover:bg-primary-100/60 font-medium cursor-pointer text-left transition-colors duration-150"
                  >
                    Artikel
                  </button>
                </div>

                {/* Auth buttons */}
                <div className="px-3 mt-3 pt-3 border-t border-gray-200">
                  {!isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { handleSignInClick(); setIsMenuOpen(false); }}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-primary-300 text-primary-700 hover:bg-primary-50 transition-colors duration-150"
                      >
                        <LoginIcon className="w-4 h-4" />
                        Masuk
                      </button>
                      <button
                        onClick={() => { handleRegister(); setIsMenuOpen(false); }}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150"
                      >
                        <UserPlusIcon className="w-4 h-4" />
                        Daftar Akun
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="cursor-pointer inline-flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-semibold rounded-lg bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 transition-colors duration-150"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      Keluar
                    </button>
                  )}
                </div>

                {/* Bottom padding */}
                <div className="h-3" />
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search as SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMe } from '../utils/auth.js';
import { apiFetch } from '../utils/api.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import { useNavigate } from 'react-router-dom';

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
        className="px-3.5 py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 font-medium inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
            <button
              key={it.page}
              role="menuitem"
              className="block w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-900 cursor-pointer whitespace-nowrap"
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
      } catch (err) {
        console.error('Search failed:', err);
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
    if (onLoginToggle) onLoginToggle();
  };

  const handleRegister = () => {
    navigate('/scholarship/register');
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
  };

  const handleSearchResultClick = (result) => {
    if (result.href) {
      navigate(result.href);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Pengguna';
  const userEmail = user?.email || '';
  const userAvatar = user?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=128`;

  return (
    <header className="sticky top-0 z-50 bg-primary-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 md:py-3 gap-3">
          <button onClick={() => handleNavigation('home')} className="flex items-center gap-3 sm:gap-4 whitespace-nowrap cursor-pointer" aria-label="GenBI Unsika - Beranda">
            <img src="./genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-6 md:h-8 lg:h-12 w-auto flex-shrink-0" loading="eager" decoding="async" />
          </button>

          <nav className="hidden md:flex items-center gap-3 lg:gap-6 flex-nowrap">
            <button onClick={() => handleNavigation('home')} className="px-3.5 py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 font-medium cursor-pointer whitespace-nowrap">
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

            <button onClick={() => handleNavigation('scholarship')} className="px-3.5 py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 font-medium cursor-pointer whitespace-nowrap">
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

            <button onClick={() => handleNavigation('articles')} className="px-3.5 py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 font-medium cursor-pointer whitespace-nowrap">
              Artikel
            </button>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden md:block" ref={searchRef}>
              <label>
                <span className="sr-only">Cari</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder="Telusuri..."
                  className="pl-9 pr-3 h-9 w-60 lg:w-64 py-2 bg-white border border-primary-200 rounded-lg text-sm placeholder:text-[var(--primary-500)] placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" aria-hidden="true" />
              </label>

              {showResults && (
                <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hasil Pencarian</span>
                    {isSearching && <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                  <div className="max-h-[min(70vh,480px)] overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                            {result.image ? (
                              <img src={result.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary-200">
                                <SearchIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors uppercase">{result.title}</h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{result.type}</p>
                          </div>
                        </button>
                      ))
                    ) : !isSearching ? (
                      <div className="px-4 py-8 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <SearchIcon className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500">Tidak ada hasil ditemukan untuk "{searchQuery}"</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors" aria-label="Profile menu">
                  <img src={userAvatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                    </div>

                    <div className="py-1">
                      <button onClick={() => handleProfileNavigation('/profile')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Profil Saya
                      </button>
                      <button onClick={() => handleProfileNavigation('/riwayat-aktivitas')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Riwayat Aktivitas
                      </button>
                      <button onClick={() => handleProfileNavigation('/transaksi')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Transaksi
                      </button>
                      <button onClick={() => handleProfileNavigation('/pengaturan')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Pengaturan
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2.5 whitespace-nowrap">
                <button onClick={handleSignInClick} className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50">
                  Masuk
                </button>
                <button onClick={handleRegister} className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  Daftar Akun
                </button>
              </div>
            )}

            <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-2.5 rounded-md text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer" aria-label="Buka menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  handleNavigation('home');
                  setIsMenuOpen(false);
                }}
                className="px-2 py-3 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer text-left"
              >
                Beranda
              </button>

              <button
                className="flex items-center justify-between w-full px-2 py-3 text-left rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                onClick={() => setMAboutOpen((v) => !v)}
                aria-expanded={mAboutOpen}
                aria-controls="m-about"
              >
                <span>Tentang Kami</span>
                <ChevronDown className={`w-4 h-4 transition ${mAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mAboutOpen && (
                <div id="m-about" className="pl-3 pb-2">
                  <button
                    onClick={() => {
                      handleNavigation('history');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                  >
                    Sejarah
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('teams');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                  >
                    Tim
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  handleNavigation('scholarship');
                  setIsMenuOpen(false);
                }}
                className="px-2 py-3 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer text-left"
              >
                Beasiswa
              </button>

              <button
                className="flex items-center justify-between w-full px-2 py-3 text-left rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                onClick={() => setMActivityOpen((v) => !v)}
                aria-expanded={mActivityOpen}
                aria-controls="m-activity"
              >
                <span>Aktivitas</span>
                <ChevronDown className={`w-4 h-4 transition ${mActivityOpen ? 'rotate-180' : ''}`} />
              </button>
              {mActivityOpen && (
                <div id="m-activity" className="pl-3 pb-2">
                  <button
                    onClick={() => {
                      handleNavigation('events');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                  >
                    Event
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('proker');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2.5 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer"
                  >
                    Proker
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  handleNavigation('articles');
                  setIsMenuOpen(false);
                }}
                className="px-2 py-3 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-50 cursor-pointer text-left"
              >
                Artikel
              </button>

              {!isLoggedIn ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleSignInClick();
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      handleRegister();
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Daftar Akun
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer inline-flex items-center justify-center w-full px-3.5 py-2.5 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50"
                  >
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

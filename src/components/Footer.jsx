// src/components/Footer.jsx
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { apiFetch } from '../services/api.js';

const defaultFooterContent = {
  description: 'Komunitas penerima beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang',
  address: 'Universitas Singaperbangsa Karawang Jl. HS. Ronggo Waluyo, Telukjambe Timur, Karawang, Jawa Barat, Indonesia - 41361',
  socialLinks: [
    { type: 'email', label: 'genbiunsika.org@gmail.com', url: 'mailto:genbiunsika.org@gmail.com', icon: 'tabler:mail' },
    { type: 'instagram', label: 'genbi.unsika', url: 'https://instagram.com/genbi.unsika', icon: 'tabler:brand-instagram' },
    { type: 'tiktok', label: 'genbi.unsika', url: 'https://tiktok.com/@genbi.unsika', icon: 'tabler:brand-tiktok' },
    { type: 'youtube', label: 'GenBI Unsika', url: 'https://youtube.com/@GenBIUnsika', icon: 'tabler:brand-youtube' },
  ],
};

const Footer = ({ ctaOverlap = false }) => {
  const year = new Date().getFullYear();
  const [content, setContent] = useState(defaultFooterContent);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_footer', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) {
          setContent({ ...defaultFooterContent, ...value });
        }
      } catch {
        // Use defaults on error
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <footer className="w-full bg-blue-50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${ctaOverlap ? 'pt-32 sm:pt-40 md:pt-48' : 'pt-8 sm:pt-12 md:pt-16'} pb-6 sm:pb-8`}>
        {/* MOBILE LAYOUT (< 768px) */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-body-lg font-semibold text-primary-600 mb-3">
              <img src="/genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-7 w-auto flex-shrink-0" loading="lazy" decoding="async" />
              <span>GenBI Unsika</span>
            </div>
            <p className="text-body-sm text-gray-700 leading-relaxed mb-2">{content.description}</p>
            <p className="text-caption text-gray-600 leading-relaxed">{content.address}</p>
          </div>

          {/* Mobile nav: side-by-side (no dropdown) */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <nav className="space-y-2">
              <h6 className="text-label font-semibold text-gray-900">Tentang</h6>
              <ul className="space-y-2">
                <li>
                  <a href="/#about" className="block text-sm text-gray-600 active:text-primary-700">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="/history" className="block text-sm text-gray-600 active:text-primary-700">
                    Sejarah
                  </a>
                </li>
                <li>
                  <a href="/teams" className="block text-sm text-gray-600 active:text-primary-700">
                    Tim Kami
                  </a>
                </li>
                <li>
                  <a href="/#vision-mission" className="block text-sm text-gray-600 active:text-primary-700">
                    Visi & Misi
                  </a>
                </li>
              </ul>
            </nav>

            <nav className="space-y-2">
              <h6 className="font-semibold text-gray-900 text-sm">Program</h6>
              <ul className="space-y-2">
                <li>
                  <a href="/scholarship" className="block text-sm text-gray-600 active:text-primary-700">
                    Beasiswa
                  </a>
                </li>
                <li>
                  <a href="/events" className="block text-sm text-gray-600 active:text-primary-700">
                    Event
                  </a>
                </li>
                <li>
                  <a href="/proker" className="block text-sm text-gray-600 active:text-primary-700">
                    Program Kerja
                  </a>
                </li>
                <li>
                  <a href="/articles" className="block text-sm text-gray-600 active:text-primary-700">
                    Artikel
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social: professional icon buttons (mobile) */}
          <div className="mb-6">
            <h6 className="font-semibold text-gray-900 text-sm mb-3">Kontak</h6>
            <div className="flex flex-wrap gap-4">
              {content.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.type !== 'email' ? '_blank' : undefined}
                  rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors hover-animate group"
                  aria-label={link.label}
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                    <Icon icon={link.icon || 'tabler:link'} className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-medium group-hover:underline">{link.type === 'email' ? 'Email' : link.type.charAt(0).toUpperCase() + link.type.slice(1)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT (>= 768px) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-primary-600">
              <img src="/genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-8 w-auto flex-shrink-0" loading="lazy" decoding="async" />
              <span>GenBI Unsika</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{content.description}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{content.address}</p>
          </div>

          {/* Navigation - Desktop */}
          <nav className="lg:col-span-2 space-y-3">
            <h6 className="font-semibold text-gray-900 text-base mb-4">Tentang</h6>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="/history" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Sejarah
                </a>
              </li>
              <li>
                <a href="/teams" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Tim Kami
                </a>
              </li>
              <li>
                <a href="/#vision-mission" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Visi & Misi
                </a>
              </li>
            </ul>
          </nav>

          <nav className="lg:col-span-2 space-y-3">
            <h6 className="font-semibold text-gray-900 text-base mb-4">Program</h6>
            <ul className="space-y-2">
              <li>
                <a href="/scholarship" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Beasiswa
                </a>
              </li>
              <li>
                <a href="/events" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Event
                </a>
              </li>
              <li>
                <a href="/proker" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Program Kerja
                </a>
              </li>
              <li>
                <a href="/articles" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Artikel
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact - Desktop */}
          <nav className="md:col-span-2 lg:col-span-3 space-y-3">
            <h6 className="font-semibold text-gray-900 text-base mb-4">Hubungi Kami</h6>
            <ul className="space-y-3">
              {content.socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target={link.type !== 'email' ? '_blank' : undefined}
                    rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
                      <Icon icon={link.icon || 'tabler:link'} className="w-4 h-4" />
                    </div>
                    <span className="truncate text-sm">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-caption text-gray-600">© {year} GenBI Unsika. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

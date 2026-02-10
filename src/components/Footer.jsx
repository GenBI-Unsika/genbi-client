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
    <div className="w-full bg-blue-50">
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 ${ctaOverlap ? 'pt-40 md:pt-48' : 'pt-12 md:pt-16'}`}>
        {/* Brand + Description - Takes full width on mobile/tablet, 5 columns on large */}
        <div className="sm:col-span-2 lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary-600">
            <img src="/genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-7 sm:h-8 w-auto flex-shrink-0" loading="eager" decoding="async" />
            <span>GenBI Unsika</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{content.description}</p>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{content.address}</p>
        </div>

        {/* Column 2 - Takes 1 column on mobile, 2 on large */}
        <nav className="lg:col-span-2 space-y-2 sm:space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Tentang Kami</h6>
          <a href="/about" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Tentang Kami
          </a>
          <a href="/scholarship" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Beasiswa
          </a>
          <a href="/activities" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Kegiatan
          </a>
          <a href="/articles" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Artikel
          </a>
        </nav>

        {/* Column 3 - Takes 1 column on mobile, 2 on large */}
        <nav className="lg:col-span-2 space-y-2 sm:space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Layanan</h6>
          <a href="/events" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Event
          </a>
          <a href="/proker" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Proker
          </a>
          <a href="#testimonials" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Pengalaman Alumni
          </a>
          <a href="#faq" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Pertanyaan Umum
          </a>
          <a href="#vision-mission" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Visi Misi
          </a>
        </nav>

        {/* Column 4 - Social Media Links - Takes full width on mobile, 2 cols on tablet, 3 on large */}
        <nav className="sm:col-span-2 lg:col-span-3 space-y-2 sm:space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Kontak</h6>
          {content.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target={link.type !== 'email' ? '_blank' : undefined}
              rel={link.type !== 'email' ? 'noreferrer' : undefined}
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors group"
            >
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
                <Icon icon={link.icon || 'tabler:link'} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="truncate">{link.label}</span>
            </a>
          ))}
        </nav>
      </footer>

      {/* BOTTOM BAR */}
      <footer className="border-t border-gray-200 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <p className="text-center text-xs sm:text-sm text-gray-600">GenBI Unsika. All Rights Reserved {year}</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

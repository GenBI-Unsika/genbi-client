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

const navAbout = [
  { label: 'Tentang Kami', href: '/#about' },
  { label: 'Sejarah', href: '/history' },
  { label: 'Tim Kami', href: '/teams' },
  { label: 'Visi & Misi', href: '/#vision-mission' },
  { label: 'Pusat Informasi', href: '/pusat-informasi' },
];

const navProgram = [
  { label: 'Beasiswa', href: '/scholarship' },
  { label: 'Event', href: '/events' },
  { label: 'Program Kerja', href: '/proker' },
  { label: 'Artikel', href: '/articles' },
];

const NavList = ({ title, items, isMobile = false }) => (
  <nav className="space-y-3">
    <h6 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>{title}</h6>
    <ul className="space-y-2">
      {items.map(({ label, href }) => (
        <li key={href}>
          <a
            href={href}
            className={`block text-sm text-gray-600 transition-colors ${isMobile ? 'active:text-primary-700' : 'hover:text-primary-600'}`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const SocialIcon = ({ link }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
    <Icon icon={link.icon || 'tabler:link'} className="w-4 h-4" />
  </div>
);

const Brand = ({ size = 'md' }) => (
  <div className={`flex items-center gap-2 font-semibold text-primary-600 ${size === 'sm' ? 'text-base' : 'text-xl'}`}>
    <img src="/genbi-unsika.webp" alt="Logo GenBI Unsika" className={`${size === 'sm' ? 'h-7' : 'h-8'} w-auto flex-shrink-0`} loading="lazy" decoding="async" />
    <span>GenBI Unsika</span>
  </div>
);

const Footer = ({ ctaOverlap = false }) => {
  const year = new Date().getFullYear();
  const [content, setContent] = useState(defaultFooterContent);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_footer', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) setContent({ ...defaultFooterContent, ...value });
      } catch {
      }
    })();
    return () => { alive = false; };
  }, []);

  const ptClass = ctaOverlap ? 'pt-32 sm:pt-40 md:pt-48' : 'pt-8 sm:pt-12 md:pt-16';

  return (
    <footer className="w-full bg-blue-50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${ptClass} pb-6 sm:pb-8`}>

        <div className="md:hidden space-y-6 pb-6">
          <div className="space-y-2">
            <Brand size="sm" />
            <p className="text-sm text-gray-700 leading-relaxed">{content.description}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{content.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <NavList title="Tentang" items={navAbout} isMobile />
            <NavList title="Program" items={navProgram} isMobile />
          </div>

          <div className="space-y-3">
            <h6 className="text-sm font-semibold text-gray-900">Kontak</h6>
            <div className="flex flex-wrap gap-3">
              {content.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target={link.type !== 'email' ? '_blank' : undefined}
                  rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors group"
                >
                  <SocialIcon link={link} />
                  <span className="text-xs font-medium group-hover:underline">
                    {link.type === 'email' ? 'Email' : link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10">
          <div className="md:col-span-2 lg:col-span-5 space-y-3">
            <Brand />
            <p className="text-sm text-gray-700 leading-relaxed">{content.description}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{content.address}</p>
          </div>

          <div className="lg:col-span-2">
            <NavList title="Tentang" items={navAbout} />
          </div>

          <div className="lg:col-span-2">
            <NavList title="Program" items={navProgram} />
          </div>

          <nav className="md:col-span-2 lg:col-span-3 space-y-3">
            <h6 className="font-semibold text-gray-900 text-base">Hubungi Kami</h6>
            <ul className="space-y-3">
              {content.socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target={link.type !== 'email' ? '_blank' : undefined}
                    rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group"
                  >
                    <SocialIcon link={link} />
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-xs text-gray-600">© {year} GenBI Unsika. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
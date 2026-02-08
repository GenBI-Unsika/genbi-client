// src/components/Footer.jsx
import { Icon } from '@iconify/react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="w-full bg-blue-50">
      {/* MAIN FOOTER - dengan padding top untuk CTA overlap */}
      <footer className="max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Brand + Description - Takes 5 columns on large screens */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-primary-600">
            <img src="./genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-8 w-auto flex-shrink-0" loading="eager" decoding="async" />
            <span>GenBI Unsika</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">Komunitas penerima beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang</p>

          <p className="text-sm text-gray-600 leading-relaxed">Universitas Singaperbangsa Karawang Jl. HS. Ronggo Waluyo, Telukjambe Timur, Karawang, Jawa Barat, Indonesia - 41361</p>
        </div>

        {/* Column 2 - Takes 2 columns */}
        <nav className="lg:col-span-2 space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm mb-4">Tentang Kami</h6>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Tentang Kami
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Beasiswa
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Kegiatan
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Artikel
          </a>
        </nav>

        {/* Column 3 - Takes 2 columns */}
        <nav className="lg:col-span-2 space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm mb-4">Layanan</h6>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Event
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Proker
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Pengalaman Alumni
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Pertanyaan Umum
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
            Visi Misi
          </a>
        </nav>

        {/* Column 4 - Social Media Links - Takes 3 columns */}
        <nav className="lg:col-span-3 space-y-3">
          <h6 className="font-semibold text-gray-900 text-sm mb-4">Kontak</h6>
          <a href="mailto:genbiunsika.org@gmail.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
              <Icon icon="tabler:mail" className="w-4 h-4" />
            </div>
            <span>genbiunsika.org@gmail.com</span>
          </a>
          <a href="https://instagram.com/genbi.unsika" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
              <Icon icon="tabler:brand-instagram" className="w-4 h-4" />
            </div>
            <span>genbi.unsika</span>
          </a>
          <a href="https://tiktok.com/@genbi.unsika" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
              <Icon icon="tabler:brand-tiktok" className="w-4 h-4" />
            </div>
            <span>genbi.unsika</span>
          </a>
          <a href="https://youtube.com/@GenBIUnsika" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
              <Icon icon="tabler:brand-youtube" className="w-4 h-4" />
            </div>
            <span>GenBI Unsika</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white group-hover:bg-primary-700 transition-colors flex-shrink-0">
              <Icon icon="tabler:speakerphone" className="w-4 h-4" />
            </div>
            <span>Podcast GenBI Unsika</span>
          </a>
        </nav>
      </footer>

      {/* BOTTOM BAR */}
      <footer className="border-t border-gray-200 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-600">GenBI Unsika. All Rights Reserved {year}</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

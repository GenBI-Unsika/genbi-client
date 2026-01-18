// src/components/Footer.jsx
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

const Footer = () => {
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    toast.success(`Subscribed: ${email}`);
    e.currentTarget.reset();
  };

  return (
    <div className="w-full">
      {/* MAIN */}
      <footer className="footer bg-primary-50 py-12 pt-32 px-22 text-neutral-800 space-x-12">
        {/* Brand + deskripsi + newsletter */}
        <form className="gap-6" onSubmit={handleSubscribe}>
          <div className="flex items-center gap-2 text-2xl font-semibold text-primary-500">
            <img src="./genbi-unsika.webp" alt="Logo GenBI Unsika" className="h-6 md:h-8 lg:h-12 w-auto flex-shrink-0" loading="eager" decoding="async" />
            <span>GenBI Unsika</span>
          </div>

          <p className="text-sm leading-relaxed">Komunitas penerima beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang.</p>

          <p className="text-sm leading-relaxed">Universitas Singaperbangsa Karawang Jl. HS. Ronggo Waluyo, Telukjambe Timur, Karawang, Jawa Barat, Indonesia - 41361</p>
        </form>

        {/* Tentang Kami */}
        <nav>
          <h6 className="footer-title text-gray-900">Tentang Kami</h6>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Tentang Kami
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Beasiswa
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Kegiatan
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Artikel
          </a>
        </nav>

        {/* Layanan */}
        <nav>
          <h6 className="footer-title text-gray-900">Layanan</h6>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Event
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Proker
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Pengalaman Alumni
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Pertanyaan Umum
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Visi Misi
          </a>
        </nav>

        {/* Kontak */}
        <nav>
          <h6 className="footer-title text-gray-900">Kontak</h6>
          <a href="https://maps.google.com/?q=Universitas%20Singaperbangsa%20Karawang" className="link link-hover inline-flex items-center gap-2 text-gray-600 hover:text-primary-600" target="_blank" rel="noreferrer">
            <Icon icon="tabler:map-pin" className="size-4" />
            <span>Universitas Singaperbangsa Karawang</span>
          </a>
          <a href="mailto:genbi@unsika.ac.id" className="link link-hover inline-flex items-center gap-2 text-gray-600 hover:text-primary-600">
            <Icon icon="tabler:mail" className="size-4" />
            <span>genbi@unsika.ac.id</span>
          </a>
          <a href="tel:+62123456789" className="link link-hover inline-flex items-center gap-2 text-gray-600 hover:text-primary-600">
            <Icon icon="tabler:phone" className="size-4" />
            <span>+62 123 456 789</span>
          </a>
        </nav>
      </footer>

      {/* BOTTOM BAR */}
      <footer className="footer bg-primary-50 border-t border-gray-200 px-6 py-4">
        <div className="flex w-full items-center justify-center">
          <aside className="grid-flow-col items-center">
            <p className="text-gray-600">
              &copy;{year}{' '}
              <a className="link link-hover font-medium text-primary-700 hover:text-primary-600" href="#">
                GenBI Unsika
              </a>
            </p>
          </aside>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

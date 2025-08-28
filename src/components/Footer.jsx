// src/components/Footer.jsx
import { Icon } from '@iconify/react';

const Footer = () => {
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    alert(`Subscribed: ${email}`);
    e.currentTarget.reset();
  };

  return (
    <div className="w-full">
      {/* MAIN */}
      <footer className="footer bg-primary-50 py-12 pt-32 px-30 text-gray-600">
        {/* Brand + deskripsi + newsletter */}
        <form className="gap-6" onSubmit={handleSubscribe}>
          <div className="flex items-center gap-2 text-xl font-bold text-primary-700">
            <div className="w-6 h-6 rounded-full bg-primary-500 grid place-items-center text-white">
              <span className="text-xs font-extrabold">G</span>
            </div>
            <span>GenBI Unsika</span>
          </div>

          <p className="text-sm leading-relaxed">Komunitas mahasiswa penerima beasiswa Bank Indonesia di Universitas Singaperbangsa Karawang yang berkomitmen untuk mengembangkan potensi diri dan berkontribusi kepada masyarakat.</p>

          <fieldset>
            <label className="label-text text-gray-900" htmlFor="subscribeNewsletter">
              Subscribe to newsletter
            </label>
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-1">
              <input
                className="input input-sm bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                id="subscribeNewsletter"
                name="email"
                type="email"
                placeholder="johndoe@gmail.com"
                autoComplete="email"
                required
              />
              <button className="btn btn-sm bg-primary-500 border-primary-500 text-white hover:bg-primary-600 hover:border-primary-600" type="submit">
                Subscribe
              </button>
            </div>
          </fieldset>
        </form>

        {/* Tentang Kami */}
        <nav>
          <h6 className="footer-title text-gray-900">Tentang Kami</h6>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Visi Misi
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Sejarah
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Struktur Organisasi
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Prestasi
          </a>
        </nav>

        {/* Layanan */}
        <nav>
          <h6 className="footer-title text-gray-900">Layanan</h6>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Beasiswa BI
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Pelatihan Kepemimpinan
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Program Sosial
          </a>
          <a href="#" className="link link-hover text-gray-600 hover:text-primary-600">
            Pengembangan Karir
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
        <div className="flex w-full items-center justify-between">
          <aside className="grid-flow-col items-center">
            <p className="text-gray-600">
              &copy;{year}{' '}
              <a className="link link-hover font-medium text-primary-700 hover:text-primary-600" href="#">
                GenBI Unsika
              </a>
            </p>
          </aside>

          {/* Sosial: gaya bulat bg primary seperti versi lama */}
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors" aria-label="Instagram">
              <Icon icon="tabler:brand-instagram" className="size-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors" aria-label="X (Twitter)">
              <Icon icon="tabler:brand-x" className="size-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors" aria-label="YouTube">
              <Icon icon="tabler:brand-youtube" className="size-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

// HeroSection.jsx
// Satu file: sudah termasuk AvatarStack versi Tailwind murni

function AvatarStack({ size = 'md' }) {
  const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  const imgCls = `${sizeMap[size]} rounded-full object-cover ring-2 ring-white hover:z-10`;

  const avatars = [
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1061&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1288&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1287&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=1760&q=80',
  ];

  return (
    <div className="flex items-center -space-x-3">
      {avatars.map((src, i) => (
        <img key={i} src={src} alt={`user ${i + 1}`} className={imgCls} loading="lazy" />
      ))}
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="bg-primary-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="font-heading text-balance text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-900 leading-tight">Tumbuh dan Berdampak Bagi Sesama Bersama GenBI Unsika</h1>
            <p className="text-md md:text-lg leading-relaxed">Ayo, daftar Beasiswa GenBI Unsika sekarang dan raih kesempatan untuk mendukung perjalanan akademikmu.</p>

            {/* CTA + AvatarStack rapi, tidak menjepit */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <button className="btn-primary px-6 py-3 md:px-8 md:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0 self-start" type="button">
                Daftar Sekarang
              </button>

              {/* Divider hanya di sm+ */}
              <span className="hidden sm:block h-6 w-px bg-gray-300" aria-hidden="true" />

              <div className="flex items-center gap-3">
                <AvatarStack size="md" />
                <p className="text-sm sm:text-base text-gray-600">
                  Lebih dari <span className="font-extrabold text-gray-900">500+</span> orang <span className="font-semibold">penerima manfaat.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative aspect-[4/3] w-full isolate">
            <div className="absolute -top-10 right-135 w-20 h-20 bg-secondary-300 rounded-2xl z-1" aria-hidden="true"></div>
            <div className="absolute top-12 left-16 w-25 h-25 bg-secondary-400 rounded-3xl z-5" aria-hidden="true"></div>
            <div className="absolute -top-6 right-111 w-10 h-10 bg-secondary-300 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute top-43 right-134 w-10 h-10 bg-secondary-400 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute -top-10 right-63 w-80 h-60 bg-white rounded-xl opacity-70" aria-hidden="true"></div>
            <div className="absolute top-10 right-20 w-100 h-[497px] bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-400)] rounded-t-full z-4" aria-hidden="true"></div>
            <div className="absolute top-10 right-10 w-[420px] h-[497px] rounded-t-full z-50">
              <img src="./graduation-women.webp" alt="Mahasiswa GenBI UNSIKA merayakan kelulusan" className="absolute inset-0 w-full h-full object-fit" loading="eager" decoding="async" fetchpriority="high" />
            </div>

            <div
              className="absolute top-10 right-17 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-300 z-3"
              aria-hidden="true"
            />
            <div
              className="absolute top-10 right-14 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-200 z-3"
              aria-hidden="true"
            />
            <div
              className="absolute top-10 right-11 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-200 opacity-50 z-3"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

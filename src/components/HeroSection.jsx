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
          <div className="relative">
            {/* <div className="relative z-0">
              <img src="http://placehold.co/800x600" alt="Mahasiswa GenBI UNSIKA merayakan kelulusan" className="w-full h-auto" loading="eager" decoding="async" fetchpriority="high" />
            </div>
            <div className="absolute top-0 right-140 w-16 h-16 bg-secondary-300 rounded-lg z-1" aria-hidden="true"></div>
            <div className="absolute bottom-65 left-12 w-25 h-25 bg-secondary-400 rounded-lg z-2" aria-hidden="true"></div>
            <div className="absolute top-3 right-115 w-10 h-10 bg-secondary-300 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute top-48 right-140 w-10 h-10 bg-secondary-400 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute top-0 right-47 w-100 h-50 bg-white rounded-xl opacity-80" aria-hidden="true"></div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

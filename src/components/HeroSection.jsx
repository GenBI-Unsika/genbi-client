const HeroSection = () => {
  return (
    <section className="bg-primary-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="font-heading text-balance text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-900 leading-tight">Tumbuh dan Berdampak Bagi Sesama Bersama GenBI Unsika</h1>
            <p className="text-md md:text-lg leading-relaxed">Ayo, daftar Beasiswa GenBI Unsika sekarang dan raih kesempatan untuk mendukung perjalanan akademikmu.</p>
            <button className="btn-primary px-6 py-3 md:px-8 md:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" type="button">
              Daftar Sekarang
            </button>
          </div>

          {/* Right illustration */}
          <div className="relative">
            <div className="relative z-0">
              <img src="http://placehold.co/800x600" alt="Mahasiswa GenBI UNSIKA merayakan kelulusan" className="w-full h-auto" loading="eager" decoding="async" fetchpriority="high" />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-secondary-400 rounded-lg opacity-80" aria-hidden="true"></div>
            <div className="absolute top-20 right-32 w-8 h-8 bg-secondary-500 rounded-full" aria-hidden="true"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-primary-300 rounded-lg opacity-60" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

const HeroSection = () => {
  return (
    <section className="bg-primary-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 leading-tight">Tumbuh dan Berdampak Bagi Sesama Bersama GenBI Unsika</h1>
            <p className="text-lg text-gray-600 leading-relaxed">Ayo, daftar Beasiswa Genbi Unsika sekarang dan raih kesempatan untuk mendukung perjalanan akademismu</p>
            <button className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium">Daftar Sekarang</button>
          </div>

          {/* Right illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img src="/graduation-student-with-cap-and-gown-celebrating.png" alt="Graduate student celebrating" className="w-full h-auto" />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-secondary-400 rounded-lg opacity-80"></div>
            <div className="absolute top-20 right-32 w-8 h-8 bg-secondary-500 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-primary-300 rounded-lg opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

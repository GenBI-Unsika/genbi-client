import ScrollReveal from './ScrollReveal';

const ScholarshipSection = () => {
  return (
    <ScrollReveal as="section" className="bg-white">
      {/* Responsive radius (no big curve on small screens) */}
      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-r-[72px] xl:rounded-r-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 sm:space-y-6 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary-600">Beasiswa Bank Indonesia</h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                Beasiswa Bank Indonesia merupakan beasiswa yang diberikan oleh Bank Indonesia bagi para mahasiswa S1 di berbagai Perguruan Tinggi Negeri (PTN). Para penerima beasiswa juga akan tergabung dalam organisasi bernama Generasi
                Baru Indonesia (GenBI) dan mendapatkan berbagai pelatihan untuk meningkatkan kompetensi, mengembangkan karakter dan jiwa kepemimpinan mereka. Ini merupakan komitmen Bank Indonesia (BI) untuk memajukan dunia pendidikan dan
                salah satu bentuk tanggung jawab sosial perusahaan. Adapaun tahap seleksi beasiswa Bank Indonesia terdiri dari 3 tahap.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">Daftar Sekarang</button>
              </div>
            </div>

            {/* Right image */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="relative w-full overflow-hidden rounded-xl shadow-sm bg-white">
                {/* Aspect ratios per breakpoint to avoid layout shift */}
                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/2]">
                  <img
                    src="./read-book.webp"
                    alt="Mahasiswa penerima beasiswa Bank Indonesia"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.remove();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ScholarshipSection;

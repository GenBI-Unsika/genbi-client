const ScholarshipSection = () => {
  return (
    <section className="bg-white">
      <div className="py-16 bg-primary-50 rounded-r-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-primary-900">Beasiswa Bank Indonesia</h2>
              <p className="text-gray-600 leading-relaxed">
                Beasiswa Bank Indonesia merupakan beasiswa yang diberikan oleh Bank Indonesia bagi para mahasiswa S1 di berbagai Perguruan Tinggi Negeri (PTN). Para penerima beasiswa juga akan tergabung dalam organisasi bernama Generasi
                Baru Indonesia (GenBI) dan mendapatkan berbagai pelatihan untuk meningkatkan kompetensi, mengembangkan karakter dan jiwa kepemimpinan mereka. Ini merupakan komitmen Bank Indonesia (BI) untuk memajukan dunia pendidikan dan
                salah satu bentuk tanggung jawab sosial perusahaan. Adapaun tahap seleksi beasiswa Bank Indonesia terdiri dari 3 tahap.
              </p>
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">Daftar Sekarang</button>
            </div>

            {/* Right image */}
            <div className="relative">
              <img src="https://placehold.co/800x600" alt="Students with scholarship" className="w-full h-80 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSection;

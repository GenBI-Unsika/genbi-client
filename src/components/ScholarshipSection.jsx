const ScholarshipSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-900">Beasiswa Bank Indonesia</h2>
            <p className="text-gray-600 leading-relaxed">
              Beasiswa Bank Indonesia merupakan program beasiswa yang diberikan oleh Bank Indonesia bagi para mahasiswa
              S1 di berbagai Perguruan Tinggi Negeri (PTN) dan Perguruan Tinggi Swasta (PTS) di Indonesia. Beasiswa ini
              bertujuan untuk mendukung mahasiswa berprestasi dalam menyelesaikan studi dan mengembangkan potensi
              kepemimpinan.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Para penerima beasiswa ini kemudian menjadi bagian dari komunitas GenBI yang tersebar di seluruh Indonesia
              dan aktif dalam berbagai kegiatan pengembangan diri dan pengabdian masyarakat.
            </p>
            <button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              Selengkapnya
            </button>
          </div>

          {/* Right image */}
          <div className="relative">
            <img
              src="/students-studying-together-in-university-campus.png"
              alt="Students with scholarship"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScholarshipSection

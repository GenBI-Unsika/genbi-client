import React from "react";

const ScholarshipPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tertarik Untuk Daftar Beasiswa Bank Indonesia?
          </h1>
          <p className="text-gray-600 text-lg">
            Ketahui persyaratan dan dokumen yang dibutuhkan untuk mendaftar
            beasiswa Bank Indonesia
          </p>
        </div>

        {/* Persyaratan Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan</h2>

          <ul className="space-y-3 text-gray-700">
            <li>
              • Mahasiswa aktif S1 Universitas Singaperbangsa Karawang
              (dibuktikan dengan KTM atau surat keterangan aktif).
            </li>
            <li>
              • Sekurang-kurangnya telah menyelesaikan 40 sks atau berada di
              semester 4 atau 6.
            </li>
            <li>
              • Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4).
            </li>
            <li>
              • Transkrip nilai bertandatangan dan cap Koordinator Program
              Studi.
            </li>
            <li>
              • Tidak sedang menerima beasiswa dari pihak lain, lembaga, atau
              instansi lainnya (dibuktikan dengan surat keterangan).
            </li>
            <li>
              • Bersedia berperan aktif, mengelola, dan mengembangkan komunitas
              Generasi Baru Indonesia (GenBI) serta berpartisipasi dalam semua
              kegiatan yang diselenggarakan oleh Bank Indonesia.
            </li>
            <li>
              • Mempunyai pengalaman menjalankan aktivitas sosial yang berdampak
              keberhasilan bagi masyarakat.
            </li>
            <li>
              • Terbuka Untuk Mahasiswa S1 Unsika dengan Fakultas/Prodi
              Prioritas: FISIP, FH, FE, FAPERTA, FASILKOM, FKIP (Pendidikan
              Matematika).
            </li>
            <li>
              • Fakultas/Prodi Non Prioritas: FT, FIKES, FAI, FKIP (Selain
              Pendidikan Matematika).
            </li>
            <li>
              • Maksimal berusia 23 tahun pada saat ditetapkan sebagai penerima
              beasiswa (OAP maksimal 27 tahun).
            </li>
          </ul>
        </div>

        {/* Dokumen Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dokumen Yang Dibutuhkan
          </h2>

          <ul className="space-y-3 text-gray-700">
            <li>
              • Surat pernyataan beasiswa Bank Indonesia 2024 dan biodata
              mahasiswa form A.1
              <br />
              (dapat diakses pada link{" "}
              <span className="text-blue-600 underline">
                unsika.link/daftar-beasiswa-bi-unsika-2024
              </span>
              )
            </li>
            <li>• Scan KTM dan KTP yang masih berlaku.</li>
            <li>• Dokumen transkrip nilai.</li>
            <li>• Motivation letter (dalam Bahasa Indonesia).</li>
            <li>
              • Surat keterangan tidak mampu dari Kelurahan/Desa setempat atau
              slip gaji resmi orang tua jika bekerja.
            </li>
            <li>
              • Surat rekomendasi dari 1 tokoh (akademik atau non akademik).
            </li>
            <li>
              • Video pengenalan diri dan motivasi menerima Beasiswa Bank
              Indonesia. (Upload di Instagram utama dan tag Instagram
              @genbi.unsika, durasi maksimal 2 menit).
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Daftar Beasiswa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;

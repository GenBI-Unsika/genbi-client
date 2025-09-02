import { useNavigate } from 'react-router-dom';

const ScholarshipPage = () => {
  const navigate = useNavigate();

  const isOpen = true;

  const btnClasses = isOpen ? 'text-white bg-[var(--primary-500)] hover:bg-[var(--primary-600)]' : 'text-[color:var(--neutral-600)] bg-[color:var(--neutral-200)] cursor-not-allowed';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tertarik Untuk Daftar Beasiswa Bank Indonesia?</h1>
          <p className="text-gray-600 text-lg">Ketahui persyaratan dan dokumen yang dibutuhkan untuk mendaftar beasiswa Bank Indonesia</p>
        </div>

        {/* Persyaratan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            <li>• Mahasiswa aktif S1 Universitas Singaperbangsa Karawang (dibuktikan dengan KTM atau surat keterangan aktif).</li>
            <li>• Sekurang-kurangnya telah menyelesaikan 40 sks atau berada di semester 4 atau 6.</li>
            <li>• Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4).</li>
            <li>• Transkrip nilai bertandatangan dan cap Koordinator Program Studi.</li>
            <li>• Tidak sedang menerima beasiswa dari pihak lain, lembaga, atau instansi lainnya (dibuktikan dengan surat keterangan).</li>
            <li>• Bersedia berperan aktif, mengelola, dan mengembangkan komunitas GenBI serta berpartisipasi dalam semua kegiatan yang diselenggarakan oleh Bank Indonesia.</li>
            <li>• Mempunyai pengalaman aktivitas sosial yang berdampak bagi masyarakat.</li>
            <li>• Prioritas: FISIP, FH, FE, FAPERTA, FASILKOM, FKIP (Pendidikan Matematika).</li>
            <li>• Non Prioritas: FT, FIKES, FAI, FKIP (selain Pendidikan Matematika).</li>
            <li>• Maksimal berusia 23 tahun saat ditetapkan sebagai penerima (OAP maksimal 27 tahun).</li>
          </ul>
        </div>

        {/* Dokumen */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dokumen Yang Dibutuhkan</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            <li>
              • Surat pernyataan Beasiswa BI 2024 & Biodata Form A.1
              <br />
              (akses: <span className="text-blue-600 underline">unsika.link/daftar-beasiswa-bi-unsika-2024</span>)
            </li>
            <li>• Scan KTM & KTP yang berlaku.</li>
            <li>• Transkrip nilai.</li>
            <li>• Motivation letter (Bahasa Indonesia).</li>
            <li>• SKTM dari kelurahan/desa atau slip gaji orang tua.</li>
            <li>• Surat rekomendasi dari 1 tokoh (akademik/non-akademik).</li>
            <li>
              • Video pengenalan diri dan motivasi (max 2 menit) upload di IG utama, tag <span className="font-medium">@genbi.unsika</span>.
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button type="button" aria-disabled={!isOpen} disabled={!isOpen} onClick={() => isOpen && navigate('/scholarship/register')} className={`px-8 py-3 rounded-lg font-medium transition-colors ${btnClasses}`}>
            Daftar Beasiswa
          </button>

          {/* (opsional) helper text ketika tutup */}
          {!isOpen && <p className="mt-3 text-sm italic text-secondary-600 ">Pendaftaran sedang ditutup. Pantau informasi selanjutnya ya!</p>}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;

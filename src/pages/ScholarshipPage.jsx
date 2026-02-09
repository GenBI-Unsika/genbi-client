import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';

const defaultScholarshipPage = {
  title: 'Tertarik Untuk Daftar Beasiswa Bank Indonesia?',
  subtitle: 'Ketahui persyaratan dan dokumen yang dibutuhkan untuk mendaftar beasiswa Bank Indonesia',
  isOpen: true,
  buttonText: 'Daftar Beasiswa',
  closedMessage: 'Pendaftaran sedang ditutup. Pantau informasi selanjutnya ya!',
  requirements: [
    'Mahasiswa aktif S1 Universitas Singaperbangsa Karawang (dibuktikan dengan KTM atau surat keterangan aktif).',
    'Sekurang-kurangnya telah menyelesaikan 40 sks atau berada di semester 4 atau 6.',
    'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4).',
  ],
  documents: ['Scan KTM & KTP yang berlaku.', 'Transkrip nilai.', 'Motivation letter (Bahasa Indonesia).'],
};

const ScholarshipPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(defaultScholarshipPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/public/scholarship-page', { method: 'GET', skipAuth: true });
        if (alive && json?.data) {
          setContent({ ...defaultScholarshipPage, ...json.data });
        }
      } catch {
        // Use defaults on error
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const isOpen = content.isOpen;
  const btnClasses = isOpen ? 'text-white bg-[var(--primary-500)] hover:bg-[var(--primary-600)]' : 'text-[color:var(--neutral-600)] bg-[color:var(--neutral-200)] cursor-not-allowed';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-gray-600 text-lg">{content.subtitle}</p>
        </div>

        {/* Persyaratan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            {content.requirements?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Dokumen */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dokumen Yang Dibutuhkan</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            {content.documents?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button type="button" aria-disabled={!isOpen} disabled={!isOpen} onClick={() => isOpen && navigate('/scholarship/register')} className={`px-8 py-3 rounded-lg font-medium transition-colors ${btnClasses}`}>
            {content.buttonText}
          </button>

          {/* helper text ketika tutup */}
          {!isOpen && <p className="mt-3 text-sm italic text-secondary-600">{content.closedMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;

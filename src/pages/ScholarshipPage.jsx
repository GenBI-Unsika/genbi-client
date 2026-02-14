import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';
import { Lock } from 'lucide-react';

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
        {/* Banner ketika pendaftaran ditutup */}
        {!isOpen && (
          <div className="mb-10">
            <div className="mx-auto w-full max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white">
                  <Lock className="h-4 w-4 text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Pendaftaran sedang ditutup</p>
                  <p className="mt-1 text-sm text-red-800">{content.closedMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="page-title mb-4">{content.title}</h1>
          <p className="section-subtitle">{content.subtitle}</p>
        </div>

        {/* Persyaratan */}
        <div className="mb-12">
          <h2 className="section-title mb-6">Persyaratan</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            {content.requirements?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Dokumen */}
        <div className="mb-12">
          <h2 className="section-title mb-6">Dokumen Yang Dibutuhkan</h2>
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
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;

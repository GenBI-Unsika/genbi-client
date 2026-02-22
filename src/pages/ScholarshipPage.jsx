import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';
import { Check, Lock, ArrowRight } from 'lucide-react';

const defaultScholarshipPage = {
  title: 'Tertarik Untuk Daftar Beasiswa Bank Indonesia?',
  subtitle: 'Ketahui persyaratan dan dokumen yang dibutuhkan untuk mendaftar beasiswa Bank Indonesia',
  isOpen: true,
  buttonText: 'Daftar Beasiswa',
  closedMessage: 'Pendaftaran Batch {batch} sedang ditutup. Pantau informasi selanjutnya ya!',
  requirements: [
    'Mahasiswa aktif S1 Universitas Singaperbangsa Karawang (dibuktikan dengan KTM atau surat keterangan aktif).',
    'Sekurang-kurangnya telah menyelesaikan 40 sks atau berada di semester 4 atau 6.',
    'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4).',
  ],
  documents: ['Scan KTM & KTP yang berlaku.', 'Transkrip nilai.', 'Motivation letter (Bahasa Indonesia).'],
  year: new Date().getFullYear(),
  batch: 1,
};

const ScholarshipPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(defaultScholarshipPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Parallel fetch: Page content (CMS) & Registration Info (Admin Settings)
        const [pageRes, regRes] = await Promise.all([
          apiFetch('/public/scholarship-page', { method: 'GET', skipAuth: true }),
          apiFetch('/scholarships/registration', { method: 'GET', skipAuth: true }).catch(() => null),
        ]);

        if (alive) {
          const pageData = pageRes?.data || {};
          const regData = regRes?.data || {};

          setContent({
            ...defaultScholarshipPage,
            ...pageData,
            // Override with live registration data if available
            isOpen: regData.open ?? pageData.isOpen ?? defaultScholarshipPage.isOpen,
            year: regData.year ?? defaultScholarshipPage.year,
            batch: regData.batch ?? defaultScholarshipPage.batch,
          });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          {/* Header */}
          <div className="mb-12 space-y-3">
            <div className="h-9 w-72 bg-gray-200 rounded" />
            <div className="h-5 w-96 bg-gray-100 rounded" />
          </div>

          {/* Persyaratan */}
          <div className="mb-12 space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded mb-6" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${75 + (i % 3) * 8}%` }} />
            ))}
          </div>

          {/* Dokumen */}
          <div className="mb-12 space-y-4">
            <div className="h-6 w-52 bg-gray-200 rounded mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${70 + (i % 4) * 6}%` }} />
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <div className="h-11 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Banner ketika pendaftaran ditutup */}
        {!isOpen && (
          <div className="mb-10">
            <div className="mx-auto w-full max-w-4xl rounded-l-lg border-l-4 border-red-500 bg-red-50 px-4 py-4 text-left shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Lock className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-red-900">Pendaftaran Batch {content.batch} Ditutup</p>
                  <p className="mt-1 text-sm text-red-800 leading-relaxed">{content.closedMessage.replace('{batch}', content.batch)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Tahun {content.year}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              Batch {content.batch}
            </span>
          </div>
          <h1 className="page-title mb-4">{content.title}</h1>
          <p className="section-subtitle">{content.subtitle}</p>
        </div>

        {/* Persyaratan */}
        <div className="mb-12">
          <h2 className="section-title mb-6">Persyaratan</h2>
          <ul className="space-y-4 text-gray-700 leading-relaxed">
            {content.requirements?.map((item, index) => (
              <li key={index} className="flex gap-3 items-start group">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-gray-600 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dokumen */}
        <div className="mb-12">
          <h2 className="section-title mb-6">Dokumen Yang Dibutuhkan</h2>
          <ul className="space-y-4 text-gray-700 leading-relaxed">
            {content.documents?.map((item, index) => (
              <li key={index} className="flex gap-3 items-start group">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-gray-600 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            aria-disabled={!isOpen}
            disabled={!isOpen}
            onClick={() => isOpen && navigate('/scholarship/register')}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-lg
              ${isOpen
                ? 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-1'
                : 'bg-neutral-300 cursor-not-allowed'
              }
            `}
          >
            {content.buttonText}
            {isOpen && <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;

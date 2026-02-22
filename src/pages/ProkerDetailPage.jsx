import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, Link as LinkIcon } from 'lucide-react';
import DOMPurify from 'dompurify';
import { DetailSkeleton } from '../components/shared/PageSkeleton';
import { apiFetch } from '../services/api.js';
import { formatDateLong } from '../utils/formatters';
import { normalizeFileUrl } from '../utils/api';
import ShareButtons from '../components/shared/ShareButtons';
import { useSeo } from '../hooks/useSeo';

const ProkerDetailPage = ({ onNavigate, eventId }) => {
  const [proker, setProker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useSeo({
    title: proker?.title,
    description: proker?.description?.replace(/<[^>]+>/g, '')?.substring(0, 160),
    image: proker?.coverImage ? normalizeFileUrl(proker.coverImage) : null,
    schema: proker ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": proker.title,
          "image": proker.coverImage ? normalizeFileUrl(proker.coverImage) : undefined,
          "author": {
            "@type": "Organization",
            "name": "GenBI: Energi Untuk Negeri"
          },
          "datePublished": proker.publicationDate || proker.createdAt,
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://genbiunsika.web.id"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Proker",
              "item": "https://genbiunsika.web.id/proker"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": proker.title,
              "item": `https://genbiunsika.web.id/proker/${proker.id}`
            }
          ]
        }
      ]
    } : null,
  });

  useEffect(() => {
    if (!eventId) {
      setError('ID Program Kerja tidak ditemukan');
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch(`/activities/${eventId}`)
      .then((res) => {
        setProker(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat program kerja');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    const article = document.querySelector('.article-content');
    if (article) {
      const images = Array.from(article.querySelectorAll('img'));
      images.forEach((img, index) => {
        img.className = 'w-full sm:w-1/2 md:w-5/12 h-auto rounded-xl shadow-sm mb-4 sm:mb-6 mt-1 sm:mt-2 object-cover';

        if (index % 2 === 0) {
          img.classList.add('sm:float-right', 'sm:ml-8');
        } else {
          img.classList.add('sm:float-left', 'sm:mr-8');
        }
      });
    }
  }, [proker, loading]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !proker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Program kerja tidak ditemukan'}</p>
          <button onClick={() => onNavigate('home')} className="text-primary-600 hover:underline">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const attachments = typeof proker.attachments === 'string' ? JSON.parse(proker.attachments) : proker.attachments || {};
  const photos = attachments.photos || [];
  const documents = attachments.documents || [];
  const links = attachments.links || [];

  const publishedDate = formatDateLong(proker.publicationDate || proker.createdAt);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-6 animate-in fade-in slide-in-from-top-2 duration-500">

          <div className="flex-1">
            
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 flex-wrap leading-loose">
              <button onClick={() => onNavigate('home')} className="hover:text-primary-600 transition-colors">
                Beranda
              </button>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <button onClick={() => onNavigate('proker')} className="hover:text-primary-600 transition-colors">
                Aktivitas
              </button>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <button onClick={() => onNavigate('proker')} className="hover:text-primary-600 transition-colors">
                Proker
              </button>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-gray-900 line-clamp-1">{proker.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              {proker.title}
            </h1>

            {proker.theme && (
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                "{proker.theme}"
              </h2>
            )}

            <div className="text-sm text-gray-600">
              <p>Dipublikasikan pada {publishedDate}</p>
            </div>
          </div>

          <div className="flex-shrink-0 sm:ml-6 mt-2 sm:mt-0">
            <div className="flex flex-col items-center justify-center p-3 sm:px-4 sm:py-2 bg-white border border-gray-100 shadow-sm rounded-lg opacity-90">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-primary-600 bg-primary-50 rounded p-1">
                  
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg sm:text-xl font-black text-gray-800 tracking-tight">GenBI</span>
                  <span className="text-sm sm:text-base font-bold text-gray-500 tracking-widest uppercase">News</span>
                </div>
              </div>
              <span className="text-[0.6rem] text-gray-400 mt-1 uppercase tracking-widest text-center">Share Our Moment</span>
            </div>
          </div>

        </div>

        <div className="prose prose-lg max-w-none animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
          <p className="font-bold mb-4">GenBI: Energi Untuk Negeri</p>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(proker.description || 'Deskripsi program kerja tidak tersedia.') }}
          />

          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-12">
            <ShareButtons title={proker.title} />
          </div>
        </div>

        {photos.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dokumentasi Kegiatan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                  <img
                    src={normalizeFileUrl(photo.url)}
                    alt={photo.name || `Dokumentasi ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {documents.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dokumen Terkait</h2>
            <div className="flex flex-col gap-3">
              {documents.map((doc, i) => (
                <a key={i} href={normalizeFileUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group">
                  <FileText className="w-6 h-6 text-primary-500" />
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-primary-600 truncate">{doc.name || 'Dokumen'}</span>
                  <span className="text-sm font-medium text-primary-600 whitespace-nowrap">Unduh File</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {links.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tautan Terkait</h2>
            <div className="flex flex-col gap-3">
              {links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group">
                  <LinkIcon className="w-6 h-6 text-primary-500" />
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-primary-600 truncate">{link.url}</span>
                  <span className="text-sm font-medium text-primary-600 whitespace-nowrap">Buka Tautan</span>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProkerDetailPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { apiFetch, normalizeFileUrl } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { formatDateLong } from '../utils/formatters';
import ShareButtons from '../components/shared/ShareButtons';
import NewsletterSubscribe from '../components/shared/NewsletterSubscribe';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError('Slug artikel tidak ditemukan');
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch(`/articles/slug/${slug}`)
      .then((res) => {
        setArticle(res.data);
        setError(null);
      })
      .catch((err) => {
        // Error loading article
        setError(err.message || 'Gagal memuat artikel');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Artikel tidak ditemukan'}</p>
          <button onClick={() => navigate('/')} className="text-primary-600 hover:underline">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Parse attachments if stored as JSON string
  const attachments = typeof article.attachments === 'string' ? JSON.parse(article.attachments) : article.attachments || {};
  const photos = attachments.photos || [];

  const publishedDate = article.publishedAt ? formatDateLong(article.publishedAt) : 'Belum dipublikasikan';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-body-sm text-gray-500 mb-8 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
          <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors flex-shrink-0">
            Beranda
          </button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <button onClick={() => navigate('/articles')} className="hover:text-primary-600 transition-colors flex-shrink-0">
            Artikel
          </button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 truncate min-w-0 max-w-[40vw]">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <h1 className="text-h1 font-bold text-gray-900 mb-4">{article.title}</h1>
          {article.excerpt && <p className="text-body-lg text-gray-600 mb-4">{article.excerpt}</p>}
          <div className="date-text">Dipublikasikan pada {publishedDate}</div>
          {/* {article.author?.profile?.name && <div className="date-text mt-1">Oleh: {article.author.profile.name}</div>} */}

          {/* Share Buttons */}
          <ShareButtons title={article.title} className="mt-4" />
        </header>

        {/* Cover Image */}
        {article.coverImage ? (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-700 delay-200 overflow-hidden rounded-lg">
            <img src={normalizeFileUrl(article.coverImage)} alt={article.title} className="w-full h-auto object-cover max-h-[500px] hover:scale-105 transition-all duration-700 ease-out" />
          </div>
        ) : null}

        {/* Article Content */}
        <article className="mb-12 max-w-none animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
        </article>

        {/* Newsletter Subscription */}
        <NewsletterSubscribe className="mb-12" />

        {/* Documentation Section */}
        {photos.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
            <h2 className="section-title mb-8">Dokumentasi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                  <img src={normalizeFileUrl(photo.url)} alt={photo.name || `Dokumentasi ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;

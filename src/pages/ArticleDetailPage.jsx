import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { apiFetch, normalizeFileUrl } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { formatDateLong } from '../utils/formatters';

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
        console.error('Failed to load article:', err);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-500 mb-8 overflow-hidden">
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
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          {article.excerpt && <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>}
          <div className="text-sm text-gray-500">Dipublikasikan pada {publishedDate}</div>
          {article.author?.profile?.name && <div className="text-sm text-gray-500 mt-1">Oleh: {article.author.profile.name}</div>}
        </header>

        {/* Cover Image */}
        {article.coverImage ? (
          <div className="mb-8">
            <img src={normalizeFileUrl(article.coverImage)} alt={article.title} className="w-full h-auto rounded-lg object-cover max-h-96" />
          </div>
        ) : null}

        {/* Article Content */}
        <article className="mb-12 prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
        </article>

        {/* Documentation Section */}
        {photos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dokumentasi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                  <img src={normalizeFileUrl(photo.url)} alt={photo.name || `Dokumentasi ${i + 1}`} className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" />
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

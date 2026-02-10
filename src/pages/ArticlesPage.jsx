import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ArticleCard from '../components/cards/ArticleCard';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);

        const params = new URLSearchParams();

        const json = await apiFetch(`/articles?${params.toString()}`, { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];

        if (alive) {
          setArticles(Array.isArray(items) ? items : []);
        }
      } catch (e) {
        if (!alive) return;
        const msg = e?.message || 'Gagal memuat artikel';
        toast.error(msg);
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Yang Baru Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? <div className="text-gray-500">Memuat...</div> : null}
          {!loading && !error && articles.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon="files" title="Belum ada artikel" description="Artikel akan muncul di sini setelah dipublikasikan" variant="primary" />
            </div>
          ) : null}
          {articles.map((a) => {
            const pubDate = a.publishedAt || a.createdAt;
            const isNew = pubDate && (new Date() - new Date(pubDate)) / (1000 * 60 * 60 * 24) <= 7;
            const isPopular = a.viewCount >= 50;

            let badge = 'Artikel';
            let badgeColor = '#6B7280';

            if (isNew) {
              badge = 'Terbaru';
              badgeColor = '#10B981';
            } else if (isPopular) {
              badge = 'Populer';
              badgeColor = '#F59E0B';
            }

            return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} date={pubDate} badge={badge} badgeColor={badgeColor} image={a.coverImage} to={`/articles/${a.slug}`} />;
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Berikutnya">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

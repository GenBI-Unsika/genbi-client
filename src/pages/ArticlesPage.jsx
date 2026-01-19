import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ArticleCard from '../components/cards/ArticleCard';
import { apiFetch } from '../services/api.js';
import EmptyStateImage from '../components/EmptyStateImage';

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

        // NOTE: Endpoint ini belum tersedia di backend saat ini.
        // Saat endpoint tersedia, sesuaikan path & mapping sesuai response API.
        const json = await apiFetch('/public/articles', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setArticles(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setArticles([]);
          return;
        }
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Apa Yang Baru Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? <div className="text-gray-500">Memuat...</div> : null}
          {!loading && !error && articles.length === 0 ? (
            <div className="col-span-full">
              <EmptyStateImage
                image="https://illustrations.popsy.co/amber/work-from-home.svg"
                imageAlt="No articles illustration"
                title="Belum ada artikel"
                description="Artikel akan muncul di sini setelah dipublikasikan"
                variant="primary"
                imageSize="lg"
              />
            </div>
          ) : null}
          {articles.map((a) => (
            <ArticleCard
              key={a.id || a.slug || a.title}
              title={a.title}
              excerpt={a.excerpt || a.description}
              date={a.date}
              badge={a.badge}
              readTime={a.readTime}
              image={a.image || undefined}
              to={a.href || (a.id ? `/articles/${a.id}` : '/articles')}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50" aria-label="Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50" aria-label="Berikutnya">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ArticleCard from '../components/cards/ArticleCard';
import Pagination from '../components/shared/Pagination';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { FireIcon } from '../components/icons/CustomIcons.jsx';

const LIMIT = 21;

function clampPage(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.floor(num);
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = clampPage(searchParams.get('page') || 1);

  const [page, setPage] = useState(urlPage);
  const [meta, setMeta] = useState({ total: 0, page: urlPage, limit: LIMIT, totalPages: 1 });
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'publishedAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  useEffect(() => {
    // Keep state in sync when user uses Back/Forward.
    if (urlPage !== page) setPage(urlPage);
  }, [urlPage]);

  const goToPage = (next) => {
    const nextPage = clampPage(next);
    setPage(nextPage);
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set('page', String(nextPage));
      sp.set('sortBy', sortBy);
      sp.set('sortOrder', sortOrder);
      return sp;
    });
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);

        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(LIMIT));
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
        params.set('popularFirst', 'true');

        const json = await apiFetch(`/articles?${params.toString()}`, { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        const nextMeta = json?.meta || json?.data?.meta;

        if (alive) {
          setArticles(Array.isArray(items) ? items : []);
          if (nextMeta && typeof nextMeta === 'object') {
            setMeta({
              total: Number(nextMeta.total || 0),
              page: Number(nextMeta.page || page),
              limit: LIMIT,
              totalPages: Number(nextMeta.totalPages || 1),
            });
          } else {
            setMeta((m) => ({ ...m, page }));
          }
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
  }, [page, sortBy, sortOrder]);

  const totalPages = Math.max(1, Number(meta.totalPages) || 1);

  // Clamp page if server reports fewer pages (prevents dead-end pages).
  useEffect(() => {
    if (page > totalPages) goToPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="page-title mb-4">Apa Yang Baru Di GenBI Unsika</h1>
            <p className="section-subtitle">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
          </div>

          <div className="flex gap-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSort, newOrder] = e.target.value.split('-');
                setSortBy(newSort);
                setSortOrder(newOrder);
                setPage(1);
                setSearchParams((prev) => {
                  const sp = new URLSearchParams(prev);
                  sp.set('page', '1');
                  sp.set('sortBy', newSort);
                  sp.set('sortOrder', newOrder);
                  return sp;
                });
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="publishedAt-desc">Terbaru</option>
              <option value="publishedAt-asc">Terlama</option>
              <option value="viewCount-desc">Terpopuler</option>
              <option value="title-asc">Judul (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse">
                <div className="h-44 w-full bg-gray-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-4/5 bg-gray-200 rounded" />
                  <div className="h-3.5 w-full bg-gray-100 rounded" />
                  <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
                  </div>
                </div>
              </div>
            ))
            : null}
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
              badge = (
                <span className="flex items-center gap-1">
                  <FireIcon className="w-3 h-3 text-red-500" />
                  Populer
                </span>
              );
              badgeColor = '#F59E0B';
            }

            return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} date={pubDate} badge={badge} badgeColor={badgeColor} image={a.coverImage} to={`/articles/${a.slug}`} />;
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

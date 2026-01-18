import ArticleCard from './cards/ArticleCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const json = await apiFetch('/public/articles?limit=4', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setArticles(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setArticles([]);
          return;
        }
        setArticles([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="bg-white">
      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-tl-[72px] xl:rounded-tl-[100px] md:rounded-br-[72px] xl:rounded-br-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary-600">Artikel</h2>
            <a href="/articles" className="text-primary-600 hover:text-primary-700 font-medium">
              Lihat Lainnya →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? <div className="text-gray-500">Memuat...</div> : null}
            {!loading && articles.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="files" title="Belum ada artikel" description="Artikel terbaru akan muncul di sini." />
              </div>
            ) : null}
            {articles.map((a) => (
              <ArticleCard key={a.id || a.slug || a.title} {...a} to={a.href || (a.id ? `/articles/${a.id}` : '/articles')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

import ArticleCard from './cards/ArticleCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';
import ScrollReveal from './ScrollReveal';
import { Link } from 'react-router-dom';

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
    <ScrollReveal as="section" className="bg-white">
      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-tl-[72px] xl:rounded-tl-[100px] md:rounded-br-[72px] xl:rounded-br-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-1">Publikasi</p>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Artikel Terbaru</h2>
            </div>
            <Link to="/articles" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors duration-150 shrink-0">
              Lihat Lainnya <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : null}
            {!loading && articles.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="files" title="Belum ada artikel" description="Artikel terbaru akan muncul di sini" variant="primary" />
              </div>
            ) : null}
            {articles.map((a, idx) => (
              <ScrollReveal key={a.id || a.slug || a.title} as="div" once className="h-full" delay={(idx * 70) / 1000}>
                <ArticleCard {...a} to={a.href || (a.slug ? `/articles/${a.slug}` : '/articles')} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ArticlesSection;

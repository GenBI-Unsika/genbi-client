import React, { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import { HistorySkeleton } from '../components/shared/PageSkeleton';
import { apiFetch, normalizeFileUrl } from '../services/api.js';

const defaultHistoryContent = {
  title: '',
  subtitle: '',
  image: '',
  body: '',
};

const HistoryPage = () => {
  const [content, setContent] = useState(defaultHistoryContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_history', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) setContent({ ...defaultHistoryContent, ...value });
      } catch {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <HistorySkeleton />;

  const imageSrc = normalizeFileUrl(content.image);
  const paragraphs = String(content.body || '')
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="mb-12">
          <h1 className="page-title mb-4">{content.title || 'Sejarah'}</h1>
          {content.subtitle ? <p className="section-subtitle">{content.subtitle}</p> : null}
        </div>

        {imageSrc ? (
          <div className="mb-8">
            <img src={imageSrc} alt={content.title || 'Sejarah GenBI'} className="w-full aspect-video object-cover rounded-lg" loading="lazy" decoding="async" />
          </div>
        ) : null}

        {!content.body ? (
          <div className="py-8">
            <EmptyState icon="box" title="Konten belum tersedia" description="Silakan coba lagi nanti." variant="default" />
          </div>
        ) : (
          <div className="prose max-w-none">
            {paragraphs.map((text, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed text-base mb-6">
                {text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

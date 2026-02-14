import React, { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
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
        // Keep default on error
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const imageSrc = normalizeFileUrl(content.image);
  const paragraphs = String(content.body || '')
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="page-title mb-4">{content.title || 'Sejarah'}</h1>
          {content.subtitle ? <p className="section-subtitle">{content.subtitle}</p> : null}
        </div>

        {/* Image Placeholder */}
        {imageSrc ? (
          <div className="mb-8">
            <img src={imageSrc} alt={content.title || 'Sejarah GenBI'} className="w-full h-80 object-cover rounded-lg" loading="lazy" decoding="async" />
          </div>
        ) : null}

        {/* Content */}
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          </div>
        ) : !content.body ? (
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

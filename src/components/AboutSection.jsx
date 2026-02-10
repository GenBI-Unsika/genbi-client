import React, { useState, useEffect, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import EmptyState from './EmptyState';
import ScrollReveal from './ScrollReveal';
import { apiFetch, normalizeFileUrl } from '../services/api.js';

// Default CMS content (fallback if API fails or returns null)
// Initial state is empty to enforce CMS dependence
const defaultAboutContent = {
  title: '',
  description: '',
  coverImage: '',
  videoUrl: '',
};

const getEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
};

const AboutSection = ({ imageSrc: propImageSrc, videoUrl: propVideoUrl }) => {
  const [content, setContent] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Fetch CMS content
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_about', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) {
          setContent(value);
        }
      } catch {
        // Keep empty/default on error
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Props override CMS values if provided
  const imageSrc = normalizeFileUrl(propImageSrc || content.coverImage);
  const videoUrl = propVideoUrl || content.videoUrl;

  const hasVideo = Boolean(videoUrl);
  const hasCover = Boolean(imageSrc);

  const openPlayer = useCallback(() => setOpen(true), []);
  const closePlayer = useCallback(() => setOpen(false), []);

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closePlayer();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closePlayer]);

  return (
    <ScrollReveal as="section" aria-labelledby="about-heading" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-2xl aspect-[16/9]"></div>
          </div>
        ) : !content.title && !content.description ? (
          <div className="text-center py-12">
            <EmptyState icon="box" title="Konten belum tersedia" description="Admin belum mengatur konten untuk bagian ini." variant="default" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <h2 id="about-heading" className="text-4xl font-semibold text-primary-500">
                {content.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{content.description}</p>
            </div>

            {/* Right video/image */}
            <div className="relative">
              <figure className="bg-gray-200 rounded-2xl overflow-hidden">
                {hasCover ? (
                  <img src={imageSrc} alt="Mahasiswa GenBI UNSIKA dalam kegiatan kampus" className="w-full h-auto object-cover aspect-[16/9]" loading="lazy" decoding="async" />
                ) : hasVideo ? (
                  <div className="w-full aspect-[16/9] bg-black">
                    <iframe
                      title="Video profil GenBI UNSIKA"
                      src={getEmbedUrl(videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] bg-white flex items-center justify-center p-6">
                    <div className="w-full">
                      <EmptyState icon="box" title="Konten belum tersedia" description="Kami akan menambahkan foto/video profil GenBI UNSIKA secepatnya." variant="primary" />
                    </div>
                  </div>
                )}
              </figure>

              {/* Play button overlay (only when there is a cover image) */}
              {hasCover ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={openPlayer}
                    className={
                      hasVideo
                        ? 'cursor-pointer bg-white/90 backdrop-blur rounded-full p-4 ring-1 ring-black/5 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                        : 'cursor-pointer bg-white/95 backdrop-blur rounded-full p-4 ring-1 ring-black/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                    }
                    aria-label={hasVideo ? 'Putar video profil GenBI UNSIKA' : 'Video profil belum tersedia (klik untuk info)'}
                    title={hasVideo ? 'Putar video' : 'Video belum tersedia'}
                  >
                    <Play className="w-8 h-8 text-primary-500" aria-hidden="true" />
                    <span className="sr-only">Putar video</span>
                  </button>

                  {!hasVideo ? <div className="rounded-full bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-black/5">Video segera hadir</div> : null}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Modal / tempat video */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-video-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePlayer} // klik backdrop untuk tutup
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()} // biar klik konten nggak nutup
          >
            <button
              type="button"
              onClick={closePlayer}
              className="cursor-pointer absolute -top-3 -right-3 bg-white rounded-full p-2 shadow ring-1 ring-black/10
                         hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Tutup video"
              title="Tutup"
            >
              <X className="w-5 h-5 text-gray-700" aria-hidden="true" />
            </button>

            <h3 id="about-video-title" className="sr-only">
              Video profil GenBI UNSIKA
            </h3>

            <div className="bg-black rounded-xl overflow-hidden aspect-video ring-1 ring-white/10">
              {videoUrl ? (
                <iframe title="Pemutar video" src={getEmbedUrl(videoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white p-6">
                  <div className="w-full">
                    <EmptyState
                      icon="box"
                      title="Video belum tersedia"
                      description="Kami akan menambahkan video profil GenBI UNSIKA secepatnya."
                      variant="primary"
                      action={
                        <button type="button" onClick={closePlayer} className="bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                          Tutup
                        </button>
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ScrollReveal>
  );
};

export default AboutSection;

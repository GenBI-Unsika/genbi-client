import React, { useState, useEffect, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import EmptyStateImage from './EmptyStateImage';
import ScrollReveal from './ScrollReveal';
import { apiFetch } from '../services/api.js';

// Default CMS content (fallback if API fails or returns null)
const defaultAboutContent = {
  title: 'Tentang Kami',
  description:
    'Generasi Baru Indonesia (GenBI) Universitas Singaperbangsa Karawang (UNSIKA) adalah komunitas mahasiswa penerima beasiswa Bank Indonesia yang berkomitmen untuk memberikan kontribusi positif kepada masyarakat. GenBI UNSIKA tidak hanya berfokus pada prestasi akademik, tetapi juga aktif dalam berbagai kegiatan sosial, lingkungan, dan ekonomi. Dengan semangat kolaborasi dan inovasi, kami berusaha menciptakan program-program yang bermanfaat bagi masyarakat luas. Melalui upaya ini, GenBI UNSIKA bertekad menjadi agen perubahan yang inspiratif, membantu membangun masa depan Indonesia yang lebih baik.',
  coverImage: '',
  videoUrl: '',
};

const AboutSection = ({ imageSrc: propImageSrc, videoUrl: propVideoUrl }) => {
  const [content, setContent] = useState(defaultAboutContent);
  const [open, setOpen] = useState(false);

  // Fetch CMS content
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_about', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) {
          setContent({ ...defaultAboutContent, ...value });
        }
      } catch {
        // Use defaults on error
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Props override CMS values if provided
  const imageSrc = propImageSrc || content.coverImage;
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
            <figure className="bg-gray-200 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
              {hasCover ? (
                <img src={imageSrc} alt="Mahasiswa GenBI UNSIKA dalam kegiatan kampus" className="w-full h-auto object-cover aspect-[16/9]" loading="lazy" decoding="async" />
              ) : (
                <div className="w-full aspect-[16/9] bg-white flex items-center justify-center p-6">
                  <div className="w-full">
                    <EmptyStateImage
                      image="https://illustrations.popsy.co/amber/remote-work.svg"
                      imageAlt="Konten belum tersedia"
                      title="Konten belum tersedia"
                      description="Kami akan menambahkan foto/video profil GenBI UNSIKA secepatnya."
                      variant="primary"
                      imageSize="lg"
                    />
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
                <iframe title="Pemutar video" src={videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white p-6">
                  <div className="w-full">
                    <EmptyStateImage
                      image="https://illustrations.popsy.co/amber/remote-work.svg"
                      imageAlt="Video belum tersedia"
                      title="Video belum tersedia"
                      description="Kami akan menambahkan video profil GenBI UNSIKA secepatnya."
                      variant="primary"
                      imageSize="lg"
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

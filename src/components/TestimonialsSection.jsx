import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch, normalizeFileUrl } from '../services/api.js';
import ScrollReveal from './ScrollReveal';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAvatarPlaceholder = (url) => {
    if (!url || typeof url !== 'string') return true;
    // The project previously used ui-avatars as placeholders; prefer neutral icon placeholders instead.
    if (url.includes('ui-avatars.com/api/')) return true;
    return false;
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const json = await apiFetch('/public/testimonials', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setTestimonials(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status !== 404) console.error('Failed to load testimonials:', e);
        setTestimonials([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <ScrollReveal as="section" className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Row - Terpisah */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-[#003D7A] text-3xl lg:text-4xl font-bold">Pengalaman Alumni</h2>
        </div>

        {/* Content Row - Split Left & Right */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:w-[40%] flex-shrink-0">
            <div className="space-y-4">
              <h3 className="text-gray-900 text-xl lg:text-2xl font-bold">Bagaimana Pendapat Alumni GenBI Unsika</h3>
              <p className="text-gray-700 text-base leading-relaxed">Yukk, cari tahu bagaimana pengalaman alumni selama menjadi anggota GenBI Unsika</p>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="lg:w-[60%] relative">
            {loading ? (
              <div className="text-gray-500 py-24 text-center">Memuat testimoni...</div>
            ) : testimonials.length === 0 ? (
              <div className="py-16">
                {(() => {
                  const placeholders = Array.from({ length: 3 });
                  return (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center -space-x-3 rtl:space-x-reverse isolate">
                        {placeholders.map((_, i) => (
                          <div key={i} className="h-10 w-10 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <>
                {/* Navigation Buttons */}
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  onClick={scrollPrev}
                  disabled={!canPrev}
                  className="
                    absolute left-0 top-1/2 -translate-y-1/2 translate-x-0 md:-translate-x-6 z-20
                    flex items-center justify-center
                    w-10 h-10 md:w-12 md:h-12 rounded-full
                    bg-[#1E40AF] text-white
                    hover:bg-[#1E3A8A]
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-200
                    shadow-lg
                  "
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={3} />
                </button>

                <button
                  type="button"
                  aria-label="Berikutnya"
                  onClick={scrollNext}
                  disabled={!canNext}
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-6 z-20
                    flex items-center justify-center
                    w-10 h-10 md:w-12 md:h-12 rounded-full
                    bg-[#1E40AF] text-white
                    hover:bg-[#1E3A8A]
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-200
                    shadow-lg
                  "
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </button>

                {/* Carousel */}
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex">
                    {testimonials.map((item, idx) => (
                      <div className="flex-[0_0_100%] min-w-0 pl-3" key={idx}>
                        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl px-5 py-8 shadow-lg max-w-sm mx-auto">
                          {/* Quote Icon Top Left */}
                          <div className="absolute top-4 left-4">
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                              <text x="0" y="30" fontSize="32" fontWeight="bold" fill="#1E40AF" fontFamily="Georgia, serif">
                                "
                              </text>
                            </svg>
                          </div>

                          {/* Content */}
                          <div className="flex flex-col items-center gap-4 pt-2">
                            {/* Profile Photo */}
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-pink-300 ring-2 ring-white shadow-md">
                              {(() => {
                                const photoUrl = normalizeFileUrl(item.photo_profile);
                                if (photoUrl && !isAvatarPlaceholder(photoUrl)) {
                                  return <img src={photoUrl} alt={item.name} loading="lazy" className="w-full h-full object-cover" />;
                                }

                                return (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Name */}
                            <h4 className="text-gray-900 font-bold text-lg">{item.name}</h4>

                            {/* Role */}
                            <p className="text-gray-600 text-sm -mt-3">{item.role}</p>

                            {/* Quote */}
                            <p className="text-gray-800 text-center text-sm leading-relaxed max-w-sm px-2">"{item.quote}"</p>
                          </div>

                          {/* Quote Icon Bottom Right */}
                          <div className="absolute bottom-4 right-4">
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                              <rect x="4" y="4" width="12" height="12" rx="2" stroke="#EF4444" strokeWidth="2" fill="none" />
                              <rect x="20" y="20" width="12" height="12" rx="2" stroke="#EF4444" strokeWidth="2" fill="none" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

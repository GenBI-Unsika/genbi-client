import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api.js';
import EmptyStateImage from './EmptyStateImage';
import ScrollReveal from './ScrollReveal';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
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
    <ScrollReveal as="section" className="py-16 bg-white">
      <div className="py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex w-full gap-12 max-lg:flex-col md:gap-16 lg:items-center lg:gap-24">
            <div>
              <div className="space-y-4">
                <p className="inline-block text-primary-500 text-sm font-medium bg-primary-50 p-2 rounded-xl">Pengalaman Alumni</p>
                <h2 className="text-neutral-800 text-2xl font-semibold md:text-3xl lg:text-4xl">Bagaimana Pendapat Alumni GenBI Unsika</h2>
                <p className="text-neutral-500 text-xl">Yuk, cari tahu bagaimana pengalaman alumni selama menjadi anggota GenBI Unsika.</p>
              </div>

              {/* Tombol navigasi tetap berfungsi & tidak overlay heading */}
              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  onClick={scrollPrev}
                  disabled={!canPrev}
                  className="
                    flex items-center justify-center
                    w-9 h-9 rounded-md
                    bg-primary-300 text-white
                    hover:bg-primary-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  aria-label="Berikutnya"
                  onClick={scrollNext}
                  disabled={!canNext}
                  className="
                    flex items-center justify-center
                    w-9 h-9 rounded-md
                    bg-primary-400 text-white
                    hover:bg-primary-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="rounded-2xl p-8 overflow-hidden border border-neutral-200 bg-white">
              {loading ? (
                <div className="text-gray-500 py-8">Memuat testimoni...</div>
              ) : testimonials.length === 0 ? (
                <div className="py-8">
                  <EmptyStateImage
                    image="https://illustrations.popsy.co/amber/remote-work.svg"
                    imageAlt="No testimonials illustration"
                    title="Belum ada testimoni"
                    description="Testimoni dari anggota akan muncul di sini"
                    variant="primary"
                    imageSize="lg"
                  />
                </div>
              ) : (
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex gap-6">
                    {testimonials.map((item, idx) => (
                      <div className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0" key={idx}>
                        <div
                          className="
                            relative h-full rounded-3xl border border-neutral-200 bg-white
                            transition-transform duration-300 ease-out
                            hover:-translate-y-1 hover:scale-[1.01]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300
                            shadow-sm-primary-500/30 hover:shadow-lg-primary-500/30
                          "
                          tabIndex={0}
                        >
                          <div className="p-6 md:p-7 flex flex-col justify-between gap-6 min-h-[18rem]">
                            <div className="flex flex-col justify-center items-center gap-3">
                              <div className="size-14 rounded-full overflow-hidden bg-neutral-100">
                                <img src={item.photo_profile} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                              </div>
                              <h4 className="text-neutral-800 font-medium text-center">{item.name}</h4>
                              <p className="text-neutral-600 text-sm text-center">{item.role}</p>
                            </div>
                            <p className="text-neutral-700 text-sm overflow-hidden text-center">{item.quote}</p>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* End Carousel */}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Data dipisahkan agar tidak dibuat ulang di setiap render
const TESTIMONIALS = [
  {
    name: "Arif Syarifudin",
    role: "GenBI Unsika 2021",
    image: "https://placehold.co/160x160?text=Arif",
    quote:
      "Pengalaman menjadi bagian dari GenBI sangat berharga. Saya belajar banyak tentang kepemimpinan, kerjasama tim, dan pengabdian kepada masyarakat.",
  },
  {
    name: "Siti Nurhaliza",
    role: "GenBI Unsika 2021",
    image: "https://placehold.co/160x160?text=Siti",
    quote:
      "GenBI memberikan kesempatan luar biasa untuk berkembang dan berkontribusi. Melalui berbagai kegiatan, saya dapat mengasah kemampuan public speaking dan manajemen proyek.",
  },
  {
    name: "Ahmad Fauzi",
    role: "GenBI Unsika 2020",
    image: "https://placehold.co/160x160?text=Ahmad",
    quote:
      "Bergabung dengan GenBI adalah keputusan terbaik selama kuliah. Tidak hanya mendapat beasiswa, tapi juga pengalaman organisasi yang sangat berharga untuk karier.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true, // infinite loop
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const len = TESTIMONIALS.length;
  const prevIndex = useMemo(() => (current - 1 + len) % len, [current, len]);
  const nextIndex = useMemo(() => (current + 1) % len, [current, len]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  // Sync current index
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Autoplay (infinite scroll) — pause saat hover/focus
  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const id = setInterval(() => emblaApi && emblaApi.scrollNext(), 3500);
    return () => clearInterval(id);
  }, [emblaApi, isPaused]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    },
    [scrollPrev, scrollNext]
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-semibold text-primary-900 mb-10">
          Pengalaman Alumni
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left intro */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-2xl font-semibold text-neutral-900 leading-snug">
              Bagaimana Pendapat Alumni GenBI Unsika
            </h3>
            <p className="text-gray-600">
              Yuk, cari tahu bagaimana pengalaman alumni selama menjadi anggota GenBI Unsika
            </p>
          </div>

          {/* Right carousel */}
          <div className="lg:col-span-8 relative">
            {/* Stage / Embla viewport */}
            <div
              className="relative outline-none"
              role="region"
              aria-roledescription="carousel"
              aria-label="Testimoni Alumni GenBI Unsika"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >
              <div
                className="overflow-hidden h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px]"
                ref={emblaRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
              >
                <div className="flex h-full touch-pan-y">
                  {TESTIMONIALS.map((t, i) => {
                    const variant =
                      i === current
                        ? "active"
                        : i === prevIndex
                        ? "neighbor-left"
                        : i === nextIndex
                        ? "neighbor-right"
                        : "other";

                    return (
                      <div
                        key={i}
                        className="basis-[240px] sm:basis-[280px] md:basis-[340px] lg:basis-[380px] shrink-0 px-3"
                        aria-roledescription="slide"
                        aria-label={`${t.name} — ${t.role}`}
                      >
                        <TestimonialCard t={t} variant={variant} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nav buttons */}
              <button
                onClick={scrollPrev}
                aria-label="Sebelumnya"
                className="absolute left-[-6px] sm:left-0 md:left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-primary-500 text-white grid place-items-center shadow-md hover:shadow-[0_8px_20px_rgba(1,49,159,0.25)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(1,49,159,0.6)]"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="sr-only">Sebelumnya</span>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Berikutnya"
                className="absolute right-[-6px] sm:right-0 md:right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-primary-500 text-white grid place-items-center shadow-md hover:shadow-[0_8px_20px_rgba(1,49,159,0.25)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(1,49,159,0.6)]"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
                <span className="sr-only">Berikutnya</span>
              </button>
            </div>

            {/* Dots indicator */}
            <div className="mt-6 flex justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ke slide ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === current ? "bg-primary-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, variant }) {
  const isActive = variant === "active";

  const base =
    "relative mx-auto w-full aspect-square rounded-2xl transition-all duration-300 select-none";

  const look =
    variant === "active"
      ? "bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(1,49,159,0.18)] scale-100"
      : variant === "neighbor-left" || variant === "neighbor-right"
      ? "pointer-events-none bg-white/70 border border-slate-200/60 scale-[.96] saturate-90 opacity-80"
      : "opacity-0 scale-[.96] pointer-events-none";

  const onImgError = (e) => {
    e.currentTarget.src = "https://placehold.co/160x160";
  };

  return (
    <article className={`${base} ${look}`} aria-hidden={!isActive}>
      {/* content */}
      <div className="h-full px-6 sm:px-7 py-6 sm:py-7 flex flex-col items-center justify-between text-center">
        {/* avatar + name */}
        <div className="flex flex-col items-center">
          <span className="block w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow">
            <img
              src={t.image || "https://placehold.co/160x160"}
              alt={t.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={onImgError}
            />
          </span>
          <h4 className="mt-4 font-semibold text-neutral-900">{t.name}</h4>
          <p className="text-sm text-gray-600">{t.role}</p>
        </div>

        {/* quote */}
        <p className="text-gray-700 max-w-[40ch] mx-auto leading-relaxed">
          {t.quote}
        </p>

        {/* subtle accent */}
        <div className="w-full flex justify-center" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-[rgba(1,49,159,0.4)]"></span>
        </div>
      </div>
    </article>
  );
}

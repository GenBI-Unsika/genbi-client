import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';

function AvatarStack({ size = 'md' }) {
  const [avatars, setAvatars] = useState([]);
  const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  const imgCls = `${sizeMap[size]} aspect-square shrink-0 rounded-full overflow-hidden object-cover ring-2 ring-white hover:motion-scale-out-110 motion-ease-spring-smooth hover:z-30`;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/public/hero-avatars', { method: 'GET', skipAuth: true });
        const items = json?.data?.avatars || json?.data || [];
        if (alive && Array.isArray(items) && items.length > 0) {
          setAvatars(items);
        } else {
          setAvatars([]);
        }
      } catch {
        if (alive) setAvatars([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (avatars.length === 0) return null;

  return (
    <div className="flex items-center -space-x-3 rtl:space-x-reverse isolate ">
      {avatars.map((src, i) => (
        <img key={i} src={typeof src === 'string' ? src : src.url || src.image} alt={`Anggota ${i + 1}`} className={imgCls} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-100/70 to-transparent" aria-hidden="true" />

        <div className="absolute -top-40 -right-24 h-[48rem] w-[48rem] rounded-full blur-3xl bg-gradient-to-br from-primary-200/80 via-primary-200/30 to-transparent" aria-hidden="true" />

        <div className="absolute -bottom-48 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl bg-gradient-to-tr from-primary-300/60 via-primary-200/20 to-transparent" aria-hidden="true" />

        <div
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(16,24,40,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.06)_1px,transparent_1px)] bg-[length:24px_24px] [mask-image:radial-gradient(60%_60%_at_75%_25%,black_40%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="absolute right-[-8rem] top-1/4 h-[28rem] w-[28rem] rounded-full border border-primary-300/60 [box-shadow:0_0_120px_40px_rgba(0,0,0,0.02)_inset]" aria-hidden="true" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-2 pb-8 sm:pb-10 md:pb-12 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center lg:h-[clamp(560px,70vh,820px)] xl:h-[clamp(640px,calc(100dvh-96px),640px)]">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            <h1 className="font-heading text-balance text-3xl md:text-5xl lg:text-6xl font-semibold text-primary-900 leading-tight animation-button motion-preset-slide-right motion-duration-1500">
              Tumbuh dan Berdampak Bagi Sesama Bersama GenBI Unsika
            </h1>

            <p className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl animation-button motion-preset-slide-right motion-duration-2000">
              Ayo, daftar Beasiswa GenBI Unsika sekarang dan raih kesempatan untuk mendukung perjalanan akademikmu.
            </p>

            {/* CTA + AvatarStack */}
            <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-4 sm:gap-5">
              <button
                className="btn-primary px-6 py-3 md:px-8 md:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0 self-center lg:self-start animation-button motion-preset-shrink motion-duration-1000"
                type="button"
              >
                Daftar Sekarang
              </button>

              {/* Divider hanya di sm+ */}
              <span className="hidden sm:block h-6 w-px bg-gray-300" aria-hidden="true" />

              <div className="flex items-center justify-center gap-3">
                <AvatarStack size="md" />
                <p className="text-sm sm:text-base text-gray-600 motion-preset-slide-right motion-duration-1000">
                  Lebih dari <span className="font-extrabold text-gray-900">500+</span> orang <span className="font-semibold">penerima manfaat.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          {/* <div className="relative aspect-[4/3] w-full isolate">
            <div className="absolute -top-10 right-135 w-20 h-20 bg-secondary-300 rounded-2xl z-1" aria-hidden="true"></div>
            <div className="absolute top-12 left-16 w-25 h-25 bg-secondary-400 rounded-3xl z-5" aria-hidden="true"></div>
            <div className="absolute -top-6 right-111 w-10 h-10 bg-secondary-300 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute top-43 right-134 w-10 h-10 bg-secondary-400 rounded-full z-3" aria-hidden="true"></div>
            <div className="absolute -top-10 right-63 w-80 h-60 bg-white rounded-xl opacity-70" aria-hidden="true"></div>
            <div className="absolute top-10 right-20 w-100 h-[497px] bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-400)] rounded-t-full z-4" aria-hidden="true"></div>
            <div className="absolute top-10 right-10 w-[420px] h-[497px] rounded-t-full z-50">
              <img src="./graduation-women.webp" alt="Mahasiswa GenBI UNSIKA merayakan kelulusan" className="absolute inset-0 w-full h-full object-fit" loading="eager" decoding="async" fetchpriority="high" />
            </div>

            <div
              className="absolute top-10 right-17 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-300 z-3"
              aria-hidden="true"
            />
            <div
              className="absolute top-10 right-14 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-200 z-3"
              aria-hidden="true"
            />
            <div
              className="absolute top-10 right-11 w-100 h-[497px] rounded-t-full
             border-[1px] border-primary-200 opacity-50 z-3"
              aria-hidden="true"
            />
          </div> */}
          <div className="relative hidden lg:flex h-full items-end justify-end ">
            <div className="relative w-full max-w-[600px] motion-preset-blur-right motion-duration-1000">
              <img src="./women-graduation.webp" alt="Mahasiswi GenBI UNSIKA merayakan kelulusan" className="block max-h-full w-auto object-contain " loading="eager" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

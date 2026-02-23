import { useState, useEffect } from "react";

import { apiFetch } from "../services/api.js";
import LoadableImage from "./shared/LoadableImage";

const defaultHeroContent = {
  headline: "Tumbuh dan Berdampak Bagi Sesama Bersama GenBI Unsika",
  subheadline:
    "Ayo, daftar Beasiswa GenBI Unsika sekarang dan raih kesempatan untuk mendukung perjalanan akademikmu.",
  ctaText: "Daftar Sekarang",
  statsText: "500+ penerima manfaat",
  heroImage: "",
};

function AvatarStack({ size = "md" }) {
  const [avatars, setAvatars] = useState([]);
  const sizeMap = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const imgCls = `${sizeMap[size]} aspect-square shrink-0 rounded-full overflow-hidden object-cover ring-2 ring-white transition-transform duration-300 ease-in-out hover:scale-110 hover:z-30 relative`;

  const isServerPlaceholderAvatar = (url) => {
    if (!url || typeof url !== "string") return false;
    // Example: https://ui-avatars.com/api/?name=User+1&background=random
    if (!url.includes("ui-avatars.com/api/")) return false;
    return /[?&]name=User(?:\+|%20)\d+\b/i.test(url);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch("/public/hero-avatars", {
          method: "GET",
          skipAuth: true,
        });
        const items = json?.data?.avatars || json?.data || [];
        if (alive && Array.isArray(items) && items.length > 0) {
          const processedAvatars = items.map((src) => {
            const url = typeof src === "string" ? src : src?.url || src?.image;
            if (!url || isServerPlaceholderAvatar(url)) {
              return null;
            }
            return url;
          });
          setAvatars(processedAvatars);
        } else {
          setAvatars([null, null, null]);
        }
      } catch {
        if (alive) setAvatars([null, null, null]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (avatars.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center -space-x-3 rtl:space-x-reverse isolate ">
      {avatars.map((src, i) =>
        src ? (
          <img
            key={i}
            src={src}
            alt={`Anggota ${i + 1}`}
            className={imgCls}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            key={i}
            className={`${sizeMap[size]} rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center shrink-0 transition-transform duration-300 ease-in-out hover:scale-110 hover:z-30 relative`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ),
      )}
    </div>
  );
}

const HeroSection = () => {
  const [content, setContent] = useState(defaultHeroContent);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch("/site-settings/cms_hero", {
          method: "GET",
          skipAuth: true,
        });
        const value = json?.data?.value;
        if (alive && value) {
          setContent({ ...defaultHeroContent, ...value });
        }
      } catch {
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const heroImgSrc = content.heroImage || "./women-graduation.webp";

  return (
    <section className="relative overflow-hidden bg-primary-50">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-100/70 to-transparent"
          aria-hidden="true"
        />

        <div
          className="absolute -top-40 -right-24 h-[48rem] w-[48rem] max-w-none rounded-full blur-3xl bg-gradient-to-br from-primary-200/80 via-primary-200/30 to-transparent"
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-48 -left-32 h-[42rem] w-[42rem] max-w-none rounded-full blur-3xl bg-gradient-to-tr from-primary-300/60 via-primary-200/20 to-transparent"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(16,24,40,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.06)_1px,transparent_1px)] bg-[length:24px_24px] [mask-image:radial-gradient(60%_60%_at_75%_25%,black_40%,transparent_70%)]"
          aria-hidden="true"
        />

        <div
          className="absolute right-[-8rem] top-1/4 h-[28rem] w-[28rem] max-w-none rounded-full border border-primary-300/60 [box-shadow:0_0_120px_40px_rgba(0,0,0,0.02)_inset]"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-10 pb-10 sm:pb-10 md:pb-12 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:h-[clamp(560px,70vh,820px)] xl:h-[clamp(640px,calc(100dvh-96px),640px)]">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 order-2 lg:order-1 relative z-10 motion-preset-fade motion-duration-1000">
            <h1 className="font-sans text-balance text-display font-extrabold text-primary-900 pb-2 motion-preset-slide-up motion-duration-1000">
              {content.headline}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed motion-preset-fade motion-duration-1000 motion-delay-500">
              {content.subheadline}
            </p>

            <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-4 sm:gap-5 motion-preset-fade motion-duration-1000 motion-delay-700">
              <button
                className="bg-primary-600 text-white font-semibold w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0 transition-all duration-300 ease-in-out hover:bg-primary-700 hover:scale-105 hover:-rotate-1"
                type="button"
                onClick={() => window.location.href = '/scholarship'}
              >
                {content.ctaText}
              </button>

              <span
                className="hidden sm:block h-6 w-px bg-gray-300"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <AvatarStack size="sm" />
                <p className="text-sm text-gray-600">
                  Lebih dari{" "}
                  <span className="font-bold text-gray-900">
                    {content.statsText}
                  </span>
                  <br className="hidden sm:block" />
                  <span className="font-medium"> penerima manfaat.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center lg:items-end lg:justify-end order-1 lg:order-2 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
            <div className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] motion-preset-blur-right motion-duration-1000">
              <LoadableImage
                src={heroImgSrc}
                alt="Mahasiswi GenBI UNSIKA merayakan kelulusan"
                className="block w-full h-auto object-contain drop-shadow-2xl"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

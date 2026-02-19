import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { apiFetch } from '../services/api.js';

// Default CMS content (fallback if API fails or returns null)
const defaultCtaContent = {
  text: 'Daftar Beasiswa Bank Indonesia Dan Bergabung Menjadi Anggota GenBI Unsika',
  buttonText: 'Daftar Sekarang',
};

const CTASection = () => {
  const [content, setContent] = useState(defaultCtaContent);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_cta', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) {
          setContent({ ...defaultCtaContent, ...value });
        }
      } catch {
        // Use defaults on error
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative z-20 pb-16 md:pb-0 md:-mb-18">
      <ScrollReveal as="div" once className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* CTA Card */}
          <div className="bg-[#01319F] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 sm:px-10 sm:py-6 lg:px-12">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 lg:gap-6">
                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-body-lg font-semibold text-white leading-snug">{content.text}</h3>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0">
                  <button
                    className="cursor-pointer w-full sm:w-auto bg-white text-[#01319F] px-5 py-2.5 sm:px-6 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 text-btn whitespace-nowrap"
                    onClick={() => {
                      navigate('/scholarship/register');
                    }}
                  >
                    {content.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default CTASection;

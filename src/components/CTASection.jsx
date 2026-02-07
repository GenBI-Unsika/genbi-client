import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { apiFetch } from '../services/api.js';

// Default CMS content (fallback if API fails or returns null)
const defaultCtaContent = {
  text: 'Daftar Beasiswa Bank Indonesia Dan Bergabung Menjadi Anggota GenBI Unsika',
  buttonText: 'Daftar Sekarang',
};

const CTASection = () => {
  const [content, setContent] = useState(defaultCtaContent);

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
    <ScrollReveal as="div" once className="relative z-10 -mb-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="bg-primary-500 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center items-center px-2 gap-6">
            <h3 className="text-md font-semibold text-white">{content.text}</h3>
            <button className="bg-white text-primary-500 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">{content.buttonText}</button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CTASection;

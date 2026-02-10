import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';
import ScrollReveal from './ScrollReveal';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const json = await apiFetch('/public/faqs', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setFaqs(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status !== 404) console.error('Failed to load FAQs:', e);
        setFaqs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <ScrollReveal as="section" className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-[#003D7A] text-2xl font-bold md:text-3xl">Pertanyaan Umum</h2>
        </div>

        {/* Accordion */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat FAQ...</div>
        ) : faqs.length === 0 ? (
          <div className="py-8">
            <EmptyState icon="files" title="Belum ada FAQ" description="Pertanyaan yang sering diajukan akan muncul di sini" variant="primary" />
          </div>
        ) : (
          <div className="w-full divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const itemId = `faq-item-${index}`;
              const collapseId = `faq-collapse-${index}`;
              const isOpen = openIndex === index;

              return (
                <div key={index} id={itemId} className="group">
                  <button
                    type="button"
                    className="w-full py-5 inline-flex items-center justify-between gap-4 text-start text-gray-800 hover:text-gray-900 transition-colors"
                    aria-controls={collapseId}
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                  >
                    <span className="text-base font-medium leading-relaxed pr-4">{faq.question}</span>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#0066CC] flex items-center justify-center transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                      <span className="icon-[tabler--plus] text-white size-4"></span>
                    </span>
                  </button>

                  <div id={collapseId} className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} aria-labelledby={itemId} role="region">
                    <div className="pb-5 pr-10">
                      <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};

export default FAQSection;

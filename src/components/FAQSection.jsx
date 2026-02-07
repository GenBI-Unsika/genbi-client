import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyStateImage from './EmptyStateImage';
import ScrollReveal from './ScrollReveal';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

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
    <ScrollReveal as="section" className="bg-base-100 py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-base-content text-2xl font-semibold md:text-3xl lg:text-4xl">Pertanyaan Umum</h2>
          <p className="text-base-content/80 text-xl">Jelajahi pertanyaan yang sering diajukan dan temukan informasi yang Anda butuhkan.</p>
        </div>

        {/* Accordion */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat FAQ...</div>
        ) : faqs.length === 0 ? (
          <div className="py-8">
            <EmptyStateImage
              image="https://illustrations.popsy.co/amber/remote-work.svg"
              imageAlt="No FAQs illustration"
              title="Belum ada FAQ"
              description="Pertanyaan yang sering diajukan akan muncul di sini"
              variant="primary"
              imageSize="lg"
            />
          </div>
        ) : (
          <div className="w-full divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((faq, index) => {
              const itemId = `faq-item-${index}`;
              const collapseId = `faq-collapse-${index}`;
              const isOpen = openIndex === index;

              return (
                <div key={index} id={itemId}>
                  <button
                    type="button"
                    className="w-full px-5 py-4 inline-flex items-center justify-between text-start font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
                    aria-controls={collapseId}
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                  >
                    <span>{faq.question}</span>
                    <span className={`icon-[tabler--plus] text-neutral-700 size-4.5 shrink-0 ${isOpen ? 'hidden' : 'block'}`}></span>
                    <span className={`icon-[tabler--minus] text-neutral-700 size-4.5 shrink-0 ${isOpen ? 'block' : 'hidden'}`}></span>
                  </button>

                  <div id={collapseId} className={`${isOpen ? 'block' : 'hidden'}`} aria-labelledby={itemId} role="region">
                    <div className="px-5 pb-4">
                      <p className="text-neutral-600">{faq.answer}</p>
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

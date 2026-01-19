import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyStateImage from './EmptyStateImage';
import ScrollReveal from './ScrollReveal';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* FlyonUI Accordion */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat FAQ...</div>
        ) : faqs.length === 0 ? (
          <div className="py-8">
            <EmptyStateImage
              image="https://illustrations.popsy.co/amber/question.svg"
              imageAlt="No FAQs illustration"
              title="Belum ada FAQ"
              description="Pertanyaan yang sering diajukan akan muncul di sini"
              variant="primary"
              imageSize="lg"
            />
          </div>
        ) : (
          <div className="accordion divide-neutral/20 w-full divide-y">
            {faqs.map((faq, index) => {
              const itemId = `faq-item-${index}`;
              const collapseId = `faq-collapse-${index}`;
              const isFirst = index === 1; // buka item pertama

              return (
                <div key={index} id={itemId} className={`accordion-item ${isFirst ? 'active' : ''}`}>
                  <button className="accordion-toggle inline-flex items-center justify-between text-start" aria-controls={collapseId} aria-expanded={isFirst ? 'true' : 'false'}>
                    {faq.question}
                    <span className="icon-[tabler--plus] accordion-item-active:hidden text-base-content block size-4.5 shrink-0"></span>
                    <span className="icon-[tabler--minus] accordion-item-active:block text-base-content hidden size-4.5 shrink-0"></span>
                  </button>

                  <div id={collapseId} className={`accordion-content w-full overflow-hidden transition-[height] duration-300 ${isFirst ? '' : 'hidden'}`} aria-labelledby={itemId} role="region">
                    <div className="px-5 pb-4">
                      <p className="text-base-content/80">{faq.answer}</p>
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

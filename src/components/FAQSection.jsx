import { useEffect, useState } from 'react';
import { DropdownIcon } from './icons/CustomIcons.jsx';
import { motion } from 'framer-motion';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';
import ScrollReveal from './ScrollReveal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

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
        if (e?.status !== 404) {  }
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
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal as="div" className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-2">Informasi</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Pertanyaan Umum</h2>
          <div className="w-12 h-1 rounded-full bg-primary-300 mt-3" />
        </ScrollReveal>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-5 animate-pulse flex items-center justify-between gap-4">
                <div className={`h-4 bg-gray-200 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'}`} />
                <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-8">
            <EmptyState icon="files" title="Belum ada FAQ" description="Pertanyaan yang sering diajukan akan muncul di sini" variant="primary" />
          </div>
        ) : (
          <ScrollReveal as="div" variants={containerVariants} className="w-full divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const itemId = `faq-item-${index}`;
              const collapseId = `faq-collapse-${index}`;
              const isOpen = openIndex === index;

              return (
                <motion.div variants={itemVariants} key={index} id={itemId} className="group">
                  <button
                    type="button"
                    className="w-full py-5 inline-flex items-center justify-between gap-4 text-start text-gray-800 hover:text-gray-900 transition-colors"
                    aria-controls={collapseId}
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                  >
                    <span className="text-base font-medium leading-relaxed pr-4">{faq.question}</span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <DropdownIcon className="w-4 h-4 text-white" />
                    </span>
                  </button>

                  <div id={collapseId} className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} aria-labelledby={itemId} role="region">
                    <div className="pb-5 pr-4 sm:pr-10">
                      <p className="text-body text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

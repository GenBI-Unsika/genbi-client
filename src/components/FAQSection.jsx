const FAQSection = () => {
  const faqs = [
    {
      question:
        "Apakah setiap lulusan mahasiswa Bank Indonesia wajib mengikuti kegiatan GenBI?",
      answer:
        "Ya, setiap penerima beasiswa Bank Indonesia diharapkan untuk aktif dalam kegiatan GenBI sebagai bagian dari komitmen pengembangan diri dan kontribusi kepada masyarakat.",
    },
    {
      question: "Bagaimana cara mendaftar menjadi anggota GenBI?",
      answer:
        "Untuk menjadi anggota GenBI, Anda harus terlebih dahulu menjadi penerima beasiswa Bank Indonesia melalui seleksi yang diadakan secara berkala.",
    },
    {
      question: "Apakah setiap mahasiswa dapat mengikuti kegiatan GenBI?",
      answer:
        "Kegiatan GenBI terbuka untuk umum, namun keanggotaan penuh hanya untuk penerima beasiswa Bank Indonesia.",
    },
    {
      question:
        "Apakah setiap mahasiswa dapat berpartisipasi dalam kegiatan GenBI?",
      answer:
        "Ya, mahasiswa non-GenBI dapat berpartisipasi dalam berbagai kegiatan yang bersifat terbuka dan umum.",
    },
  ];

  return (
    <section className="bg-base-100 py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-base-content text-2xl font-semibold md:text-3xl lg:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="text-base-content/80 text-xl">
            Jelajahi pertanyaan yang sering diajukan dan temukan informasi yang
            Anda butuhkan.
          </p>
        </div>

        {/* FlyonUI Accordion */}
        <div className="accordion divide-neutral/20 w-full divide-y">
          {faqs.map((faq, index) => {
            const itemId = `faq-item-${index}`;
            const collapseId = `faq-collapse-${index}`;
            const isFirst = index === 1; // buka item pertama

            return (
              <div
                key={index}
                id={itemId}
                className={`accordion-item ${isFirst ? "active" : ""}`}
              >
                <button
                  className="accordion-toggle inline-flex items-center justify-between text-start"
                  aria-controls={collapseId}
                  aria-expanded={isFirst ? "true" : "false"}
                >
                  {faq.question}
                  <span className="icon-[tabler--plus] accordion-item-active:hidden text-base-content block size-4.5 shrink-0"></span>
                  <span className="icon-[tabler--minus] accordion-item-active:block text-base-content hidden size-4.5 shrink-0"></span>
                </button>

                <div
                  id={collapseId}
                  className={`accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                    isFirst ? "" : "hidden"
                  }`}
                  aria-labelledby={itemId}
                  role="region"
                >
                  <div className="px-5 pb-4">
                    <p className="text-base-content/80">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

const FAQSection = () => {
  const faqs = [
    {
      question: "Apakah setiap lulusan mahasiswa Bank Indonesia wajib mengikuti kegiatan GenBI?",
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
      question: "Apakah setiap mahasiswa dapat berpartisipasi dalam kegiatan GenBI?",
      answer: "Ya, mahasiswa non-GenBI dapat berpartisipasi dalam berbagai kegiatan yang bersifat terbuka dan umum.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Pertanyaan Umum</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                  <button className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection

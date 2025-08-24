const ArticlesSection = () => {
  const articles = [
    {
      title: "Menyambut Tantangan Baru di Era Digital",
      excerpt: "Bagaimana GenBI Unsika mempersiapkan diri menghadapi tantangan era digital...",
      image: "/digital-technology-students.png",
      date: "15 Des 2023",
      readTime: "5 min read",
    },
    {
      title: "Tips & Trik: Sukses Studi di Perguruan Tinggi",
      excerpt: "Strategi efektif untuk meraih prestasi akademik yang gemilang...",
      image: "/students-studying-success-tips.png",
      date: "12 Des 2023",
      readTime: "7 min read",
    },
    {
      title: "Membangun Digital Ecosystem Terintegrasi",
      excerpt: "Pentingnya membangun ekosistem digital yang terintegrasi untuk kemajuan...",
      image: "/digital-ecosystem-integration.png",
      date: "10 Des 2023",
      readTime: "6 min read",
    },
    {
      title: "GenBI dan Pemberdayaan Masyarakat",
      excerpt: "Peran GenBI dalam memberdayakan masyarakat melalui berbagai program...",
      image: "/community-empowerment-program.png",
      date: "8 Des 2023",
      readTime: "4 min read",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary-900">Artikel</h2>
          <button className="text-primary-500 hover:text-primary-600 font-medium">Lihat Lainnya →</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <button className="mt-3 text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArticlesSection

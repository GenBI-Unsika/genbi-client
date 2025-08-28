import { Calendar, Clock, ArrowRight } from 'lucide-react';

const ArticlesSection = () => {
  const articles = [
    {
      title: 'Menyambut Tantangan Baru di Era Digital',
      excerpt: 'Bagaimana GenBI Unsika mempersiapkan diri menghadapi tantangan era digital...',
      image: '/digital-technology-students.png',
      date: '15 Des 2023',
      readTime: '5 min read',
    },
    {
      title: 'Tips & Trik: Sukses Studi di Perguruan Tinggi',
      excerpt: 'Strategi efektif untuk meraih prestasi akademik yang gemilang...',
      image: '/students-studying-success-tips.png',
      date: '12 Des 2023',
      readTime: '7 min read',
    },
    {
      title: 'Membangun Digital Ecosystem Terintegrasi',
      excerpt: 'Pentingnya membangun ekosistem digital yang terintegrasi untuk kemajuan...',
      image: '/digital-ecosystem-integration.png',
      date: '10 Des 2023',
      readTime: '6 min read',
    },
    {
      title: 'GenBI dan Pemberdayaan Masyarakat',
      excerpt: 'Peran GenBI dalam memberdayakan masyarakat melalui berbagai program...',
      image: '/community-empowerment-program.png',
      date: '8 Des 2023',
      readTime: '4 min read',
    },
  ];

  const placeholder = 'https://placehold.co/800x500';

  return (
    <section className="bg-white">
      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-tl-[72px] xl:rounded-tl-[100px] md:rounded-br-[72px] xl:rounded-br-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary-600">Artikel</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium">Lihat Lainnya →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article, index) => (
              <article key={index} className="bg-white rounded-xl overflow-hidden border border-[#F3F5F9] shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                {/* Media */}
                <div className="relative">
                  <div className="w-full aspect-[16/10] bg-gray-100">
                    <img
                      src={article.image || placeholder}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = placeholder;
                      }}
                    />
                  </div>

                  {/* Badge ala desain lampiran (pojok kanan atas) */}
                  <span className="absolute top-3 right-3 bg-[#E3EEFC] text-[#01319F] text-xs font-medium px-2 py-1 rounded-md leading-none">New</span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold text-neutral-800 mb-1 leading-snug line-clamp-2">{article.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>

                  {/* Meta */}
                  <div className="mt-0.5 flex items-center gap-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {article.date}
                    </span>
                  </div>

                  {/* CTA bar di bawah sesuai kartu lampiran */}
                  <div className="mt-auto pt-3">
                    <button className="w-full inline-flex items-center justify-center bg-[#F3F5F9] text-[#01319F] text-sm font-medium rounded-lg px-3 py-2 group">
                      <span className="group-hover:underline">Baca selengkapnya</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

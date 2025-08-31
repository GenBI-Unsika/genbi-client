import ArticleCard from './cards/ArticleCard';

const ArticlesSection = () => {
  const articles = [
    {
      title: 'Menyambut Tantangan Baru di Era Digital',
      excerpt: 'Bagaimana GenBI Unsika mempersiapkan diri menghadapi tantangan era digital...',
      image: '/digital-technology-students.png',
      date: '15 Des 2023',
      readTime: '5 min read',
      badge: 'New',
      href: '/articles/menyambut-tantangan-baru',
    },
    {
      title: 'Tips & Trik: Sukses Studi di Perguruan Tinggi',
      excerpt: 'Strategi efektif untuk meraih prestasi akademik yang gemilang...',
      image: '/students-studying-success-tips.png',
      date: '12 Des 2023',
      readTime: '7 min read',
      href: '/articles/tips-trik-sukses-studi',
    },
    {
      title: 'Membangun Digital Ecosystem Terintegrasi',
      excerpt: 'Pentingnya membangun ekosistem digital yang terintegrasi untuk kemajuan...',
      image: '/digital-ecosystem-integration.png',
      date: '10 Des 2023',
      readTime: '6 min read',
      href: '/articles/digital-ecosystem',
    },
    {
      title: 'GenBI dan Pemberdayaan Masyarakat',
      excerpt: 'Peran GenBI dalam memberdayakan masyarakat melalui berbagai program...',
      image: '/community-empowerment-program.png',
      date: '8 Des 2023',
      readTime: '4 min read',
      href: '/articles/genbi-pemberdayaan-masyarakat',
    },
  ];

  return (
    <section className="bg-white">
      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-tl-[72px] xl:rounded-tl-[100px] md:rounded-br-[72px] xl:rounded-br-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary-600">Artikel</h2>
            <a href="/articles" className="text-primary-600 hover:text-primary-700 font-medium">
              Lihat Lainnya →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((a, i) => (
              <ArticleCard key={i} {...a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

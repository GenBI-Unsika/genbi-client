import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from '../components/cards/ArticleCard';

const ArticlesPage = () => {
  const articles = [
    { id: 1, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '12 Jan 2025', badge: 'New', readTime: '5 min read', image: '' },
    { id: 2, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '05 Jan 2025', readTime: '6 min read', image: '' },
    { id: 3, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '22 Des 2024', readTime: '7 min read', image: '' },
    { id: 4, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '20 Des 2024', badge: 'New', readTime: '4 min read', image: '' },
    { id: 5, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '10 Des 2024', readTime: '5 min read', image: '' },
    { id: 6, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '01 Des 2024', readTime: '8 min read', image: '' },
    { id: 7, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '25 Nov 2024', badge: 'New', readTime: '6 min read', image: '' },
    { id: 8, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '15 Nov 2024', readTime: '5 min read', image: '' },
    { id: 9, title: 'Judul Artikel', description: 'Lorem ipsum dolor sit amet consectetur...', date: '01 Nov 2024', readTime: '9 min read', image: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Apa Yang Baru Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              title={a.title}
              excerpt={a.description} // map ke prop kartu
              date={a.date}
              badge={a.badge}
              readTime={a.readTime}
              image={a.image || undefined}
              to={`/articles/${a.id}`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50" aria-label="Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50" aria-label="Berikutnya">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

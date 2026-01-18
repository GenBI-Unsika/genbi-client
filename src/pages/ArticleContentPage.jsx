import { ChevronRight } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const ArticleContentPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-primary-600 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('articles')} className="hover:text-primary-600 transition-colors">
            Artikel
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Judul Artikel</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Artikel</h1>
          <div className="text-sm text-gray-500 mb-6">
            <span className="font-medium">GenBI Unsika</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <MediaPlaceholder ratio="16/9" label="Gambar Utama Artikel" />
          <p className="text-center text-xs text-gray-500 mt-2">Sumber : Source Pic</p>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 transform hover:shadow-md transition-shadow duration-300">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">Konten artikel akan ditampilkan dari backend setelah endpoint artikel tersedia.</p>
          </div>
        </article>

        {/* References Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transform hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Referensi</h2>
          <div className="text-sm text-gray-700">Referensi akan ditampilkan dari backend.</div>
        </section>
      </div>
    </div>
  );
};

export default ArticleContentPage;

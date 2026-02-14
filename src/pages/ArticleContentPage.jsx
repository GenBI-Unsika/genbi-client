import { ChevronRight } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const ArticleContentPage = ({ onNavigate, article }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
          <button onClick={() => onNavigate?.('home')} className="hover:text-blue-600 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button onClick={() => onNavigate?.('articles')} className="hover:text-blue-600 transition-colors">
            Artikel
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-800 font-medium">{article?.title ?? 'Judul Artikel'}</span>
        </nav>

        {/* Article Title */}
        <h1 className="text-h1 font-bold text-gray-900 leading-tight mb-4">{article?.title}</h1>

        {/* Author & Date */}
        <div className="flex flex-col gap-0.5 mb-6">
          <span className="text-body-sm font-semibold text-gray-700">{article?.author}</span>
          <span className="meta-text">{article?.date}</span>
        </div>

        {/* Featured Image */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          {article?.image ? <img src={article.image} alt={article.title} className="w-full object-cover" /> : <MediaPlaceholder ratio="16/9" label="Gambar Utama Artikel" />}
          {article?.imageSource && <p className="text-center text-xs text-gray-400 py-2 border-t border-gray-100">Sumber : {article.imageSource}</p>}
        </div>

        {/* Article Body */}
        <article className="text-gray-700 text-sm leading-relaxed mb-10 space-y-4">{article?.content}</article>

        {/* References */}
        {article?.references?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Referensi</h2>
            <div className="space-y-3 text-sm text-gray-700">
              {article.references.map((ref, i) => (
                <p key={i} className="leading-relaxed">
                  {ref.text}{' '}
                  {ref.url && (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                      {ref.url}
                    </a>
                  )}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticleContentPage;

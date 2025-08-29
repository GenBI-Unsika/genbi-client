import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ArticlesPage = () => {
  const articles = [
    {
      id: 1,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
      badge: "New",
    },
    {
      id: 2,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
    {
      id: 3,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
    {
      id: 4,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
      badge: "New",
    },
    {
      id: 5,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
    {
      id: 6,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
    {
      id: 7,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
      badge: "New",
    },
    {
      id: 8,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
    {
      id: 9,
      title: "Judul Artikel",
      description:
        "Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turp...",
      date: "Date",
    },
  ];

  const ArticleCard = ({ article }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </div>
            <div className="w-16 h-2 bg-white bg-opacity-50 rounded mx-auto mb-1"></div>
            <div className="w-12 h-2 bg-white bg-opacity-30 rounded mx-auto"></div>
          </div>
        </div>
        {article.badge && (
          <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
            {article.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {article.description}
        </p>
        <div className="text-xs text-gray-500">{article.date}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Yang Baru Di GenBI Unsika
          </h1>
          <p className="text-gray-600 text-lg">
            Temukan hal baru dan menarik dari seluruh kegiatan kami
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

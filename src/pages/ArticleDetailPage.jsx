import { ChevronRight, MapPin, Calendar, Clock } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const ArticleDetailPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-primary-600 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('proker')} className="hover:text-primary-600 transition-colors">
            Aktivitas
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('proker')} className="hover:text-primary-600 transition-colors">
            Proker
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Genbi Peduli Pesisir Pantai</span>
        </nav>

        {/* GenBI News Badge */}
        <div className="flex justify-end mb-6">
          <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium text-sm">GenBI News</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Genbi Peduli Pesisir Pantai</h1>
          <p className="text-lg text-gray-600 mb-4">"Save The Coast: Greening The Coast, Sustaining The Life"</p>
          <div className="text-sm text-gray-500">Dipublikasikan pada 29 Februari 2024</div>
        </header>

        {/* Article Content */}
        <article className="mb-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">GenBI: Energi Untuk Negeri</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Melihat bencana alam yang kian sering terjadi di beberapa daerah, membuat GenBI Unsika tergerak untuk peduli terhadap kondisi lingkungan, khususnya di daerah Karawang. Dengan mengangkat tema "Save The Coast: Greening The
                  Coast, Sustaining The Life", GenBI Unsika mengadakan program kerja GenBI Peduli Pesisir Pantai di Wisata Mangrove Karawang, Desa Cilebar yang bertujuan untuk memelihara garis pantai agar tetap stabil dan menahan arus air
                  laut yang dapat mengikis daratan pantai. Membantu perekonomian masyarakat sekitar pantai, kawasan mangrove yang nantinya akan dimanfaatkan masyarakat untuk
                </p>
              </div>

              <div className="lg:col-span-1">
                <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" className="rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" className="rounded-lg" />
              </div>

              <div className="lg:col-span-2">
                <p className="text-gray-700 leading-relaxed">
                  wilayah tambak, penelitian, maupun dijadikan tempat pariwisata. Selain itu, juga bisa membantu memelihara ekosistem pantai dan sebagai tempat berlindung berbagai macam satwa air, serta menumbuhkan kesadaran masyarakat
                  untuk tetap menjaga kelestarian hutan mangrove. Seluruh anggota GenBI Unsika bersama dengan kelompok sadar wisata Sukamulya dan beberapa warga desa Cilebar melakukan penanaman 200 tunas mangrove secara bersama-sama.
                  Setelah itu, anggota GenBI Unsika juga melakukan kegiatan GenBI Clean Up, yaitu dengan membersihkan sampah di lingkungan di sektor pesisir pantai.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Documentation Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Dokumentasi Kegiatan</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MediaPlaceholder key={i} ratio="4/3" label={`Dokumentasi ${i + 1}`} className="cursor-pointer hover:scale-110" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticleDetailPage;

import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProkerCard from '../components/cards/ProkerCard';

const ProkerPage = () => {
  const programs = [
    { id: 1, title: 'Nama Program', subtitle: 'Deskripsi singkat', date: '2025-02-10', badge: 'Terbaru', image: 'https://placehold.co/800x450', category: 'Kewirausahaan', href: '/proker/1' },
    { id: 2, title: 'Nama Program', subtitle: 'Deskripsi singkat', date: '2025-03-02', image: 'https://placehold.co/800x450', category: 'Lingkungan', href: '/proker/2' },
    { id: 3, title: 'Nama Program', subtitle: 'Deskripsi singkat', date: '2025-03-15', image: 'https://placehold.co/800x450', category: 'Edukasi', href: '/proker/3' },
    // ...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Proker Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((p) => (
            <ProkerCard key={p.id} {...p} />
          ))}
        </div>

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

export default ProkerPage;

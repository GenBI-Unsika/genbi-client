import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '../components/cards/EventCard';

const EventsPage = () => {
  const events = [
    { id: 1, title: 'Nama Event', subtitle: 'Deskripsi singkat', date: '2025-01-20', badge: 'Terbaru', image: 'https://placehold.co/800x450', category: 'Event', href: '/events/1' },
    { id: 2, title: 'Nama Event', subtitle: 'Deskripsi singkat', date: '2025-02-10', image: 'https://placehold.co/800x450', category: 'Seminar', href: '/events/2' },
    { id: 3, title: 'Nama Event', subtitle: 'Deskripsi singkat', date: '2025-03-05', image: 'https://placehold.co/800x450', category: 'Workshop', href: '/events/3' },
    // ...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((e) => (
            <EventCard key={e.id} {...e} />
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

export default EventsPage;

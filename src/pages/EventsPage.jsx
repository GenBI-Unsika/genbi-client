import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EventCard from '../components/cards/EventCard';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);
        const json = await apiFetch('/public/events', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setEvents(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setEvents([]);
          return;
        }
        const msg = e?.message || 'Gagal memuat event';
        toast.error(msg);
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? <div className="text-gray-500">Memuat...</div> : null}
          {!loading && !error && events.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon="calendar" title="Belum ada event" description="Event akan muncul di sini." />
            </div>
          ) : null}
          {events.map((e) => (
            <EventCard key={e.id || e.slug || e.title} {...e} />
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

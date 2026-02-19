import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventCard from '../components/cards/EventCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/shared/Pagination';
import { apiFetch } from '../services/api.js';

const LIMIT = 9;

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialSortBy = searchParams.get('sortBy') || 'startDate';
  const initialSortOrder = searchParams.get('sortOrder') || 'asc';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    // Sync state with URL if URL changes externally (e.g. back button)
    const p = Number(searchParams.get('page')) || 1;
    if (p !== page) setPage(p);
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: String(newPage), sortBy, sortOrder });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const [newSort, newOrder] = e.target.value.split('-');
    setSortBy(newSort);
    setSortOrder(newOrder);
    setPage(1);
    setSearchParams({ page: '1', sortBy: newSort, sortOrder: newOrder });
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(LIMIT));
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);

        const json = await apiFetch(`/public/events?${params.toString()}`, { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        const meta = json?.data?.meta || json?.meta;

        if (alive) {
          setEvents(Array.isArray(items) ? items : []);
          setTotalPages(meta?.totalPages ? Number(meta.totalPages) : 1);
        }
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
  }, [page, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="page-title mb-4">Event Kami</h1>
            <p className="section-subtitle">Ikuti berbagai kegiatan seru dan bermanfaat</p>
          </div>

          <div className="flex gap-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="startDate-asc">Terdekat</option>
              <option value="startDate-desc">Terlama</option>
              <option value="title-asc">Judul (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse">
                <div className="h-44 w-full bg-gray-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-4/5 bg-gray-200 rounded" />
                  <div className="h-3.5 w-full bg-gray-100 rounded" />
                  <div className="h-3.5 w-3/4 bg-gray-100 rounded" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
                  </div>
                </div>
              </div>
            ))
          ) : null}
          {!loading && !error && events.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon="calendar" title="Belum ada event" description="Event dan kegiatan akan muncul di sini" variant="default" />
            </div>
          ) : null}
          {events.map((e) => (
            <EventCard key={e.id || e.slug || e.title} {...e} />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

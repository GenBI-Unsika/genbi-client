import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProkerCard from '../components/cards/ProkerCard';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';

const ProkerPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);
        const json = await apiFetch('/public/programs', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setPrograms(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setPrograms([]);
          return;
        }
        const msg = e?.message || 'Gagal memuat proker';
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Proker Di GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Temukan hal baru dan menarik dari seluruh kegiatan kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? <div className="text-gray-500">Memuat...</div> : null}
          {!loading && !error && programs.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon="clipboard" title="Belum ada proker" description="Program kerja akan muncul di sini setelah dipublikasikan" variant="default" />
            </div>
          ) : null}
          {programs.map((p) => (
            <ProkerCard key={p.id || p.slug || p.title} {...p} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <button className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Berikutnya">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProkerPage;

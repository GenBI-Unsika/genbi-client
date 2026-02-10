import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { formatDateID } from '../utils/formatters';


const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState('beasiswa');
  const [scholarshipData, setScholarshipData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fallbackImage = `${import.meta.env.BASE_URL}genbi-unsika.webp`;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);

        // NOTE: Endpoint activity history belum tersedia di backend saat ini.
        const [sch, evt] = await Promise.all([
          apiFetch('/me/scholarships', { method: 'GET' }).catch((e) => (e?.status === 404 ? { data: [] } : Promise.reject(e))),
          apiFetch('/me/events', { method: 'GET' }).catch((e) => (e?.status === 404 ? { data: [] } : Promise.reject(e))),
        ]);

        const schItems = sch?.data?.items || sch?.data || [];
        const evtItems = evt?.data?.items || evt?.data || [];
        if (!alive) return;
        setScholarshipData(Array.isArray(schItems) ? schItems : []);
        setEventData(Array.isArray(evtItems) ? evtItems : []);
      } catch (e) {
        if (!alive) return;
        const msg = e?.message || 'Gagal memuat aktivitas';
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
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Riwayat Aktivitas</h2>

      {/* Tab */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('beasiswa')} className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'beasiswa' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Beasiswa
        </button>
        <button onClick={() => setActiveTab('event')} className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'event' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Event
        </button>
      </div>

      {/* Konten */}
      <div className="space-y-6">
        {activeTab === 'beasiswa' && (
          <>
            {loading ? <div className="text-gray-500">Memuat...</div> : null}
            {!loading && !error && scholarshipData.length === 0 ? (
              <EmptyState
                icon="files"
                title="Belum ada riwayat beasiswa"
                description="Riwayat beasiswa Anda akan muncul di sini"
                variant="primary"
              />
            ) : null}
            {scholarshipData.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={item.logo || fallbackImage} alt="Logo" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.period}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.statusColor || 'bg-gray-100 text-gray-800'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'event' && (
          <>
            {loading ? <div className="text-gray-500">Memuat...</div> : null}
            {!loading && !error && eventData.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="Belum ada riwayat event"
                description="Riwayat event Anda akan muncul di sini"
                variant="primary"
              />
            ) : null}
            {eventData.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg">
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image || fallbackImage} alt="Event" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.location} | {formatDateID(item.date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.statusColor || 'bg-gray-100 text-gray-800'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch, scholarshipGetMyApplication } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { formatDateID } from '../utils/formatters';

function statusPillClass(tone) {
  if (tone === 'success') return 'bg-emerald-100 text-emerald-800';
  if (tone === 'danger') return 'bg-red-100 text-red-800';
  if (tone === 'info') return 'bg-primary-50 text-primary-700';
  return 'bg-gray-100 text-gray-800';
}

function buildScholarshipHistory(app) {
  if (!app) return [];

  const baseTitle = 'Beasiswa GenBI Unsika';
  const progress = ['Diajukan'];

  const isPassAdmin = app.administrasiStatus === 'LOLOS_ADMINISTRASI';
  const isFailAdmin = app.administrasiStatus === 'ADMINISTRASI_DITOLAK';
  const isWaitAdmin = app.administrasiStatus === 'MENUNGGU_VERIFIKASI' || !app.administrasiStatus;

  if (isPassAdmin) progress.push('Lolos Administrasi');
  else if (isFailAdmin) progress.push('Administrasi Ditolak');
  else if (isWaitAdmin) progress.push('Menunggu Verifikasi');

  const hasSchedule = app.interviewStatus === 'DIJADWALKAN' || Boolean(app.interviewDate) || Boolean(app.interviewTime);
  if (hasSchedule && isPassAdmin) progress.push('Dijadwalkan');

  const isPassInterview = app.interviewStatus === 'LOLOS_WAWANCARA';
  const isFailInterview = app.interviewStatus === 'GAGAL_WAWANCARA';
  if (isPassInterview) progress.push('Lolos Wawancara');
  else if (isFailInterview) progress.push('Tidak Lolos Wawancara');

  let status = 'Diajukan';
  let tone = 'info';
  if (isFailInterview) {
    status = 'Tidak Lolos Wawancara';
    tone = 'danger';
  } else if (isPassInterview) {
    status = 'Lolos Wawancara';
    tone = 'success';
  } else if (hasSchedule && isPassAdmin) {
    status = 'Dijadwalkan';
    tone = 'info';
  } else if (isFailAdmin) {
    status = 'Administrasi Ditolak';
    tone = 'danger';
  } else if (isPassAdmin) {
    status = 'Lolos Administrasi';
    tone = 'success';
  } else if (isWaitAdmin) {
    status = 'Diajukan';
    tone = 'info';
  }

  const fallbackYear = app.submittedAt ? new Date(app.submittedAt).getFullYear() : new Date().getFullYear();
  const periodYear = app.year ?? fallbackYear;
  const periodText = `Periode: ${periodYear} Batch ${app.batch || 1}`;

  const fullPeriod = periodText;

  return [
    {
      id: `sch-latest-${app.id}`,
      title: baseTitle,
      period: fullPeriod,
      status,
      statusColor: statusPillClass(tone),
    },
  ];
}

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

        const [app, evt] = await Promise.all([
          scholarshipGetMyApplication().catch((e) => (e?.status === 404 ? null : Promise.reject(e))),
          apiFetch('/me/events', { method: 'GET' }).catch((e) => (e?.status === 404 ? { data: [] } : Promise.reject(e))),
        ]);

        const schItems = buildScholarshipHistory(app);
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
    <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-h2 font-bold text-gray-900 mb-6 sm:mb-8">Riwayat Aktivitas</h2>

      <div className="flex gap-4 sm:gap-8 mb-6 sm:mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('beasiswa')} className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'beasiswa' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Beasiswa
        </button>
        <button onClick={() => setActiveTab('event')} className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'event' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Event
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'beasiswa' && (
          <>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 border border-gray-200 rounded-lg animate-pulse">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              ))
            ) : null}
            {!loading && !error && scholarshipData.length === 0 ? <EmptyState icon="files" title="Belum ada riwayat beasiswa" description="Riwayat beasiswa Anda akan muncul di sini" variant="primary" /> : null}
            {scholarshipData.map((item) => (
              <Link
                key={item.id}
                to="/scholarship/selection/admin"
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label={`Lihat status beasiswa: ${item.title}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src={item.logo || fallbackImage} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.period}</p>
                </div>
                <div className="sm:text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.statusColor || 'bg-gray-100 text-gray-800'}`}>{item.status}</span>
                </div>
              </Link>
            ))}
          </>
        )}

        {activeTab === 'event' && (
          <>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 border border-gray-200 rounded-lg animate-pulse">
                  <div className="w-full sm:w-20 h-20 sm:h-16 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              ))
            ) : null}
            {!loading && !error && eventData.length === 0 ? <EmptyState icon="calendar" title="Belum ada riwayat event" description="Riwayat event Anda akan muncul di sini" variant="primary" /> : null}
            {eventData.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 border border-gray-200 rounded-lg">
                <div className="w-full sm:w-20 h-32 sm:h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image || fallbackImage} alt="Event" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.location} | {formatDateID(item.date)}
                  </p>
                </div>
                <div className="sm:text-right">
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

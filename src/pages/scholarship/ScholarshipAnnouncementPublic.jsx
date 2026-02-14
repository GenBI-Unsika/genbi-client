import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { apiFetch } from '../../services/api.js';

function periodLabelFrom({ year, batch }) {
  const y = Number(year);
  const b = Number(batch);
  const hasYear = Number.isInteger(y) && y > 2000;
  const hasBatch = Number.isInteger(b) && b > 0;
  const range = hasYear ? `${y}-${y + 1}` : '';
  if (range && hasBatch) return `Periode ${range} (Batch ${b})`;
  if (range) return `Periode ${range}`;
  if (hasBatch) return `Batch ${b}`;
  return '';
}

function announcementState({ administrasiStatus, interviewStatus }) {
  const passed = administrasiStatus === 'LOLOS_ADMINISTRASI' && interviewStatus === 'LOLOS_WAWANCARA';
  const failed = administrasiStatus === 'ADMINISTRASI_DITOLAK' || interviewStatus === 'GAGAL_WAWANCARA';
  return { passed, failed, pending: !passed && !failed };
}

export default function ScholarshipAnnouncementPublic() {
  const [searchParams] = useSearchParams();
  const token = String(searchParams.get('t') || '').trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const publicUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        setData(null);

        if (!token) {
          setError('Link pengumuman tidak valid (token kosong).');
          return;
        }

        const json = await apiFetch(`/public/scholarship-announcement?t=${encodeURIComponent(token)}`, {
          method: 'GET',
          skipAuth: true,
        });

        if (!alive) return;
        setData(json?.data || null);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Gagal memuat pengumuman.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  const periodLabel = useMemo(() => periodLabelFrom({ year: data?.year, batch: data?.batch }), [data?.year, data?.batch]);
  const state = useMemo(() => announcementState({ administrasiStatus: data?.administrasiStatus, interviewStatus: data?.interviewStatus }), [data?.administrasiStatus, data?.interviewStatus]);

  const theme = useMemo(() => {
    if (state.passed) return {
      main: 'bg-white',
      banner: 'bg-emerald-600',
      textAccent: 'text-emerald-900',
      badge: 'bg-emerald-600',
      label: 'Selamat! Anda Dinyatakan Lulus Seleksi Beasiswa'
    };
    if (state.failed) return {
      main: 'bg-white',
      banner: 'bg-red-700',
      textAccent: 'text-red-900',
      badge: 'bg-red-600',
      label: 'Mohon Maaf, Anda Dinyatakan Tidak Lolos Seleksi Beasiswa'
    };
    return {
      main: 'bg-white',
      banner: 'bg-slate-700',
      textAccent: 'text-slate-900',
      badge: 'bg-slate-600',
      label: 'Pengumuman Seleksi Beasiswa'
    };
  }, [state]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4" />
        <p className="text-slate-600 font-semibold">Memverifikasi Link...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h3>
        <p className="text-slate-500 mb-6">{error || 'Data pengumuman tidak ditemukan.'}</p>
        <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Coba Lagi</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-6 lg:p-8">

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col items-center">

        {/* The Card */}
        <div className="w-full bg-white rounded-none sm:rounded-xl overflow-hidden shadow-none sm:shadow-xl flex flex-col border-x-0 sm:border border-slate-200">

          {/* Header Section: Banner with Logo */}
          <div className={`${theme.banner} px-6 py-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
            {/* Background Decorative Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />

            <div className="relative z-10 text-center sm:text-left flex-1">
              <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-black leading-tight max-w-4xl uppercase">
                {theme.label} {data?.year || new Date().getFullYear()}
              </h1>
              <p className="text-white/80 text-[10px] sm:text-xs font-bold mt-1 uppercase">{periodLabel}</p>
            </div>

            {/* Logo Integration */}
            <div className="relative z-10 bg-white p-2 rounded-xl shadow-lg border border-white/20">
              <img
                src="/genbi-unsika.webp"
                alt="GenBI Unsika Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Body Section: Identification */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">

            {/* Left Section: Personal Details */}
            <div className="flex-1 space-y-6 w-full">
              {/* Secondary ID Label */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase">
                  Identitas NPM: {data?.npm}
                </div>
              </div>

              {/* Name Section - Extreme Highlight */}
              <div className="space-y-1">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${theme.textAccent} leading-tight`}>
                  {data?.name || '-'}
                </h2>
                <div className="space-y-0.5">
                  <p className="text-base sm:text-lg font-bold text-slate-700 uppercase">
                    {data?.studyProgram?.name || '-'}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-400 uppercase">
                    {data?.faculty?.name || '-'}
                  </p>
                </div>
              </div>

              {/* Data Grid for secondary info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-400 font-black text-[10px] uppercase block">Status Kelulusan</label>
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${theme.badge} animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]`}></div>
                    <span className="text-base font-black text-slate-900">
                      {state.passed ? 'Lolos Seleksi' : state.failed ? 'Tidak Lolos' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-black text-[10px] uppercase block">Tanggal Pengumuman</label>
                  <p className="text-base font-black text-slate-900">
                    {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: QR Security Box */}
            <div className="w-fit flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                  <QRCodeCanvas
                    value={publicUrl}
                    size={140}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Alert Text */}
          <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-4xl">
              Status penerimaan Anda sebagai penerima beasiswa akan ditetapkan setelah pihak penyelenggara melakukan verifikasi data akademik dan berkas fisik. Segala bentuk pemalsuan data akan ditindak tegas sesuai hukum yang berlaku. Keep your digital pass secure.
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { GraduationCap, Building2, AlertCircle } from 'lucide-react';
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
  const [qrSize, setQrSize] = useState(110);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setQrSize(220);
      } else if (window.innerWidth >= 640) {
        setQrSize(180);
      } else {
        setQrSize(145);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="h-screen h-[100dvh] relative flex items-center justify-center p-3 sm:p-4 lg:p-8 font-sans antialiased selection:bg-primary-100 selection:text-primary-900 overflow-hidden">

      <div className="fixed inset-0 bg-slate-950">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover filter grayscale brightness-[0.6] contrast-[1.1]"
          style={{ backgroundImage: 'url(/unsika.jpg)' }}
        />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center relative z-10 lg:h-full lg:justify-center">

        <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] border-0 sm:border border-white overflow-hidden flex flex-col max-h-full lg:max-h-[85vh]">

          <div className={`${theme.banner} px-5 py-3 sm:px-12 sm:py-8 relative overflow-hidden shrink-0`}>

            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 grid grid-cols-[auto_1fr] sm:flex sm:flex-row items-center justify-between gap-x-3 gap-y-0.5 sm:gap-5">

              <div className="row-span-2 sm:order-last bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30 p-0.5 sm:p-1 shrink-0 self-center">
                <div className="bg-white rounded-lg sm:rounded-xl p-0.5 sm:p-1">
                  <img src="/favicon-genbi.webp" alt="Logo" className="w-8 h-8 sm:w-14 sm:h-14 object-contain" />
                </div>
              </div>

              <div className="contents sm:flex sm:flex-col sm:items-start sm:gap-1">
                <div className="text-left self-end sm:self-auto">
                  <h1 className="text-white text-[13px] sm:text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight">
                    {theme.label} {data?.year || new Date().getFullYear()}
                  </h1>
                </div>
                <div className="text-left self-start sm:self-auto">
                  <p className="text-white/90 text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em]">{periodLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 sm:px-12 sm:py-8 flex flex-row lg:flex-row gap-4 sm:gap-8 items-center lg:items-center overflow-hidden">

            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6 flex flex-col items-start text-left">

              <div className="space-y-1.5 sm:space-y-4 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-100 rounded-full text-[9px] sm:text-[13px] font-black text-slate-500 uppercase border border-slate-200/50">
                  NPM: {data?.npm}
                </div>
                <h2 className={`text-xl sm:text-4xl lg:text-5xl font-black ${theme.textAccent} leading-tight`}>
                  {data?.name || '-'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full">
                {[
                  { label: 'Program Studi', value: data?.studyProgram?.name || '-', icon: GraduationCap },
                  { label: 'Fakultas', value: data?.faculty?.name || '-', icon: Building2 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 p-2 sm:p-5 rounded-lg sm:rounded-3xl flex items-center gap-2 sm:gap-4 transition-all hover:bg-white hover:border-slate-200 group">
                    <div className="hidden sm:flex w-8 h-8 bg-white rounded-full items-center justify-center text-slate-400 border border-slate-100 group-hover:text-primary-500 group-hover:border-primary-100 transition-colors">
                      <item.icon size={16} className="stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {item.label}
                      </span>
                      <span className="block text-[10px] sm:text-sm font-bold text-slate-900 truncate leading-tight">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="relative group p-1.5 sm:p-2.5 bg-white rounded-xl sm:rounded-[1.5rem] border border-slate-100/80 transition-all">
                <QRCodeCanvas
                  value={publicUrl}
                  size={qrSize}
                  level="M"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 px-5 py-3 sm:px-12 sm:py-6 border-t border-slate-100 flex flex-row sm:flex-row items-center sm:items-start gap-3 sm:gap-4 shrink-0 shadow-[inset_0_1px_0_white]">
            <div className="p-2 rounded-xl bg-yellow-50 border border-amber-100 text-amber-600 shrink-0">
              <AlertCircle size={14} className="stroke-[2.5]" />
            </div>
            <p className="text-[9px] sm:text-xs text-slate-500 font-medium leading-relaxed">
              Data yang tertera adalah hasil keputusan final. Segala bentuk manipulasi data akan ditindak tegas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

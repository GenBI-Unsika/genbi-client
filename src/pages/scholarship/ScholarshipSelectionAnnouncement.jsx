import { useEffect, useMemo, useState } from 'react';
import StepperVertical from '../../components/ui/StepperVertical';
import { getMe } from '../../utils/auth.js';
import { useScholarshipSelectionGate } from '../../utils/scholarshipSelectionGate.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { apiFetch } from '../../services/api.js';

const Card = ({ title, badge, badgeIntent, tone, children, action }) => {
  const badgeStyles = {
    success: { background: 'var(--green-100, #dcfce7)', color: 'var(--green-700, #15803d)', border: 'var(--green-300, #86efac)' },
    danger: { background: 'var(--red-100, #fee2e2)', color: 'var(--red-700, #b91c1c)', border: 'var(--red-300, #fca5a5)' },
    warn: { background: 'var(--amber-100, #fef3c7)', color: 'var(--amber-800, #92400e)', border: 'var(--amber-300, #fcd34d)' },
    primary: { background: 'var(--primary-100, #c8ddfa)', color: 'var(--primary-700, #001b72)', border: 'var(--primary-300, #5b8ce2)' },
  };
  const style = badgeStyles[badgeIntent] || badgeStyles.primary;

  const accentColors = {
    success: 'border-l-emerald-400',
    danger: 'border-l-red-400',
    warn: 'border-l-amber-400',
    primary: 'border-l-blue-400',
  };
  const accentClass = accentColors[tone || badgeIntent] || accentColors.primary;

  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-6 border-l-4 ${accentClass} shadow-sm`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-body">{title}</h4>
        {badge && (
          <span className="rounded-md border px-2.5 py-0.5 text-xs font-medium" style={{ background: style.background, color: style.color, borderColor: style.border }}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-neutral-700">{children}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="text-sm">
    <p className="text-neutral-500">{label}</p>
    <div className="font-medium text-body">{children}</div>
  </div>
);

const fmtDate = (d) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '-';
  }
};

const normalizeExternalHref = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw) || /^mailto:/i.test(raw) || /^tel:/i.test(raw)) return raw;

  if (/^(wa\.me\/|chat\.whatsapp\.com\/|meet\.google\.com\/|zoom\.us\/|www\.)/i.test(raw)) {
    return `https://${raw}`;
  }

  return null;
};

const LocationOrLink = ({ value, className, linkClassName }) => {
  const raw = String(value || '').trim();
  if (!raw) return <span className={className}>-</span>;

  const href = normalizeExternalHref(raw);
  if (!href) return <span className={className}>{raw}</span>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} ${linkClassName || ''}`}>
      {raw}
    </a>
  );
};

const AnnouncementDetailModal = ({ open, onClose, app, userData, registration, shareUrl }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', intent: 'success' });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!open) {
          if (alive) setQrDataUrl('');
          return;
        }

        if (!shareUrl) {
          if (alive) setQrDataUrl('');
          return;
        }

        const dataUrl = await QRCode.toDataURL(shareUrl, {
          margin: 1,
          width: 256,
          errorCorrectionLevel: 'M',
        });
        if (alive) setQrDataUrl(dataUrl);
      } catch {
        if (alive) setQrDataUrl('');
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, shareUrl]);

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
      setToast({ open: true, message: 'Link berhasil disalin', intent: 'success' });
      window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 1800);
    } catch {
      try {
        const el = document.createElement('textarea');
        el.value = shareUrl;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
        setToast({ open: true, message: 'Link berhasil disalin', intent: 'success' });
        window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 1800);
      } catch {
        setToast({ open: true, message: 'Gagal menyalin link', intent: 'error' });
        window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 1800);
      }
    }
  };

  if (!open) return null;

  const data = {
    name: app?.name || userData?.profile?.name || userData?.email?.split('@')[0] || 'Calon Peserta',
    npm: app?.npm || userData?.profile?.npm || '-',
    faculty: app?.faculty?.name || userData?.profile?.faculty || '-',
    study: app?.studyProgram?.name || userData?.profile?.study || '-',
    semester: app?.semester || userData?.profile?.semester || '-',
    interviewLocation: app?.interviewLocation || '',
  };

  const periodYear = registration?.year ?? app?.year ?? null;
  const periodBatch = registration?.batch ?? app?.batch ?? null;
  const periodRange = periodYear ? `${periodYear}-${periodYear + 1}` : null;
  const periodLabel = periodRange ? `periode ${periodRange}${periodBatch ? ` (Batch ${periodBatch})` : ''}` : periodBatch ? `Batch ${periodBatch}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="fixed right-4 top-4 z-[60]">
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm transition-all duration-200 ${toast.open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            } ${toast.intent === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'}`}
        >
          {toast.intent === 'error' ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86l-8.02 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3.14l-8.02-14a2 2 0 0 0-3.42 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          <span className="font-medium">{toast.message || ' '}</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
        <button type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">Selamat! Anda dinyatakan sebagai penerima beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang{periodLabel ? ` ${periodLabel}.` : '.'}</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Nama</p>
              <p className="text-gray-700">{data.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">NPM</p>
              <p className="text-gray-700">{data.npm}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Fakultas</p>
              <p className="text-gray-700">{data.faculty}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Program Studi</p>
              <p className="text-gray-700">{data.study}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Semester</p>
              <p className="text-gray-700">{data.semester}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Lokasi / Link</p>
              <LocationOrLink value={data.interviewLocation} className="break-all text-gray-700" linkClassName="text-blue-600 underline" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-48 mx-auto">
              <div className="w-48 h-48 rounded-lg border border-neutral-200 bg-white flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Pengumuman" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-2 bg-neutral-100 rounded" />
                    <span className="text-xs text-neutral-500">QR Pengumuman</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-neutral-500">Scan untuk membuka halaman pengumuman</p>

              {shareUrl ? (
                <div className="mt-3">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Buka Pengumuman
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={copyShareUrl}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    {copied ? 'Link tersalin' : 'Salin Link'}
                    {copied ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-[18px] w-[18px]">
                        <path
                          d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScholarshipSelectionAnnouncement = () => {
  const [open, setOpen] = useState(false);
  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Calon Peserta';

  const { loading, error, app, registration } = useScholarshipSelectionGate();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [publicShareUrl, setPublicShareUrl] = useState('');

  const isFullyPassed = app?.administrasiStatus === 'LOLOS_ADMINISTRASI' && app?.interviewStatus === 'LOLOS_WAWANCARA';
  const isFailed = app?.administrasiStatus === 'ADMINISTRASI_DITOLAK' || app?.interviewStatus === 'GAGAL_WAWANCARA';
  const isFinal = isFullyPassed || isFailed;

  useEffect(() => {
    if (loading) return;
    if (!app) return;
    if (searchParams.get('detail') === '1') setOpen(true);
  }, [loading, app, searchParams]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (loading) return;
        if (!app) return;
        if (!isFinal) return;

        const json = await apiFetch('/scholarships/my-announcement-token', { method: 'GET' });
        const token = String(json?.data?.token || '').trim();
        if (!token) return;

        const url = new URL(window.location.href);
        url.pathname = '/scholarship/announcement';
        url.search = '';
        url.searchParams.set('t', token);
        if (alive) setPublicShareUrl(url.toString());
      } catch {
        if (alive) setPublicShareUrl('');
      }
    })();
    return () => {
      alive = false;
    };
  }, [loading, app, isFinal]);

  const openDetail = () => {
    setOpen(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('detail', '1');
      navigate(`${url.pathname}${url.search}`, { replace: true });
    } catch {
      // ignore
    }
  };

  const closeDetail = () => {
    setOpen(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('detail');
      navigate(`${url.pathname}${url.search}`, { replace: true });
    } catch {
      // ignore
    }
  };

  const administrasiStatus = app?.administrasiStatus;
  const interviewStatus = app?.interviewStatus;

  const administrasiLabel = useMemo(() => {
    if (administrasiStatus === 'LOLOS_ADMINISTRASI') return 'Lolos Seleksi';
    if (administrasiStatus === 'ADMINISTRASI_DITOLAK') return 'Tidak Lolos';
    return 'Menunggu';
  }, [administrasiStatus]);

  const administrasiIntent = useMemo(() => {
    if (administrasiStatus === 'LOLOS_ADMINISTRASI') return 'success';
    if (administrasiStatus === 'ADMINISTRASI_DITOLAK') return 'danger';
    return 'warn';
  }, [administrasiStatus]);

  const interviewLabel = useMemo(() => {
    if (interviewStatus === 'LOLOS_WAWANCARA') return 'Lolos Seleksi';
    if (interviewStatus === 'GAGAL_WAWANCARA') return 'Tidak Lolos';
    if (interviewStatus === 'DIJADWALKAN') return 'Terjadwal';
    return 'Menunggu';
  }, [interviewStatus]);

  const interviewIntent = useMemo(() => {
    if (interviewStatus === 'LOLOS_WAWANCARA') return 'success';
    if (interviewStatus === 'GAGAL_WAWANCARA') return 'danger';
    if (interviewStatus === 'DIJADWALKAN') return 'primary';
    return 'warn';
  }, [interviewStatus]);

  const isStillInProgress = !isFullyPassed && !isFailed;

  const announcementBadge = useMemo(() => {
    if (isFullyPassed) return { label: 'Diterima', intent: 'success' };
    if (isFailed) return { label: 'Tidak Lolos', intent: 'danger' };
    return { label: 'Dalam Proses', intent: 'warn' };
  }, [isFullyPassed, isFailed]);

  const stepCurrent = useMemo(() => {
    if (isFullyPassed || isFailed) return 2;
    if (administrasiStatus === 'LOLOS_ADMINISTRASI') return 1;
    return 0;
  }, [isFullyPassed, isFailed, administrasiStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperVertical current={stepCurrent} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Proses Seleksi</h1>
            <p className="mt-1 text-sm text-neutral-600">Pantau perkembangan tahap seleksi beasiswa Anda</p>
          </div>

          {loading && (
            <>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="h-16 bg-gray-100 rounded-lg w-full" />
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-36" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                      <div className="h-4 bg-gray-200 rounded w-28" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-40" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </>
          )}

          {!loading && !error && !app && (
            <Card title="Status" badge="Belum Daftar" badgeIntent="warn" tone="warn">
              Anda belum memiliki pengajuan beasiswa. Silakan isi formulir pendaftaran ketika dibuka.
            </Card>
          )}

          {!loading && !error && app && (
            <>

              <Card
                title="Pengumuman"
                badge={announcementBadge.label}
                badgeIntent={announcementBadge.intent}
                tone={announcementBadge.intent}
                action={
                  isFullyPassed || isFailed ? (
                    <button onClick={openDetail} className="btn btn-primary">
                      Lihat Detail
                    </button>
                  ) : null
                }
              >
                {isFullyPassed && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-green-800 font-semibold">Selamat! Anda dinyatakan LOLOS dan diterima sebagai Penerima Beasiswa Bank Indonesia.</p>
                    <p className="mt-1 text-green-700 text-xs">Informasi lebih lanjut akan dikirim melalui email.</p>
                  </div>
                )}
                {isFailed && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-800 font-semibold">Mohon maaf, Anda dinyatakan tidak lolos seleksi beasiswa.</p>
                    <p className="mt-1 text-red-700 text-xs">Terima kasih telah berpartisipasi. Jangan berkecil hati, tetap semangat!</p>
                  </div>
                )}
                {isStillInProgress && 'Status pengumuman akan tampil otomatis setelah seluruh tahap seleksi selesai.'}
              </Card>

              <Card title="Seleksi Wawancara" badge={interviewLabel} badgeIntent={interviewIntent} tone={interviewIntent}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nama">{userName}</Field>
                  <Field label="Jadwal Wawancara">{fmtDate(app.interviewDate)}</Field>
                  <Field label="Waktu Wawancara">{app.interviewTime || '-'}</Field>
                  <Field label="Room Wawancara">
                    <LocationOrLink value={app.interviewLocation} className="break-all" linkClassName="text-blue-600 underline" />
                  </Field>
                </div>
                {app.interviewNotes && (
                  <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
                    <span className="font-medium">Catatan:</span> {app.interviewNotes}
                  </div>
                )}
              </Card>

              <Card title="Seleksi Administrasi" badge={administrasiLabel} badgeIntent={administrasiIntent} tone={administrasiIntent}>
                {administrasiStatus === 'ADMINISTRASI_DITOLAK'
                  ? 'Mohon maaf, Anda belum lolos seleksi administrasi.'
                  : administrasiStatus === 'LOLOS_ADMINISTRASI'
                    ? 'Selamat, Anda lolos seleksi administrasi.'
                    : 'Dokumen Anda sedang diverifikasi oleh panitia.'}
              </Card>
            </>
          )}
        </div>
      </div>

      <AnnouncementDetailModal open={open} onClose={closeDetail} app={app} userData={user} registration={registration} shareUrl={publicShareUrl} />
    </div>
  );
};

export default ScholarshipSelectionAnnouncement;

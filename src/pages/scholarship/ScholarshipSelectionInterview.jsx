import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import StepperVertical from '../../components/ui/StepperVertical';
import { getMe } from '../../utils/auth.js';
import { useScholarshipSelectionGate } from '../../utils/scholarshipSelectionGate.js';

const Card = ({ title, badge, badgeIntent, tone, children }) => {
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

const ScholarshipSelectionInterview = () => {
  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Calon Peserta';

  const { loading, app } = useScholarshipSelectionGate();

  // Guard: must have passed administrasi
  const administrasiLolos = app?.administrasiStatus === 'LOLOS_ADMINISTRASI';
  const administrasiDitolak = app?.administrasiStatus === 'ADMINISTRASI_DITOLAK';

  const interviewStatus = app?.interviewStatus;
  const isBelumDijadwalkan = !interviewStatus || interviewStatus === 'MENUNGGU_JADWAL';
  const isDijadwalkan = interviewStatus === 'DIJADWALKAN';
  const isLolosWawancara = interviewStatus === 'LOLOS_WAWANCARA';
  const isDitolakWawancara = interviewStatus === 'GAGAL_WAWANCARA';

  const stepCurrent = useMemo(() => {
    return 1;
  }, []);

  const interviewBadge = useMemo(() => {
    if (isLolosWawancara) return { label: 'Lolos Seleksi', intent: 'success' };
    if (isDitolakWawancara) return { label: 'Tidak Lolos', intent: 'danger' };
    if (isDijadwalkan) return { label: 'Terjadwal', intent: 'primary' };
    return { label: 'Menunggu Jadwal', intent: 'warn' };
  }, [isLolosWawancara, isDitolakWawancara, isDijadwalkan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        {/* Left: Vertical stepper */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperVertical current={stepCurrent} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} />
        </div>

        {/* Right: Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Proses Seleksi</h1>
            <p className="mt-1 text-sm text-neutral-600">Pantau perkembangan tahap seleksi beasiswa Anda</p>
          </div>

          {loading && (
            <>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </>
          )}

          {!loading && !app && (
            <Card title="Status" badge="Belum Daftar" badgeIntent="warn" tone="warn">
              Anda belum memiliki pengajuan beasiswa.
            </Card>
          )}

          {!loading && app && !administrasiLolos && (
            <Card title="Seleksi Wawancara" badge="Belum Tersedia" badgeIntent="warn" tone="warn">
              {administrasiDitolak ? 'Anda tidak lolos seleksi administrasi sehingga tidak dapat melanjutkan ke tahap wawancara.' : 'Anda harus lolos seleksi administrasi terlebih dahulu sebelum dapat mengakses tahap wawancara.'}
              <div className="mt-4">
                <Link to="/scholarship/selection/admin" className="text-sm text-primary-600 hover:underline">
                  ← Kembali ke Seleksi Administrasi
                </Link>
              </div>
            </Card>
          )}

          {!loading && app && administrasiLolos && (
            <>
              <Card title="Seleksi Wawancara" badge={interviewBadge.label} badgeIntent={interviewBadge.intent} tone={interviewBadge.intent}>
                {isBelumDijadwalkan && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Nama">{userName}</Field>
                      <Field label="Jadwal Wawancara">Belum dijadwalkan</Field>
                      <Field label="Waktu Wawancara">-</Field>
                      <Field label="Room Wawancara">-</Field>
                    </div>
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Jadwal wawancara sedang disiapkan oleh panitia. Pantau halaman ini secara berkala.</div>
                  </>
                )}
                {isDijadwalkan && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Nama">{userName}</Field>
                    <Field label="Jadwal Wawancara">{fmtDate(app.interviewDate)}</Field>
                    <Field label="Waktu Wawancara">{app.interviewTime || '-'}</Field>
                    <Field label="Room Wawancara">
                      {app.interviewLocation ? (
                        <a href={app.interviewLocation} target="_blank" rel="noreferrer" className="break-all text-blue-600 underline">
                          {app.interviewLocation}
                        </a>
                      ) : (
                        '-'
                      )}
                    </Field>
                  </div>
                )}
                {isLolosWawancara && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Nama">{userName}</Field>
                      <Field label="Jadwal Wawancara">{fmtDate(app.interviewDate)}</Field>
                      <Field label="Waktu Wawancara">{app.interviewTime || '-'}</Field>
                      <Field label="Hasil">
                        <span className="rounded-md bg-green-50 px-2 py-0.5 text-green-700 font-semibold">Lolos Wawancara</span>
                      </Field>
                    </div>
                    {app.interviewNotes && (
                      <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
                        <span className="font-medium">Catatan:</span> {app.interviewNotes}
                      </div>
                    )}
                  </>
                )}
                {isDitolakWawancara && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Nama">{userName}</Field>
                      <Field label="Jadwal Wawancara">{fmtDate(app.interviewDate)}</Field>
                      <Field label="Waktu Wawancara">{app.interviewTime || '-'}</Field>
                      <Field label="Hasil">
                        <span className="rounded-md bg-red-50 px-2 py-0.5 text-red-700 font-semibold">Tidak Lolos Wawancara</span>
                      </Field>
                    </div>
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">Mohon maaf, Anda tidak lolos seleksi wawancara. Jika ada pertanyaan, silakan hubungi panitia.</div>
                  </>
                )}
              </Card>

              <Card title="Seleksi Administrasi" badge="Lolos Seleksi" badgeIntent="success" tone="success">
                Selamat dokumen Anda telah kami terima. Anda dinyatakan lulus seleksi administrasi.
              </Card>

              {isLolosWawancara && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">Pengumuman akan terbuka otomatis. Sistem akan mengarahkan kamu ke halaman pengumuman.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSelectionInterview;

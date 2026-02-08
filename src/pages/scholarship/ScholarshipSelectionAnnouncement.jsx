import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import StepperVertical from '../../components/ui/StepperVertical';
import { getMe } from '../../utils/auth.js';
import { scholarshipGetMyApplication } from '../../utils/api.js';

const Card = ({ title, badge, children, action }) => (
  <div className="rounded-xl border border-neutral-200 bg-surface p-6">
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-body">{title}</h4>
      {badge && (
        <span className="rounded-md px-2.5 py-0.5 text-xs font-medium" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
          {badge}
        </span>
      )}
    </div>
    <div className="mt-3 text-sm leading-relaxed text-neutral-700">{children}</div>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

const Field = ({ label, children }) => (
  <div className="text-sm">
    <p className="text-neutral-500">{label}</p>
    <div className="font-medium text-body">{children}</div>
  </div>
);


const AnnouncementDetailModal = ({ open, onClose, userData }) => {
  if (!open) return null;

  const data = {
    name: userData?.profile?.name || userData?.email?.split('@')[0] || 'Calon Peserta',
    npm: userData?.profile?.npm || '-',
    faculty: userData?.profile?.faculty || '-',
    study: userData?.profile?.study || '-',
    semester: userData?.profile?.semester || '-',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-xl border border-neutral-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-body">Detail Seleksi Beasiswa</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Detail kiri */}
          <div className="md:col-span-2 space-y-3 text-sm">
            <div>
              <p className="font-semibold">Nama</p>
              <p>{data.name}</p>
            </div>
            <div>
              <p className="font-semibold">NPM</p>
              <p>{data.npm}</p>
            </div>
            <div>
              <p className="font-semibold">Fakultas</p>
              <p>{data.faculty}</p>
            </div>
            <div>
              <p className="font-semibold">Program Studi</p>
              <p>{data.study}</p>
            </div>
            <div>
              <p className="font-semibold">Semester</p>
              <p>{data.semester}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-page p-3 text-xs text-neutral-700">Informasi lanjutan (jadwal, link, dan pengumuman) akan ditampilkan otomatis jika sudah diinput oleh admin.</div>
          </div>

          {/* Kanan: QR placeholder (ganti ke generator bila siap) */}
          <div className="flex items-start justify-center">
            <div className="grid aspect-square w-40 place-items-center rounded-md border border-neutral-200 bg-page">
              <span className="text-xs text-neutral-600">QR Code</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-primary">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


const ScholarshipSelectionAnnouncement = () => {
  const [open, setOpen] = useState(false);
  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Calon Peserta';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [app, setApp] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await scholarshipGetMyApplication();
        if (!alive) return;
        setApp(data || null);
      } catch (e) {
        if (!alive) return;
        const msg = e?.message || 'Gagal memuat status seleksi.';
        toast.error(msg);
        setError(msg);
        setApp(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const administrasiLabel = useMemo(() => {
    const s = app?.administrasiStatus;
    if (s === 'LOLOS_ADMINISTRASI') return 'Lolos Seleksi';
    if (s === 'ADMINISTRASI_DITOLAK') return 'Tidak Lolos';
    return 'Menunggu';
  }, [app]);

  const stepCurrent = useMemo(() => {
    const s = app?.administrasiStatus;
    if (s === 'LOLOS_ADMINISTRASI') return 1;
    return 0;
  }, [app]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        {/* Left: Vertical stepper */}
        <div className="rounded-xl border border-neutral-200 bg-surface p-6">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperVertical current={stepCurrent} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} />
        </div>

        {/* Right */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-body">Proses Seleksi</h1>

          {loading && <div className="rounded-xl border border-neutral-200 bg-surface p-6 text-sm text-neutral-600">Memuat...</div>}

          {!loading && !error && !app && (
            <Card title="Status" badge="Belum Daftar">
              Anda belum memiliki pengajuan beasiswa. Silakan isi formulir pendaftaran ketika dibuka.
            </Card>
          )}

          {!loading && !error && app && (
            <>
              <Card
                title="Pengumuman"
                badge={app.administrasiStatus === 'LOLOS_ADMINISTRASI' ? 'Diproses' : 'Menunggu'}
                action={
                  <button onClick={() => setOpen(true)} className="btn btn-primary">
                    Lihat Detail
                  </button>
                }
              >
                Status pengumuman akan tampil otomatis setelah panitia mengunci hasil seleksi.
              </Card>

              <Card title="Seleksi Wawancara" badge="Menunggu">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nama">{userName}</Field>
                  <Field label="Jadwal Wawancara">-</Field>
                  <Field label="Waktu Wawancara">-</Field>
                  <Field label="Room Wawancara">-</Field>
                </div>
              </Card>

              <Card title="Seleksi Administrasi" badge={administrasiLabel}>
                {app.administrasiStatus === 'ADMINISTRASI_DITOLAK'
                  ? 'Mohon maaf, Anda belum lolos seleksi administrasi.'
                  : app.administrasiStatus === 'LOLOS_ADMINISTRASI'
                    ? 'Selamat, Anda lolos seleksi administrasi.'
                    : 'Dokumen Anda sedang diverifikasi oleh panitia.'}
              </Card>
            </>
          )}
        </div>
      </div>

      <AnnouncementDetailModal open={open} onClose={() => setOpen(false)} userData={user} />
    </div>
  );
};

export default ScholarshipSelectionAnnouncement;

import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, X } from 'lucide-react';
import StepperVertical from '../../components/ui/StepperVertical';
import { useScholarshipSelectionGate } from '../../utils/scholarshipSelectionGate.js';

const Card = ({ title, badge, badgeIntent, tone, children }) => {
  const badgeStyles = {
    success: { background: 'var(--green-100, #dcfce7)', color: 'var(--green-700, #15803d)', border: 'var(--green-300, #86efac)' },
    danger: { background: 'var(--red-100, #fee2e2)', color: 'var(--red-700, #b91c1c)', border: 'var(--red-300, #fca5a5)' },
    warn: { background: 'var(--amber-100, #fef3c7)', color: 'var(--amber-800, #92400e)', border: 'var(--amber-300, #fcd34d)' },
    primary: { background: 'var(--primary-100)', color: 'var(--primary-700)', border: 'var(--primary-300)' },
  };
  const style = badgeStyles[badgeIntent] || badgeStyles.primary;

  const accentColors = {
    success: 'border-l-emerald-400',
    danger: 'border-l-red-400',
    warn: 'border-l-amber-400',
    primary: 'border-l-primary-400',
  };
  const accentClass = accentColors[tone] || accentColors.primary;

  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-6 border-l-4 ${accentClass} shadow-sm`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-body">{title}</h4>
        {badge && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold border" style={{ background: style.background, color: style.color, borderColor: style.border }}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-neutral-700">{children}</div>
    </div>
  );
};

const CelebrationModal = ({ isOpen, onClose, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-slideUp">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors" aria-label="Tutup">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <PartyPopper className="w-10 h-10 text-emerald-600" />
          </div>

          <h2 className="mb-3 text-2xl font-bold text-neutral-900">Selamat!</h2>
          <p className="mb-6 text-neutral-600 leading-relaxed">
            {name && <span className="font-semibold text-neutral-900">{name}</span>}
            {name && ', '}Kamu berhasil lolos seleksi administrasi! Dokumen yang kamu kirimkan telah diverifikasi dan memenuhi persyaratan.
          </p>

          <div className="mb-6 w-full rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left">
            <h3 className="mb-2 font-semibold text-emerald-900 text-sm">Tahap Selanjutnya:</h3>
            <p className="text-emerald-800 text-sm leading-relaxed">Kamu akan diarahkan ke halaman seleksi wawancara. Pastikan untuk memantau jadwal wawancara yang akan diumumkan oleh panitia.</p>
          </div>

          <button onClick={onClose} className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors">
            Lanjut ke Tahap Wawancara
          </button>
        </div>
      </div>
    </div>
  );
};

const ScholarshipSelectionAdmin = () => {
  const navigate = useNavigate();
  const { loading, app } = useScholarshipSelectionGate();

  const status = app?.administrasiStatus;
  const isLolos = status === 'LOLOS_ADMINISTRASI';
  const isDitolak = status === 'ADMINISTRASI_DITOLAK';
  const isMenunggu = !status || status === 'MENUNGGU_VERIFIKASI';

  const stepCurrent = useMemo(() => 0, []);

  const badgeLabel = isLolos ? 'Lolos Seleksi' : isDitolak ? 'Tidak Lolos' : 'Dalam Verifikasi';
  const badgeIntent = isLolos ? 'success' : isDitolak ? 'danger' : 'warn';
  const cardTone = badgeIntent;

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!loading && isLolos && app?.id) {
      const celebrationKey = `scholarship_admin_celebrated_${app.id}`;
      const hasCelebrated = localStorage.getItem(celebrationKey);

      if (!hasCelebrated) {
        setShowCelebration(true);
        localStorage.setItem(celebrationKey, 'true');
      } else {
        // Jika sudah pernah merayakan, langsung pindah ke tahap wawancara (seleksi otomatis diarahkan)
        // navigate('/scholarship/selection/interview', { replace: true });
      }
    }
  }, [loading, isLolos, app, navigate]);

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    navigate('/scholarship/selection/interview', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      <CelebrationModal isOpen={showCelebration} onClose={handleCloseCelebration} name={app?.name} />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperVertical current={stepCurrent} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} heightClass="h-72" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Proses Seleksi</h1>
            <p className="mt-1 text-sm text-neutral-600">Pantau perkembangan tahap seleksi beasiswa Anda</p>
          </div>

          {loading && <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">Memuat status seleksi...</div>}

          {!loading && !app && (
            <Card title="Status" badge="Belum Daftar" badgeIntent="warn" tone="warn">
              Anda belum memiliki pengajuan beasiswa. Silakan isi formulir pendaftaran ketika dibuka.
            </Card>
          )}

          {!loading && app && (
            <Card title="Seleksi Administrasi" badge={badgeLabel} badgeIntent={badgeIntent} tone={cardTone}>
              {isMenunggu && (
                <>
                  Dokumen Anda sedang dalam proses verifikasi oleh panitia. Mohon menunggu hasil seleksi administrasi.
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <strong className="font-semibold">Catatan:</strong> Proses verifikasi memerlukan waktu. Pantau halaman ini secara berkala untuk mengetahui hasilnya.
                  </div>
                </>
              )}
              {isLolos && (
                <>
                  Selamat dokumen Anda telah kami terima. Anda dinyatakan lulus seleksi administrasi.
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    <strong className="font-semibold">✅ Selanjutnya:</strong> Tahap selanjutnya akan terbuka otomatis. Sistem akan mengarahkan kamu ke tahap wawancara.
                  </div>
                </>
              )}
              {isDitolak && (
                <>
                  Mohon maaf, dokumen Anda tidak memenuhi persyaratan seleksi administrasi. Anda dinyatakan tidak lolos seleksi administrasi.
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    <strong className="font-semibold">ℹ️ Bantuan:</strong> Jika Anda merasa ada kekeliruan, silakan hubungi panitia melalui kontak yang tersedia.
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSelectionAdmin;


import { useState } from 'react';
import StepperFlyonVertical from '../../components/ui/StepperFlyonVertical';

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

/* ---------- Modal Detail Pengumuman ---------- */
const AnnouncementDetailModal = ({ open, onClose }) => {
  if (!open) return null;

  const data = {
    name: 'Devi Fitriani Maulana',
    npm: '2010631250037',
    faculty: 'Fakultas Ilmu Komputer',
    study: 'Sistem Informasi',
    semester: '8',
    moreInfo: 'https://chat.whatsapp.com/DRivS4sK085964DoRBzA66779900',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-xl border border-neutral-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-body">Selamat! Anda dinyatakan sebagai penerima Beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang periode 2024–2025.</h2>

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
            <div>
              <p className="font-semibold">Informasi Lebih Lanjut</p>
              <div className="flex items-center gap-2">
                <a href={data.moreInfo} target="_blank" rel="noreferrer" className="truncate text-blue-600 underline">
                  {data.moreInfo}
                </a>
                <button type="button" title="Salin" onClick={() => navigator.clipboard.writeText(data.moreInfo)} className="btn btn-ghost btn-xs">
                  Salin
                </button>
              </div>
            </div>
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
/* -------------------------------------------- */

const ScholarshipSelectionAnnouncement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        {/* Left: Vertical stepper */}
        <div className="rounded-xl border border-neutral-200 bg-surface p-6">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperFlyonVertical current={2} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} />
        </div>

        {/* Right */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-body">Proses Seleksi</h1>

          <Card
            title="Pengumuman"
            badge="Lolos Seleksi"
            action={
              <button onClick={() => setOpen(true)} className="btn btn-primary">
                Lihat Detail
              </button>
            }
          >
            Selamat! Anda sebagai penerima beasiswa Bank Indonesia Komisariat Universitas Singaperbangsa Karawang periode 2024–2025.
          </Card>

          <Card title="Seleksi Wawancara" badge="Lolos Seleksi">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nama">Devi Fitriani Maulana</Field>
              <Field label="Jadwal Wawancara">Senin, 06 Juni 2024</Field>
              <Field label="Waktu Wawancara">10.00 – 10.30 WIB</Field>
              <Field label="Room Wawancara">
                <a href="#" className="break-all text-blue-600 underline">
                  https://us02web.zoom.us/j/83272175692?pwd=NVV6cWZhY2NYRlBxVzZ5K3llMF...
                </a>
              </Field>
            </div>
          </Card>

          <Card title="Seleksi Administrasi" badge="Lolos Seleksi">
            Selamat dokumen Anda telah kami terima. Anda dinyatakan lulus seleksi administrasi.
          </Card>
        </div>
      </div>

      <AnnouncementDetailModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ScholarshipSelectionAnnouncement;

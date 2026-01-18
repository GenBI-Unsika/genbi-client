import { Link } from 'react-router-dom';
import StepperFlyonVertical from '../../components/ui/StepperFlyonVertical';
import { getMe } from '../../utils/auth.js';

const Card = ({ title, badge, children }) => (
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
  </div>
);

const Field = ({ label, children }) => (
  <div className="text-sm">
    <p className="text-neutral-500">{label}</p>
    <div className="font-medium text-body">{children}</div>
  </div>
);

const ScholarshipSelectionInterview = () => {
  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Calon Peserta';

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        {/* Left: Vertical stepper */}
        <div className="rounded-xl border border-neutral-200 bg-surface p-6">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperFlyonVertical current={1} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} />
        </div>

        {/* Right: Content */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-body">Proses Seleksi</h1>

          <Card title="Seleksi Wawancara" badge="Proses Seleksi">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nama">{userName}</Field>
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

          <div className="flex justify-end">
            <Link to="/scholarship/selection/announcement" className="btn btn-primary">
              Ke Halaman Pengumuman
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSelectionInterview;

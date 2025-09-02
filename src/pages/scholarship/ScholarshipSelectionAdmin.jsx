import { Link } from 'react-router-dom';
import StepperFlyonVertical from '../../components/ui/StepperFlyonVertical';

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

const ScholarshipSelectionAdmin = () => {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-surface p-6">
          <h3 className="mb-6 text-xl font-semibold text-body">Tahap Seleksi</h3>
          <StepperFlyonVertical current={0} items={['Seleksi Administrasi', 'Seleksi Wawancara', 'Pengumuman']} heightClass="h-72" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-body">Proses Seleksi</h1>
          <Card title="Seleksi Administrasi" badge="Proses Seleksi">
            Selamat dokumen Anda telah kami terima. Anda dinyatakan lulus seleksi administrasi.
            <div className="mt-4">
              <Link to="/scholarship/selection/interview" className="btn btn-primary">
                Lanjut ke Seleksi Wawancara
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSelectionAdmin;

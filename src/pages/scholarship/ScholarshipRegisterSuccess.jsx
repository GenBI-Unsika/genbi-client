import { Link } from 'react-router-dom';

const ScholarshipRegisterSuccess = () => {
  return (
    <main className="bg-page">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center" style={{ animation: 'fadeSlideIn 0.5s ease both' }}>
        <h1 className="mb-6 text-4xl font-extrabold text-neutral-900 tracking-tighter">Pendaftaran Berhasil</h1>

        <div className="mb-6 flex items-center justify-center" style={{ animation: 'floatIn 0.6s 0.15s ease both' }}>
          <img src="/success-regis.gif" alt="Pendaftaran beasiswa berhasil" className="h-auto w-[240px] select-none" draggable="false" />
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-md text-neutral-500" style={{ animation: 'fadeSlideIn 0.5s 0.25s ease both', opacity: 0 }}>
          Yeay, kamu telah berhasil menyelesaikan pendaftaran Beasiswa Bank Indonesia. Silahkan cek secara berkala website dan email kamu untuk mengetahui informasi lebih lanjut.
        </p>

        <div style={{ animation: 'fadeSlideIn 0.5s 0.35s ease both', opacity: 0 }}>
          <Link
            to="/scholarship/selection/admin"
            className="btn btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Lihat Status Daftar
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
};

export default ScholarshipRegisterSuccess;

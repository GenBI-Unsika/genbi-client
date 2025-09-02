import { Link } from 'react-router-dom';

const ScholarshipRegisterSuccess = () => {
  return (
    <main className="bg-page">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-6 text-3xl font-bold text-body">Pendaftaran Berhasil</h1>

        <div className="mb-6 flex items-center justify-center">
          <img src="/success-regis.gif" alt="Pendaftaran beasiswa berhasil" className="h-auto w-[240px] select-none" draggable="false" />
        </div>

        <p className="mx-auto mb-8 max-w-2xl text-sm text-neutral-600">
          Yeay, kamu telah berhasil menyelesaikan pendaftaran Beasiswa Bank Indonesia. Silahkan cek secara berkala website dan email kamu untuk mengetahui informasi lebih lanjut.
        </p>

        <Link to="/scholarship/selection/admin" className="btn btn-primary">
          Lihat Status Daftar
        </Link>
      </div>
    </main>
  );
};

export default ScholarshipRegisterSuccess;

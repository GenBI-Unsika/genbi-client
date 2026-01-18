'use client';

import { useEffect, useMemo, useState } from 'react';
import { resendVerification, verifyEmail } from '../utils/auth.js';

const VerifyEmailPage = ({ onNavigate }) => {
  const token = useMemo(() => {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get('token') || '';
    } catch {
      return '';
    }
  }, []);

  const [email, setEmail] = useState(() => localStorage.getItem('pendingVerifyEmail') || '');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    let alive = true;
    (async () => {
      setError('');
      setStatus('Memverifikasi...');
      try {
        await verifyEmail(token);
        if (!alive) return;
        setStatus('Email berhasil diverifikasi. Silakan login.');
      } catch (e2) {
        if (!alive) return;
        setError(e2?.message || 'Verifikasi gagal');
        setStatus('');
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  const handleResend = async () => {
    setError('');
    if (!email) {
      setError('Masukkan email @unsika.ac.id atau @student.unsika.ac.id untuk kirim ulang');
      return;
    }
    try {
      setSubmitting(true);
      await resendVerification(email);
      localStorage.setItem('pendingVerifyEmail', email);
      setStatus('Email verifikasi telah dikirim ulang. Silakan cek inbox/spam.');
    } catch (e2) {
      setError(e2?.message || 'Gagal mengirim ulang');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onNavigate('signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h1>
          <p className="text-gray-600 mb-4">Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek email dan klik link untuk mengaktifkan akun.</p>
          <p className="text-sm text-gray-500">Tidak menerima email? Cek folder spam atau kirim ulang.</p>
        </div>

        {status ? <div className="mb-4 text-sm text-green-700">{status}</div> : null}
        {error ? <div className="mb-4 text-sm text-red-600">{error}</div> : null}

        {!token ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@unsika.ac.id / nama@student.unsika.ac.id"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        ) : null}

        <div className="space-y-4">
          {status && !error ? (
            <button onClick={() => onNavigate('signin')} className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Lanjut Login
            </button>
          ) : null}

          <button onClick={handleResend} disabled={submitting} className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
            {submitting ? 'Memproses...' : 'Kirim Ulang Email'}
          </button>

          <button onClick={handleSkip} className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Lewati untuk Sekarang
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('signin')} className="text-primary-600 hover:text-primary-700 font-medium">
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

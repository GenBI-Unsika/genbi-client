'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { login, loginWithGoogle } from '../utils/auth.js';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';

function defaultPasswordFromEmail(email) {
  const raw = String(email || '')
    .trim()
    .toLowerCase();
  const at = raw.indexOf('@');
  if (at <= 0) return '';
  const local = raw.slice(0, at);
  const domain = raw.slice(at + 1);
  const isStudent = domain === 'student.unsika.ac.id' && /^\d{8,}$/.test(local);
  return isStudent ? local : '';
}

const SignInPage = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (password) return;
    const candidate = defaultPasswordFromEmail(email);
    if (candidate) setPassword(candidate);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Berhasil masuk!');
      if (onLogin) onLogin();
      onNavigate('home');
    } catch (err) {
      toast.error(err?.message || 'Login gagal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="max-w-md">
          <img src="https://illustrations.popsy.co/amber/remote-work.svg" alt="Login illustration" className="w-full h-auto" loading="eager" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk Ke GenBI Unsika</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Unsika</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <button type="button" onClick={() => onNavigate('forgot-password')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Lupa Password
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="text-center">
              <span className="text-gray-600">Belum punya akun? </span>
              <button type="button" onClick={() => onNavigate('signup')} className="text-primary-600 hover:text-primary-700 font-medium">
                Daftar akun
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Atau masuk menggunakan email</span>
              </div>
            </div>

            <div className="w-full">
              <GoogleLoginButton
                onIdToken={async (idToken) => {
                  try {
                    await loginWithGoogle(idToken);
                    toast.success('Berhasil masuk dengan Google!');
                    if (onLogin) onLogin();
                    onNavigate('home');
                  } catch (e2) {
                    toast.error(e2?.message || 'Login Google gagal');
                  }
                }}
                onError={(msg) => toast.error(msg || 'Login Google gagal')}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

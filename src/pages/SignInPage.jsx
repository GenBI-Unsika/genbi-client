'use client';

import { useState } from 'react';
import { login, loginWithGoogle } from '../utils/auth.js';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';

const SignInPage = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      if (onLogin) onLogin();
      onNavigate('home');
    } catch (err) {
      setError(err?.message || 'Login gagal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-50 items-center justify-center p-12">
        <div className="max-w-md">
          <img src="/professional-person-working-at-desk-with-computer-.png" alt="Login illustration" className="w-full h-auto" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk Ke GenBI Unsika</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Unsika (unsika.ac.id / student.unsika.ac.id)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" onClick={() => onNavigate('forgot-password')} className="text-sm text-primary-600 hover:text-primary-700">
                  Lupa Password
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
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
                <span className="px-2 bg-gray-50 text-gray-500">Atau masuk dengan Google</span>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <GoogleLoginButton
                onIdToken={async (idToken) => {
                  try {
                    setError('');
                    await loginWithGoogle(idToken);
                    if (onLogin) onLogin();
                    onNavigate('home');
                  } catch (e2) {
                    setError(e2?.message || 'Login Google gagal');
                  }
                }}
                onError={(msg) => setError(msg || 'Login Google gagal')}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

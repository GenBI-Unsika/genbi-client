'use client';

import { useState } from 'react';

const TwoFactorAuthPage = ({ onNavigate }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-h2 font-bold text-gray-900 mb-2">Verifikasi Dua Faktor</h1>
          <p className="text-body text-gray-600">Masukkan kode 6 digit yang dikirim ke email Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={1}
              />
            ))}
          </div>

          <button type="submit" className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Verifikasi
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600">Tidak menerima kode?</p>
            <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
              Kirim Ulang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;

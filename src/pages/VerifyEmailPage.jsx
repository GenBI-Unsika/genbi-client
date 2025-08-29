"use client"

const VerifyEmailPage = ({ onNavigate }) => {
  const handleResend = () => {
    alert("Email verifikasi telah dikirim ulang")
  }

  const handleSkip = () => {
    onNavigate("signin")
  }

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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h1>
          <p className="text-gray-600 mb-4">
            Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek email dan klik link untuk mengaktifkan
            akun.
          </p>
          <p className="text-sm text-gray-500">Tidak menerima email? Cek folder spam atau kirim ulang.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Kirim Ulang Email
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Lewati untuk Sekarang
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate("signin")} className="text-primary-600 hover:text-primary-700 font-medium">
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage

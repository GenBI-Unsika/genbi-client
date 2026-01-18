import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onIdToken, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => onError?.('Google login belum dikonfigurasi. Isi VITE_GOOGLE_CLIENT_ID di .env lalu restart dev server.')}
      >
        Masuk dengan Google
      </button>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse?.credential;
        if (!idToken) return onError?.('Google credential tidak ditemukan');
        onIdToken?.(idToken);
      }}
      onError={() => onError?.('Login Google gagal')}
      useOneTap={false}
    />
  );
}

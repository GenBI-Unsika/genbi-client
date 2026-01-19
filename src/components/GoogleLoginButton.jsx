import { useEffect, useRef, useState } from 'react';

export default function GoogleLoginButton({ onIdToken, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hiddenButtonRef = useRef(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!clientId || isInitialized) return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

    if (existingScript) {
      // Script already loaded
      if (window.google?.accounts?.id) {
        initializeGoogle();
        setIsInitialized(true);
      } else {
        existingScript.addEventListener('load', () => {
          initializeGoogle();
          setIsInitialized(true);
        });
      }
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      initializeGoogle();
      setIsInitialized(true);
    };

    script.onerror = () => {
      onError?.('Gagal memuat Google Sign-In. Periksa koneksi internet Anda.');
    };

    document.body.appendChild(script);

    function initializeGoogle() {
      if (!window.google?.accounts?.id) {
        onError?.('Google Sign-In tidak tersedia');
        return;
      }

      try {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            // response.credential contains the ID token (JWT)
            if (response.credential) {
              onIdToken?.(response.credential);
            } else {
              onError?.('ID Token tidak ditemukan');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        // Render hidden Google button for triggering
        if (hiddenButtonRef.current) {
          window.google.accounts.id.renderButton(hiddenButtonRef.current, {
            type: 'standard',
            size: 'large',
            width: 1,
          });
        }

        setIsGoogleReady(true);
      } catch (error) {
        onError?.('Gagal menginisialisasi Google Sign-In: ' + error.message);
      }
    }
  }, [clientId, onIdToken, onError, isInitialized]);

  const handleClick = () => {
    if (!isGoogleReady || !hiddenButtonRef.current) {
      onError?.('Google Sign-In belum siap. Tunggu sebentar dan coba lagi.');
      return;
    }

    try {
      // Click the hidden Google button
      const googleButton = hiddenButtonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      } else {
        onError?.('Tombol Google Sign-In tidak ditemukan');
      }
    } catch (error) {
      onError?.('Gagal membuka Google Sign-In: ' + error.message);
    }
  };

  if (!clientId) {
    return (
      <button
        type="button"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-3"
        onClick={() => onError?.('Google login belum dikonfigurasi.')}
      >
        <GoogleIcon />
        Masuk dengan Google
      </button>
    );
  }

  return (
    <>
      {/* Hidden Google button for triggering */}
      <div ref={hiddenButtonRef} className="hidden" />

      {/* Custom button with our styling */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!isGoogleReady}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        Masuk dengan Google
      </button>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

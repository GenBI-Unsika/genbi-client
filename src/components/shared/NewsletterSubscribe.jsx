import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../services/api.js';
import { getMe } from '../../utils/auth.js';

const NewsletterSubscribe = ({ className = '' }) => {
  const user = getMe();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribedName, setSubscribedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.profile?.name) setName(user.profile.name);
  }, [user?.email, user?.profile?.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!user?.email) {
      toast.error('Email akun tidak tersedia. Silakan login ulang.');
      return;
    }

    setLoading(true);
    try {
      const nameToShow = name.trim() || user?.profile?.name || '';
      await apiFetch('/subscribers', {
        method: 'POST',
        body: { name: name.trim() || undefined },
      });
      setSubscribedName(nameToShow);
      setSubscribed(true);
      toast.success('Berhasil berlangganan! Terima kasih.');
    } catch (err) {
      if (err?.status === 409) {
        const nameToShow = name.trim() || user?.profile?.name || '';
        setSubscribedName(nameToShow);
        setSubscribed(true);
        toast.success('Kamu sudah berlangganan.');
        return;
      }
      if (err?.status === 401 || err?.status === 403) {
        toast.error('Silakan login untuk berlangganan newsletter.');
        navigate('/signin');
        return;
      }
      const message = err?.message || 'Gagal berlangganan. Silakan coba lagi.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full bg-primary-600 rounded-2xl px-6 py-7 animate-in fade-in slide-in-from-bottom-3 duration-700 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div className="flex items-center gap-4">
          <div className="bg-white/15 p-2.5 rounded-xl flex-shrink-0 transition-all duration-500 ease-out hover:scale-105 hover:rotate-2 hover:bg-white/25">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Berlangganan Newsletter</h3>
            <p className="text-sm text-white/75 mt-0.5">Update artikel, berita GenBI & info beasiswa langsung ke emailmu</p>
          </div>
        </div>

        {subscribed ? (
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm whitespace-nowrap">
              <Mail className="w-4 h-4" />
              <span>Sudah berlangganan</span>
            </div>
          </div>
        ) : !user ? (
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-500 ease-out flex items-center justify-center gap-2 text-sm whitespace-nowrap w-full"
            >
              <Mail className="w-4 h-4" />
              <span>Login untuk berlangganan</span>
            </button>
            <p className="mt-2 text-sm text-white/80">Berlangganan newsletter hanya untuk akun yang sedang login.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-shrink-0 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="px-4 py-2.5 w-full sm:flex-1 sm:min-w-[180px] bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:border-white/60 focus:bg-white/15 focus:scale-[1.02] transition-all duration-300 ease-in-out text-sm"
                disabled={loading || !!user?.profile?.name}
                readOnly={!!user?.profile?.name}
              />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email kamu"
                className="px-4 py-2.5 w-full sm:flex-1 sm:min-w-[240px] bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:border-white/60 focus:bg-white/15 focus:scale-[1.02] transition-all duration-300 ease-in-out text-sm"
                disabled={loading || !!user?.email}
                readOnly={!!user?.email}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tunggu...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Berlangganan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscribe;

import { useEffect, useState } from 'react';
import { getMe, syncMe } from '../utils/auth.js';
import { apiFetch } from '../services/api.js';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = getMe();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    gender: '',
    npm: '',
    studyProgram: '',
    currentSemester: '',
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await syncMe();
        const me = getMe();
        if (!alive) return;

        setFormData({
          fullName: me?.profile?.name || '',
          email: me?.email || '',
          birthDate: me?.profile?.birthDate ? new Date(me.profile.birthDate).toISOString().split('T')[0] : '',
          gender: me?.profile?.gender || '',
          npm: me?.profile?.npm || '',
          studyProgram: me?.profile?.study || '',
          currentSemester: me?.profile?.semester || '',
        });
      } catch (e) {
        if (!alive) return;
        setError('Gagal memuat profil');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await apiFetch('/me/profile', {
        method: 'PATCH',
        body: {
          name: formData.fullName,
          birthDate: formData.birthDate || null,
          gender: formData.gender || null,
          npm: formData.npm || null,
          study: formData.studyProgram || null,
          semester: formData.currentSemester || null,
        },
      });
      await syncMe();
      setMessage('Profil berhasil diperbarui');
    } catch (e) {
      setError(e?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Profil Saya</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat profil...</div>
      ) : (
        <>
          {/* Profile Photo Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary-200 rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-4xl font-semibold text-primary-700">{formData.fullName?.charAt(0)?.toUpperCase() || 'P'}</span>
            </div>
            <div className="flex gap-3">
              <button type="button" className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Unggah Foto
              </button>
              <button type="button" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Hapus Foto
              </button>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                <input type="text" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NPM</label>
              <input type="text" name="npm" value={formData.npm} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Studi</label>
              <input type="text" name="studyProgram" value={formData.studyProgram} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester Saat Ini</label>
              <input
                type="text"
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-secondary-500 text-white px-8 py-3 rounded-lg hover:bg-secondary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

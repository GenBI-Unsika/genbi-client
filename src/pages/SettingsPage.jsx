import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/api.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import PasswordInput from '../components/ui/PasswordInput';

const SettingsPage = () => {
  const { confirm } = useConfirm();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Lemah', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 66, label: 'Sedang', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Kuat', color: 'bg-green-500' };
  };

  const handleSave = async () => {
    const hasPasswordIntent = Boolean(passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmNewPassword);

    if (!hasPasswordIntent) {
      toast.success('Tidak ada perubahan');
      return;
    }

    const ok = await confirm({
      title: 'Simpan pengaturan?',
      description: 'Perubahan pengaturan akun akan disimpan.',
      confirmText: 'Simpan',
      cancelText: 'Batal',
    });

    if (!ok) return;

    setSaving(true);

    try {
      if (hasPasswordIntent) {
        if (!passwordForm.newPassword) {
          toast.error('Password baru wajib diisi');
          return;
        }

        if (!validatePassword(passwordForm.newPassword)) {
          toast.error('Password harus minimal 8 karakter dengan kombinasi huruf besar, kecil, dan angka');
          return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
          toast.error('Konfirmasi password tidak sama');
          return;
        }

        setChangingPassword(true);
        await apiFetch('/auth/password', {
          method: 'PATCH',
          body: {
            currentPassword: passwordForm.currentPassword || undefined,
            newPassword: passwordForm.newPassword,
          },
        });
        toast.success('Password berhasil diperbarui');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (e2) {
      toast.error(e2?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setChangingPassword(false);
      setSaving(false);
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-h2 font-bold text-gray-900 mb-6 sm:mb-8">Pengaturan</h2>

      <div className="space-y-8">

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubah Password</h3>
          <p className="text-sm text-gray-600 mb-4">Jika akun Anda dibuat via Google, kolom password lama boleh dikosongkan.</p>

          <div className="space-y-4">
            <PasswordInput
              label="Password Lama (Opsional untuk akun Google)"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Masukkan password lama"
            />

            <div>
              <PasswordInput
                label="Password Baru"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Masukkan password baru"
              />

              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${passwordStrength.strength}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <PasswordInput
              label="Konfirmasi Password Baru"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
              placeholder="ulangi password baru"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 ">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || changingPassword}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

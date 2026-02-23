import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMe, syncMe } from '../utils/auth.js';
import { apiFetch } from '../services/api.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import { fetchFaculties } from '../utils/masterData.js';

const ProfilePage = () => {
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    gender: '',
    phone: '',
    npm: '',
    facultyId: '',
    studyProgramId: '',
    currentSemester: '',
  });

  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [availablePrograms, setAvailablePrograms] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const facultiesData = await fetchFaculties();
        if (alive) {
          setFaculties(facultiesData);
        }
      } catch (error) {
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        await syncMe();
        const me = getMe();

        if (!alive) return;

        setUserAvatar(me?.profile?.avatar || '');

        const facultyId = me?.profile?.facultyId || '';
        const studyProgramId = me?.profile?.studyProgramId || '';

        if (facultyId && faculties.length > 0) {
          const selectedFaculty = faculties.find((f) => f.id === facultyId);
          if (selectedFaculty) {
            setAvailablePrograms(selectedFaculty.studyPrograms || []);
          }
        }

        setFormData({
          fullName: me?.profile?.name || '',
          email: me?.email || '',
          birthDate: me?.profile?.birthDate ? new Date(me.profile.birthDate).toISOString().split('T')[0] : '',
          gender: me?.profile?.gender || '',
          phone: me?.profile?.phone || '',
          npm: me?.profile?.npm || '',
          facultyId,
          studyProgramId,
          currentSemester: me?.profile?.semester?.toString() || '',
        });
      } catch {
        if (!alive) return;
        toast.error('Gagal memuat profil');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [faculties]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNPM = (npm) => {
    const npmRegex = /^\d{13}$/;
    return npmRegex.test(npm);
  };

  const validateSemester = (semester) => {
    const semesterNum = parseInt(semester, 10);
    return semesterNum >= 1 && semesterNum <= 14;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.npm && !validateNPM(formData.npm)) {
      newErrors.npm = 'NPM harus 13 digit angka';
    }

    if (formData.currentSemester && !validateSemester(formData.currentSemester)) {
      newErrors.currentSemester = 'Semester harus antara 1-14';
    }

    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 16 || currentYear - birthYear > 100) {
        newErrors.birthDate = 'Tanggal lahir tidak valid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toOptionalPositiveInt = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const nextValue = name === 'studyProgramId' ? toOptionalPositiveInt(value) : value;

    setFormData({
      ...formData,
      [name]: nextValue,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value ? Number(e.target.value) : '';
    setFormData({
      ...formData,
      facultyId,
      studyProgramId: '',
    });

    if (facultyId) {
      const selectedFaculty = faculties.find((f) => f.id === facultyId);
      setAvailablePrograms(selectedFaculty?.studyPrograms || []);
    } else {
      setAvailablePrograms([]);
    }

    if (errors.facultyId) {
      setErrors({ ...errors, facultyId: undefined, studyProgramId: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Mohon periksa kembali data yang Anda masukkan');
      return;
    }

    const ok = await confirm({
      title: 'Simpan perubahan profil?',
      description: 'Perubahan profil akan disimpan ke akun Anda.',
      confirmText: 'Simpan',
      cancelText: 'Batal',
    });

    if (!ok) return;

    setSaving(true);

    try {
      const payload = {
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        npm: formData.npm || null,
        facultyId: formData.facultyId ? Number(formData.facultyId) : null,
        studyProgramId: formData.studyProgramId ? Number(formData.studyProgramId) : null,
        semester: formData.currentSemester ? parseInt(formData.currentSemester, 10) : null,
      };

      const trimmedName = formData.fullName.trim();
      if (trimmedName) payload.name = trimmedName;

      await apiFetch('/me/profile', {
        method: 'PATCH',
        body: payload,
      });

      await syncMe();
      toast.success('Profil berhasil diperbarui');
    } catch (e) {
      const msg = e?.message || 'Gagal memperbarui profil';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 sm:p-8 animate-pulse">
        <div className="h-7 w-36 bg-gray-200 rounded mb-8" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-2 text-center sm:text-left">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="space-y-6">

          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-11 w-full bg-gray-100 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-11 w-full bg-gray-100 rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-10 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-lg" />
          </div>

          <div className="flex justify-end pt-2">
            <div className="h-11 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Profil Saya</h2>

      {(() => {
        const userName = formData.fullName || getMe()?.email?.split('@')[0] || 'Pengguna';
        const displayAvatar = userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=256`;

        return (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 pb-4 border-b border-gray-200">
            <div className="relative shrink-0">
              <img src={displayAvatar} alt={userName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary-100 bg-primary-50" referrerPolicy="no-referrer" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{formData.fullName || 'Nama belum diisi'}</h3>
              <p className="text-sm text-gray-600 mb-2">{formData.email}</p>
              {formData.npm && <p className="text-sm text-gray-500">NPM: {formData.npm}</p>}
              {formData.studyProgram && <p className="text-xs text-gray-400 mt-1">{formData.studyProgram}</p>}
            </div>
          </div>
        );
      })()}

      {!userAvatar && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start sm:items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Masuk dengan <strong>Google</strong> agar foto profil otomatis muncul.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="nama@email.com"
            readOnly
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onFocus={(e) => e.currentTarget.showPicker?.()}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Pilih Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NPM</label>
          <input
            type="text"
            name="npm"
            value={formData.npm}
            onChange={handleInputChange}
            maxLength={13}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.npm ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Contoh: 2111010001234"
          />
          {errors.npm && <p className="mt-1 text-sm text-red-600">{errors.npm}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fakultas</label>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleFacultyChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.facultyId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Pilih Fakultas</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          {errors.facultyId && <p className="mt-1 text-sm text-red-600">{errors.facultyId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Program Studi</label>
          <select
            name="studyProgramId"
            value={formData.studyProgramId}
            onChange={handleInputChange}
            disabled={!formData.facultyId}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.studyProgramId ? 'border-red-500' : 'border-gray-300'
              } ${!formData.facultyId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">{formData.facultyId ? 'Pilih Program Studi' : 'Pilih Fakultas terlebih dahulu'}</option>
            {availablePrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.degree})
              </option>
            ))}
          </select>
          {errors.studyProgramId && <p className="mt-1 text-sm text-red-600">{errors.studyProgramId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Semester Saat Ini</label>
          <select
            name="currentSemester"
            value={formData.currentSemester}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.currentSemester ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Pilih Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
          {errors.currentSemester && <p className="mt-1 text-sm text-red-600">{errors.currentSemester}</p>}
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" disabled={saving} className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div >
  );
};

export default ProfilePage;

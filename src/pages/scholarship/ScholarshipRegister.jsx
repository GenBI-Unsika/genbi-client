import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Stepper from '../../components/ui/Stepper';
import { Field, FieldLabel, TextInput, Select, Textarea } from '../../components/ui/FormControls';
import { getMe } from '../../utils/auth.js';
import { scholarshipSubmitApplication, scholarshipGetRegistration, scholarshipGetMyApplication, uploadFileStaging, finalizeBulkUpload, deleteStagingFile, getTempPreviewUrl, getPublicFileUrl } from '../../utils/api.js';
import { fetchFaculties, fetchStudyProgramsByFaculty } from '../../utils/masterData.js';
import { useConfirm } from '../../contexts/ConfirmContext.jsx';
import { buildScholarshipFolderPath } from '../../utils/scholarshipHelpers.js';
import { useFormDraft } from '../../utils/useFormDraft.js';

// File validation constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function validateFile(file) {
  if (!file) return null;
  if (file.size > MAX_FILE_SIZE) {
    return `Ukuran file terlalu besar (${Math.round(file.size / 1024 / 1024)}MB). Maksimal 10MB.`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Tipe file tidak didukung (${file.type || 'unknown'}). Hanya PDF, JPG, dan PNG yang diizinkan.`;
  }
  return null;
}

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

const ScholarshipRegister = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, currentFile: '' });
  const actionsRef = useRef(null);
  const previewUrlsRef = useRef({});
  const [filePreviews, setFilePreviews] = useState({});
  const [dragOverKey, setDragOverKey] = useState(null);
  const fileInputRefs = useRef({});
  const draftRestoredRef = useRef(false);

  // Draft auto-save (persists form text fields to localStorage)
  const { restoreDraft, saveDraft, saveDraftNow, clearDraft } = useFormDraft('scholarship-register', {
    maxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Registration open status
  const [regOpen, setRegOpen] = useState(null); // null = loading
  const [regChecked, setRegChecked] = useState(false);
  const [regBatch, setRegBatch] = useState(null);
  const [registrationDocuments, setRegistrationDocuments] = useState(null);

  // Master data: faculties & study programs
  const [faculties, setFaculties] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [loadingProdi, setLoadingProdi] = useState(false);

  // Staged files for upload (tempIds mapped by doc key)
  const [stagedFiles, setStagedFiles] = useState({}); // { docKey: { tempId, name, previewUrl } }
  const [stagingFile, setStagingFile] = useState(null); // key currently being staged

  // MEMOIZED user to prevent re-renders (getMe returns new object every time)
  const user = useMemo(() => getMe(), []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    birth: '',
    gender: '',
    nik: '',
    phone: '',
    facultyId: '',
    studyProgramId: '',
    semester: '',
    npm: '',
    gpa: '',
    age: '',
    knowGenbi: '',
    knowDesc: '',
    agree: false,
    files: {},
  });

  // Check registration status on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await scholarshipGetRegistration();
        if (!alive) return;
        setRegOpen(Boolean(data?.open));
        setRegBatch(Number.isInteger(Number(data?.batch)) ? Number(data?.batch) : null);
        if (Array.isArray(data?.documents)) {
          setRegistrationDocuments(data.documents);
        } else {
          setRegistrationDocuments(null);
        }
      } catch {
        if (!alive) return;
        setRegOpen(false);
        setRegBatch(null);
        setRegistrationDocuments(null);
      } finally {
        if (alive) setRegChecked(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Guard: prevent applying twice in the same opening/batch
  useEffect(() => {
    if (!regChecked) return;
    if (!regOpen) return;
    if (!user?.id) return;

    let alive = true;
    (async () => {
      try {
        const app = await scholarshipGetMyApplication();
        if (!alive) return;

        const appBatch = Number(app?.batch);
        const currentBatch = Number(regBatch);
        const sameBatch = Number.isInteger(appBatch) && Number.isInteger(currentBatch) ? appBatch === currentBatch : Boolean(app);

        if (app && sameBatch) {
          toast('Kamu sudah mendaftar beasiswa pada pembukaan ini.');
          navigate('/scholarship/selection/admin', { replace: true });
        }
      } catch {
        // ignore: user might not have any application yet
      }
    })();

    return () => {
      alive = false;
    };
  }, [regChecked, regOpen, regBatch, user?.id, navigate]);

  // Load faculties on mount
  useEffect(() => {
    (async () => {
      const data = await fetchFaculties();
      setFaculties(data || []);
    })();
  }, []);

  // Load study programs when faculty changes
  useEffect(() => {
    // If no faculty selected, clear study programs
    if (!form.facultyId) {
      setStudyPrograms([]);
      return;
    }

    let alive = true;
    (async () => {
      setLoadingProdi(true);
      try {
        const data = await fetchStudyProgramsByFaculty(form.facultyId);
        if (!alive) return;
        setStudyPrograms(data || []);
      } catch (err) {
        console.error('Error fetching study programs:', err);
        if (!alive) return;
        setStudyPrograms([]);
      } finally {
        if (alive) setLoadingProdi(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [form.facultyId]);

  // Pre-fill from user profile, then overlay any saved draft
  // Pre-fill from user profile + Restore Draft
  useEffect(() => {
    // 1. Prepare profile data (with formatting fixes)
    let profileData = {};
    if (user?.profile) {
      // Fix Gender mapping (Backend uses full words, User might have 'L'/'P')
      let gender = user.profile.gender;
      if (gender === 'L') gender = 'Laki-laki';
      if (gender === 'P') gender = 'Perempuan';

      // Fix Phone formatting (Standardize to 62...)
      let phone = user.profile.phone || '';
      phone = phone.replace(/\D/g, '');
      if (phone.startsWith('0')) phone = '62' + phone.slice(1);

      profileData = {
        name: user.profile.name || '',
        email: user.email || '',
        gender: gender || '',
        npm: user.profile.npm || '',
        semester: user.profile.semester || '',
        birth: user.profile.birthDate ? new Date(user.profile.birthDate).toISOString().split('T')[0] : '',
        facultyId: user.profile.facultyId ? String(user.profile.facultyId) : '',
        studyProgramId: user.profile.studyProgramId ? String(user.profile.studyProgramId) : '',
        phone: phone,
      };
    }

    // 2. Restore Draft or Apply Profile
    if (!draftRestoredRef.current) {
      draftRestoredRef.current = true;
      const draft = restoreDraft();

      if (draft?.form) {
        // Smart Merge: Handle specific field fallbacks
        let mergedGender = draft.form.gender;
        // Fix legacy draft values
        if (mergedGender === 'L') mergedGender = 'Laki-laki';
        if (mergedGender === 'P') mergedGender = 'Perempuan';
        // Fallback to profile if draft is empty (but profile has data)
        if (!mergedGender && profileData.gender) {
          mergedGender = profileData.gender;
        }

        setForm((prev) => ({
          ...prev,
          ...profileData,
          ...draft.form,
          gender: mergedGender || '', // Apply fixed gender
          agree: false, // Never restore consent
          files: {
            ...(prev.files || {}),
            ...(draft.videoUrl ? { videoUrl: draft.videoUrl } : {}),
          },
        }));

        if (typeof draft.step === 'number' && draft.step >= 0 && draft.step <= 2) {
          setStep(draft.step);
        }
        if (draft.stagedFiles && Object.keys(draft.stagedFiles).length > 0) {
          // Hydrate previewUrl so staged/finalized docs are visible/usable after refresh
          const hydrated = {};
          for (const [key, val] of Object.entries(draft.stagedFiles)) {
            if (!val) continue;
            if (val.fileId) {
              hydrated[key] = {
                ...val,
                previewUrl: val.previewUrl || getPublicFileUrl(val.fileId),
              };
              continue;
            }
            if (val.tempId) {
              hydrated[key] = {
                ...val,
                previewUrl: getTempPreviewUrl(val.tempId),
              };
            }
          }
          setStagedFiles(hydrated);
        }
      } else {
        // No draft -> Initialize with profile data
        console.log('Initializing with profile data:', profileData);
        setForm((prev) => ({ ...prev, ...profileData }));
      }
    }
  }, [user, restoreDraft]);

  // Auto-save form data to localStorage on every change (debounced)
  useEffect(() => {
    // Don't save while submitting or before initial load
    if (submitting || !regChecked) return;
    saveDraft({ form, step, stagedFiles });
  }, [form, step, stagedFiles, submitting, regChecked, saveDraft]);

  // Save draft immediately if user refreshes/closes tab quickly
  useEffect(() => {
    const handler = () => {
      try {
        saveDraftNow({ form, step, stagedFiles });
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form, step, stagedFiles, saveDraftNow]);

  // Auto-calculate age from birth date
  useEffect(() => {
    if (form.birth) {
      const birthDate = new Date(form.birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm((prev) => ({ ...prev, age: String(age) }));
    }
  }, [form.birth]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      for (const url of Object.values(previewUrlsRef.current)) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }
      previewUrlsRef.current = {};
    };
  }, []);

  // Stage file to temp storage immediately on selection
  const handleFileSelect = useCallback(
    async (key, file) => {
      // Clear previous preview URL
      const existingUrl = previewUrlsRef.current[key];
      if (existingUrl) {
        try {
          URL.revokeObjectURL(existingUrl);
        } catch {
          /* ignore */
        }
        delete previewUrlsRef.current[key];
      }

      if (!file) {
        // Remove staged file
        const prev = stagedFiles[key];
        if (prev?.tempId) {
          try {
            await deleteStagingFile(prev.tempId);
          } catch {
            /* ignore */
          }
        }
        setStagedFiles((s) => {
          const n = { ...s };
          delete n[key];
          return n;
        });
        setFilePreviews((p) => {
          const n = { ...p };
          delete n[key];
          return n;
        });
        setForm((old) => {
          const f = { ...old.files };
          delete f[key];
          return { ...old, files: f };
        });
        return;
      }

      // Validate
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      // Set local preview for images and PDFs
      if (file.type?.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        previewUrlsRef.current[key] = url;
        setFilePreviews((prev) => ({ ...prev, [key]: { url, type: file.type } }));
      } else {
        setFilePreviews((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }

      // Hold file reference in form state for display
      setForm((old) => ({ ...old, files: { ...old.files, [key]: file } }));

      // Stage to temp storage
      setStagingFile(key);
      try {
        const result = await uploadFileStaging(file);
        setStagedFiles((s) => ({
          ...s,
          [key]: {
            tempId: result.tempId,
            name: result.name || file.name,
            previewUrl: result.previewUrl || getTempPreviewUrl(result.tempId),
            size: result.size || file.size,
            mimeType: result.mimeType || file.type,
          },
        }));
        toast.success(`${file.name} berhasil disimpan sementara`);
      } catch (err) {
        toast.error(`Gagal menyimpan ${file.name}: ${err.message}`);
        // Cleanup on failure
        setForm((old) => {
          const f = { ...old.files };
          delete f[key];
          return { ...old, files: f };
        });
      } finally {
        setStagingFile(null);
      }
    },
    [stagedFiles],
  );

  const preventDnDDefault = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const staticDocs = useMemo(
    () => [
      { key: 'ktmKtp', title: 'Scan KTP & KTM', desc: 'Dalam 1 file format PDF (Maks 10 MB).', required: true, kind: 'file' },
      { key: 'transkrip', title: 'Transkrip Nilai', desc: 'Bertandatangan dan cap Koordinator Program Studi, format PDF (Maks 10 MB).', required: true, kind: 'file' },
      { key: 'rekomendasi', title: 'Surat Rekomendasi', desc: 'Format PDF (Maks 10 MB).', required: true, kind: 'file' },
      { key: 'suratAktif', title: 'Surat Keterangan Aktif', desc: 'Format PDF (Maks 10 MB).', required: true, kind: 'file' },
      { key: 'sktmSlip', title: 'SKTM / Surat Keterangan Penghasilan / Slip Gaji', desc: 'Format PDF (Maks 10 MB).', kind: 'file' },
      { key: 'formA1', title: 'Biodata Diri Form A.1', desc: 'Unduh formulir pada link yang tersedia, isi dan unggah kembali dalam format PDF.', required: true, kind: 'file', downloadLink: '' },
      { key: 'suratPernyataan', title: 'Surat Pernyataan Tidak Mendaftar/Menerima Beasiswa Lain', desc: 'Unduh formulir pada link yang tersedia, isi dan unggah kembali dalam format PDF.', required: true, kind: 'file', downloadLink: '' },
      { key: 'portofolio', title: 'Portofolio', desc: 'Dalam 1 file format PDF (Maks 10 MB).', kind: 'file' },
      { key: 'videoUrl', title: 'Link Video Pengenalan Diri dan Motivasi', desc: 'Tag Instagram @genbi.unsika, akun tidak di-private (Maks 2 menit).', required: true, kind: 'url' },
      { key: 'instagramUrl', title: 'Link Profil Instagram', desc: 'Akun tidak diprivat selama masa seleksi.', required: true, kind: 'url' },
    ],
    [],
  );

  const docs = useMemo(() => {
    if (!Array.isArray(registrationDocuments) || registrationDocuments.length === 0) return staticDocs;

    // Normalize server payload and keep a stable, minimal shape expected by UI.
    return registrationDocuments
      .filter((d) => d && typeof d.key === 'string')
      .map((d) => ({
        key: String(d.key),
        title: String(d.title || d.key),
        desc: String(d.desc || ''),
        required: Boolean(d.required),
        kind: d.kind || 'file',
        downloadLink: String(d.downloadLink || ''),
      }));
  }, [registrationDocuments, staticDocs]);

  const next = () => {
    // Validate step 0 (Data Pribadi)
    if (step === 0) {
      if (!form.name?.trim()) {
        toast.error('Nama lengkap wajib diisi.');
        return;
      }
      if (!form.email?.trim()) {
        toast.error('Email wajib diisi.');
        return;
      }
      // Email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        toast.error('Format email tidak valid.');
        return;
      }
      if (!form.birth) {
        toast.error('Tanggal lahir wajib diisi.');
        return;
      }
      if (!form.gender) {
        toast.error('Gender wajib dipilih.');
        return;
      }
      if (!form.npm?.trim()) {
        toast.error('NPM wajib diisi.');
        return;
      }
      // NPM format: 13 digits for Unsika
      if (!/^\d{13}$/.test(form.npm.trim())) {
        toast.error('NPM harus terdiri dari 13 digit angka.');
        return;
      }
      if (!form.nik?.trim()) {
        toast.error('NIK wajib diisi.');
        return;
      }
      // NIK format: 16 digits
      if (!/^\d{16}$/.test(form.nik.trim())) {
        toast.error('NIK harus terdiri dari 16 digit angka sesuai KTP.');
        return;
      }

      if (!form.facultyId) {
        toast.error('Fakultas wajib dipilih.');
        return;
      }
      if (!form.studyProgramId) {
        toast.error('Program Studi wajib dipilih.');
        return;
      }
      if (!form.semester) {
        toast.error('Semester wajib dipilih.');
        return;
      }
      if (!form.gpa) {
        toast.error('IPK wajib diisi.');
        return;
      }
      const gpaNum = Number(form.gpa);
      if (Number.isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
        toast.error('IPK harus antara 0 hingga 4.');
        return;
      }
      if (!form.age) {
        toast.error('Usia wajib diisi.');
        return;
      }
      const ageNum = Number(form.age);
      if (!Number.isInteger(ageNum) || ageNum < 15 || ageNum > 40) {
        toast.error('Usia harus antara 15 hingga 40 tahun.');
        return;
      }
      // Optional field format checks (only if filled)
      if (!form.phone?.trim()) {
        toast.error('No. telepon wajib diisi.');
        return;
      }
      if (!/^628\d{8,13}$/.test(form.phone.trim())) {
        toast.error('No. telepon harus diawali 628 dan terdiri dari 11-15 digit.');
        return;
      }
      if (form.knowGenbi === 'Ya' && !form.knowDesc?.trim()) {
        toast.error('Mohon jelaskan pengetahuan Anda mengenai GenBI Unsika.');
        return;
      }
    }

    // Validate step 1 (Pemberkasan) — check all required docs are staged
    if (step === 1) {
      const missingDocs = [];
      for (const d of docs) {
        if (!d.required) continue;
        if (d.kind === 'url') {
          if (!form.files?.[d.key]?.trim()) missingDocs.push(d.title);
        } else {
          const staged = stagedFiles[d.key];
          if (!staged?.fileId && !staged?.tempId) missingDocs.push(d.title);
        }
      }
      if (missingDocs.length > 0) {
        toast.error(`Dokumen wajib belum lengkap: ${missingDocs.join(', ')}`);
        return;
      }
    }

    setStep((s) => Math.min(2, s + 1));
  };
  const prev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (step === 2 && !form.agree) {
      toast.error('Mohon centang pernyataan persetujuan sebelum mengirim data.');
      actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (step !== 2) return;

    // Final defense: re-check all required docs before submit
    const missingDocs = [];
    for (const d of docs) {
      if (!d.required) continue;
      if (d.kind === 'url') {
        if (!form.files?.[d.key]?.trim()) missingDocs.push(d.title);
      } else {
        const staged = stagedFiles[d.key];
        if (!staged?.fileId && !staged?.tempId) missingDocs.push(d.title);
      }
    }
    if (missingDocs.length > 0) {
      toast.error(`Dokumen wajib belum lengkap: ${missingDocs.join(', ')}`);
      setStep(1); // bring back to document step
      return;
    }

    const ok = await confirm({
      title: 'Kirim pendaftaran beasiswa?',
      description: 'Pastikan data dan dokumen sudah benar sebelum mengirim. File akan di-upload ke Google Drive secara terorganisir.',
      confirmText: 'Kirim',
      cancelText: 'Batal',
    });

    if (!ok) return;

    try {
      setSubmitting(true);

      // Build organized folder path for this applicant
      const folderPath = buildScholarshipFolderPath({
        npm: form.npm,
        name: form.name,
      }).join('/');

      // Collect staged files that need to be finalized to GDrive
      const filesToFinalize = [];
      const filesPayload = {};

      for (const d of docs) {
        if (d.kind === 'url') {
          if (form.files?.[d.key]) filesPayload[d.key] = String(form.files[d.key]);
          continue;
        }

        const staged = stagedFiles[d.key];
        // If already finalized previously, reuse the permanent fileId (prevents re-upload on retry)
        if (staged?.fileId) {
          filesPayload[d.key] = String(staged.fileId);
        } else if (staged?.tempId) {
          filesToFinalize.push({
            tempId: staged.tempId,
            folder: folderPath,
            docKey: d.key,
          });
        }
      }

      // Finalize all staged files to GDrive in bulk (organized in applicant folder)
      if (filesToFinalize.length > 0) {
        setUploadProgress({ current: 0, total: filesToFinalize.length, currentFile: 'Menyiapkan upload...' });

        const bulkResult = await finalizeBulkUpload(filesToFinalize.map((f) => ({ tempId: f.tempId, folder: f.folder })));

        // Promote successful staged files to permanent references immediately.
        // This ensures that if the next API call fails, the user can retry without re-uploading.
        const uploadedByTempId = new Map((bulkResult?.uploaded || []).map((u) => [u.tempId, u]));
        setStagedFiles((prev) => {
          const next = { ...prev };
          for (const item of filesToFinalize) {
            const uploaded = uploadedByTempId.get(item.tempId);
            if (!uploaded?.fileId) continue;
            next[item.docKey] = {
              ...(next[item.docKey] || {}),
              tempId: null,
              fileId: uploaded.fileId,
              name: uploaded.name || next[item.docKey]?.name,
              url: uploaded.url,
              previewUrl: uploaded.previewUrl || next[item.docKey]?.previewUrl,
            };
          }
          return next;
        });

        // Map results back to doc keys
        for (const item of filesToFinalize) {
          const uploaded = uploadedByTempId.get(item.tempId);
          if (uploaded?.fileId) {
            filesPayload[item.docKey] = String(uploaded.fileId);
          }
        }

        // Check for errors
        if (bulkResult.errors?.length > 0) {
          const failedItems = filesToFinalize.filter((f) => bulkResult.errors.some((e) => e.tempId === f.tempId));
          const failedKeys = failedItems.map((f) => f.docKey);

          // Remove failed files from stagedFiles so user MUST re-upload
          setStagedFiles((prev) => {
            const next = { ...prev };
            failedKeys.forEach((key) => delete next[key]);
            return next;
          });

          // Also clear from form state to reset UI completely
          setForm((prev) => {
            const nextFiles = { ...prev.files };
            failedKeys.forEach((key) => delete nextFiles[key]);
            return { ...prev, files: nextFiles };
          });

          const failedTitles = docs
            .filter((d) => failedKeys.includes(d.key))
            .map((d) => d.title)
            .join(', ');

          toast.error(`Sesi file telah habis. Mohon unggah ulang dokumen: ${failedTitles}`);
          setStep(1); // Return to document step
          setSubmitting(false);
          return;
        }

        setUploadProgress({ current: filesToFinalize.length, total: filesToFinalize.length, currentFile: 'Selesai!' });
      }

      // Submit application with file IDs
      await scholarshipSubmitApplication({
        name: form.name,
        email: form.email,
        birth: form.birth,
        gender: form.gender,
        nik: form.nik,
        phone: form.phone,
        facultyId: form.facultyId ? Number(form.facultyId) : undefined,
        studyProgramId: form.studyProgramId ? Number(form.studyProgramId) : undefined,
        npm: form.npm,
        semester: form.semester,
        gpa: form.gpa,
        age: form.age,
        knowGenbi: form.knowGenbi,
        knowDesc: form.knowDesc,
        agree: Boolean(form.agree),
        files: filesPayload,
      });

      // Clear saved draft on successful submission
      clearDraft();
      toast.success('Pendaftaran beasiswa berhasil dikirim!');
      navigate('/scholarship/success');
    } catch (err) {
      toast.error(err?.message || 'Gagal mengirim pendaftaran.');
      actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setSubmitting(false);
      setUploadProgress({ current: 0, total: 0, currentFile: '' });
    }
  };

  // Show loading while checking registration status
  if (!regChecked) {
    return (
      <div className="min-h-screen bg-page">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
              <p className="text-sm text-neutral-500">Memeriksa status pendaftaran...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show closed message if registration is not open
  if (regOpen === false) {
    return (
      <div className="min-h-screen bg-page">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-xl border border-neutral-200 bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m-4.93 3.07A10 10 0 1 1 20.07 5.93 10 10 0 0 1 5.07 18.07z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-body">Pendaftaran Ditutup</h2>
            <p className="text-sm text-neutral-500">Pendaftaran beasiswa sedang tidak dibuka saat ini. Pantau informasi terbaru di halaman beasiswa.</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate('/scholarship');
              }}
              className="btn btn-primary mt-6"
            >
              Kembali ke Halaman Beasiswa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-xl font-extrabold tracking-tighter text-neutral-900 sm:text-2xl lg:text-3xl">
          Formulir <span className="text-primary-600">Pendaftaran</span>
        </h1>

        <div className="mb-6 rounded-xl border border-neutral-200 bg-surface p-6">
          <Stepper current={step} items={['Data Pribadi', 'Pemberkasan', 'Validasi Data']} />
        </div>

        <form onSubmit={submit} className="rounded-xl border border-neutral-200 bg-surface p-6">
          {/* STEP 1 — Data Pribadi */}
          {step === 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name" required>
                  Nama Lengkap
                </FieldLabel>
                <TextInput id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama sesuai KTP" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" required>
                  Email
                </FieldLabel>
                <TextInput id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" />
              </Field>

              <Field>
                <FieldLabel htmlFor="birth" required>
                  Tanggal Lahir
                </FieldLabel>
                <TextInput id="birth" type="date" value={form.birth} onChange={(e) => setForm({ ...form, birth: e.target.value })} max={new Date().toISOString().slice(0, 10)} placeholder="dd/mm/yyyy" />
              </Field>

              <Field>
                <FieldLabel htmlFor="gender" required>
                  Jenis Kelamin
                </FieldLabel>
                <Select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Pilih Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="nik" required>
                  NIK
                </FieldLabel>
                <TextInput
                  id="nik"
                  value={form.nik}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setForm({ ...form, nik: val });
                  }}
                  placeholder="16 digit NIK"
                  inputMode="numeric"
                  maxLength={16}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" required>
                  No Telp
                </FieldLabel>
                <TextInput
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.startsWith('0')) {
                      val = '62' + val.slice(1);
                    }
                    setForm({ ...form, phone: val.slice(0, 15) });
                  }}
                  placeholder="628xxxxxxxxxx"
                  inputMode="numeric"
                  maxLength={15}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="facultyId" required>
                  Fakultas
                </FieldLabel>
                <Select
                  id="facultyId"
                  value={form.facultyId}
                  onChange={(e) => {
                    setForm({ ...form, facultyId: e.target.value, studyProgramId: '' });
                  }}
                >
                  <option value="">Pilih Fakultas</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={String(f.id)}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="studyProgramId" required>
                  Program Studi
                </FieldLabel>
                <Select id="studyProgramId" value={form.studyProgramId} onChange={(e) => setForm({ ...form, studyProgramId: e.target.value })} disabled={!form.facultyId || loadingProdi}>
                  <option value="">{loadingProdi ? 'Memuat...' : 'Pilih Program Studi'}</option>
                  {studyPrograms.map((sp) => (
                    <option key={sp.id} value={String(sp.id)}>
                      {sp.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="npm" required>
                  NPM
                </FieldLabel>
                <TextInput
                  id="npm"
                  value={form.npm}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 13);
                    setForm({ ...form, npm: val });
                  }}
                  placeholder="13 digit NPM"
                  inputMode="numeric"
                  maxLength={13}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="semester" required>
                  Semester
                </FieldLabel>
                <Select id="semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                  <option value="">Pilih Semester</option>
                  {[2, 4, 6, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="gpa" required>
                  IPK Terakhir
                </FieldLabel>
                <TextInput
                  id="gpa"
                  type="text"
                  inputMode="decimal"
                  value={form.gpa}
                  onChange={(e) => {
                    // Replace comma with dot
                    let val = e.target.value.replace(/,/g, '.');
                    // Allow only digits and one dot
                    if (!/^\d*\.?\d*$/.test(val)) return;
                    setForm({ ...form, gpa: val });
                  }}
                  onBlur={(e) => {
                    let val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      // Clamp between 0 and 4
                      if (val < 0) val = 0;
                      if (val > 4) val = 4;
                      setForm({ ...form, gpa: val.toFixed(2) });
                    }
                  }}
                  placeholder="3.00"
                  maxLength={4}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="age" required>
                  Usia (Tahun)
                </FieldLabel>
                <TextInput id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Contoh: 20" min="15" max="40" />
              </Field>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <FieldLabel htmlFor="knowGenbi">Apakah kamu mengetahui GenBI Unsika?</FieldLabel>
                  <Select id="knowGenbi" value={form.knowGenbi} onChange={(e) => setForm({ ...form, knowGenbi: e.target.value, knowDesc: e.target.value === 'Tidak' ? '' : form.knowDesc })}>
                    <option value="">Pilih Jawaban</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </Select>
                </div>

                {form.knowGenbi === 'Ya' && (
                  <Field>
                    <FieldLabel htmlFor="knowDesc" required>
                      Jika ya, jelaskan apa yang kamu ketahui mengenai GenBI Unsika?
                    </FieldLabel>
                    <Textarea id="knowDesc" value={form.knowDesc} onChange={(e) => setForm({ ...form, knowDesc: e.target.value })} placeholder="Tulis pengetahuanmu tentang GenBI Unsika di sini..." />
                  </Field>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 — Pemberkasan */}
          {step === 1 && (
            <div className="space-y-6">
              {docs.map((d) => (
                <div key={d.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {d.title}
                        {d.required && <span className="ml-1 text-red-500">*</span>}
                      </p>
                      {d.desc && <p className="text-xs text-neutral-500">{d.desc}</p>}
                      {d.downloadLink && (
                        <a href={normalizeUrl(d.downloadLink)} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                          </svg>
                          Unduh Formulir
                        </a>
                      )}
                    </div>
                    {d.kind !== 'url' && stagedFiles[d.key] && <span className="rounded-md bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-600">Siap dikirim</span>}
                    {d.kind !== 'url' && stagingFile === d.key && <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-600 animate-pulse">Menyimpan...</span>}
                  </div>

                  {d.kind === 'url' ? (
                    <TextInput placeholder={`Tempel link ${d.title} di sini`} value={form.files[d.key] || ''} onChange={(e) => setForm((old) => ({ ...old, files: { ...old.files, [d.key]: e.target.value } }))} />
                  ) : (
                    <label className="block cursor-pointer">
                      <div
                        className={`rounded-lg border-2 border-dashed bg-neutral-50 p-5 text-center transition-colors ${
                          stagingFile !== null ? 'border-neutral/30 opacity-70' : dragOverKey === d.key ? 'border-neutral/80' : 'border-neutral/40 hover:border-neutral/60'
                        }`}
                        onDragEnter={(e) => {
                          if (stagingFile !== null) return;
                          preventDnDDefault(e);
                          setDragOverKey(d.key);
                        }}
                        onDragOver={(e) => {
                          if (stagingFile !== null) return;
                          preventDnDDefault(e);
                          setDragOverKey(d.key);
                        }}
                        onDragLeave={(e) => {
                          if (stagingFile !== null) return;
                          preventDnDDefault(e);
                          setDragOverKey((k) => (k === d.key ? null : k));
                        }}
                        onDrop={(e) => {
                          if (stagingFile !== null) return;
                          preventDnDDefault(e);
                          setDragOverKey(null);
                          const dt = e.dataTransfer;
                          const files = dt?.files;
                          if (!files || files.length === 0) return;
                          if (files.length > 1) {
                            toast.error('Hanya bisa unggah 1 file per dokumen.');
                            return;
                          }

                          const droppedFile = files[0];
                          handleFileSelect(d.key, droppedFile);
                          const inputEl = fileInputRefs.current?.[d.key];
                          if (inputEl) inputEl.value = '';
                        }}
                      >
                        {dragOverKey === d.key ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-neutral-800">Lepaskan file untuk mengunggah</p>
                            <p className="text-xs text-neutral-500">PDF/JPG/PNG, maks 10MB</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm text-neutral-600">Drag & drop atau klik untuk unggah</p>
                            <p className="text-xs text-neutral-500">PDF/JPG/PNG, maks 10MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        disabled={stagingFile !== null}
                        ref={(el) => {
                          if (el) fileInputRefs.current[d.key] = el;
                        }}
                        onChange={(e) => {
                          const value = e.target.files?.[0] || null;
                          handleFileSelect(d.key, value);
                          e.currentTarget.value = '';
                        }}
                      />

                      {form.files?.[d.key] instanceof File ? (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                            {form.files[d.key].type?.startsWith('image/') && filePreviews[d.key] ? (
                              <img src={filePreviews[d.key].url} alt={form.files[d.key].name} className="h-12 w-12 rounded-md object-cover border border-neutral-200" />
                            ) : (
                              <div className="h-12 w-12 rounded-md border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs text-neutral-500 font-medium">PDF</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-neutral-800">{form.files[d.key].name}</p>
                              <p className="text-xs text-neutral-500">{Math.round(form.files[d.key].size / 1024)} KB</p>
                            </div>
                            <button
                              type="button"
                              disabled={stagingFile !== null}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFileSelect(d.key, null);
                              }}
                              className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                            >
                              Hapus
                            </button>
                          </div>

                          {/* Inline Preview */}
                          {filePreviews[d.key] && (
                            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 overflow-hidden">
                              {filePreviews[d.key].type?.startsWith('image/') ? (
                                <img src={filePreviews[d.key].url} alt={form.files[d.key].name} className="w-full h-auto rounded-md" />
                              ) : filePreviews[d.key].type === 'application/pdf' ? (
                                <iframe src={filePreviews[d.key].url} className="w-full rounded-md border-0" style={{ height: '500px' }} title={form.files[d.key].name} />
                              ) : null}
                            </div>
                          )}
                        </div>
                      ) : stagedFiles?.[d.key]?.fileId || stagedFiles?.[d.key]?.tempId ? (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                            {String(stagedFiles[d.key].mimeType || '').startsWith('image/') ? (
                              <img
                                src={stagedFiles[d.key].fileId ? getPublicFileUrl(stagedFiles[d.key].fileId) : stagedFiles[d.key].previewUrl || getTempPreviewUrl(stagedFiles[d.key].tempId)}
                                alt={stagedFiles[d.key].name || d.title}
                                className="h-12 w-12 rounded-md object-cover border border-neutral-200"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-md border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs text-neutral-500 font-medium">PDF</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-neutral-800">{stagedFiles[d.key].name || 'Dokumen tersimpan sementara'}</p>
                              {stagedFiles[d.key].size ? <p className="text-xs text-neutral-500">{Math.round(stagedFiles[d.key].size / 1024)} KB</p> : <p className="text-xs text-neutral-500">(hasil restore setelah refresh)</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={stagedFiles[d.key].fileId ? getPublicFileUrl(stagedFiles[d.key].fileId) : stagedFiles[d.key].previewUrl || getTempPreviewUrl(stagedFiles[d.key].tempId)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                              >
                                Preview
                              </a>
                              <button
                                type="button"
                                disabled={stagingFile !== null}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleFileSelect(d.key, null);
                                }}
                                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — Validasi Data */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Summary of staged files */}
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="mb-3 text-sm font-semibold text-body">Ringkasan Dokumen</p>
                <div className="space-y-2">
                  {docs.map((d) => {
                    const isUrl = d.kind === 'url';
                    const hasFile = isUrl ? Boolean(form.files?.[d.key]) : Boolean(stagedFiles[d.key]);
                    return (
                      <div key={d.key} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-700">{d.title}</span>
                        {hasFile ? <span className="text-green-600 font-medium">&#10003; Siap</span> : <span className={`${d.required ? 'text-red-500' : 'text-neutral-400'}`}>{d.required ? 'Belum diisi' : 'Opsional'}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="mb-3 text-sm font-semibold text-body">Apakah data diri yang Anda serahkan benar milik Anda?</p>
                <label className="flex items-start gap-3 text-sm text-neutral-700">
                  <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-1" />
                  <span>
                    Saya <span className="font-medium">{form.name || '_____'}</span> menyatakan data yang saya serahkan benar milik saya dan tidak ada unsur kebohongan. Jika terdapat pemalsuan data, saya akan menerima konsekuensinya.
                  </span>
                </label>
                <p className="mt-3 text-xs text-neutral-500">Dengan menyetujui di atas, Anda menyerahkan data diri untuk pendaftaran Beasiswa Bank Indonesia.</p>
              </div>
            </div>
          )}

          {submitting && uploadProgress.total > 0 && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Uploading dokumen... ({uploadProgress.current}/{uploadProgress.total})
                  </p>
                  <p className="text-xs text-blue-600">{uploadProgress.currentFile}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
                    <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={actionsRef} className="mt-8 flex items-center justify-between">
            <button type="button" onClick={prev} disabled={step === 0 || submitting} className="btn btn-neutral border border-neutral-200 disabled:opacity-40">
              Kembali
            </button>

            {step < 2 ? (
              <button key="btn-next" type="button" onClick={next} disabled={stagingFile !== null} className="btn btn-primary disabled:opacity-60">
                {stagingFile !== null ? 'Menyimpan file...' : 'Selanjutnya'}
              </button>
            ) : (
              <button key="btn-submit" type="submit" disabled={submitting || stagingFile !== null || !form.agree} className="btn btn-primary disabled:opacity-60">
                {submitting ? 'Mengirim…' : 'Serahkan Data'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipRegister;

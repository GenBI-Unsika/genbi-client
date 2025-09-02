import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepperFlyon from '../../components/ui/StepperFlyon';
import { Field, FieldLabel, TextInput, Select, Textarea } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';

const ScholarshipRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showAgreeError, setShowAgreeError] = useState(false);
  const actionsRef = useRef(null);
  const [form, setForm] = useState({
    name: 'Devi Fitriani Maulana',
    email: '2010631250000@student.unsika.ac.id',
    birth: '',
    gender: 'Perempuan',
    nik: '',
    phone: '',
    faculty: 'Fakultas Ilmu Komputer',
    study: 'Sistem Informasi',
    semester: '',
    npm: '2010631250000',
    gpa: '',
    age: '',
    knowGenbi: '',
    knowDesc: '',
    agree: false,
    files: {},
  });

  const docs = useMemo(
    () => [
      { key: 'formA1', title: 'Form A.1 & Surat Pernyataan', desc: 'PDF bertanda tangan.' },
      { key: 'ktmKtp', title: 'KTM & KTP', desc: 'Gabung 1 PDF.' },
      { key: 'transkrip', title: 'Transkrip Nilai', desc: 'Cap & ttd Prodi.' },
      { key: 'motivation', title: 'Motivation Letter', desc: 'Bahasa Indonesia.' },
      { key: 'sktmSlip', title: 'SKTM / Slip Gaji Orang Tua', desc: 'Pilih salah satu.' },
      { key: 'rekomendasi', title: 'Surat Rekomendasi', desc: 'Tokoh akademik/non.' },
      { key: 'videoUrl', title: 'URL Video IG', desc: 'Reels yang men-tag @genbi.unsika.' },
      { key: 'lainnya1', title: 'Dokumen Tambahan 1' },
      { key: 'lainnya2', title: 'Dokumen Tambahan 2' },
    ],
    []
  );

  const next = () => {
    setShowAgreeError(false);
    setStep((s) => Math.min(2, s + 1));
  };
  const prev = () => {
    setShowAgreeError(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = (e) => {
    e.preventDefault();
    if (step === 2 && !form.agree) {
      setShowAgreeError(true);
      actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    navigate('/scholarship/success');
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-body">Formulir Pendaftaran</h1>

        <div className="mb-6 rounded-xl border border-neutral-200 bg-surface p-6">
          <StepperFlyon current={step} items={['Data Pribadi', 'Pemberkasan', 'Validasi Data']} />
        </div>

        <form onSubmit={submit} className="rounded-xl border border-neutral-200 bg-surface p-6">
          {/* STEP 1 */}
          {step === 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name" required>
                  Nama Lengkap
                </FieldLabel>
                <TextInput id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama lengkap" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" required>
                  Email
                </FieldLabel>
                <TextInput id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@student.unsika.ac.id" />
              </Field>

              <Field>
                <FieldLabel htmlFor="birth" required>
                  Tanggal Lahir
                </FieldLabel>
                <TextInput id="birth" type="date" value={form.birth} onChange={(e) => setForm({ ...form, birth: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel htmlFor="gender" required>
                  Gender
                </FieldLabel>
                <Select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option>Perempuan</option>
                  <option>Laki-laki</option>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="nik">NIK</FieldLabel>
                <TextInput id="nik" value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} placeholder="Masukkan NIK" />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">No Telp</FieldLabel>
                <TextInput id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" />
              </Field>

              <Field>
                <FieldLabel htmlFor="faculty">Fakultas</FieldLabel>
                <Select id="faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}>
                  {['Fakultas Ilmu Komputer', 'Fakultas Ekonomi', 'Fakultas Hukum', 'FISIP', 'FAPERTA', 'FKIP', 'FT', 'FIKES', 'FAI'].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="study">Program Studi</FieldLabel>
                <Select id="study" value={form.study} onChange={(e) => setForm({ ...form, study: e.target.value })}>
                  {['Sistem Informasi', 'Informatika', 'Ilmu Hukum', 'Manajemen', 'Ilmu Komunikasi'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="npm">NPM</FieldLabel>
                <TextInput id="npm" value={form.npm} onChange={(e) => setForm({ ...form, npm: e.target.value })} placeholder="Masukkan NPM" />
              </Field>

              <Field>
                <FieldLabel htmlFor="semester">Semester Saat Ini</FieldLabel>
                <Select id="semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                  <option value="">Pilih Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="gpa">IPK</FieldLabel>
                <TextInput id="gpa" type="number" step="0.01" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} placeholder="3.45" />
              </Field>

              <Field>
                <FieldLabel htmlFor="age">Usia</FieldLabel>
                <TextInput id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Tuliskan usia saat ini" />
              </Field>

              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-neutral-700">Apakah kamu mengetahui komunitas GenBI Unsika?</p>
                <div className="flex items-center gap-6 text-sm">
                  {['Ya', 'Tidak'].map((v) => (
                    <label key={v} className="inline-flex items-center  gap-2">
                      <input type="radio" name="know" value={v} checked={form.knowGenbi === v} onChange={(e) => setForm({ ...form, knowGenbi: e.target.value })} />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Field>
                  <FieldLabel htmlFor="knowDesc">Jika kamu mengetahuinya, jelaskan apa yang kamu ketahui mengenai GenBI Unsika?</FieldLabel>
                  <Textarea id="knowDesc" value={form.knowDesc} onChange={(e) => setForm({ ...form, knowDesc: e.target.value })} placeholder="Tulis jawabanmu di sini..." />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-6">
              {docs.map((d) => (
                <div key={d.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-base-content">{d.title}</p>
                      {d.desc && <p className="text-xs text-neutral-500">{d.desc}</p>}
                    </div>
                    {form.files[d.key] && <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Terkirim</span>}
                  </div>

                  {d.key === 'videoUrl' ? (
                    <TextInput placeholder="Tempel URL reels IG di sini" value={form.files.videoUrl || ''} onChange={(e) => setForm((old) => ({ ...old, files: { ...old.files, videoUrl: e.target.value } }))} />
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="rounded-lg border-2 border-dashed border-neutral/40 bg-base-200 p-5 text-center hover:border-neutral/60">
                        <p className="text-sm text-neutral-600">Unggah file (PDF/JPG/PNG)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={(e) => {
                          const value = e.target.files?.[0] || null;
                          setForm((old) => ({ ...old, files: { ...old.files, [d.key]: value } }));
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-4">
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

              {/* Alert profesional (muncul hanya di step 3 dan saat submit gagal) */}
              <Alert show={showAgreeError} title="Konfirmasi diperlukan" message="Mohon centang pernyataan persetujuan sebelum mengirim data." onClose={() => setShowAgreeError(false)} />
            </div>
          )}

          {/* Actions */}
          <div ref={actionsRef} className="mt-8 flex items-center justify-between">
            <button type="button" onClick={prev} disabled={step === 0} className="btn btn-neutral border border-neutral-200 disabled:opacity-40">
              Kembali
            </button>

            {step < 2 ? (
              <button type="button" onClick={next} className="btn btn-primary">
                Selanjutnya
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Serahkan Data
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipRegister;

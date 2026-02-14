/**
 * Builds the GDrive folder path segments for a scholarship applicant.
 * Structure: Beasiswa / Periode-{year} / {NPM}-{Name}
 *
 * This mirrors the server-side `buildScholarshipFolderPath` in gdrive.js
 * so the client can display the expected folder path to the user.
 *
 * @param {{ npm: string, name: string, year?: number }} applicant
 * @returns {string[]}
 */
export function buildScholarshipFolderPath({ npm, name, year }) {
  const y = year || new Date().getFullYear();
  const safeName = (name || 'Unknown')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return ['Beasiswa', `Periode-${y}`, `${npm}-${safeName}`];
}

/**
 * Document types for scholarship registration.
 * This is a fallback — the actual config is fetched from the server
 * (GET /scholarships/registration → documents), which can be managed via CMS.
 */
export const SCHOLARSHIP_DOCS = [
  { key: 'ktmKtp', title: 'Scan KTP & KTM', desc: 'Dalam 1 file format PDF (Maks 10 MB).', required: true, kind: 'file' },
  { key: 'transkrip', title: 'Transkrip Nilai', desc: 'Bertandatangan dan cap Koordinator Program Studi, format PDF (Maks 10 MB).', required: true, kind: 'file' },
  { key: 'rekomendasi', title: 'Surat Rekomendasi', desc: 'Format PDF (Maks 10 MB).', required: true, kind: 'file' },
  { key: 'suratAktif', title: 'Surat Keterangan Aktif', desc: 'Format PDF (Maks 10 MB).', required: true, kind: 'file' },
  { key: 'sktmSlip', title: 'SKTM / Surat Keterangan Penghasilan / Slip Gaji', desc: 'Format PDF (Maks 10 MB).', required: false, kind: 'file' },
  { key: 'formA1', title: 'Biodata Diri Form A.1', desc: 'Unduh formulir pada link yang tersedia, isi dan unggah kembali dalam format PDF.', required: true, kind: 'file', downloadLink: '' },
  { key: 'suratPernyataan', title: 'Surat Pernyataan Tidak Mendaftar/Menerima Beasiswa Lain', desc: 'Unduh formulir pada link yang tersedia, isi dan unggah kembali dalam format PDF.', required: true, kind: 'file', downloadLink: '' },
  { key: 'portofolio', title: 'Portofolio', desc: 'Dalam 1 file format PDF (Maks 10 MB).', required: false, kind: 'file' },
  { key: 'videoUrl', title: 'Link Video Pengenalan Diri dan Motivasi', desc: 'Tag Instagram @genbi.unsika, akun tidak di-private (Maks 2 menit).', required: true, kind: 'url' },
  { key: 'instagramUrl', title: 'Link Profil Instagram', desc: 'Akun tidak diprivat selama masa seleksi.', required: true, kind: 'url' },
];

# 🦅 GenBI UNSIKA Client (Public Portal)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-19.1.0-61dafb.svg?logo=react)
![Vite](https://img.shields.io/badge/vite-6.3.5-646cff.svg?logo=vite)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.1.6-38b2ac.svg?logo=tailwind-css)

## 📖 Introduction / Description

**GenBI Client** adalah modul antarmuka publik (Frontend) untuk website resmi Generasi Baru Indonesia (GenBI) Komisariat Universitas Singaperbangsa Karawang (UNSIKA). Modul ini berfungsi sebagai portal informasi utama bagi mahasiswa, anggota GenBI, maupun masyarakat umum. Di sini, pengunjung bisa melihat profil organisasi, membaca artikel/berita terbaru, melihat galeri kegiatan, serta mendaftar menjadi anggota (OpRec).

Modul ini dibangun mengutamakan performa tinggi (menggunakan Vite), UI/UX yang modern & responsif (menggunakan TailwindCSS dan Framer Motion), serta interaktivitas real-time (React 19).

## 🎯 Key Features

- **Public Landing Page**: Menampilkan informasi sekilas tentang GenBI UNSIKA, Visi Misi, dan Highlight Kegiatan.
- **Article & News Portal**: Sistem publikasi artikel dan pengumuman dengan fitur pencarian dan filter kategori.
- **Scholarship Information**: Halaman khusus yang menjelaskan detail beasiswa Bank Indonesia.
- **Interactive Gallery**: Menampilkan dokumentasi kegiatan organisasi (Testimoni, Foto-foto).
- **Authentication & Member Area**: Login terintegrasi dengan Google Auth (`@react-oauth/google`).
- **Open Recruitment (OpRec) Form**: Form pendaftaran dinamis untuk calon anggota baru.

## 🛠️ Tech Stack & Ekosistem

Jangan asal install package baru! Ini adalah persenjataan yang sudah kami siapkan. Pahami fungsi masing-masing:

- **Core Framework**: React (`^19.1.0`) & React DOM (`^19.1.0`)
- **Build Tool**: Vite (`^6.3.5`) dengan plugin `@vitejs/plugin-react`
- **Routing**: React Router DOM (`^7.8.2`)
- **Styling Core**: Tailwind CSS (`^4.1.6`) via `@tailwindcss/vite`
- **Animation Engine**:
  - Framer Motion (`^12.23.12`) - *Untuk animasi transisi kompleks*
  - GSAP (`^3.13.0`) - *Untuk scroll reveal & custom timeline*
  - React Spring (`^10.0.1`)
  - TailwindCSS Motion & Intersect
- **Carousel / Slider**: Embla Carousel React (`^8.6.0`)
- **Iconography**:
  - Lucide React (`^0.541.0`)
  - Iconify React (`^6.0.0`) & Iconify JSON Tabler
- **Forms & Validation**: React Hook Form (`^7.62.0`)
- **QR Code Generator**: `qrcode` (`^1.5.4`) & `qrcode.react` (`^4.2.0`)
- **Notifications / Toast**: React Hot Toast (`^2.6.0`)
- **Security / Sanitization**: DOMPurify (`^3.3.1`) - *Mencegah XSS pada konten artikel HTML*
- **Authentication**: React OAuth Google (`^0.12.2`)
- **Typography (Fonts)**: `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource/poppins`
- **Testing**: Vitest (`^3.2.4`), Testing Library (`jest-dom`, `react`, `user-event`)

## ⚙️ Prerequisites

Sebelum Anda berani menjalankan perintah `npm install`, pastikan di komputer Anda sudah terpasang:

- **Node.js**: Minimal veri 18.x (Disarankan versi LTS 20.x atau 22.x).
- **NPM / Yarn**: NPM bawaan Node.js.
- **GenBI Server**: Backend (`genbi-server`) WAJIB sudah berjalan di port `3500` secara lokal agar API bisa diakses (Jika tidak, Vite Proxy akan mengembalikan error 502/Network Error).

## 🚀 Installation & Starter

Ikuti langkah ini secara berurutan. Jangan ada yang dilewatkan:

1. **Clone Repository (Jika belum)**
   ```bash
   git clone <repository-url>
   cd project-fullstack/genbiunsika/genbi-client
   ```

2. **Install Dependencies**
   Jangan gunakan `-g` kecuali Anda tahu apa yang Anda lakukan!
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Salin dari template yang ada:
   ```bash
   cp .env.example .env.local
   ```
   Lalu isi variabel tersebut (lihat bagian Environment Variables di bawah).

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka browser dan arahkan senjata Anda ke: `http://localhost:5173`

## 🔐 Environment Variables

Modul ini membutuhkan file konfigurasi `.env` (atau `.env.local`). Berikut adalah konfigurasi mutlak yang harus ada:

```env
# URL dasar untuk endpoint API lokal maupun production. 
# Jika lokal, Vite Proxy akan meneruskannya ke backend port 3500.
VITE_API_BASE_URL=http://localhost:3500/api/v1

# Client ID untuk Google OAuth/Login. Dapatkan dari Google Cloud Console.
VITE_GOOGLE_CLIENT_ID=1015424406938-so5oeb8hicss9kad02s8i9kf20adhkvm.apps.googleusercontent.com
```
*Catatan: Variabel yang terekspos ke sisi klien (browser) HARUS memiliki prefix `VITE_`.*

## 📂 Folder Structure

Pahami arsitektur pangkalan kita. Jangan menaruh file sembarangan!

```text
genbi-client/
├── public/              # Aset statis (Favicon, Logo robot.txt) yang tidak di-build
├── src/
│   ├── components/      # (UI Components) Navbar, Footer, Modal, Card, Buttons, dll
│   ├── contexts/        # Provider global React Context (AuthContext, ThemeContext)
│   ├── pages/           # Komponen level Halaman (Home, Article, Profile)
│   ├── router/          # Konfigurasi routing utama aplikasi
│   ├── services/        # Wrapper API call menggunakan Axios/Fetch
│   ├── test/            # Setup file untuk testing Vitest (setup.js)
│   ├── utils/           # Helper functions murni (formatting tanggal, regex)
│   ├── App.jsx          # Root component router provider
│   ├── main.jsx         # Entry point aplikasi React & mount DOM
│   ├── index.css        # Tailwind directives & global CSS styling
├── .env.example         # Template environment variables
├── eslint.config.js     # Aturan ketat linter kode!
├── package.json         # Daftar amunisi dependencies & scripts manifest
└── vite.config.js       # Konfigurasi proxy dev & build Vite
```

## 💻 Usage / Examples

Berikut adalah contoh cara modul ini memanggil Service API terpusat untuk menampilkan data:

**1. Contoh Pemanggilan API Service (di `services/api.js`)**
```javascript
export const fetchArticles = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
```

**2. Contoh Implementasi Komponen UI**
```jsx
// src/components/cards/ArticleCard.jsx
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, brief }) => (
  <div className="p-4 border rounded shadow hover:shadow-lg transition-shadow motion-preset-fade">
    <h3 className="text-xl font-bold font-inter">{title}</h3>
    <p className="text-gray-600 mb-2">{brief}</p>
    <Link to={`/articles/${id}`} className="text-blue-500 hover:text-blue-600">
      Baca Selengkapnya
    </Link>
  </div>
);

export default ArticleCard;
```

## 🔌 API Documentation (Frontend Perspective)

Walaupun ini adalah Frontend, aplikasi ini bergantung sepenuhnya pada API dari `genbi-server`. Server Vite secara otomatis mengatur Proxy untuk `/api` langsung ke port `3500`.

**Endpoint Utama yang Dikonsumsi:**
- `GET /api/v1/articles` : Mengambil daftar artikel publik.
- `GET /api/v1/activities` : Mengambil highlight kegiatan GenBI.
- `POST /api/v1/auth/google` : Mengirim token Google ke server untuk validasi login/register.
- `GET /api/v1/me` : Validasi token JWT yang ada di localStorage.

*Format response standar:*
```json
{
  "status": "success",
  "data": { ... }
}
```

## 📜 Commands (CLI)

Gunakan perintah ini layaknya seorang profesional:

| Command | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite development server (hot-reload aktif). |
| `npm run build` | Melakukan proses build production-ready ke folder `/dist`. |
| `npm run preview`| Menjalankan web server lokal untuk testing folder `/dist` hasil build. |
| `npm run lint` | Menjalankan ESLint untuk mencari kode busuk (error syntax/style). |
| `npm run test` | Menjalankan unit test dengan Vitest (sekali jalan). |
| `npm run test:watch` | Menjalankan unit test pada mode watch. |
| `npm run test:coverage`| Menghasilkan laporan coverage test. |

## 🧪 Testing

Modul ini menggunakan **Vitest** dan **React Testing Library**. Lingkungan jsdom sudah dikonfigurasi pada `vite.config.js`.

Untuk menjalankan semua test:
```bash
npm run test
```

*Aturan Mafia:* "Jika satu komponen gagal lolos test, jangan pernah berani push kode Anda ke origin main!"

## 🚑 Troubleshooting

**1. Halaman web blank (putih) dan console browser muncul pesan CORS Error:**
- **Solusi**: Vite proxy mungkin tidak menemukan target server. Pastikan `genbi-server` berjalan dengan command `npm run dev` pada terminal sebelahnya, dan `.env` sudah sesuai: `VITE_API_BASE_URL=http://localhost:3500/api/v1`.

**2. Google Login tidak merespon / Error 500 (Network):**
- **Solusi**: Pastikan pop-ups pada browser tidak di-block. Pada environment development `vite.config.js` sudah mengatur header COOP/COEP, namun jika masih bermasalah coba ubah network ke Public/Private dan matikan ekstensi AdBlocker.

**3. Styling Tailwind tidak teraplikasikan / terlihat rusak:**
- **Solusi**: Restart server Vite. Karena ini memakai Vite TailwindCSS 4, terkadang file cache perlu di refresh. Tekan `ctrl + c` lalu jalankan ulang `npm run dev`.

## 🤝 Contribution

Ini sistem organisasi, bukan proyek pribadi. Ikuti aturan main pengerjaan kode:
1. Setiap fitur / bug fix HARUS dilakukan pada branch baru (contoh: `feature/gallery-ui` atau `fix/login-button`).
2. Tulis pesan commit dengan prefix yang jelas: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`.
3. Pastikan kode Anda rapi (sudah lolos `npm run lint`).
4. Buat Pull Request ke branch `develop` (jangan langsung ke `main`).
5. Tunggu persetujuan dari Tech Lead sebelum di-merge.

## � Developer Handover Guide (Korelasi & Arsitektur)

Untuk memudahkan *developer* baru yang akan melanjutkan (handover) pengerjaan portal public `genbi-client`, berikut adalah Peta Navigasi Arsitektur secara detail:

### 1. Peta Korelasi Modul (File Correlation)
Aplikasi ini memisahkan logika (Logics/State), antarmuka (UI/Components), dan pengaturan jaringan (API/Services) dengan tegas:

- **`src/main.jsx` & `src/App.jsx`**: Akar dari aplikasi. Menginisiasi `RouterProvider`, Global Contexts (misal `AuthContext`, Google OAuth Provider), dan layanan Notifikasi global (`Toaster`).
- **`src/pages/` (Smart Components)**: Bertanggung jawab memegang *state*, memanggil API (`useEffect` / fetch hooks), dan mengelola logika halaman. Contoh: `ArticlesPage.jsx` memanggil data dari backend lalu mengirimkannya sebagai *props* ke komponen anak.
- **`src/components/` (Dumb/Presentational Components)**: Komponen UI re-usable yang idealnya statis dan tidak secara langsung memanggil *network request*. Menerima data hanya melalui *props*.
  - `components/ui/` atau `components/shared/`: Komponen *super-dasar* (Tombol, Input, Modal, Alert).
  - `components/cards/`: Standar kartu artikel, kegiatan, beasiswa, agar tetap seragam dimensinya di semua tempat.
- **`src/utils/` & `src/services/`**:
  - Tempat komando terpusat untuk komunikasi Backend. Jangan menggunakan `fetch()` atau `axios` murni di tengah-tengah komponen React. Gunakan/buat wrapper fungsi pada `utils/api.js` agar URL base, handling error, dan validasi *token* mudah dipelihara pada satu pintu.
  - Terdapat helper utilitas seperti `formatters.js` untuk merapikan tanggal Indo dan format mata uang, serta `analytics.js` untuk metrik aplikasi.
- **`src/contexts/`**: Pengelolaan *state* aplikasi secara lintas halaman. Memastikan data inti seperti status *login* user dapat diakses kapanpun, dimanapun tanpa *props drilling*.

### 2. Panduan Ikonografi (Icons)
Untuk menjaga UI tetap terkesan rapi dan seragam, pengerjaan UI dibatasi menggunakan library khusus:
- **Lucide React (`lucide-react`)**: Digunakan untuk ikon antarmuka fungsional, indikator tombol, *chevron*, dan *badges* karena minim ruang dan cepat di-*render*.
- **Ikon Khusus (`src/components/icons/CustomIcons.jsx`)**: Mengandung *raw SVG* buatan tim (mis. Logo GenBI resmi UI, ornamen desain *custom*). Jika Anda membutuhkan ikon tematik spesifik dan estetik, gunakan *component* yang berada pada file ini ketimbang menambah beban library SVG baru dari internet.

### 3. Layanan Inti Ekosistem (Available Core Services)
Aplikasi tidak perlu dibangun dari nol. Ekosistem genbi-client telah dipersenjatai fungsi vital yang harus dire-use:
- **Sistem Autentikasi (`auth.js` / `googleIdentity.js`)**: Wrapper terpusat untuk pendelegasian login token JWT dan integrasi kredensial login Google Auth tanpa me-reload aplikasi.
- **Manajemen Form Draft (`useFormDraft.js`)**: Digunakan terutama pada modul *Open Recruitment* (OpRec). Hook ini akan me-*resume* data masukan formulir calon pendaftar biarpun browser tertutup.
- **Protokol File Staging (`useStagingUpload.js`)**: Komponen untuk mempermudah upload file/berkas besar (KTM, Foto) ke backend secara *progress-based*, beserta penanganan memori di *browser*.
- **Gatekeeper Beasiswa (`scholarshipSelectionGate.js`)**: Validasi dinamis untuk memastikan alur pembukaan/seleksi pendaftaran program mengikuti _timeline_ backend.

### 4. Alur Kerja Standar Fitur Baru (Feature Development Workflow)
Bila mendapat arahan baru: "Tolong buatkan halaman daftar Event":
1. Buka folder `utils/api.js` letakkan *fetcher* Anda (contoh: `export const getEvents = ...`).
2. Buat kerangka layar (scaffold) di folder `src/pages/EventsPage.jsx`.
3. Tarik API getEvents ke `EventsPage.jsx` dengan sistem _loading_ / _empty state_.
4. Buat komponen UI pendukung mis. `src/components/cards/EventCard.jsx`.
5. Daftarkan di file routing utama agar dapat diakses oleh browser.
6. Lakukan `npm run lint`! Pastikan terminal hijau, tidak ada kode tidak terpanggil (_unused vars_), baru kirim PR (Pull Request).

## �🕒 Changelog / Version Control

- **v1.0.0** - Initial Release Candidate. Integrasi Google Auth, Framer Motion, dan UI dasar.
- *(Tahap Pengembangan Aktif)*

## ✒️ Author & Credits

- **Developer / Maintainer**: Pihak IT GenBI Komisariat UNSIKA.
- **Tech Lead**: Rangga Mukti
- **Credits**: Icons provided by Lucide & Iconify. Animations powered by Framer Motion & GSAP.

---
*"Tulis kode yang bisa dibaca oleh mesin, tapi rancanglah arsitektur yang bisa dipahami oleh manusia."*

# GenBI Client

Website publik GenBI Unsika untuk informasi beasiswa, artikel, dan kegiatan.

## Quick Start

```bash
npm install
npm run dev
```

Berjalan di `http://localhost:5173`

## Environment

Buat `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Routes

| Route              | Halaman          |
| ------------------ | ---------------- |
| `/`                | Homepage         |
| `/beasiswa`        | Info Beasiswa    |
| `/beasiswa/daftar` | Form Pendaftaran |
| `/artikel`         | Daftar Artikel   |
| `/artikel/:slug`   | Detail Artikel   |
| `/kegiatan`        | Events & Proker  |
| `/tentang`         | Tentang GenBI    |
| `/login`           | Login            |
| `/register`        | Register         |
| `/profile`         | Profile User     |
| `/settings`        | Pengaturan       |

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router v7
- Google OAuth

## Build

```bash
npm run build
```

Output: `dist/`

## Dokumentasi

Lihat `../Documentation/` untuk dokumentasi lengkap.

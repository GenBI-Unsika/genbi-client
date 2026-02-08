# GenBI Client (Public Website)

Website publik GenBI Unsika yang menampilkan informasi beasiswa, artikel, galeri, dan profil organisasi.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Backend (`genbi-server`) harus berjalan untuk fitur dinamis (artikel, pengumuman).

### Installation

1.  **Clone & Install Dependencies**
    ```bash
    cd genbi-client
    npm install
    ```

2.  **Environment Variables**
    Buat file `.env.local`:
    ```env
    VITE_API_BASE_URL=http://localhost:4000/api/v1
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Akses di `http://localhost:5173`.

## 🛠️ Tech Stack

-   **Framework**: React
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Routing**: React Router v6
-   **Animation**: Framer Motion (jika ada)

## 📂 Folder Structure

```
genbi-client/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components (Navbar, Footer, Card)
│   ├── contexts/        # React Context (Auth untuk member area terbatas)
│   ├── pages/           # Halaman (Home, About, Articles, Contact)
│   ├── services/        # API calls wrapper
│   ├── utils/           # Helper functions
│   ├── router/          # Definisi Router (jika dipisah)
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── .env.local           # Environment variables
└── vite.config.js       # Vite configuration
```

## 🔄 Application Flow

1.  **Public Access**:
    -   Mayoritas halaman dapat diakses tanpa login.
    -   Data artikel dan pengumuman diambil dari API backend.

2.  **Member Registration (OpRec)**:
    -   Form pendaftaran calon anggota GenBI (jika sedang dibuka).
    -   Mengirim data pendaftaran ke endpoint API.

3.  **Interactive Elements**:
    -   Search bar untuk artikel.
    -   Filter kategori kegiatan.

## 🗺️ File Tour

-   **`src/pages/Home.jsx`**:
    -   Landing page utama.
    -   Hero section, highlight kegiatan recent.

-   **`src/components/Navbar.jsx`**:
    -   Navigasi utama responsive.

-   **`src/services/api.js` (atau similar)**:
    -   Konfigurasi Axios instance.
    -   Fungsi fetch data terpusat.

## 📚 Documentation

Dokumentasi lengkap project ini ada di folder `../Documentation/`.

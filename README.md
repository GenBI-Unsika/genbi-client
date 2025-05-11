# 🌐 Website Komunitas GenBI Unsika

Website resmi komunitas **Generasi Baru Indonesia (GenBI)** Universitas Singaperbangsa Karawang. Dibangun menggunakan **MERN Stack (MongoDB, Express, React, Node.js)** dengan **Tailwind CSS** untuk frontend styling.

---

## 📌 Fitur Utama

### 🧑‍🎓 GenBI Profil

- Halaman berisi informasi seputar GenBI Unsika
- Halaman detail profil setiap anggota GenBI
- Edit dan manajemen profil untuk admin

### 📚 Artikel & Berita

- Buat, edit, hapus artikel
- Sistem kategori dan tag
- Artikel publik & internal

### 🎓 Pendaftaran Beasiswa

- Formulir online pendaftaran
- Validasi data otomatis
- Sistem seleksi tahap awal oleh admin

### 📈 Tracking Beasiswa

- Status real-time: _Dikirim → Diproses → Diterima / Ditolak_
- Notifikasi email

### 🔐 Autentikasi & Role

- Login, register, lupa password
- Role: Admin, Anggota, Pengunjung
- Middleware proteksi route

---

## 🛠️ Teknologi yang Digunakan

| Layer      | Teknologi                    |
| ---------- | ---------------------------- |
| Frontend   | React.js, Vite, Tailwind CSS |
| Backend    | Node.js, Express.js          |
| Database   | MongoDB                      |
| Auth       | JSON Web Token (JWT), bcrypt |
| Styling    | Tailwind CSS                 |
| API Client | Axios                        |
| Dev Tools  | Postman, ESLint, Prettier    |

---

## 🚀 Instalasi

### 1. Instalasi Frontend (React + Tailwind)

#### a. Clone Repositori

```bash
git clone https://github.com/GenBI-Unsika/genbi-client.git
```

#### b. Instalasi Depedensi

```bash
cd genbi-client
npm install
npm run dev
```

### 2. Instalasi Backend (Express + MongoDB)

#### a. Clone Repositori

```bash
git clone https://github.com/GenBI-Unsika/genbi-server.git
```

#### b. Instalasi Depedensi

```bash
cd genbi-server
npm install
```

#### c. Buat File .env

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/genbi-db
JWT_SECRET=your_jwt_secret_key
```

#### d. Jalankan Server

```bash
node index.js
# atau jika pakai nodemon
npx nodemon index.js
```

## 📡 API Endpoint

## 👥 Kontribusi

Pull request sangat diterima. Untuk kontribusi, buat branch baru:

```bash
git checkout -b fitur-nama
git push origin fitur-nama
```

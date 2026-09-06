
<div align="center">

# 🚀 Sistem *Backend* Portofolio Personal (API)

[![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=flat)](https://nodejs.org)
[![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat)](https://expressjs.com)
[![Vercel Badge](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff&style=flat)](https://vercel.com/)

Dokumentasi resmi untuk struktur, konfigurasi, dan implementasi *Application Programming Interface* (API) pada sistem portofolio personal. Sistem ini dikembangkan menggunakan arsitektur *Model-View-Controller* (MVC) dengan Node.js dan Express.js.

</div>

---

## 📖 Deskripsi Sistem

Repositori ini memuat kode sumber untuk layanan *backend* yang bertugas mengelola logika bisnis, manajemen basis data, dan penyediaan titik akhir (*endpoint*) API untuk aplikasi web portofolio. Sistem ini dirancang secara modular guna memastikan skalabilitas, keamanan, dan kemudahan pemeliharaan (*maintainability*), serta telah terkonfigurasi untuk *deployment* melalui platform Vercel.

## ✨ Fitur Utama

Sistem *backend* ini menyediakan layanan integrasi data dengan rincian fitur sebagai berikut:
- **Manajemen Proyek (`ProjectController`)**: Mengelola operasi *Create, Read, Update, Delete* (CRUD) untuk data portofolio proyek.
- **Manajemen Artikel (`ArticleController`)**: Mengelola publikasi dan pengelolaan konten artikel atau blog.
- **Sistem Otentikasi (`AuthController`)**: Mengamankan akses sistem menggunakan token otentikasi.
- **Pesan & Kontak (`ContactController`)**: Memproses dan merekam pesan yang dikirimkan melalui formulir kontak.
- **Pengaturan Profil (`ProfileController` & `SettingModel`)**: Mengelola data dinamis terkait profil pengguna dan konfigurasi situs.
- **Keamanan Lanjutan (`middleware`)**: Diimplementasikan dengan *Rate Limit* untuk mencegah serangan *DDoS/Brute Force*, serta *Auth Middleware* untuk validasi akses rute terproteksi.

## 🛠️ Arsitektur dan Teknologi

Pengembangan sistem ini memanfaatkan beberapa teknologi utama:
*   **Lingkungan Eksekusi**: [Node.js](https://nodejs.org/)
*   **Kerangka Kerja (Framework)**: [Express.js](https://expressjs.com/)
*   **Manajemen Basis Data**: SQL/NoSQL (Diinisialisasi pada `config/Database.js`)
*   **Mesin Templat (*Template Engine*)**: EJS (Digunakan untuk halaman statis pada `views/`)
*   **Pengujian API**: Terlampir pada berkas `request.rest` (Kompatibel dengan ekstensi REST Client)
*   **Penyebaran (*Deployment*)**: Konfigurasi Vercel tersedia pada `vercel.json`

---

## 📁 Struktur Direktori

Pengorganisasian kode sumber mematuhi standar *clean architecture*:

```text
📦 be-portfolio-shinta
 ┣ 📂 config/           # Konfigurasi koneksi basis data (Database.js)
 ┣ 📂 controllers/      # Logika pemrosesan untuk setiap entitas model
 ┣ 📂 middleware/       # Fungsi penengah (Otentikasi, Rate Limit, Upload Berkas)
 ┣ 📂 models/           # Definisi skema basis data (User, Project, Article, dll.)
 ┣ 📂 routes/           # Pemetaan titik akhir (endpoint) HTTP ke Controller
 ┣ 📂 views/            # Antarmuka EJS untuk penanganan galat dan halaman indeks
 ┣ 📜 .env.example      # Templat variabel lingkungan konfigurasi sistem
 ┣ 📜 index.js          # Titik masuk utama (Main Entry Point) aplikasi
 ┣ 📜 vercel.json       # Konfigurasi kompilasi dan perutean Vercel
 ┣ 📜 package.json      # Daftar dependensi dan skrip eksekusi manajer paket
 ┗ 📜 request.rest      # Skenario pengujian manual endpoint API
```

---

## 🚀 Panduan Instalasi dan Konfigurasi

Untuk menjalankan sistem ini pada lingkungan pengembangan lokal (*localhost*), ikuti langkah-langkah komprehensif berikut:

### 1. Prasyarat Sistem
Pastikan perangkat keras lunak berikut telah terpasang:
*   Node.js (versi stabil / LTS direkomendasikan)
*   Manajer Paket Node (NPM)
*   Sistem Basis Data (Contoh: MySQL/PostgreSQL/MongoDB sesuai konfigurasi)

### 2. Kloning Repositori
Kloning kode sumber dari repositori ke direktori lokal:
```bash
git clone <URL_REPOSITORI>
cd be-portfolio-shinta
```

### 3. Instalasi Dependensi
Unduh seluruh pustaka yang dibutuhkan dengan menjalankan perintah:
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan
Salin templat variabel lingkungan dan sesuaikan parameter koneksi basis data serta kunci rahasia:
```bash
cp .env.example .env
```
*(Buka berkas `.env` dan lengkapi konfigurasi seperti `PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `JWT_SECRET`, dll.)*

### 5. Eksekusi Program
Jalankan peladen (*server*) dalam mode pengembangan:
```bash
npm run dev
# atau
node index.js
```
Peladen akan berjalan pada porta yang ditentukan di `.env` (umumnya `http://localhost:5000` atau `http://localhost:3000`).

---

## 📡 Referensi API (*API Endpoint*)

Berikut adalah abstraksi perutean utama yang diimplementasikan pada direktori `routes/`:

| Entitas | Titik Akhir (Endpoint) | Metode HTTP | Keterangan |
| :--- | :--- | :---: | :--- |
| **Auth** | `/api/auth/login` | `POST` | Otentikasi dan pembuatan sesi pengguna |
| **Project** | `/api/projects` | `GET, POST, PUT, DELETE` | Manajemen operasi CRUD data proyek |
| **Article** | `/api/articles` | `GET, POST, PUT, DELETE` | Manajemen operasi CRUD data artikel |
| **Profile** | `/api/profile` | `GET, PUT` | Pengambilan dan pembaruan data profil |
| **Contact** | `/api/contact` | `POST, GET` | Pengiriman pesan baru & pembacaan kotak masuk |

*Catatan: Seluruh rute dengan modifikasi data (POST, PUT, DELETE) diwajibkan menyertakan token Bearer yang dikonfigurasi melalui `AuthMiddleware.js`.*

---

## 🛡️ Standar Keamanan & Middleware

Sistem *backend* ini telah dilengkapi dengan beberapa lapisan keamanan:
1.  **`AuthMiddleware.js`**: Melakukan validasi token akses pada setiap permintaan ke rute terproteksi (*protected routes*).
2.  **`RateLimitMiddleware.js`**: Membatasi jumlah permintaan berlebih dalam rentang waktu tertentu untuk menjaga stabilitas peladen.
3.  **`UploadMiddleware.js`**: Mengelola pembatasan ukuran dan ekstensi berkas saat melakukan unggah media (gambar proyek/artikel).

---

## 📄 Lisensi

Kode sumber ini didistribusikan di bawah lisensi yang tercantum pada berkas `LICENSE`. Penggunaan dan modifikasi diperkenankan dengan tetap merujuk pada regulasi lisensi tersebut.

<div align="center">
  <br>
  <i>Disusun dan didokumentasikan untuk keperluan pengembangan sistem portofolio terintegrasi.</i>
</div>

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
*   **Manajemen Basis Data**: SQL/NoSQL (Diinisialisasi pada `config/database.js`)
*   **Mesin Templat (*Template Engine*)**: EJS (Digunakan untuk halaman statis pada `views/`)
*   **Pengujian API**: Terlampir pada berkas `request.rest` (Kompatibel dengan ekstensi REST Client)
*   **Penyebaran (*Deployment*)**: Konfigurasi Vercel tersedia pada `vercel.json`

---

## 🏗️ Struktur Direktori & Arsitektur (MVC)

Pengorganisasian kode sumber mematuhi standar *clean architecture* berbasis MVC. Berikut adalah rincian peran dari masing-masing lapisan komponen:

### 1. Models (Representasi Data)
Bertindak sebagai entitas yang mendefinisikan skema data yang akan disimpan di dalam basis data (implementasi dengan ORM/ODM seperti Sequelize/Mongoose).

*   **`ProjectModel.js`**: Menyimpan tabel Galeri Karya (media, judul, deskripsi, *tools*, tautan GitHub, Figma, situs web).
*   **`ProfileModel.js`**: Menyimpan informasi *About Me*, biodata utama, dan integrasi media sosial.
*   **`ResumeModel.js`**: Mengelola *metadata* tautan berkas CV/Resume (seperti `cv_url`, versi, status aktif).
*   **`ExperienceModel.js`**: Menyimpan riwayat profesional (posisi, perusahaan, lokasi, durasi, deskripsi, keahlian, dan media pendukung).
*   **`EducationModel.js`**: Menyimpan riwayat akademis (institusi, gelar, bidang studi, durasi, IPK/Nilai, aktivitas sosial).
*   **`CertificationModel.js`**: Menyimpan data lisensi (nama, penerbit, ID/URL kredensial, masa berlaku).
*   **`SkillModel.js`**: Menyimpan entri keahlian teknis (Frontend, Backend, Tools, Database) beserta aset visual.
*   **`ArticleModel.js`**: Mengelola entitas konten blog, metadata publikasi, dan judul.
*   **`MessageModel.js`**: Menampung *log* pesan masuk pengunjung situs.
*   **`UserModel.js`**: Menyimpan kredensial otentikasi (username, *hashed password*, hak akses) untuk administrator CMS.
*   **`SettingModels.js`**: Menyimpan parameter konfigurasi situs seperti optimasi SEO dan preferensi bahasa.

### 2. Controllers (Logika Bisnis)
Memproses permintaan masuk (HTTP *Requests*), memanipulasi model, dan mengirimkan respon (HTTP *Responses*).

*   **`ProjectController.js`**: Operasi CRUD Galeri Karya.
*   **`ProfileController.js`**: Manipulasi pembaruan profil dan tautan relasi.
*   **`ResumeController.js`**: Penanganan operasi *I/O* berkas CV.
*   **`ExperienceController.js`**: Mengelola entri pengalaman profesional.
*   **`EducationController.js`**: Mengelola entri rekam jejak akademis.
*   **`CertificationController.js`**: Mengelola validasi dan entri sertifikat.
*   **`SkillController.js`**: Pemetaan daftar teknologi dan keahlian.
*   **`ArticleController.js`**: Implementasi *drafting* dan *publishing* artikel.
*   **`ContactController.js`**: Penanganan formulir pesan dan *webhook*/notifikasi email.
*   **`AuthController.js`**: Implementasi alur otentikasi CMS dan penerbitan token.

### 3. Routes (Pemetaan *Endpoint*)
Menghubungkan URI (*Uniform Resource Identifier*) yang diakses klien ke fungsi pada *Controller* yang bersesuaian.

*   `ProjectRoute.js` ➔ `/api/projects`
*   `ProfileRoute.js` ➔ `/api/profile`
*   `ResumeRoute.js` ➔ `/api/resume`
*   `ExperienceRoute.js` ➔ `/api/experiences`
*   `EducationRoute.js` ➔ `/api/educations`
*   `CertificationRoute.js` ➔ `/api/certifications`
*   `SkillRoute.js` ➔ `/api/skills`
*   `ArticleRoute.js` ➔ `/api/articles`
*   `ContactRoute.js` ➔ `/api/contact`
*   `AuthRoute.js` ➔ `/api/auth`

### 4. Middleware (Lapis Intersepsi)
Berfungsi sebagai filter keamanan dan prapemrosesan sebelum *request* mencapai *Controller*.

*   **`AuthMiddleware.js`**: Memvalidasi integritas *Bearer Token* pengguna sebelum operasi modifikasi data dieksekusi.
*   **`UploadMiddleware.js`**: Menangani sistem penyimpanan berkas statis (gambar/PDF), pembatasan *size*, dan implementasi *watermark* untuk HKI.
*   **`RateLimitMiddleware.js`**: Membatasi laju akses jaringan per IP untuk mencegah eksploitasi *spam* dan *bot*.

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
| **Resume** | `/api/resume` | `GET, POST, PUT` | Layanan pengunggahan dan pengunduhan dokumen CV |
| **Experience** | `/api/experiences` | `GET, POST, PUT, DELETE` | Manajemen data riwayat pengalaman kerja / magang / organisasi|
| **Education** | `/api/educations` | `GET, POST, PUT, DELETE` | Manajemen data latar belakang akademis |
| **Certifications** | `/api/certifications` | `GET, POST, PUT, DELETE` | Manajemen data lisensi, bootcamp, dan sertifikasi |
| **Skills** | `/api/skills` | `GET, POST, PUT, DELETE` | Manajemen inventaris keahlian (Tech Stack) |
| **Contact** | `/api/contact` | `POST, GET` | Pengiriman pesan baru & pembacaan kotak masuk |

*Catatan: Seluruh endpoint yang memicu modifikasi status data (metode POST, PUT, DELETE—kecuali formulir kontak publik) diwajibkan untuk menyertakan Bearer Token pada Header Authorization sesuai kebijakan `AuthMiddleware.js`.*

---

## 📄 Lisensi

Kode sumber ini didistribusikan di bawah lisensi yang tercantum pada berkas `LICENSE`. Penggunaan dan modifikasi diperkenankan dengan tetap merujuk pada regulasi lisensi tersebut.

<div align="center">
  <br>
  <i>Disusun dan didokumentasikan untuk keperluan pengembangan sistem portofolio terintegrasi.</i>
</div>
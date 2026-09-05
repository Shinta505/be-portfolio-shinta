import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";

import AuthRoute from "./routes/AuthRoute.js";
import ProfileRoute from "./routes/ProfileRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
import ArticleRoute from "./routes/ArticleRoute.js";
import ContactRoute from "./routes/ContactRoute.js";

dotenv.config();

const app = express();

// Konfigurasi Middleware CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Middleware untuk membaca format JSON dari request body
app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine ke EJS dan arahkan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sinkronisasi Database (Opsional: Di Vercel terkadang lebih aman dilewati 
// atau menggunakan migrations, namun aman dijalankan untuk inisialisasi tabel)
(async() => {
    try {
        await db.authenticate();
        console.log("Koneksi ke database Supabase berhasil.");
        // await db.sync(); // Uncomment baris ini jika ingin otomatis membuat tabel dari model
    } catch (error) {
        console.error("Gagal terhubung ke database:", error);
    }
})();

// Definisi Endpoint / Routes Utama
app.use('/api', AuthRoute);
app.use('/api', ProfileRoute);
app.use('/api', ProjectRoute);
app.use('/api', ArticleRoute);
app.use('/api', ContactRoute);

// Endpoint Utama (Merender tampilan views/index.ejs)
app.get('/', (req, res) => {
    res.render('index');
});

// Penanganan untuk rute yang tidak ditemukan (404 Not Found)
app.use((req, res, next) => {
    res.status(404).render('error', { message: "Endpoint atau sumber daya yang Anda cari tidak ditemukan." });
});

// Penanganan Error Umum / Server (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: err.message || "Terjadi kesalahan internal pada server." });
});

// Jalankan server secara lokal jika tidak berjalan di lingkungan Vercel serverless
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server backend berjalan lancar pada port ${PORT}`);
    });
}

// Ekspor aplikasi untuk mendukung deployment serverless Vercel
export default app;
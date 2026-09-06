import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bcrypt from 'bcrypt';
import { fileURLToPath } from "url";
import db from "./config/database.js";
import UserModel from './models/UserModel.js';

import AuthRoute from "./routes/AuthRoute.js";
import ProfileRoute from "./routes/ProfileRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
import ArticleRoute from "./routes/ArticleRoute.js";
import ContactRoute from "./routes/ContactRoute.js";
import ResumeRoute from "./routes/ResumeRoute.js";
import ExperienceRoute from "./routes/ExperienceRoute.js";
import EducationRoute from "./routes/EducationRoute.js";
import CertificationRoute from "./routes/CertificationRoute.js";
import SkillRoute from "./routes/SkillRoute.js";

dotenv.config();

const app = express();

// Konfigurasi Middleware CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Middleware untuk membaca format JSON dari request body
app.use(express.json());

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine ke EJS dan arahkan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sinkronisasi Database dengan Supabase via Sequelize
(async() => {
    try {
        await db.authenticate();
        console.log("Koneksi ke database Supabase berhasil.");

        // Melakukan sinkronisasi tabel secara otomatis dari model
        await db.sync();

        // Auto-seed akun admin berdasarkan variabel environment
        if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
            const adminExists = await UserModel.findOne({
                where: { username: process.env.ADMIN_USERNAME }
            });

            if (!adminExists) {
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
                await UserModel.create({
                    username: process.env.ADMIN_USERNAME,
                    password: hashedPassword,
                    role: 'admin'
                });
                console.log(`Akun admin (${process.env.ADMIN_USERNAME}) berhasil dibuat otomatis ke database.`);
            }
        }
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
app.use('/api', ResumeRoute);
app.use('/api', ExperienceRoute);
app.use('/api', EducationRoute);
app.use('/api', CertificationRoute);
app.use('/api', SkillRoute);

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
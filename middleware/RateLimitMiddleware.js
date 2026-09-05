import rateLimit from "express-rate-limit";

// Pembatas untuk Formulir Kontak atau endpoint publik lainnya
export const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Jangka waktu 15 menit
    max: 5, // Batas maksimal 5 kali request per IP dalam 15 menit
    message: {
        msg: "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Pembatas umum untuk API (opsional)
export const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 100, // Maksimal 100 request per menit per IP
    message: {
        msg: "Terlalu banyak aktivitas, mohon tunggu sebentar."
    }
});
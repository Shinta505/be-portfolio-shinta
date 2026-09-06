import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Konfigurasi Multer memory storage (file disimpan sementara di RAM, bukan di folder lokal Vercel)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas maksimal 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("Hanya file gambar yang diizinkan!"), false);
        }
    }
});

// Inisialisasi Supabase Client menggunakan kredensial dari .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

router.post("/upload", verifyToken, adminOnly, upload.single("image"), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah." });
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `profile-${Date.now()}-${Math.round(Math.random() * 1000)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Unggah ke Bucket Supabase Storage (nama bucket: 'portfolio-images')
        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Ambil Public URL dari file yang baru diunggah
        const { data: publicURLData } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(filePath);

        return res.status(200).json({
            success: true,
            message: "Gambar berhasil diunggah ke Supabase.",
            url: publicURLData.publicUrl
        });

    } catch (error) {
        console.error("Error Supabase Upload:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal mengunggah gambar." });
    }
});

export default router;
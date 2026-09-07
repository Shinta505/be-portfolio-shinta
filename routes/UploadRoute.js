import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Konfigurasi Multer memory storage
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

// Inisialisasi Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

router.post("/upload", verifyToken, adminOnly, upload.single("image"), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah." });
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        
        // Ambil nama folder dari req.body (opsional), default-kan ke 'profiles' jika kosong
        const folderName = req.body.folder || 'profiles';
        
        // Sanitasi nama file agar aman dari spasi atau karakter khusus
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `file-${Date.now()}-${sanitizedOriginalName}`;
        
        // Gabungkan folder tujuan dengan nama file (Contoh: profiles/file-12345.jpg)
        const filePath = `${folderName}/${fileName}`;

        // Unggah ke Bucket Supabase Storage (nama bucket: 'uploads')
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Ambil Public URL dari file yang baru diunggah
        const { data: publicURLData } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        return res.status(200).json({
            success: true,
            message: `File berhasil diunggah ke folder '${folderName}' di Supabase.`,
            url: publicURLData.publicUrl
        });

    } catch (error) {
        console.error("Error Supabase Upload:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal mengunggah gambar." });
    }
});

export default router;

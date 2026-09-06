import express from "express";
import upload from "../middleware/UploadMiddleware.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/upload", verifyToken, adminOnly, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah." });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        return res.status(200).json({
            success: true,
            message: "Gambar berhasil diunggah.",
            url: imageUrl
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
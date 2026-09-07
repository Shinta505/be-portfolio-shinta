import express from "express";
import {
    getCertifications,
    getCertificationById,
    createCertification,
    updateCertification,
    deleteCertification
} from "../controllers/CertificationController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/certifications
 * @desc    Mengambil seluruh data sertifikasi dan lisensi profesional
 * @access  Public
 */
router.get("/certifications", getCertifications);

/**
 * @route   GET /api/certifications/:id
 * @desc    Mengambil data sertifikasi spesifik berdasarkan UUID
 * @access  Public
 */
router.get("/certifications/:id", getCertificationById);

/**
 * @route   POST /api/certifications
 * @desc    Menambahkan data sertifikasi atau lisensi baru + Upload Gambar
 * @access  Private (Admin Only)
 */
router.post("/certifications", verifyToken, adminOnly, upload.single("image"), createCertification);

/**
 * @route   PATCH /api/certifications/:id
 * @desc    Memperbarui data sertifikasi berdasarkan UUID + Upload Gambar Opsional
 * @access  Private (Admin Only)
 */
router.patch("/certifications/:id", verifyToken, adminOnly, upload.single("image"), updateCertification);

/**
 * @route   DELETE /api/certifications/:id
 * @desc    Menghapus data sertifikasi berdasarkan UUID
 * @access  Private (Admin Only)
 */
router.delete("/certifications/:id", verifyToken, adminOnly, deleteCertification);

export default router;

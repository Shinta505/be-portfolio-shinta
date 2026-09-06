import express from "express";
import {
    getAllEducations,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation
} from "../controllers/EducationController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/educations
 * @desc    Mengambil seluruh data riwayat pendidikan (Publik)
 * @access  Public
 */
router.get("/educations", getAllEducations);

/**
 * @route   GET /api/educations/:id
 * @desc    Mengambil detail data riwayat pendidikan berdasarkan ID/UUID (Publik)
 * @access  Public
 */
router.get("/educations/:id", getEducationById);

/**
 * @route   POST /api/educations
 * @desc    Menambahkan data riwayat pendidikan baru (CMS Admin)
 * @access  Private/Admin
 */
router.post("/educations", verifyToken, adminOnly, createEducation);

/**
 * @route   PATCH /api/educations/:id
 * @desc    Memperbarui data riwayat pendidikan berdasarkan ID/UUID (CMS Admin)
 * @access  Private/Admin
 */
router.patch("/educations/:id", verifyToken, adminOnly, updateEducation);

/**
 * @route   DELETE /api/educations/:id
 * @desc    Menghapus data riwayat pendidikan berdasarkan ID/UUID (CMS Admin)
 * @access  Private/Admin
 */
router.delete("/educations/:id", verifyToken, adminOnly, deleteEducation);

export default router;
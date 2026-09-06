import express from "express";
import {
    getProjects,
    getProjectByIdOrSlug,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/ProjectController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Mengambil seluruh data projek/karya (mendukung filter kategori)
 * @access  Public
 */
router.get("/projects", getProjects);

/**
 * @route   GET /api/projects/:identifier
 * @desc    Mengambil detail satu projek berdasarkan UUID atau Slug
 * @access  Public
 */
router.get("/projects/:identifier", getProjectByIdOrSlug);

/**
 * @route   POST /api/projects
 * @desc    Menambahkan projek baru ke galeri karya
 * @access  Private (Admin Only) + Upload File Gambar/Media
 */
router.post("/projects", verifyToken, adminOnly, upload.single("image"), createProject);

/**
 * @route   PUT /api/projects/:uuid
 * @desc    Memperbarui data projek berdasarkan UUID
 * @access  Private (Admin Only) + Upload File Gambar/Media Opsional
 */
router.put("/projects/:uuid", verifyToken, adminOnly, upload.single("image"), updateProject);

/**
 * @route   DELETE /api/projects/:uuid
 * @desc    Menghapus projek dari database berdasarkan UUID
 * @access  Private (Admin Only)
 */
router.delete("/projects/:uuid", verifyToken, adminOnly, deleteProject);

export default router;
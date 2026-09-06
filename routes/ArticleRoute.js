import express from "express";
import {
    getArticles,
    getArticleByIdOrSlug,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controllers/ArticleController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/articles
 * @desc    Mengambil semua daftar artikel atau blog (mendukung query filter ?status=draft/published)
 * @access  Public
 */
router.get("/articles", getArticles);

/**
 * @route   GET /api/articles/:identifier
 * @desc    Mengambil detail artikel berdasarkan UUID atau Slug
 * @access  Public
 */
router.get("/articles/:identifier", getArticleByIdOrSlug);

/**
 * @route   POST /api/articles
 * @desc    Membuat artikel atau tulisan blog baru
 * @access  Private (Admin Only) - Menggunakan Multer untuk unggah gambar/thumbnail
 */
router.post("/articles", verifyToken, adminOnly, upload.single("image"), createArticle);

/**
 * @route   PUT /api/articles/:uuid
 * @desc    Memperbarui artikel yang sudah ada berdasarkan UUID
 * @access  Private (Admin Only) - Menggunakan Multer untuk pembaruan gambar/thumbnail
 */
router.put("/articles/:uuid", verifyToken, adminOnly, upload.single("image"), updateArticle);

/**
 * @route   DELETE /api/articles/:uuid
 * @desc    Menghapus artikel berdasarkan UUID beserta file gambar terkait
 * @access  Private (Admin Only)
 */
router.delete("/articles/:uuid", verifyToken, adminOnly, deleteArticle);

export default router;
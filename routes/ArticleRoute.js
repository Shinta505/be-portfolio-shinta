import express from "express";
import {
    getArticles,
    getArticleById,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controllers/ArticleController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Endpoint Publik (Dapat diakses pengunjung tanpa otentikasi)
router.get('/articles', getArticles);
router.get('/articles/slug/:slug', getArticleBySlug);
router.get('/articles/:id', getArticleById);

// Endpoint CMS Admin (Dilindungi oleh middleware otentikasi JWT)
router.post('/articles', verifyToken, createArticle);
router.patch('/articles/:id', verifyToken, updateArticle);
router.delete('/articles/:id', verifyToken, deleteArticle);

export default router;
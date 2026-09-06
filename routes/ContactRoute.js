import express from "express";
import {
    sendMessage,
    getMessages,
    getMessageById,
    deleteMessage
} from "../controllers/ContactController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import { contactLimiter } from "../middleware/RateLimitMiddleware.js";

/**
 * @file ContactRoute.js
 * @description Definisi jalur endpoint untuk menampung pengiriman Formulir Kontak 
 * serta manajemen data pesan masuk oleh administrator dalam sistem manajemen konten (CMS)[cite: 1].
 */

const router = express.Router();

/**
 * @route POST /api/contact
 * @desc Mengirim pesan baru dari pengunjung melalui Formulir Kontak publik
 * @access Public (Dilengkapi dengan pembatas rate limit untuk mencegah spam)
 */
router.post("/contact", contactLimiter, sendMessage);

/**
 * @route GET /api/contacts
 * @desc Mendapatkan seluruh daftar pesan masuk
 * @access Private (Khusus Administrator/CMS dengan verifikasi Token dan hak akses Admin)[cite: 1]
 */
router.get("/contacts", verifyToken, adminOnly, getMessages);

/**
 * @route GET /api/contacts/:uuid
 * @desc Mendapatkan detail pesan berdasarkan UUID
 * @access Private (Khusus Administrator/CMS dengan verifikasi Token dan hak akses Admin)[cite: 1]
 */
router.get("/contacts/:uuid", verifyToken, adminOnly, getMessageById);

/**
 * @route DELETE /api/contacts/:uuid
 * @desc Menghapus pesan berdasarkan UUID
 * @access Private (Khusus Administrator/CMS dengan verifikasi Token dan hak akses Admin)[cite: 1]
 */
router.delete("/contacts/:uuid", verifyToken, adminOnly, deleteMessage);

export default router;
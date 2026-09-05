import express from "express";
import {
    getMessages,
    createMessage,
    deleteMessage
} from "../controllers/ContactController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
const router = express.Router();

// Endpoint Publik: Mengirim pesan baru dari formulir kontak
router.post("/contact", createMessage);

// Endpoint Admin (Terproteksi JWT): Mengambil seluruh daftar pesan masuk
router.get("/contact", verifyToken, getMessages);

// Endpoint Admin (Terproteksi JWT): Menghapus pesan berdasarkan ID
router.delete("/contact/:id", verifyToken, deleteMessage);

export default router;
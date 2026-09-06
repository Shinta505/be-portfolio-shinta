import express from "express";
import { Login, Me, Logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

/**
 * Konfigurasi Jalur Endpoint (Routes) untuk Otentikasi Administrator CMS[cite: 1].
 */
const router = express.Router();

// Endpoint untuk proses masuk administrator
router.post("/login", Login);

// Endpoint untuk memuat data sesi pengguna yang sedang aktif (memerlukan token valid)
router.get("/me", verifyToken, Me);

// Endpoint untuk proses keluar (logout) sistem
router.delete("/logout", verifyToken, Logout);

export default router;
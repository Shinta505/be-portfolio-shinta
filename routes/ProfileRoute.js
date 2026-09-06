import express from "express";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Endpoint publik untuk mengambil data profil
router.get("/profile", getProfile);

// Endpoint privat (admin) untuk memperbarui atau membuat profil
router.put("/profile", verifyToken, updateProfile);

export default router;
import express from "express";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

// Endpoint publik untuk mengambil data profil
router.get("/profile", getProfile);

// Endpoint privat (admin) untuk memperbarui atau membuat profil dengan middleware Upload yang disamakan seperti project
router.put("/profile", verifyToken, adminOnly, upload.single("profile_image"), updateProfile);

export default router;

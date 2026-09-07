import express from "express";
import multer from "multer";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Alokasikan penyimpanan memori sementera untuk buffer Supabase
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint publik untuk mengambil data profil
router.get("/profile", getProfile);

// Sisipkan middleware upload.single() sesuai dengan key FormData dari frontend
router.put("/profile", verifyToken, upload.single("profile_image"), updateProfile);

export default router;

import express from "express";
import {
    getExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} from "../controllers/ExperienceController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";

const router = express.Router();

/**
 * Mendefinisikan jalur endpoint untuk data pengalaman kerja (/api/experiences)[cite: 1].
 */
router.get("/experiences", getExperiences);
router.get("/experiences/:id", getExperienceById);
router.post("/experiences", verifyToken, adminOnly, createExperience);
router.patch("/experiences/:id", verifyToken, adminOnly, updateExperience);
router.delete("/experiences/:id", verifyToken, adminOnly, deleteExperience);

export default router;
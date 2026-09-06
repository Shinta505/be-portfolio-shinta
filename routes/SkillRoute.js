import express from "express";
import {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} from "../controllers/SkillController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";

const router = express.Router();

/**
 * Definisi rute untuk manajemen keahlian (skills) dan teknologi[cite: 1].
 */

// Rute Publik (Dapat diakses oleh siapa saja untuk menampilkan daftar skills)
router.get('/skills', getSkills);
router.get('/skills/:uuid', getSkillById);

// Rute Terlindungi CMS (Hanya dapat diakses oleh Admin yang telah terautentikasi)[cite: 1]
router.post('/skills', verifyToken, adminOnly, createSkill);
router.patch('/skills/:uuid', verifyToken, adminOnly, updateSkill);
router.delete('/skills/:uuid', verifyToken, adminOnly, deleteSkill);

export default router;
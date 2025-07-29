import express from 'express';
import {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
} from "../controllers/SkillController.js";

const router = express.Router();

// Route GET semua skill
router.get('/', getAllSkills);

// Route GET skill berdasarkan ID
router.get('/:id_skill', getSkillById);

// Route POST untuk membuat skill baru
router.post('/', createSkill);

// Route PUT untuk memperbarui skill berdasarkan ID
router.put('/:id_skill', updateSkill);

// Route DELETE untuk menghapus skill berdasarkan ID
router.delete('/:id_skill', deleteSkill);

export default router;
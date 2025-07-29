import express from 'express';
import {
    getAllExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} from '../controllers/ExperienceController.js';

const router = express.Router();

// Route GET semua pengalaman
router.get('/', getAllExperiences);

// Route GET pengalaman berdasarkan ID
router.get('/:id_experience', getExperienceById);

// Route POST untuk membuat pengalaman baru
router.post('/', createExperience);

// Route PUT untuk memperbarui pengalaman berdasarkan ID
router.put('/:id_experience', updateExperience);

// Route DELETE untuk menghapus pengalaman berdasarkan ID
router.delete('/:id_experience', deleteExperience);

export default router;
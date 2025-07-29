import express from 'express';
import {
    getAllTestimoni,
    getTestimoniById,
    createTestimoni,
    updateTestimoni,
    deleteTestimoni,
} from '../controllers/TestimoniController.js';

const router = express.Router();

// Route GET semua testimoni
router.get('/', getAllTestimoni);

// Route GET testimoni berdasarkan ID
router.get('/:id_testimoni', getTestimoniById);

// Route POST untuk membuat testimoni baru
router.post('/', createTestimoni);

// Route PUT untuk memperbarui testimoni berdasarkan ID
router.put('/:id_testimoni', updateTestimoni);

// Route DELETE untuk menghapus testimoni berdasarkan ID
router.delete('/:id_testimoni', deleteTestimoni);

export default router;
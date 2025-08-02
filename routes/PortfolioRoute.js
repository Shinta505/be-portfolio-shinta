import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
import {
    getAllPortfolios,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
} from '../controllers/PortfolioController.js';

const router = express.Router();

// Route GET semua portfolio
router.get('/', getAllPortfolios);

// Route GET portfolio berdasarkan ID
router.get('/:id_portfolio', getPortfolioById);

// Route POST untuk membuat portfolio baru
router.post('/', upload.single('gambar_portfolio'), createPortfolio);

// Route PUT untuk memperbarui portfolio berdasarkan ID
router.put('/:id_portfolio', upload.single('gambar_portfolio'), updatePortfolio);

// Route DELETE untuk menghapus portfolio berdasarkan ID
router.delete('/:id_portfolio', deletePortfolio);

export default router;

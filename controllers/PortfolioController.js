import Portfolio from "../models/PortfolioModel.js";
import { put, del } from "@vercel/blob";
import multer from "multer";

// GET all portfolios
async function getAllPortfolios(req, res) {
    try {
        const portfolios = await Portfolio.findAll();
        res.status(200).json(portfolios);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// GET portfolio by ID
async function getPortfolioById(req, res) {
    const id_portfolio = req.params.id_portfolio;
    try {
        const portfolio = await Portfolio.findOne({ where: { id_portfolio: id_portfolio } });
        if (portfolio) {
            res.status(200).json(portfolio);
        } else {
            res.status(404).json({ msg: "Portfolio tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// CREATE
async function createPortfolio(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Gambar portfolio harus disertakan" });
        }

        // upload gambar ke Vercel Blob
        const blob = await put(`portfolio/${Date.now()}_${req.file.originalname}`, req.file.buffer, {
            access: 'public',
        });

        // Simpan data portfolio ke database
        const inputResult = {
            ...req.body,
            gambar_portfolio: blob.url,
        };

        await Portfolio.create(inputResult);
        res.status(201).json({ msg: "Portfolio berhasil ditambahkan" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// UPDATE
async function updatePortfolio(req, res) {
    try {
        const portfolio = await Portfolio.findOne({
            where: { id_portfolio: req.params.id_portfolio }
        });

        if (!portfolio) {
            return res.status(404).json({ msg: "Portfolio tidak ditemukan" });
        }

        let gambar_portfolio = portfolio.gambar_portfolio;

        if (req.file) {
            // Hapus gambar lama dari Vercel Blob
            if (gambar_portfolio) {
                await del(gambar_portfolio);
            }

            // Upload gambar baru ke Vercel Blob
            const blob = await put(`portfolio/${Date.now()}_${req.file.originalname}`, req.file.buffer, {
                access: 'public',
            });
            gambar_portfolio = blob.url;
        }

        const updatedData = {
            ...req.body,
            gambar_portfolio: gambar_portfolio,
        };

        await Portfolio.update(updatedData, {
            where: { id_portfolio: req.params.id_portfolio }
        });

        res.status(200).json({ msg: "Portfolio berhasil diperbarui" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// DELETE
async function deletePortfolio(req, res) {
    try {
        const portfolio = await Portfolio.findOne({
            where: { id_portfolio: req.params.id_portfolio }
        });

        if (!portfolio) {
            return res.status(404).json({ msg: "Portfolio tidak ditemukan" });
        }

        // Hapus gambar dari Vercel Blob
        if (portfolio.gambar_portfolio) {
            await del(portfolio.gambar_portfolio);
        }

        await Portfolio.destroy({
            where: { id_portfolio: req.params.id_portfolio }
        });

        res.status(200).json({ msg: "Portfolio berhasil dihapus" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

export {
    getAllPortfolios,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
}

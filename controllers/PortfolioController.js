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
        let gambarUrl = null; // Variabel untuk menampung URL gambar, defaultnya null

        // Cek jika ada file yang diunggah
        if (req.file) {
            console.log("Mencoba mengunggah gambar ke Vercel Blob...");
            const blob = await put(`portfolio/${Date.now()}_${req.file.originalname}`, req.file.buffer, {
                access: 'public',
            });
            gambarUrl = blob.url; // Jika berhasil, simpan URL-nya
            console.log("Gambar berhasil diunggah:", gambarUrl);
        }

        // Siapkan data untuk disimpan ke database
        const inputResult = {
            ...req.body,
            gambar_portfolio: gambarUrl, // Gunakan variabel gambarUrl
        };

        console.log("Mencoba menyimpan data ke database...");
        await Portfolio.create(inputResult);
        console.log("Data berhasil disimpan ke database.");

        res.status(201).json({ msg: "Portfolio berhasil ditambahkan" });
    } catch (error) {
        console.error("Terjadi kesalahan di createPortfolio:", error);
        res.status(500).json({ msg: "Terjadi kesalahan internal pada server.", error: error.message });
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
            console.log("File baru terdeteksi, memulai proses pembaruan gambar...");
            if (gambar_portfolio) {
                console.log("Menghapus gambar lama:", gambar_portfolio);
                await del(gambar_portfolio);
                console.log("Gambar lama berhasil dihapus.");
            }

            console.log("Mengunggah gambar baru...");
            const blob = await put(`portfolio/${Date.now()}_${req.file.originalname}`, req.file.buffer, {
                access: 'public',
            });
            gambar_portfolio = blob.url;
            console.log("Gambar baru berhasil diunggah:", gambar_portfolio);
        }

        const updatedData = {
            ...req.body,
            gambar_portfolio: gambar_portfolio,
        };

        console.log("Memperbarui data di database...");
        await Portfolio.update(updatedData, {
            where: { id_portfolio: req.params.id_portfolio }
        });
        console.log("Data berhasil diperbarui.");

        res.status(200).json({ msg: "Portfolio berhasil diperbarui" });
    } catch (error) {
        // --- Logging Error Detail ---
        console.error("Terjadi kesalahan di updatePortfolio:", error);
        res.status(500).json({ msg: "Terjadi kesalahan internal pada server.", error: error.message });
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

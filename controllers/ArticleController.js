import ArticleModel from "../models/ArticleModel.js";
import path from "path";
import fs from "fs";

/**
 * Mengambil semua data artikel atau blog[cite: 1].
 * Mendukung filter berdasarkan status (draft/published) jika diperlukan.
 */
export const getArticles = async(req, res) => {
    try {
        const { status } = req.query;
        let condition = {};

        if (status) {
            condition.status = status;
        }

        const articles = await ArticleModel.findAll({
            where: condition,
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data artikel.",
            total: articles.length,
            data: articles
        });
    } catch (error) {
        console.error("Error getArticles:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Mengambil detail artikel berdasarkan UUID atau Slug.
 */
export const getArticleByIdOrSlug = async(req, res) => {
    try {
        const { identifier } = req.params;

        // Cek apakah identifier berupa UUID atau Slug
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

        const query = isUuid ? { uuid: identifier } : { slug: identifier };

        const article = await ArticleModel.findOne({
            where: query
        });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Artikel tidak ditemukan."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail artikel.",
            data: article
        });
    } catch (error) {
        console.error("Error getArticleByIdOrSlug:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Membuat artikel atau tulisan blog baru[cite: 1].
 * Memerlukan hak akses admin yang divalidasi melalui middleware autentikasi.
 */
export const createArticle = async(req, res) => {
    try {
        const { title, slug, content, publishedAt, status } = req.body;
        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Validasi input manual tambahan jika diperlukan
        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "Judul, slug, dan konten artikel wajib diisi."
            });
        }

        // Cek ketersediaan slug agar tetap unik
        const existingSlug = await ArticleModel.findOne({ where: { slug } });
        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: "Slug artikel sudah digunakan, silakan gunakan slug lain."
            });
        }

        const newArticle = await ArticleModel.create({
            title,
            slug,
            content,
            image: imagePath,
            publishedAt: publishedAt || new Date(),
            status: status || "draft"
        });

        return res.status(201).json({
            success: true,
            message: "Artikel berhasil dibuat.",
            data: newArticle
        });
    } catch (error) {
        console.error("Error createArticle:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Memperbarui data artikel yang sudah ada berdasarkan UUID.
 */
export const updateArticle = async(req, res) => {
    try {
        const { uuid } = req.params;
        const { title, slug, content, publishedAt, status } = req.body;

        const article = await ArticleModel.findOne({ where: { uuid } });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Artikel yang akan diperbarui tidak ditemukan."
            });
        }

        // Jika slug diubah, pastikan slug baru belum dipakai artikel lain
        if (slug && slug !== article.slug) {
            const existingSlug = await ArticleModel.findOne({ where: { slug } });
            if (existingSlug) {
                return res.status(400).json({
                    success: false,
                    message: "Slug artikel sudah digunakan oleh artikel lain."
                });
            }
        }

        let imagePath = article.image;
        if (req.file) {
            // Hapus gambar lama jika ada file gambar baru yang diunggah
            if (article.image) {
                const oldImagePath = path.join("public", article.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagePath = `/uploads/${req.file.filename}`;
        }

        await article.update({
            title: title || article.title,
            slug: slug || article.slug,
            content: content || article.content,
            image: imagePath,
            publishedAt: publishedAt || article.publishedAt,
            status: status || article.status
        });

        return res.status(200).json({
            success: true,
            message: "Artikel berhasil diperbarui.",
            data: article
        });
    } catch (error) {
        console.error("Error updateArticle:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Menghapus artikel berdasarkan UUID beserta file gambar sampul terkait.
 */
export const deleteArticle = async(req, res) => {
    try {
        const { uuid } = req.params;

        const article = await ArticleModel.findOne({ where: { uuid } });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Artikel yang ingin dihapus tidak ditemukan."
            });
        }

        // Hapus file gambar dari direktori lokal jika ada
        if (article.image) {
            const imagePath = path.join("public", article.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await article.destroy();

        return res.status(200).json({
            success: true,
            message: "Artikel berhasil dihapus."
        });
    } catch (error) {
        console.error("Error deleteArticle:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};
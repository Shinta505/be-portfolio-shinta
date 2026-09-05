import ArticleModel from "../models/ArticleModel.js";
import slugify from "slugify";

// 1. Mendapatkan semua artikel (bisa untuk publik atau admin)
export const getArticles = async(req, res) => {
    try {
        const response = await ArticleModel.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 2. Mendapatkan detail artikel berdasarkan UUID
export const getArticleById = async(req, res) => {
    try {
        const article = await ArticleModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!article) return res.status(404).json({ message: "Artikel tidak ditemukan" });

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 3. Mendapatkan detail artikel berdasarkan Slug (untuk halaman baca blog)
export const getArticleBySlug = async(req, res) => {
    try {
        const article = await ArticleModel.findOne({
            where: {
                slug: req.params.slug
            }
        });

        if (!article) return res.status(404).json({ message: "Artikel tidak ditemukan" });

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 4. Membuat artikel baru (Fitur CMS Admin)
export const createArticle = async(req, res) => {
    const { title, content, image, publishedAt } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Judul dan konten artikel wajib diisi" });
    }

    // Membuat slug otomatis dari judul, contoh: "Belajar Sequelize" -> "belajar-sequelize"
    const generatedSlug = slugify(title, { lower: true, strict: true });

    try {
        // Cek apakah slug sudah ada
        const existingSlug = await ArticleModel.findOne({ where: { slug: generatedSlug } });
        const finalSlug = existingSlug ? `${generatedSlug}-${Date.now()}` : generatedSlug;

        const newArticle = await ArticleModel.create({
            title: title,
            slug: finalSlug,
            content: content,
            image: image || null,
            publishedAt: publishedAt || null
        });

        return res.status(201).json({
            message: "Artikel berhasil dibuat",
            data: newArticle
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 5. Mengubah artikel (Fitur CMS Admin)
export const updateArticle = async(req, res) => {
    try {
        const article = await ArticleModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!article) return res.status(404).json({ message: "Artikel tidak ditemukan" });

        const { title, content, image, publishedAt } = req.body;

        let updatedSlug = article.slug;
        if (title && title !== article.title) {
            const baseSlug = slugify(title, { lower: true, strict: true });
            const existingSlug = await ArticleModel.findOne({ where: { slug: baseSlug } });
            updatedSlug = existingSlug && existingSlug.uuid !== article.uuid ? `${baseSlug}-${Date.now()}` : baseSlug;
        }

        await ArticleModel.update({
            title: title || article.title,
            slug: updatedSlug,
            content: content || article.content,
            image: image !== undefined ? image : article.image,
            publishedAt: publishedAt !== undefined ? publishedAt : article.publishedAt
        }, {
            where: {
                uuid: req.params.id
            }
        });

        return res.status(200).json({ message: "Artikel berhasil diperbarui" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 6. Menghapus artikel (Fitur CMS Admin)
export const deleteArticle = async(req, res) => {
    try {
        const article = await ArticleModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!article) return res.status(404).json({ message: "Artikel tidak ditemukan" });

        await ArticleModel.destroy({
            where: {
                uuid: req.params.id
            }
        });

        return res.status(200).json({ message: "Artikel berhasil dihapus" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
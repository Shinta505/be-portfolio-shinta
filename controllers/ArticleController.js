import ArticleModel from "../models/ArticleModel.js";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Konstanta nama bucket untuk artikel
const BUCKET_NAME = "uploads";

/**
 * Mengambil semua data artikel atau blog.
 */
export const getArticles = async(req, res) => {
    try {
        const { status } = req.query;
        let condition = {};

        if (status) condition.status = status;

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
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

        const article = await ArticleModel.findOne({
            where: isUuid ? { uuid: identifier } : { slug: identifier }
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
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Membuat artikel atau tulisan blog baru ke database dan Supabase Storage.
 */
export const createArticle = async(req, res) => {
    try {
        const { title, slug, content, publishedAt, status } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "Judul, slug, dan konten artikel wajib diisi."
            });
        }

        const existingSlug = await ArticleModel.findOne({ where: { slug } });
        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: "Slug artikel sudah digunakan, silakan gunakan slug lain."
            });
        }

        let imageUrl = null;

        // Eksekusi unggahan buffer ke Supabase Storage
        if (req.file) {
            const fileName = `articles/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(`articles/${fileName}`, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(`articles/${fileName}`);

            imageUrl = publicUrlData.publicUrl;
        }

        const newArticle = await ArticleModel.create({
            title,
            slug,
            content,
            image: imageUrl,
            publishedAt: publishedAt || new Date(),
            status: status || "draft"
        });

        return res.status(201).json({
            success: true,
            message: "Artikel berhasil dibuat.",
            data: newArticle
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Memperbarui data artikel dan sinkronisasi berkas media pada Supabase.
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

        if (slug && slug !== article.slug) {
            const existingSlug = await ArticleModel.findOne({ where: { slug } });
            if (existingSlug) {
                return res.status(400).json({
                    success: false,
                    message: "Slug artikel sudah digunakan oleh artikel lain."
                });
            }
        }

        let imageUrl = article.image;

        if (req.file) {
            // Evaluasi dan penghapusan objek lama dari arsitektur storage
            if (article.image && article.image.includes("supabase.co")) {
                const oldFilePath = article.image.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
                if (oldFilePath) {
                    await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
                }
            }

            // Unggah buffer objek baru
            const fileName = `articles/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
            const { error: uploadError } = await supabase.storage
                .from(
                    BUCKET_NAME
                )
                .upload(`articles/${fileName}`, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah gambar baru: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(`articles/${fileName}`);

            imageUrl = publicUrlData.publicUrl;
        }

        await article.update({
            title: title || article.title,
            slug: slug || article.slug,
            content: content || article.content,
            image: imageUrl,
            publishedAt: publishedAt || article.publishedAt,
            status: status || article.status
        });

        return res.status(200).json({
            success: true,
            message: "Artikel berhasil diperbarui.",
            data: article
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};

/**
 * Menghapus artikel beserta objek gambar persisten terkait.
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

        // Transmisi instruksi penghapusan objek ke Supabase API
        if (article.image && article.image.includes("supabase.co")) {
            const imagePath = article.image.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
            if (imagePath) {
                await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
            }
        }

        await article.destroy();

        return res.status(200).json({
            success: true,
            message: "Artikel berhasil dihapus."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan internal pada server.",
            error: error.message
        });
    }
};
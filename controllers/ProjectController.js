import ProjectModel from "../models/ProjectModel.js";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client menggunakan kredensial dari environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Konstanta nama bucket pada Supabase Storage
const BUCKET_NAME = "uploads";

/**
 * Mengambil seluruh data projek/karya dari database (mendukung filter kategori jika ada).
 */
export const getProjects = async(req, res) => {
    try {
        const { category } = req.query;
        let condition = {};

        if (category && category !== "All") {
            condition.category = category;
        }

        const projects = await ProjectModel.findAll({
            where: condition,
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data seluruh projek.",
            total: projects.length,
            data: projects,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat mengambil data projek.",
            error: error.message,
        });
    }
};

/**
 * Mengambil detail satu projek berdasarkan UUID atau slug.
 */
export const getProjectByIdOrSlug = async(req, res) => {
    try {
        const { identifier } = req.params;

        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

        const project = await ProjectModel.findOne({
            where: isUuid ? { uuid: identifier } : { slug: identifier },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Projek atau karya yang dicari tidak ditemukan.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail projek.",
            data: project,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat mengambil detail projek.",
            error: error.message,
        });
    }
};

/**
 * Menambahkan projek baru ke dalam galeri karya dan mengunggah gambar ke Supabase Storage.
 */
export const createProject = async(req, res) => {
    try {
        const { title, category, description, tools, github_url, figma_url, website_url } = req.body;

        if (!title || !category || !description || !tools) {
            return res.status(400).json({
                success: false,
                message: "Kolom wajib (title, category, description, tools) tidak boleh kosong.",
            });
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");

        const existingProject = await ProjectModel.findOne({ where: { slug } });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: "Projek dengan judul serupa sudah ada. Harap gunakan judul lain.",
            });
        }

        let imageUrl = null;

        // Logika pengunggahan buffer ke Supabase Storage
        if (req.file) {
            const fileName = `projects/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);

            // Ekstraksi URL publik dari berkas yang diunggah
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        const newProject = await ProjectModel.create({
            title,
            slug,
            category,
            description,
            tools,
            image: imageUrl,
            github_url: github_url || null,
            figma_url: figma_url || null,
            website_url: website_url || null,
        });

        return res.status(201).json({
            success: true,
            message: "Projek baru berhasil ditambahkan ke galeri karya.",
            data: newProject,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat menambahkan projek.",
            error: error.message,
        });
    }
};

/**
 * Memperbarui data projek dan menimpa file gambar di Supabase Storage jika terdapat pembaruan file.
 */
export const updateProject = async(req, res) => {
    try {
        const { uuid } = req.params;
        const project = await ProjectModel.findOne({ where: { uuid } });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Projek yang ingin diperbarui tidak ditemukan.",
            });
        }

        const { title, category, description, tools, github_url, figma_url, website_url } = req.body;

        let slug = project.slug;
        if (title && title !== project.title) {
            slug = title
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, "-");
        }

        let imageUrl = project.image;

        if (req.file) {
            // Evaluasi dan penghapusan berkas lama pada Supabase Storage
            if (project.image && project.image.includes("supabase.co")) {
                const oldFilePath = project.image.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
                if (oldFilePath) {
                    await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
                }
            }

            // Pengunggahan berkas baru
            const fileName = `projects/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah gambar baru: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        await ProjectModel.update({
            title: title || project.title,
            slug,
            category: category || project.category,
            description: description || project.description,
            tools: tools || project.tools,
            image: imageUrl,
            github_url: github_url !== undefined ? github_url : project.github_url,
            figma_url: figma_url !== undefined ? figma_url : project.figma_url,
            website_url: website_url !== undefined ? website_url : project.website_url,
        }, { where: { uuid } });

        const updatedProject = await ProjectModel.findOne({ where: { uuid } });

        return res.status(200).json({
            success: true,
            message: "Projek berhasil diperbarui.",
            data: updatedProject,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat memperbarui projek.",
            error: error.message,
        });
    }
};

/**
 * Menghapus projek dari database dan menghilangkan berkas gambar fisik terkait dari Supabase Storage.
 */
export const deleteProject = async(req, res) => {
    try {
        const { uuid } = req.params;
        const project = await ProjectModel.findOne({ where: { uuid } });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Projek yang ingin dihapus tidak ditemukan.",
            });
        }

        // Proses delegasi penghapusan objek berkas dari infrastruktur Supabase
        if (project.image && project.image.includes("supabase.co")) {
            const imagePath = project.image.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
            if (imagePath) {
                const { error: removeError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([imagePath]);

                if (removeError) console.error("Gagal menghapus gambar dari Supabase:", removeError);
            }
        }

        await ProjectModel.destroy({ where: { uuid } });

        return res.status(200).json({
            success: true,
            message: "Projek berhasil dihapus dari sistem.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat menghapus projek.",
            error: error.message,
        });
    }
};

import ProjectModel from "../models/ProjectModel.js";
import path from "path";
import fs from "fs";

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

        // Cek apakah identifier berupa UUID atau Slug
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
 * Menambahkan projek baru ke dalam galeri karya (Membutuhkan hak akses admin).
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

        // Membuat slug otomatis dari title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");

        // Cek apakah slug sudah ada
        const existingProject = await ProjectModel.findOne({ where: { slug } });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: "Projek dengan judul serupa sudah ada. Harap gunakan judul lain.",
            });
        }

        // Menangani file gambar jika diunggah melalui middleware multer
        let imageFilename = null;
        if (req.file) {
            imageFilename = req.file.filename;
        }

        const newProject = await ProjectModel.create({
            title,
            slug,
            category,
            description,
            tools,
            image: imageFilename,
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
 * Memperbarui data projek yang sudah ada berdasarkan UUID.
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

        let imageFilename = project.image;
        if (req.file) {
            // Hapus gambar lama jika ada file baru yang diunggah
            if (project.image) {
                const oldImagePath = path.join("public/uploads/projects", project.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imageFilename = req.file.filename;
        }

        await ProjectModel.update({
            title: title || project.title,
            slug,
            category: category || project.category,
            description: description || project.description,
            tools: tools || project.tools,
            image: imageFilename,
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
 * Menghapus projek dari database berdasarkan UUID.
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

        // Hapus file gambar fisik terkait jika ada
        if (project.image) {
            const imagePath = path.join("public/uploads/projects", project.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
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
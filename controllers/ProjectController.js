import ProjectModel from "../models/ProjectModel.js";

// Ambil semua data project (bisa difilter berdasarkan kategori jika diperlukan)
export const getProjects = async(req, res) => {
    try {
        const { category } = req.query;
        let condition = {};

        if (category) {
            condition.category = category;
        }

        const projects = await ProjectModel.findAll({
            where: condition,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data project",
            data: projects
        });
    } catch (error) {
        console.error("Error getProjects:", error.message);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Ambil data project berdasarkan UUID
export const getProjectByUuid = async(req, res) => {
    try {
        const project = await ProjectModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail project",
            data: project
        });
    } catch (error) {
        console.error("Error getProjectByUuid:", error.message);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Tambah project baru (Biasanya dilindungi middleware auth admin)
export const createProject = async(req, res) => {
    try {
        const { title, category, description, imageUrl, projectUrl } = req.body;

        // Validasi field wajib
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: "Judul dan kategori wajib diisi"
            });
        }

        const newProject = await ProjectModel.create({
            title,
            category,
            description,
            imageUrl,
            projectUrl
        });

        return res.status(201).json({
            success: true,
            message: "Project berhasil ditambahkan",
            data: newProject
        });
    } catch (error) {
        console.error("Error createProject:", error.message);
        return res.status(500).json({
            success: false,
            message: "Gagal menambahkan project",
            error: error.message
        });
    }
};

// Update project berdasarkan UUID
export const updateProject = async(req, res) => {
    try {
        const project = await ProjectModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project tidak ditemukan"
            });
        }

        const { title, category, description, imageUrl, projectUrl } = req.body;

        await ProjectModel.update({
            title: title || project.title,
            category: category || project.category,
            description: description !== undefined ? description : project.description,
            imageUrl: imageUrl !== undefined ? imageUrl : project.imageUrl,
            projectUrl: projectUrl !== undefined ? projectUrl : project.projectUrl
        }, {
            where: {
                uuid: req.params.uuid
            }
        });

        const updatedProject = await ProjectModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        return res.status(200).json({
            success: true,
            message: "Project berhasil diperbarui",
            data: updatedProject
        });
    } catch (error) {
        console.error("Error updateProject:", error.message);
        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui project",
            error: error.message
        });
    }
};

// Hapus project berdasarkan UUID
export const deleteProject = async(req, res) => {
    try {
        const project = await ProjectModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project tidak ditemukan"
            });
        }

        await ProjectModel.destroy({
            where: {
                uuid: req.params.uuid
            }
        });

        return res.status(200).json({
            success: true,
            message: "Project berhasil dihapus"
        });
    } catch (error) {
        console.error("Error deleteProject:", error.message);
        return res.status(500).json({
            success: false,
            message: "Gagal menghapus project",
            error: error.message
        });
    }
};
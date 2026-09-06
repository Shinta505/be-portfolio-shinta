import ResumeModel from "../models/ResumeModel.js";

// Mengambil semua daftar resume / CV yang tersedia
export const getAllResumes = async(req, res) => {
    try {
        const resumes = await ResumeModel.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.status(200).json({
            success: true,
            data: resumes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat mengambil data resume.",
            error: error.message
        });
    }
};

// Mengambil resume yang sedang aktif (is_active: true) untuk ditampilkan ke pengunjung publik
export const getActiveResume = async(req, res) => {
    try {
        const activeResume = await ResumeModel.findOne({
            where: { is_active: true }
        });

        if (!activeResume) {
            return res.status(404).json({
                success: false,
                message: "Belum ada versi resume yang diatur sebagai aktif."
            });
        }

        res.status(200).json({
            success: true,
            data: activeResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
            error: error.message
        });
    }
};

// Menambahkan data resume/CV baru
export const createResume = async(req, res) => {
    try {
        const { version_name, cv_url, is_active } = req.body;

        if (!version_name || !cv_url) {
            return res.status(400).json({
                success: false,
                message: "Nama versi dan tautan CV (cv_url) wajib diisi."
            });
        }

        // Jika resume baru diset aktif, nonaktifkan resume lainnya terlebih dahulu
        if (is_active === true) {
            await ResumeModel.update({ is_active: false }, { where: { is_active: true } });
        }

        const newResume = await ResumeModel.create({
            version_name,
            cv_url,
            is_active: is_active || false
        });

        res.status(201).json({
            success: true,
            message: "Resume berhasil ditambahkan.",
            data: newResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan resume.",
            error: error.message
        });
    }
};

// Memperbarui data resume berdasarkan UUID
export const updateResume = async(req, res) => {
    try {
        const { uuid } = req.params;
        const { version_name, cv_url, is_active } = req.body;

        const resume = await ResumeModel.findOne({ where: { uuid } });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Data resume tidak ditemukan."
            });
        }

        // Jika status diubah menjadi aktif, nonaktifkan resume lain
        if (is_active === true) {
            await ResumeModel.update({ is_active: false }, { where: { is_active: true } });
        }

        await ResumeModel.update({
            version_name: version_name !== undefined ? version_name : resume.version_name,
            cv_url: cv_url !== undefined ? cv_url : resume.cv_url,
            is_active: is_active !== undefined ? is_active : resume.is_active
        }, {
            where: { uuid }
        });

        const updatedResume = await ResumeModel.findOne({ where: { uuid } });

        res.status(200).json({
            success: true,
            message: "Resume berhasil diperbarui.",
            data: updatedResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui resume.",
            error: error.message
        });
    }
};

// Mengatur resume tertentu sebagai resume aktif utama
export const setActiveResume = async(req, res) => {
    try {
        const { uuid } = req.params;

        const resume = await ResumeModel.findOne({ where: { uuid } });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Data resume tidak ditemukan."
            });
        }

        // Nonaktifkan semua resume terlebih dahulu
        await ResumeModel.update({ is_active: false }, { where: {} });

        // Aktifkan resume yang dipilih
        await ResumeModel.update({ is_active: true }, { where: { uuid } });

        const activatedResume = await ResumeModel.findOne({ where: { uuid } });

        res.status(200).json({
            success: true,
            message: "Resume berhasil diatur sebagai aktif utama.",
            data: activatedResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengubah status aktif resume.",
            error: error.message
        });
    }
};

// Menghapus data resume berdasarkan UUID
export const deleteResume = async(req, res) => {
    try {
        const { uuid } = req.params;

        const resume = await ResumeModel.findOne({ where: { uuid } });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Data resume tidak ditemukan."
            });
        }

        await ResumeModel.destroy({ where: { uuid } });

        res.status(200).json({
            success: true,
            message: "Resume berhasil dihapus."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus resume.",
            error: error.message
        });
    }
};
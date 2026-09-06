import EducationModel from "../models/EducationModel.js";

/**
 * Mengambil seluruh data riwayat pendidikan.
 */
export const getAllEducations = async(req, res) => {
    try {
        const educations = await EducationModel.findAll({
            order: [
                ["createdAt", "DESC"]
            ]
        });
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data riwayat pendidikan.",
            data: educations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data riwayat pendidikan.",
            error: error.message
        });
    }
};

/**
 * Mengambil data riwayat pendidikan berdasarkan ID.
 */
export const getEducationById = async(req, res) => {
    try {
        const education = await EducationModel.findByPk(req.params.id);
        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Data riwayat pendidikan tidak ditemukan."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail data riwayat pendidikan.",
            data: education
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
            error: error.message
        });
    }
};

/**
 * Menambahkan data riwayat pendidikan baru (memerlukan hak akses admin).
 */
export const createEducation = async(req, res) => {
    try {
        const {
            institution_logo,
            institution_name,
            degree,
            field_of_study,
            start_date,
            end_date,
            score,
            activities,
            description,
            media
        } = req.body;

        const newEducation = await EducationModel.create({
            institution_logo,
            institution_name,
            degree,
            field_of_study,
            start_date,
            end_date,
            score,
            activities,
            description,
            media
        });

        return res.status(201).json({
            success: true,
            message: "Data riwayat pendidikan berhasil ditambahkan.",
            data: newEducation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal menambahkan data riwayat pendidikan.",
            error: error.message
        });
    }
};

/**
 * Memperbarui data riwayat pendidikan berdasarkan ID.
 */
export const updateEducation = async(req, res) => {
    try {
        const education = await EducationModel.findByPk(req.params.id);
        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Data riwayat pendidikan tidak ditemukan."
            });
        }

        const {
            institution_logo,
            institution_name,
            degree,
            field_of_study,
            start_date,
            end_date,
            score,
            activities,
            description,
            media
        } = req.body;

        await education.update({
            institution_logo: institution_logo ?? education.institution_logo,
            institution_name: institution_name ?? education.institution_name,
            degree: degree ?? education.degree,
            field_of_study: field_of_study ?? education.field_of_study,
            start_date: start_date ?? education.start_date,
            end_date: end_date ?? education.end_date,
            score: score ?? education.score,
            activities: activities ?? education.activities,
            description: description ?? education.description,
            media: media ?? education.media
        });

        return res.status(200).json({
            success: true,
            message: "Data riwayat pendidikan berhasil diperbarui.",
            data: education
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui data riwayat pendidikan.",
            error: error.message
        });
    }
};

/**
 * Menghapus data riwayat pendidikan berdasarkan ID.
 */
export const deleteEducation = async(req, res) => {
    try {
        const education = await EducationModel.findByPk(req.params.id);
        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Data riwayat pendidikan tidak ditemukan."
            });
        }

        await education.destroy();

        return res.status(200).json({
            success: true,
            message: "Data riwayat pendidikan berhasil dihapus."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal menghapus data riwayat pendidikan.",
            error: error.message
        });
    }
};
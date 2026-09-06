import ExperienceModel from "../models/ExperienceModel.js";

/**
 * Mendapatkan seluruh data riwayat pekerjaan.
 */
export const getExperiences = async(req, res) => {
    try {
        const response = await ExperienceModel.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Mendapatkan data riwayat pekerjaan berdasarkan UUID.
 */
export const getExperienceById = async(req, res) => {
    try {
        const experience = await ExperienceModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!experience) {
            return res.status(404).json({ message: "Data pengalaman kerja tidak ditemukan." });
        }

        return res.status(200).json(experience);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Menambahkan data riwayat pekerjaan baru (hanya admin).
 */
export const createExperience = async(req, res) => {
    const {
        position,
        company,
        location,
        location_type,
        employment_type,
        start_date,
        end_date,
        description,
        skills,
        media
    } = req.body;

    try {
        await ExperienceModel.create({
            position,
            company,
            location,
            location_type,
            employment_type,
            start_date,
            end_date,
            description,
            skills,
            media
        });

        return res.status(201).json({ message: "Data pengalaman kerja berhasil ditambahkan." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Memperbarui data riwayat pekerjaan berdasarkan UUID (hanya admin).
 */
export const updateExperience = async(req, res) => {
    try {
        const experience = await ExperienceModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!experience) {
            return res.status(404).json({ message: "Data pengalaman kerja tidak ditemukan." });
        }

        const {
            position,
            company,
            location,
            location_type,
            employment_type,
            start_date,
            end_date,
            description,
            skills,
            media
        } = req.body;

        await ExperienceModel.update({
            position,
            company,
            location,
            location_type,
            employment_type,
            start_date,
            end_date,
            description,
            skills,
            media
        }, {
            where: {
                uuid: req.params.id
            }
        });

        return res.status(200).json({ message: "Data pengalaman kerja berhasil diperbarui." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Menghapus data riwayat pekerjaan berdasarkan UUID (hanya admin).
 */
export const deleteExperience = async(req, res) => {
    try {
        const experience = await ExperienceModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!experience) {
            return res.status(404).json({ message: "Data pengalaman kerja tidak ditemukan." });
        }

        await ExperienceModel.destroy({
            where: {
                uuid: req.params.id
            }
        });

        return res.status(200).json({ message: "Data pengalaman kerja berhasil dihapus." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
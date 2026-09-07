import ExperienceModel from "../models/ExperienceModel.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "uploads";

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
 * Menambahkan data riwayat pekerjaan baru dengan dukungan upload media ke Supabase.
 */
export const createExperience = async(req, res) => {
    try {
        const {
            position,
            company,
            location,
            location_type,
            employment_type,
            start_date,
            end_date,
            description,
            skills
        } = req.body;

        let mediaUrl = req.body.media || null;

        if (req.file) {
            const fileName = `experiences/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah media: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            mediaUrl = publicUrlData.publicUrl;
        }

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
            media: mediaUrl
        });

        return res.status(201).json({ message: "Data pengalaman kerja berhasil ditambahkan." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Memperbarui data riwayat pekerjaan berdasarkan UUID.
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
            skills
        } = req.body;

        let mediaUrl = experience.media;

        if (req.file) {
            // Hapus file lama di Supabase jika ada dan menggunakan supabase URL
            if (experience.media && experience.media.includes("supabase.co")) {
                const oldFilePath = experience.media.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
                if (oldFilePath) {
                    await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
                }
            }

            const fileName = `experiences/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah media baru: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            mediaUrl = publicUrlData.publicUrl;
        } else if (req.body.media !== undefined) {
            mediaUrl = req.body.media;
        }

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
            media: mediaUrl
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
 * Menghapus data riwayat pekerjaan berdasarkan UUID.
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

        if (experience.media && experience.media.includes("supabase.co")) {
            const imagePath = experience.media.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
            if (imagePath) {
                await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
            }
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
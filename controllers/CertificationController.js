import CertificationModel from "../models/CertificationModel.js";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Menggunakan single-bucket "uploads" dengan folder spesifik
const BUCKET_NAME = "uploads";

/**
 * Mengambil seluruh data sertifikasi dan lisensi profesional.
 */
export const getCertifications = async(req, res) => {
    try {
        const response = await CertificationModel.findAll({
            attributes: [
                'uuid',
                'name',
                'issuer',
                'issueDate',
                'expirationDate',
                'credentialId',
                'credentialUrl',
                'skills',
                'media'
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil data sertifikasi.",
            error: error.message
        });
    }
};

/**
 * Mengambil data sertifikasi spesifik berdasarkan UUID.
 */
export const getCertificationById = async(req, res) => {
    try {
        const certification = await CertificationModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!certification) {
            return res.status(404).json({
                message: "Data sertifikasi tidak ditemukan."
            });
        }

        res.status(200).json(certification);
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil data sertifikasi.",
            error: error.message
        });
    }
};

/**
 * Menambahkan data sertifikasi atau lisensi baru ke database beserta unggah media ke Supabase.
 */
export const createCertification = async(req, res) => {
    try {
        const {
            name,
            issuer,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
            skills
        } = req.body;

        let mediaUrl = null;

        if (req.file) {
            const fileName = `certifications/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

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

        await CertificationModel.create({
            name,
            issuer,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
            skills,
            media: mediaUrl
        });

        res.status(201).json({
            message: "Sertifikasi berhasil ditambahkan."
        });
    } catch (error) {
        res.status(400).json({
            message: "Gagal menambahkan sertifikasi. Periksa kembali format data yang dikirimkan.",
            error: error.message
        });
    }
};

/**
 * Memperbarui data sertifikasi yang sudah ada berdasarkan UUID.
 */
export const updateCertification = async(req, res) => {
    try {
        const certification = await CertificationModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!certification) {
            return res.status(404).json({
                message: "Data sertifikasi tidak ditemukan."
            });
        }

        const {
            name,
            issuer,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
            skills
        } = req.body;

        let mediaUrl = certification.media;

        if (req.file) {
            // Hapus file lama di Supabase jika ada
            if (certification.media && certification.media.includes("supabase.co")) {
                const oldFilePath = certification.media.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
                if (oldFilePath) {
                    await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
                }
            }

            const fileName = `certifications/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
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
        }

        await CertificationModel.update({
            name: name !== undefined ? name : certification.name,
            issuer: issuer !== undefined ? issuer : certification.issuer,
            issueDate: issueDate !== undefined ? issueDate : certification.issueDate,
            expirationDate: expirationDate !== undefined ? expirationDate : certification.expirationDate,
            credentialId: credentialId !== undefined ? credentialId : certification.credentialId,
            credentialUrl: credentialUrl !== undefined ? credentialUrl : certification.credentialUrl,
            skills: skills !== undefined ? skills : certification.skills,
            media: mediaUrl
        }, {
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({
            message: "Sertifikasi berhasil diperbarui."
        });
    } catch (error) {
        res.status(400).json({
            message: "Gagal memperbarui sertifikasi. Periksa kembali masukan Anda.",
            error: error.message
        });
    }
};

/**
 * Menghapus data sertifikasi berdasarkan UUID.
 */
export const deleteCertification = async(req, res) => {
    try {
        const certification = await CertificationModel.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!certification) {
            return res.status(404).json({
                message: "Data sertifikasi tidak ditemukan."
            });
        }

        // Hapus file fisik dari Supabase Storage
        if (certification.media && certification.media.includes("supabase.co")) {
            const imagePath = certification.media.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
            if (imagePath) {
                await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
            }
        }

        await CertificationModel.destroy({
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({
            message: "Sertifikasi berhasil dihapus."
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan pada server saat menghapus sertifikasi.",
            error: error.message
        });
    }
};
import CertificationModel from "../models/CertificationModel.js";

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
 * Menambahkan data sertifikasi atau lisensi baru ke database.
 */
export const createCertification = async(req, res) => {
    const {
        name,
        issuer,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
        skills,
        media
    } = req.body;

    try {
        await CertificationModel.create({
            name,
            issuer,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
            skills,
            media
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
            skills,
            media
        } = req.body;

        await CertificationModel.update({
            name: name !== undefined ? name : certification.name,
            issuer: issuer !== undefined ? issuer : certification.issuer,
            issueDate: issueDate !== undefined ? issueDate : certification.issueDate,
            expirationDate: expirationDate !== undefined ? expirationDate : certification.expirationDate,
            credentialId: credentialId !== undefined ? credentialId : certification.credentialId,
            credentialUrl: credentialUrl !== undefined ? credentialUrl : certification.credentialUrl,
            skills: skills !== undefined ? skills : certification.skills,
            media: media !== undefined ? media : certification.media
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
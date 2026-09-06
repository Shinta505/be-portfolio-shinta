import MessageModel from "../models/MessageModel.js";

/**
 * @file ContactController.js
 * @description Controller untuk mengelola pesan yang dikirim lewat formulir kontak 
 * (nama, email, pesan) serta manajemen data pesan untuk keperluan administrator (CMS)[cite: 1].
 */

/**
 * Mengirim pesan baru dari pengunjung melalui Formulir Kontak publik.
 * @route POST /api/contact
 */
export const sendMessage = async(req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validasi input sederhana
        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Semua kolom (nama, email, pesan) wajib diisi."
            });
        }

        // Simpan pesan ke database PostgreSQL menggunakan Sequelize dan Supabase
        const newMessage = await MessageModel.create({
            name,
            email,
            message
        });

        return res.status(201).json({
            message: "Pesan Anda berhasil dikirim. Terima kasih telah menghubungi kami.",
            data: newMessage
        });
    } catch (error) {
        console.error("Gagal mengirim pesan:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengirim pesan.",
            error: error.message
        });
    }
};

/**
 * Mendapatkan seluruh daftar pesan masuk (Khusus Administrator/CMS).
 * @route GET /api/contacts
 */
export const getMessages = async(req, res) => {
    try {
        const messages = await MessageModel.findAll({
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({
            message: "Berhasil mengambil seluruh daftar pesan.",
            total: messages.length,
            data: messages
        });
    } catch (error) {
        console.error("Gagal mengambil daftar pesan:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil data pesan.",
            error: error.message
        });
    }
};

/**
 * Mendapatkan detail pesan berdasarkan UUID (Khusus Administrator/CMS).
 * @route GET /api/contacts/:uuid
 */
export const getMessageById = async(req, res) => {
    try {
        const message = await MessageModel.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!message) {
            return res.status(404).json({
                message: "Pesan tidak ditemukan."
            });
        }

        return res.status(200).json({
            message: "Berhasil mengambil detail pesan.",
            data: message
        });
    } catch (error) {
        console.error("Gagal mengambil detail pesan:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil detail pesan.",
            error: error.message
        });
    }
};

/**
 * Menghapus pesan berdasarkan UUID (Khusus Administrator/CMS).
 * @route DELETE /api/contacts/:uuid
 */
export const deleteMessage = async(req, res) => {
    try {
        const message = await MessageModel.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!message) {
            return res.status(404).json({
                message: "Pesan yang ingin dihapus tidak ditemukan."
            });
        }

        await message.destroy();

        return res.status(200).json({
            message: "Pesan berhasil dihapus."
        });
    } catch (error) {
        console.error("Gagal menghapus pesan:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server saat menghapus pesan.",
            error: error.message
        });
    }
};
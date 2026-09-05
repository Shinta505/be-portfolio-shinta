import MessageModel from "../models/MessageModel.js";

// Mengambil seluruh daftar pesan masuk (Biasanya digunakan pada halaman dashboard admin/CMS)
export const getMessages = async(req, res) => {
    try {
        const messages = await MessageModel.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        return res.status(200).json({
            status: "success",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Gagal mengambil data pesan.",
            error: error.message
        });
    }
};

// Menambahkan atau mengirim pesan baru dari formulir kontak publik
export const createMessage = async(req, res) => {
    const { name, email, subject, message } = req.body;

    // Validasi sederhana sisi backend
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            status: "fail",
            message: "Semua kolom wajib diisi."
        });
    }

    try {
        const newMessage = await MessageModel.create({
            name,
            email,
            subject,
            message
        });

        return res.status(201).json({
            status: "success",
            message: "Pesan berhasil dikirim.",
            data: newMessage
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal mengirim pesan.",
            error: error.message
        });
    }
};

// Menghapus pesan berdasarkan ID tertentu (Hak akses admin)
export const deleteMessage = async(req, res) => {
    const { id } = req.params;

    try {
        const existingMessage = await MessageModel.findByPk(id);

        if (!existingMessage) {
            return res.status(404).json({
                status: "fail",
                message: "Pesan tidak ditemukan."
            });
        }

        await MessageModel.destroy({
            where: { id }
        });

        return res.status(200).json({
            status: "success",
            message: "Pesan berhasil dihapus."
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Gagal menghapus pesan.",
            error: error.message
        });
    }
};
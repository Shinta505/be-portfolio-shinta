import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Controller Otentikasi untuk manajemen sesi masuk admin pada Sistem Manajemen Konten (CMS)[cite: 1].
 */

// Fungsi untuk proses login administrator
export const Login = async(req, res) => {
    const { username, password } = req.body;

    try {
        // Validasi input kosong
        if (!username || !password) {
            return res.status(400).json({ message: "Username dan password wajib diisi." });
        }

        // Mencari data pengguna berdasarkan username pada database PostgreSQL melalui model Sequelize
        const user = await UserModel.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        // Memeriksa kecocokan password yang diinput dengan enkripsi hash pada database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Kredensial tidak valid (Password salah)." });
        }

        // Pembuatan JSON Web Token (JWT) untuk otorisasi sesi
        const accessToken = jwt.sign({
                uuid: user.uuid,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Autentikasi berhasil.",
            accessToken,
            data: {
                uuid: user.uuid,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan pada server saat proses login.",
            error: error.message
        });
    }
};

// Fungsi untuk mendapatkan informasi pengguna yang sedang aktif berdasarkan token
export const Me = async(req, res) => {
    try {
        // req.userId atau req.user diasumsikan telah disematkan melalui middleware otentikasi (AuthMiddleware)
        const userId = req.userId || (req.user && req.user.uuid);

        if (!userId) {
            return res.status(401).json({ message: "Mohon masuk ke akun Anda terlebih dahulu." });
        }

        const user = await UserModel.findOne({
            attributes: ['uuid', 'username', 'role'],
            where: { uuid: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: "Gagal memuat data sesi pengguna.",
            error: error.message
        });
    }
};

// Fungsi untuk menangani proses keluar (logout) sistem
export const Logout = async(req, res) => {
    try {
        // Pada arsitektur stateless JWT, logout utama ditangani di sisi klien 
        // dengan menghapus token dari penyimpanan lokal (LocalStorage/Cookies).
        return res.status(200).json({ message: "Logout berhasil." });

    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan saat proses logout.",
            error: error.message
        });
    }
};
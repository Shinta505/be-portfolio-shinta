import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Mencari entitas pengguna berdasarkan username pada database
        let user = await Users.findOne({
            where: { username: username }
        });

        // Logika inisialisasi (seeding) otomatis admin via Environment Variables
        if (!user && username === process.env.ADMIN_USERNAME) {
            if (password === process.env.ADMIN_PASSWORD) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

                // Menyimpan data admin ke dalam tabel Users di Supabase
                user = await Users.create({
                    username: process.env.ADMIN_USERNAME,
                    password: hashPassword,
                    role: 'admin'
                });
            } else {
                return res.status(400).json({ msg: "Kredensial kata sandi tidak valid." });
            }
        } else if (!user) {
            return res.status(404).json({ msg: "Entitas pengguna tidak ditemukan di dalam sistem." });
        }

        // Verifikasi kecocokan hash sandi
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Kredensial kata sandi tidak valid." });

        // Pembuatan JSON Web Token (JWT) untuk manajemen sesi
        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret_key_sementara', { expiresIn: '1d' }
        );

        res.status(200).json({
            msg: "Autentikasi berhasil.",
            token: accessToken,
            data: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: `Kesalahan internal peladen: ${error.message}` });
    }
};

export const me = async(req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ msg: "Akses ditolak. Token tidak ditemukan." });

        jwt.verify(token, process.env.JWT_SECRET || 'secret_key_sementara', async(err, decoded) => {
            if (err) return res.status(403).json({ msg: "Token tidak valid atau telah kedaluwarsa." });

            const user = await Users.findOne({
                attributes: ['id', 'username', 'role'],
                where: { id: decoded.id }
            });

            if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan." });
            res.status(200).json(user);
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const logout = (req, res) => {
    // Pada arsitektur berbasis JWT (stateless), proses logout umumnya diselesaikan 
    // di sisi klien (frontend) dengan menghapus token dari local storage/cookies.
    res.status(200).json({ msg: "Sesi berhasil diakhiri." });
};
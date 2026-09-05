import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

/**
 * Middleware untuk memverifikasi keabsahan JSON Web Token (JWT) pada header permintaan.
 */
export const verifyToken = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            msg: "Akses ditolak. Token autentikasi tidak ditemukan."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key_sementara', async(err, decoded) => {
        if (err) {
            return res.status(403).json({
                msg: "Token tidak valid atau telah kedaluwarsa."
            });
        }

        try {
            const user = await Users.findOne({
                where: { id: decoded.id }
            });

            if (!user) {
                return res.status(404).json({
                    msg: "Entitas pengguna sistem tidak ditemukan."
                });
            }

            req.userId = user.id;
            req.role = user.role;
            next();
        } catch (error) {
            return res.status(500).json({
                msg: `Kesalahan internal peladen saat verifikasi token: ${error.message}`
            });
        }
    });
};

/**
 * Middleware untuk membatasi hak akses khusus Administrator (CMS).
 */
export const adminOnly = async(req, res, next) => {
    try {
        const user = await Users.findOne({
            where: { id: req.userId }
        });

        if (!user) {
            return res.status(404).json({
                msg: "Pengguna tidak ditemukan."
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                msg: "Akses terlarang. Hak istimewa administrator diperlukan untuk sumber daya ini."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            msg: `Kesalahan internal peladen saat validasi peran: ${error.message}`
        });
    }
};
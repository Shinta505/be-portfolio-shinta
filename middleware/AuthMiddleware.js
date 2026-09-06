import jwt from "jsonwebtoken";

/**
 * Middleware Otentikasi untuk memverifikasi keabsahan JSON Web Token (JWT) 
 * pada rute terlindungi dalam sistem manajemen konten (CMS)[cite: 1].
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({
            message: "Mohon masuk ke akun Anda terlebih dahulu. Token otentikasi tidak ditemukan."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Akses ditolak. Token tidak valid atau telah kedaluwarsa."
            });
        }

        // Menyematkan informasi pengguna ke objek request agar dapat diakses oleh controller selanjutnya
        req.userId = decoded.uuid;
        req.user = decoded;

        next();
    });
};

/**
 * Middleware Otorisasi tambahan untuk memastikan hak akses khusus Administrator (opsional).
 */
export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: "Akses terlarang. Anda tidak memiliki hak istimewa sebagai administrator."
        });
    }
    next();
};
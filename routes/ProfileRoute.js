import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";

dotenv.config();

const router = express.Router();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak. Token otentikasi tidak ditemukan."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token tidak valid atau kedaluwarsa."
            });
        }
        req.admin = decoded;
        next();
    });
};

router.get("/profile", getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
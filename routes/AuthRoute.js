import express from "express";
import { login, me, logout } from "../controllers/AuthController.js";
import { verifyToken, adminOnly } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, me);
router.delete('/logout', logout);

export default router;
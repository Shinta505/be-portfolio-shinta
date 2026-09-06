import express from "express";
import {
    getAllResumes,
    getActiveResume,
    createResume,
    updateResume,
    setActiveResume,
    deleteResume
} from "../controllers/ResumeController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Endpoint publik untuk mengakses data resume
router.get("/resumes", getAllResumes);
router.get("/resumes/active", getActiveResume);

// Endpoint privat (memerlukan autentikasi admin) untuk manajemen data resume
router.post("/resumes", verifyToken, createResume);
router.put("/resumes/:uuid", verifyToken, updateResume);
router.patch("/resumes/:uuid/active", verifyToken, setActiveResume);
router.delete("/resumes/:uuid", verifyToken, deleteResume);

export default router;
import express from "express";
import {
    getProjects,
    getProjectByUuid,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/ProjectController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Endpoint publik (bisa diakses siapa saja untuk melihat galeri proyek)
router.get('/projects', getProjects);
router.get('/projects/:uuid', getProjectByUuid);

// Endpoint privat (hanya bisa diakses oleh admin yang sudah login menggunakan token JWT)
router.post('/projects', verifyToken, createProject);
router.patch('/projects/:uuid', verifyToken, updateProject);
router.delete('/projects/:uuid', verifyToken, deleteProject);

export default router;
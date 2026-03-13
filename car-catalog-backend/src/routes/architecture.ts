import { Router } from 'express';
import { getCategories, getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/architectureController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * ARCHITECTURE ROUTES — Gestión de Planos y Proyectos
 */

// === PÚBLICAS ===
router.get('/categories', getCategories);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

// === PROTEGIDAS (Admin / Arquitecto) ===
router.post('/projects', authenticateToken, requireAdmin, createProject);
router.put('/projects/:id', authenticateToken, requireAdmin, updateProject);
router.delete('/projects/:id', authenticateToken, requireAdmin, deleteProject);

export default router;

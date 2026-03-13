import { Router } from 'express';
import { getCategories, getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/architectureController';
import { authenticateToken, requireAdmin, requireRole } from '../middleware/auth';

const router = Router();

/**
 * ARCHITECTURE ROUTES — Gestión de Planos y Proyectos
 */

// === PÚBLICAS ===
router.get('/categories', getCategories);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

// === PROTEGIDAS (Admin / Arquitecto) ===
router.post('/projects', authenticateToken, requireRole(['admin', 'architect']), createProject);
router.put('/projects/:id', authenticateToken, requireRole(['admin', 'architect']), updateProject);
router.delete('/projects/:id', authenticateToken, requireRole(['admin', 'architect']), deleteProject);

export default router;

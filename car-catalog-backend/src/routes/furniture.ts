import { Router } from 'express';
import { getCategories, getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/furnitureController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * DECOHAUS ROUTES — Muebles de Diseño
 */

// === PÚBLICAS ===
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// === PROTEGIDAS (Admin) ===
router.post('/products', authenticateToken, requireAdmin, createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;

import { Router } from 'express';
import { 
    getCategories,
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/irontrailController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * IRONTRAIL ROUTES
 * Rutas específicas para el módulo IronTrail (4x4 Off-Road)
 */

// === RUTAS PÚBLICAS ===

// GET /api/irontrail/categories - Obtener categorías (para filtros)
router.get('/categories', getCategories);

// GET /api/irontrail/products - Listar productos con filtros
router.get('/products', getProducts);

// GET /api/irontrail/products/:id - Obtener producto por ID
router.get('/products/:id', getProductById);


// === RUTAS PROTEGIDAS (Admin) ===

// POST /api/irontrail/products - Crear producto
router.post('/products', authenticateToken, requireAdmin, createProduct);

// PUT /api/irontrail/products/:id - Actualizar producto
router.put('/products/:id', authenticateToken, requireAdmin, updateProduct);

// DELETE /api/irontrail/products/:id - Eliminar producto
router.delete('/products/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;

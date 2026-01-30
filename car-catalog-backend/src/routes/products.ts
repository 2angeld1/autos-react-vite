import { Router } from 'express';
import { ProductController } from '../controllers/productController';
// Asumiendo que tienes middleware de autenticación, lo importo. Si no, lo omito por ahora para el demo.
// import { protect, authorize } from '../middleware/auth'; 

const router = Router();

// Rutas Públicas (Catálogo y Detalle)
router.get('/', ProductController.getAll);
router.get('/:slug', ProductController.getBySlug);

// Rutas Privadas (Admin) - Por ahora las dejo abiertas o comentadas hasta integrar Auth en el demo
router.post('/', ProductController.create);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;

import { Router } from 'express';
import { createQuote, getQuotes, updateQuoteStatus } from '../controllers/quoteController';
// Recomiendo descomentar esto cuando tengas autenticación
// import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// Pública: Crear cotización
router.post('/', createQuote);

// Admin: Ver y Gestionar cotizaciones
// router.use(protect, admin); // Proteger rutas admin
router.get('/', getQuotes);
router.patch('/:id', updateQuoteStatus);

export default router;

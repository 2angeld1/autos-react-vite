import { Router } from 'express';
import { PromotionController } from '@/controllers/promotionController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/temp/' });

// --- PUBLIC ROUTES ---
// Validate a promotion code (for checkout)
router.post('/validate', PromotionController.validateCode);

// --- PROTECTED ROUTES ---
router.use(authenticateToken);

// Use a promotion (after successful purchase)
router.post('/use', PromotionController.usePromotion);

// --- ADMIN ROUTES ---
router.use(requireAdmin);

// Get statistics
router.get('/stats', PromotionController.getStats);

// CRUD operations
router.get('/', PromotionController.getAllPromotions);
router.get('/:id', PromotionController.getPromotionById);
router.post('/', upload.single('image'), PromotionController.createPromotion);
router.put('/:id', upload.single('image'), PromotionController.updatePromotion);
router.delete('/:id', PromotionController.deletePromotion);

// Toggle status
router.patch('/:id/toggle', PromotionController.toggleStatus);

export default router;

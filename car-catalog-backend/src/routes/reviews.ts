import { Router } from 'express';
import { ReviewController } from '@/controllers/reviewController';
import { sanitizeInput } from '@/middleware/validation';
import { authenticateToken, requireAdmin } from '@/middleware/auth';

const router = Router();

/**
 * @route   GET /api/reviews
 * @desc    Obtener todas las reseñas (Admin)
 * @access  Private (Admin)
 */
router.get('/', [authenticateToken, requireAdmin], ReviewController.getAllReviews);

/**
 * @route   GET /api/reviews/latest
 * @desc    Obtener últimas reseñas globales
 * @access  Public
 */
router.get('/latest', ReviewController.getLatestReviews);

/**
 * @route   GET /api/reviews/:carId
 * @desc    Obtener reseñas de un auto
 * @access  Public
 */
router.get('/:carId', ReviewController.getCarReviews);

/**
 * @route   POST /api/reviews
 * @desc    Crear una reseña
 * @access  Public
 */
router.post('/', [sanitizeInput], ReviewController.createReview);

/**
 * @route   PATCH /api/reviews/:id/reply
 * @desc    Responder a una reseña
 * @access  Private (Admin)
 */
router.patch('/:id/reply', [authenticateToken, requireAdmin, sanitizeInput], ReviewController.replyToReview);

/**
 * @route   PATCH /api/reviews/:id/toggle-approval
 * @desc    Aprobar/Ocultar reseña
 * @access  Private (Admin)
 */
router.patch('/:id/toggle-approval', [authenticateToken, requireAdmin], ReviewController.toggleApproval);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Eliminar una reseña
 * @access  Private (Admin)
 */
router.delete('/:id', [authenticateToken, requireAdmin], ReviewController.deleteReview);

export default router;

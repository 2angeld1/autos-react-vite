import { Router } from 'express';
import { FavoriteController } from '@/controllers/favoriteControllers'; // Agregado "s" al final
import { handleValidationErrors, sanitizeInput, validatePagination, validateObjectId } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { body } from 'express-validator';

const router = Router();

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorite cars
 * @access  Private
 */
router.get('/', [
  authenticateToken,
  validatePagination,
  handleValidationErrors
], FavoriteController.getFavorites);

/**
 * @route   GET /api/favorites/stats
 * @desc    Get favorite statistics
 * @access  Private
 */
router.get('/stats', authenticateToken, FavoriteController.getFavoriteStats);

/**
 * @route   POST /api/favorites
 * @desc    Add car to favorites
 * @access  Private
 */
router.post('/', [
  authenticateToken,
  sanitizeInput,
  body('carId').notEmpty().withMessage('Car ID is required'),
  handleValidationErrors
], FavoriteController.addFavorite);

/**
 * @route   DELETE /api/favorites/clear
 * @desc    Clear all favorites
 * @access  Private
 */
router.delete('/clear', authenticateToken, FavoriteController.clearFavorites);

/**
 * @route   GET /api/favorites/:carId/check
 * @desc    Check if car is in favorites
 * @access  Private
 */
router.get('/:carId/check', [
  authenticateToken,
  validateObjectId('carId'),
  handleValidationErrors
], FavoriteController.checkFavorite);

/**
 * @route   DELETE /api/favorites/:carId
 * @desc    Remove car from favorites
 * @access  Private
 */
router.delete('/:carId', [
  authenticateToken,
  validateObjectId('carId'),
  handleValidationErrors
], FavoriteController.removeFavorite);

export default router;
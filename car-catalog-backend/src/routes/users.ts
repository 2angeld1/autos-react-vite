import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { handleValidationErrors, sanitizeInput, validatePagination, validateObjectId } from '@/middleware/validation';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { body } from 'express-validator';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', [
  authenticateToken,
  requireAdmin,
  sanitizeInput,
  validatePagination,
  handleValidationErrors
], UserController.getAllUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin only)
 */
router.get('/stats', [
  authenticateToken,
  requireAdmin
], UserController.getUserStats);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get('/:id', [
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors
], UserController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  sanitizeInput,
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean(),
  handleValidationErrors
], UserController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate user
 * @access  Private (Admin only)
 */
router.delete('/:id', [
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors
], UserController.deleteUser);

/**
 * @route   PUT /api/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin only)
 */
router.put('/:id/activate', [
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors
], UserController.activateUser);

/**
 * @route   PUT /api/users/:id/make-admin
 * @desc    Make user admin
 * @access  Private (Super admin only)
 */
router.put('/:id/make-admin', [
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors
], UserController.makeAdmin);

export default router;
import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { userValidationRules } from '@/utils/validators';
import { handleValidationErrors, sanitizeInput } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { body } from 'express-validator';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', [
  sanitizeInput,
  ...userValidationRules.register,
  handleValidationErrors
], AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
  sanitizeInput,
  ...userValidationRules.login,
  handleValidationErrors
], AuthController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  authenticateToken,
  sanitizeInput,
  ...userValidationRules.updateProfile,
  handleValidationErrors
], AuthController.updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', [
  authenticateToken,
  sanitizeInput,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  }),
  handleValidationErrors
], AuthController.changePassword);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, AuthController.deleteAccount);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Private
 */
router.post('/refresh', authenticateToken, AuthController.refreshToken);

export default router;
import { Router } from 'express';
import { CarController } from '@/controllers/carController';
import { carValidationRules } from '@/utils/validators';
import { handleValidationErrors, sanitizeInput, validatePagination } from '@/middleware/validation';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { param } from 'express-validator';

const router = Router();

/**
 * @route   GET /api/cars
 * @desc    Get all cars with filtering and pagination
 * @access  Public
 */
router.get('/', [
  sanitizeInput,
  validatePagination,
  handleValidationErrors
], CarController.getAllCars);

/**
 * @route   GET /api/cars/featured
 * @desc    Get featured cars
 * @access  Public
 */
router.get('/featured', CarController.getFeaturedCars);

/**
 * @route   GET /api/cars/search
 * @desc    Search cars
 * @access  Public
 */
router.get('/search', [
  sanitizeInput,
  handleValidationErrors
], CarController.searchCars);

/**
 * @route   GET /api/cars/stats
 * @desc    Get car statistics
 * @access  Public
 */
router.get('/stats', CarController.getCarStats);

/**
 * @route   GET /api/cars/makes
 * @desc    Get unique car makes
 * @access  Public
 */
router.get('/makes', CarController.getMakes);

/**
 * @route   GET /api/cars/makes/:make/models
 * @desc    Get models by make
 * @access  Public
 */
router.get('/makes/:make/models', [
  param('make').notEmpty().withMessage('Make is required'),
  handleValidationErrors
], CarController.getModelsByMake);

/**
 * @route   GET /api/cars/:id
 * @desc    Get car by ID
 * @access  Public
 */
router.get('/:id', [
  param('id').notEmpty().withMessage('ID is required'),
  handleValidationErrors
], CarController.getCarById);

/**
 * @route   GET /api/cars/:id/similar
 * @desc    Get similar cars
 * @access  Public
 */
router.get('/:id/similar', [
  param('id').notEmpty().withMessage('ID is required'),
  handleValidationErrors
], CarController.getSimilarCars);

/**
 * @route   POST /api/cars
 * @desc    Create new car
 * @access  Private (Admin only)
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  sanitizeInput,
  ...carValidationRules.create,
  handleValidationErrors
], CarController.createCar);

/**
 * @route   PUT /api/cars/:id
 * @desc    Update car
 * @access  Private (Admin only)
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').notEmpty().withMessage('ID is required'),
  sanitizeInput,
  ...carValidationRules.update,
  handleValidationErrors
], CarController.updateCar);

/**
 * @route   DELETE /api/cars/:id
 * @desc    Delete car (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').notEmpty().withMessage('ID is required'),
  handleValidationErrors
], CarController.deleteCar);

export default router;
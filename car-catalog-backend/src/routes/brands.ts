import { Router } from 'express';
import { BrandController } from '@/controllers/brandController';

const router = Router();

/**
 * @route   GET /api/brands
 * @desc    Get all active brands
 * @access  Public
 */
router.get('/', BrandController.getAllBrands);

/**
 * @route   GET /api/brands/featured
 * @desc    Get featured brands
 * @access  Public
 */
router.get('/featured', BrandController.getFeaturedBrands);

export default router;

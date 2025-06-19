import { Router } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';
import Car from '@/models/Car';
import User from '@/models/User';
import { logger } from '@/utils/logger';

const router = Router();

// Apply middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    logger.info('Getting admin dashboard stats...');

    // Get basic counts
    const [totalCars, totalUsers, activeCars, activeUsers] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Car.countDocuments({ isAvailable: true }),
      User.countDocuments({ isActive: true })
    ]);

    // Get recent cars and users
    const [recentCars, recentUsers] = await Promise.all([
      Car.find({ isAvailable: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('id make model year price image createdAt')
        .lean(),
      User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('id name email role createdAt')
        .lean()
    ]);

    const stats = {
      totalCars,
      totalUsers,
      activeCars,
      activeUsers,
      recentCars,
      recentUsers
    };

    logger.info('Dashboard stats retrieved successfully');

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
});

/**
 * @route   GET /api/admin/cars
 * @desc    Get all cars for admin (with pagination and filters)
 * @access  Private (Admin only)
 */
router.get('/cars', async (req: AuthRequest, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search,
      make,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter: Record<string, any> = {};
    
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (make) filter.make = { $regex: make, $options: 'i' };
    if (fuelType) filter.fuel_type = fuelType;
    if (transmission) filter.transmission = transmission;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    // Year range
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = parseInt(minYear as string);
      if (maxYear) filter.year.$lte = parseInt(maxYear as string);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Car.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        cars,
        total,
        pages: totalPages,
        currentPage: pageNum
      }
    });
  } catch (error) {
    logger.error('Error getting admin cars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cars'
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users for admin (with pagination and filters)
 * @access  Private (Admin only)
 */
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter: Record<string, any> = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
        total,
        pages: totalPages,
        currentPage: pageNum
      }
    });
  } catch (error) {
    logger.error('Error getting admin users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

export default router;
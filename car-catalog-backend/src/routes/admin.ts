import { Router } from 'express';
import { authenticateToken, requireAdmin, requireRole, AuthRequest } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';
import { UserController } from '@/controllers/userController';
import { body } from 'express-validator';
import { sanitizeInput, handleValidationErrors } from '@/middleware/validation';
import Car from '@/models/Car';
import User from '@/models/User';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Accessory from '@/models/Accessory';
import Promotion from '@/models/Promotion';
import Quote from '@/models/Quote';
import Product from '@/models/Product';
import { logger } from '@/utils/logger';

const router = Router();

// Apply middleware to all admin routes
router.use(authenticateToken);
// Algunas rutas pueden requerir solo architect, otras admin. 
// requireAdmin se mantiene para rutas críticas como gestión de usuarios.

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin or Architect)
 */
router.get('/stats', requireRole(['admin', 'architect']), async (req: AuthRequest, res) => {
  try {
    logger.info('Getting admin dashboard stats...');

    // Get basic counts
    const [totalCars, totalUsers, activeCars, activeUsers, totalQuotes, pendingQuotes] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Car.countDocuments({ isAvailable: true }),
      User.countDocuments({ isActive: true }),
      Quote.countDocuments(),
      Quote.countDocuments({ status: 'pending' })
    ]);

    // Calcular valor del inventario
    const inventoryValueAggregate = await Car.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: null, totalValue: { $sum: "$price" } } }
    ]);
    const inventoryValue = inventoryValueAggregate[0]?.totalValue || 0;

    // Gráfica 1: Autos por Marca (Top 5)
    const carsByMake = await Car.aggregate([
      { $group: { _id: "$make", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Gráfica 2: Leads por Mes (Últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Agrupación flexible por fecha
    const quotesByMonth = await Quote.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Estadísticas Financieras Reales (Basadas en Quotes/Ofertas)
    const financialStats = await Quote.aggregate([
      {
        $facet: {
          sales: [
            { $match: { status: 'accepted' } },
            {
              $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'carData'
              }
            },
            { $unwind: '$carData' },
            {
              $group: {
                _id: null,
                total: { $sum: '$carData.price' },
                count: { $sum: 1 }
              }
            }
          ],
          pending: [
            { $match: { status: 'pending' } },
            {
              $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'carData'
              }
            },
            { $unwind: '$carData' },
            {
              $group: {
                _id: null,
                total: { $sum: '$carData.price' },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const totalSales = financialStats[0]?.sales[0]?.total || 0;
    const salesCount = financialStats[0]?.sales[0]?.count || 0;
    const pendingAmount = financialStats[0]?.pending[0]?.total || 0;
    const pendingCount = financialStats[0]?.pending[0]?.count || 0;

    // Get recent cars and users
    const [recentCars, recentUsers] = await Promise.all([
      Car.find({ isAvailable: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('id make carModel year price image createdAt')
        .lean(),
      User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('id name email role createdAt')
        .lean()
    ]);

    // Get stats for Architecture if role is architect or admin
    let architectStats = {};
    if (req.user && (req.user.role === 'admin' || req.user.role === 'architect')) {
      const [totalProjects, activeProjects] = await Promise.all([
        Product.countDocuments({ type: 'architecture' }),
        Product.countDocuments({ type: 'architecture', isAvailable: true })
      ]);
      
      const inventoryValueAggregate = await Product.aggregate([
        { $match: { type: 'architecture', isAvailable: true } },
        { $group: { _id: null, totalValue: { $sum: "$price" } } }
      ]);
      
      // Gráfica de Arquitectura: Proyectos por Categoría
      const projectsByCategory = await Product.aggregate([
        { $match: { type: 'architecture' } },
        { $group: { _id: "$specs.projectCategory", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).then(res => res.map(item => ({ _id: item._id || 'General', count: item.count })));

      architectStats = {
        totalProjects,
        activeProjects,
        inventoryValue: inventoryValueAggregate[0]?.totalValue || 0,
        projectsByCategory
      };
    }

    const stats = {
      totalCars,
      totalUsers,
      activeCars,
      activeUsers,
      totalQuotes,
      pendingQuotes,
      inventoryValue,
      totalSales,
      salesCount,
      pendingAmount,
      pendingCount,
      recentCars,
      recentUsers,
      architectStats, // New specific stats
      charts: {
        carsByMake,
        quotesByMonth,
        projectsByCategory: (architectStats as any).projectsByCategory || []
      }
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
 * @route   GET /api/admin/analytics
 * @desc    Get comprehensive analytics data
 * @access  Private (Admin only)
 */
router.get('/analytics', requireAdmin, async (req: AuthRequest, res) => {
  try {
    logger.info('Getting analytics data...');

    // Overview counts
    const [
      totalCars, totalUsers, totalBrands, totalCategories,
      totalAccessories, totalPromotions, activePromotions
    ] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Brand.countDocuments(),
      Category.countDocuments(),
      Accessory.countDocuments(),
      Promotion.countDocuments(),
      Promotion.countDocuments({ status: 'active' })
    ]);

    // Cars by fuel type
    const carsByFuelType = await Car.aggregate([
      { $group: { _id: '$fuel_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Cars by make (top 10)
    const carsByMake = await Car.aggregate([
      { $group: { _id: '$make', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Price distribution
    const priceRanges = await Car.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 15000, 30000, 50000, 75000, 100000, 200000, Infinity],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const priceRangeLabels: Record<string, string> = {
      '0': '$0 - $15K',
      '15000': '$15K - $30K',
      '30000': '$30K - $50K',
      '50000': '$50K - $75K',
      '75000': '$75K - $100K',
      '100000': '$100K - $200K',
      '200000': '$200K+'
    };

    const formattedPriceRanges = priceRanges.map(r => ({
      range: priceRangeLabels[r._id.toString()] || r._id,
      count: r.count
    }));

    // Year distribution
    const carsByYear = await Car.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 10 }
    ]);

    // Accessory inventory value
    const accessoryStats = await Accessory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalStock: { $sum: '$stock' },
          lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lt: ['$stock', 10] }] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
        }
      }
    ]);

    // Promotion usage
    const promotionStats = await Promotion.aggregate([
      {
        $group: {
          _id: null,
          totalUsed: { $sum: '$usedCount' }
        }
      }
    ]);

    // Recent activity (simulated from recent data)
    const recentCars = await Car.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('make carModel createdAt')
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt')
      .lean();

    const recentActivity = [
      ...recentCars.map(c => ({
        action: 'New car added',
        item: `${c.make} ${(c as any).carModel}`,
        time: (c as any).createdAt,
        user: 'Admin'
      })),
      ...recentUsers.map(u => ({
        action: 'New user registered',
        item: u.name,
        time: (u as any).createdAt,
        user: 'System'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    const analytics = {
      overview: {
        totalCars,
        totalUsers,
        totalBrands,
        totalCategories,
        totalAccessories,
        totalPromotions,
        activePromotions,
        inventoryValue: accessoryStats[0]?.totalValue || 0,
        totalStock: accessoryStats[0]?.totalStock || 0,
        lowStockItems: accessoryStats[0]?.lowStock || 0,
        outOfStockItems: accessoryStats[0]?.outOfStock || 0,
        promotionRedemptions: promotionStats[0]?.totalUsed || 0
      },
      charts: {
        carsByFuelType: carsByFuelType.map(c => ({ name: c._id || 'Unknown', count: c.count })),
        carsByMake: carsByMake.map(c => ({ name: c._id || 'Unknown', count: c.count })),
        carsByYear: carsByYear.map(c => ({ year: c._id, count: c.count })),
        priceRanges: formattedPriceRanges
      },
      recentActivity
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data'
    });
  }
});

/**
 * @route   GET /api/admin/cars
 * @desc    Get all cars for admin (with pagination and filters)
 * @access  Private (Admin only)
 */
router.get('/cars', requireAdmin, async (req: AuthRequest, res) => {
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
router.get('/users', requireAdmin, async (req: AuthRequest, res) => {
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

/**
 * @route   POST /api/admin/users
 * @desc    Create new user (Admin only)
 * @access  Private (Admin only)
 */
router.post('/users', [
  sanitizeInput,
  body('name').notEmpty().withMessage('Name is required').trim().isLength({ min: 2, max: 50 }),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin', 'architect']),
  handleValidationErrors
], UserController.createUser);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user (Admin only)
 * @access  Private (Admin only)
 */
router.put('/users/:id', [
  sanitizeInput,
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin', 'architect']),
  handleValidationErrors
], UserController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/users/:id', UserController.deleteUser);

export default router;
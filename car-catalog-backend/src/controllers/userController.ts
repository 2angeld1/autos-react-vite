import { Request, Response } from 'express';
import User from '@/models/User';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export class UserController {
  /**
   * Get all users (Admin only)
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive 
    } = req.query;

    // Build filter
    const filter: Record<string, unknown> = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  });

  /**
   * Get user by ID (Admin only)
   */
  static getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Create new user (Admin only)
   */
  static createUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, password, role = 'user', isActive = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      isActive
    });

    await user.save();

    logger.info(`User created by admin ${req.user?.email}:`, user.email);

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  });

  /**
   * Update user (Admin only)
   */
  static updateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User updated by admin ${req.user?.email}:`, user.email);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  });

  /**
   * Delete user (Admin only)
   */
  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User deleted by admin ${req.user?.email}:`, user.email);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });

  /**
   * Get user statistics (Admin only)
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { 
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } 
          },
          inactiveUsers: { 
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } 
          },
          adminUsers: { 
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } 
          },
          regularUsers: { 
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } 
          }
        }
      }
    ]);

    // Recent registrations
    const recentUsers = await User.find({ isActive: true })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        recentUsers
      }
    });
  });

  /**
   * Activate user (Admin only)
   */
  static activateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User activated by admin ${req.user?.email}:`, user.email);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User activated successfully'
    });
  });

  /**
   * Make user admin (Super admin only)
   */
  static makeAdmin = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User promoted to admin by ${req.user?.email}:`, user.email);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User promoted to admin successfully'
    });
  });
}
import { Request, Response } from 'express';
import User from '@/models/User';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';
import { hashPassword } from '@/utils/helpers';

export class UserController {
  /**
   * Get all users (Admin only)
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 20, search, role, isActive } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};
    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && typeof role === 'string') filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

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
      pagination: { page: pageNum, limit: limitNum, total, totalPages }
    });
  });

  /**
   * Get user by ID (Admin only)
   */
  static getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  });

  /**
   * Create new user (Admin only)
   */
  static createUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, password = 'password123', role = 'user', isActive = true } = req.body;

    const existing = await User.findOne({ email: (email || '').toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email: (email || '').toLowerCase(),
      password: hashed,
      role,
      isActive
    });

    const userResponse: Record<string, any> = user.toObject();
    delete userResponse.password;

    logger.info(`User created by admin ${req.user?.email}: ${user.email}`);

    res.status(201).json({ success: true, data: userResponse, message: 'User created successfully' });
  });

  /**
   * Update user (Admin only)
   */
  static updateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    if (updateData.email) updateData.email = (updateData.email as string).toLowerCase();
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    logger.info(`User updated by admin ${req.user?.email}: ${user.email}`);

    res.status(200).json({ success: true, data: user, message: 'User updated successfully' });
  });

  /**
   * Delete user (Admin only) - soft deactivate
   */
  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select('-password')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    logger.info(`User deactivated by admin ${req.user?.email}: ${user.email}`);

    res.status(200).json({ success: true, message: 'User deactivated successfully' });
  });

  /**
   * Get user statistics (Admin only)
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const [total, active, inactive, admins, users] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' })
    ]);

    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id name email createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: { total, active, inactive, admins, users },
        recentUsers
      }
    });
  });

  /**
   * Activate user (Admin only)
   */
  static activateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true })
      .select('_id name email isActive')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    logger.info(`User activated by admin ${req.user?.email}: ${user.email}`);

    res.status(200).json({ success: true, data: user, message: 'User activated successfully' });
  });

  /**
   * Make user admin (Super admin only)
   */
  static makeAdmin = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true })
      .select('_id name email role')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    logger.info(`User promoted to admin by ${req.user?.email}: ${user.email}`);

    res.status(200).json({ success: true, data: user, message: 'User promoted to admin successfully' });
  });
}
import { Request, Response } from 'express';
import prisma from '@/config/prisma';
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

    const where: any = {};
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role && typeof role === 'string') where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where })
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

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

    const existing = await prisma.user.findUnique({ where: { email: (email || '').toLowerCase() } });
    if (existing) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: (email || '').toLowerCase(),
        password: hashed,
        role,
        isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true
      }
    });

    logger.info(`User created by admin ${req.user?.email}: ${user.email}`);

    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
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

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        updatedAt: true
      }
    }).catch(() => null);

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

    const user = await prisma.user.update({ where: { id }, data: { isActive: false } }).catch(() => null);

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
    const total = await prisma.user.count();
    const active = await prisma.user.count({ where: { isActive: true } });
    const inactive = await prisma.user.count({ where: { isActive: false } });
    const admins = await prisma.user.count({ where: { role: 'admin' } });
    const users = await prisma.user.count({ where: { role: 'user' } });

    const recentUsers = await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true }
    });

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

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: { id: true, name: true, email: true, isActive: true }
    }).catch(() => null);

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

    const user = await prisma.user.update({
      where: { id },
      data: { role: 'admin' },
      select: { id: true, name: true, email: true, role: true }
    }).catch(() => null);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    logger.info(`User promoted to admin by ${req.user?.email}: ${user.email}`);

    res.status(200).json({ success: true, data: user, message: 'User promoted to admin successfully' });
  });
}
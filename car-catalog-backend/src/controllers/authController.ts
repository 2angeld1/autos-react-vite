import { Request, Response } from 'express';
import User from '@/models/User';
import { generateToken, sanitizeUser } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export class AuthController {
  /**
   * Register new user
   */
  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

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
      role: 'user'
    });

    await user.save();

    // Generate token - CORREGIDO
    const token = generateToken({ 
      id: (user._id as string).toString(), // Cast explícito
      email: user.email, 
      role: user.role 
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user.toObject() as unknown as Record<string, unknown>), // Doble cast
      message: 'User registered successfully'
    });
  });

  /**
   * Login user
   */
  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token - CORREGIDO
    const token = generateToken({ 
      id: (user._id as string).toString(), // Cast explícito
      email: user.email, 
      role: user.role 
    });

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user.toObject() as unknown as Record<string, unknown>), // Doble cast
      message: 'Login successful'
    });
  });

  /**
   * Get current user profile
   */
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await User.findById(req.user!.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sanitizeUser(user.toObject() as unknown as Record<string, unknown>) // Doble cast
    });
  });

  /**
   * Update user profile
   */
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email } = req.body;
    const updateData: Record<string, string> = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.user!.id }
      });
      
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
        return;
      }
      
      updateData.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      data: sanitizeUser(user.toObject() as unknown as Record<string, unknown>), // Doble cast
      message: 'Profile updated successfully'
    });
  });

  /**
   * Change password
   */
  static changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user!.id).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  /**
   * Delete account
   */
  static deleteAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User account deactivated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  });

  /**
   * Refresh token
   */
  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await User.findById(req.user!.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
      return;
    }

    // Generate new token - CORREGIDO
    const token = generateToken({ 
      id: (user._id as string).toString(), // Cast explícito
      email: user.email, 
      role: user.role 
    });

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user.toObject() as unknown as Record<string, unknown>) // Doble cast
    });
  });
}
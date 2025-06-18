import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/User';
import { logger } from '@/utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Check if user still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
      return;
    }

    // Add user info to request - CORREGIDO
    req.user = {
      id: (user._id as string).toString(), // Cast explícito
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
    return;
  }

  next();
};

/**
 * Middleware for optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const user = await User.findById(decoded.id).select('-password');
    if (user && user.isActive) {
      req.user = {
        id: (user._id as string).toString(), // Cast explícito
        email: user.email,
        role: user.role,
        name: user.name
      };
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error:', error);
    next();
  }
};

/**
 * Middleware to check if user owns resource or is admin
 */
export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  };
};
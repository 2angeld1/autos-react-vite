import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { logger } from '@/utils/logger';

interface CustomValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Middleware to handle validation results
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error: ValidationError) => ({
        field: 'path' in error ? error.path : 'general',
        message: error.msg,
        value: 'value' in error ? error.value : undefined
      }) as CustomValidationError)
    });
    return;
  }

  next();
};

/**
 * Middleware to validate ObjectId parameters
 */
export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: `${paramName} parameter is required`
      });
      return;
    }

    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to sanitize input data - CORREGIDO
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Recursively sanitize strings in the request body
  const sanitizeObject = (obj: unknown): unknown => {
    if (typeof obj === 'string') {
      return obj.trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const key in obj as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Para query params, crear una nueva estructura sin modificar req.query directamente
  if (req.query && Object.keys(req.query).length > 0) {
    const sanitizedQuery: Record<string, unknown> = {};
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];
        if (typeof value === 'string') {
          sanitizedQuery[key] = value.trim();
        } else if (Array.isArray(value)) {
          sanitizedQuery[key] = value.map(v => typeof v === 'string' ? v.trim() : v);
        } else {
          sanitizedQuery[key] = value;
        }
      }
    }
    // Reemplazar req.query con el objeto sanitizado
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  next();
};

/**
 * Middleware to validate request content type
 */
export const validateContentType = (expectedTypes: string[] = ['application/json']) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.get('Content-Type');
    
    if (!contentType) {
      res.status(400).json({
        success: false,
        message: 'Content-Type header is required'
      });
      return;
    }

    const isValidType = expectedTypes.some(type => 
      contentType.includes(type)
    );

    if (!isValidType) {
      res.status(415).json({
        success: false,
        message: `Unsupported Content-Type. Expected: ${expectedTypes.join(', ')}`
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to validate pagination parameters
 */
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { page, limit } = req.query;

  if (page) {
    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Page must be a positive integer'
      });
      return;
    }
  }

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
      return;
    }
  }

  next();
};
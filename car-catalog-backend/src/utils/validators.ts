import { body, query, param } from 'express-validator';

// Car validation rules
export const carValidationRules = {
  create: [
    body('make').trim().notEmpty().withMessage('Make is required').isLength({ max: 50 }),
    body('model').trim().notEmpty().withMessage('Model is required').isLength({ max: 50 }),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 2 }).withMessage('Valid year is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
    body('fuel_type').isIn(['gas', 'diesel', 'electricity', 'hybrid']).withMessage('Invalid fuel type'),
    body('transmission').isIn(['a', 'm']).withMessage('Invalid transmission type'),
    body('cylinders').isInt({ min: 1, max: 16 }).withMessage('Cylinders must be between 1 and 16'),
    body('class').trim().notEmpty().withMessage('Class is required'),
    body('displacement').isFloat({ min: 0.5, max: 10.0 }).withMessage('Displacement must be between 0.5 and 10.0'),
    body('city_mpg').isInt({ min: 1, max: 200 }).withMessage('City MPG must be between 1 and 200'),
    body('highway_mpg').isInt({ min: 1, max: 200 }).withMessage('Highway MPG must be between 1 and 200'),
    body('combination_mpg').isInt({ min: 1, max: 200 }).withMessage('Combination MPG must be between 1 and 200'),
    body('features').optional().isArray().withMessage('Features must be an array')
  ],
  
  update: [
    body('make').optional().trim().isLength({ max: 50 }),
    body('model').optional().trim().isLength({ max: 50 }),
    body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 2 }),
    body('price').optional().isFloat({ min: 0 }),
    body('image').optional().trim().notEmpty(),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('fuel_type').optional().isIn(['gas', 'diesel', 'electricity', 'hybrid']),
    body('transmission').optional().isIn(['a', 'm']),
    body('cylinders').optional().isInt({ min: 1, max: 16 }),
    body('class').optional().trim().notEmpty(),
    body('displacement').optional().isFloat({ min: 0.5, max: 10.0 }),
    body('city_mpg').optional().isInt({ min: 1, max: 200 }),
    body('highway_mpg').optional().isInt({ min: 1, max: 200 }),
    body('combination_mpg').optional().isInt({ min: 1, max: 200 }),
    body('features').optional().isArray()
  ]
};

// User validation rules
export const userValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  
  updateProfile: [
    body('name').optional().trim().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail()
  ]
};

// Query validation rules
export const queryValidationRules = {
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  
  carFilters: [
    query('make').optional().trim().isLength({ max: 50 }),
    query('model').optional().trim().isLength({ max: 50 }),
    query('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 2 }),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('fuel_type').optional().isIn(['gas', 'diesel', 'electricity', 'hybrid']),
    query('transmission').optional().isIn(['a', 'm']),
    query('class').optional().trim(),
    query('search').optional().trim().isLength({ max: 100 }),
    query('sort').optional().isIn(['price', '-price', 'year', '-year', 'make', '-make', 'createdAt', '-createdAt'])
  ]
};

// Parameter validation rules
export const paramValidationRules = {
  id: [
    param('id').notEmpty().withMessage('ID is required')
  ]
};
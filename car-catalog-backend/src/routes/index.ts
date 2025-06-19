import { Router } from 'express';
import authRoutes from './auth';
import carRoutes from './cars';
import userRoutes from './users';
import favoriteRoutes from './favorites';
import adminRoutes from './admin';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/users', userRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
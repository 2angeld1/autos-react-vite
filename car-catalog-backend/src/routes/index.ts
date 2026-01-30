import { Router } from 'express';
import authRoutes from './auth';
import carRoutes from './cars';
import userRoutes from './users';
import favoriteRoutes from './favorites';
import adminRoutes from './admin';
import fileRoutes from './files';
import inventoryRoutes from './inventory';
import promotionRoutes from './promotions';
import notificationRoutes from './notifications';
import quoteRoutes from './quoteRoutes';
import productRoutes from './products';
import irontrailRoutes from './irontrail';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/users', userRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/admin', adminRoutes);
router.use('/files', fileRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/promotions', promotionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/quotes', quoteRoutes);
router.use('/products', productRoutes);
router.use('/irontrail', irontrailRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
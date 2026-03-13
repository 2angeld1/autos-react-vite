import { Router, Request, Response } from 'express';
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
import jewelryRoutes from './jewelry';
import furnitureRoutes from './furniture';
import reviewRoutes from './reviews';
import architectureRoutes from './architecture';

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
router.use('/jewelry', jewelryRoutes);
router.use('/furniture', furnitureRoutes);
router.use('/reviews', reviewRoutes);
router.use('/architecture', architectureRoutes);

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
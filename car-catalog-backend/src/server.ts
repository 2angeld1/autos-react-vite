import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectWithRetry } from './config/database';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';
import userRoutes from './routes/users';
import favoriteRoutes from './routes/favorites';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root endpoint - AGREGADO
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Car Catalog API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      cars: '/api/cars',
      auth: '/api/auth',
      users: '/api/users',
      favorites: '/api/favorites'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectWithRetry();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export default app;
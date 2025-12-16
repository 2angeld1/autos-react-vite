import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectWithRetry } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files - use process.cwd() so paths match multer and route utilities
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/uploads/files', express.static(path.join(UPLOADS_DIR, 'files')));

// Health check for root
app.get('/', (req, res) => {
  res.json({ 
    message: 'Car Catalog API is running', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectWithRetry();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
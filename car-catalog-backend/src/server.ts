import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectWithRetry } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import apiRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permite cargar imágenes desde otros dominios si es necesario
}));

// Rate Limiting: Máximo 300 peticiones por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones desde esta IP, por favor intente nuevamente en 15 minutos.'
});
app.use(limiter);

// Configure CORS to allow local dev and the deployed frontend(s).
const FRONTEND_URL = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3000',
  FRONTEND_URL,
  'https://autos-react-dashboard.vercel.app',
  'https://autos-react-front.vercel.app',
  'https://velodrive.vercel.app',
  'https://velodrive-dashboard.vercel.app',
  'https://velodrive-mobile.vercel.app'
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200
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
    message: 'VeloDrive API is running',
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
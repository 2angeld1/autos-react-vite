import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

export interface DatabaseConfig {
  url: string;
  options: mongoose.ConnectOptions;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog',
    options: {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT || '5000'),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000'),
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    }
  };
};

/**
 * Connect to MongoDB with retry logic
 */
export const connectWithRetry = async (maxRetries: number = 5): Promise<void> => {
  const config = getDatabaseConfig();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(config.url, config.options);
      logger.info(`✅ Connected to MongoDB (attempt ${attempt}/${maxRetries})`);
      
      // Set up connection event listeners
      setupConnectionEvents();
      return;
      
    } catch (error) {
      logger.error(`❌ MongoDB connection attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      logger.info(`⏳ Retrying connection in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Set up MongoDB connection event handlers
 */
const setupConnectionEvents = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('🔗 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('❌ Mongoose connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('📡 Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('🔄 Mongoose reconnected to MongoDB');
  });

  // Handle application termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

/**
 * Create database indexes
 */
export const createIndexes = async (): Promise<void> => {
  try {
    const Car = (await import('@/models/Car')).default;
    const User = (await import('@/models/User')).default;
    const Favorite = (await import('@/models/Favorite')).default;

    logger.info('📋 Creating database indexes...');

    // Car indexes
    await Car.createIndexes();
    
    // User indexes
    await User.createIndexes();
    
    // Favorite indexes
    await Favorite.createIndexes();

    logger.info('✅ Database indexes created successfully');
  } catch (error) {
    logger.error('❌ Failed to create database indexes:', error);
    throw error;
  }
};

/**
 * Check database health
 */
export const checkDatabaseHealth = async (): Promise<{
  isConnected: boolean;
  status: string;
  collections: number;
  dbStats?: Record<string, unknown>;
}> => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      return {
        isConnected: false,
        status: 'disconnected',
        collections: 0
      };
    }

    if (!mongoose.connection.db) {
      return {
        isConnected: false,
        status: 'no database connection',
        collections: 0
      };
    }

    const admin = mongoose.connection.db.admin();
    const dbStats = await admin.serverStatus();
    const collections = await mongoose.connection.db.listCollections().toArray();

    return {
      isConnected: true,
      status: 'connected',
      collections: collections.length,
      dbStats: {
        version: dbStats.version,
        uptime: dbStats.uptime,
        connections: dbStats.connections
      }
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      isConnected: false,
      status: 'error',
      collections: 0
    };
  }
};
import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

export interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog';
  
  const options: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  return { uri, options };
};

/**
 * Connect to MongoDB with retry logic
 */
export const connectWithRetry = async (retries = 5): Promise<void> => {
  const { uri, options } = getDatabaseConfig();
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, options);
      logger.info('✅ Connected to MongoDB');
      return;
    } catch (error) {
      logger.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
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

    await Car.createIndexes();
    await User.createIndexes();
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

    const db = mongoose.connection.db;
    if (!db) {
      return {
        isConnected: false,
        status: 'no database connection',
        collections: 0
      };
    }

    const admin = db.admin();
    const [dbStats, collections] = await Promise.all([
      admin.serverStatus(),
      db.listCollections().toArray()
    ]);

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
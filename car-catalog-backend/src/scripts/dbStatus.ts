import { connectWithRetry, checkDatabaseHealth } from '@/config/database';
import { logger } from '@/utils/logger';
import Car from '@/models/Car';
import User from '@/models/User';

interface MakeStats {
  _id: string;
  count: number;
}

/**
 * Database status and statistics script
 */
async function checkStatus(): Promise<void> {
  try {
    logger.info('📊 Checking database status...');

    await connectWithRetry();
    
    const health = await checkDatabaseHealth();
    
    // Get collection counts
    const [carCount, userCount] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments()
    ]);

    const activeCarCount = await Car.countDocuments({ isAvailable: true });
    const activeUserCount = await User.countDocuments({ isActive: true });

    logger.info('='.repeat(50));
    logger.info('📈 DATABASE STATUS');
    logger.info('='.repeat(50));
    logger.info(`Connection: ${health.isConnected ? '✅ Connected' : '❌ Disconnected'}`);
    logger.info(`Status: ${health.status}`);
    logger.info(`Collections: ${health.collections}`);
    
    if (health.dbStats) {
      if (typeof health.dbStats.dataSize === 'number' && typeof health.dbStats.storageSize === 'number' && typeof health.dbStats.indexSize === 'number') {
        logger.info(`Data Size: ${(health.dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        logger.info(`Storage Size: ${(health.dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        logger.info(`Index Size: ${(health.dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`);
      }
      if (typeof health.dbStats.objects === 'number') {
        logger.info(`Objects: ${health.dbStats.objects}`);
      }
    }

    logger.info('='.repeat(50));
    logger.info('📊 COLLECTION STATISTICS');
    logger.info('='.repeat(50));
    logger.info(`Cars: ${carCount} total, ${activeCarCount} available`);
    logger.info(`Users: ${userCount} total, ${activeUserCount} active`);

    // Get top makes
    const topMakes = await Car.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$make', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]) as MakeStats[];

    logger.info('='.repeat(50));
    logger.info('🚗 TOP CAR MAKES');
    logger.info('='.repeat(50));
    topMakes.forEach((make, index) => {
      logger.info(`${index + 1}. ${make._id}: ${make.count} cars`);
    });

    process.exit(0);
  } catch (error) {
    logger.error('❌ Database status check failed:', error);
    process.exit(1);
  }
}

checkStatus();
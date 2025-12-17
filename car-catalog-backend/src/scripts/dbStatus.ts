import { connectWithRetry, checkDatabaseHealth } from '@/config/database';
import { logger } from '@/utils/logger';
import prisma from '@/config/prisma';

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
    
    // Get collection counts (Prisma)
    const [carCount, userCount] = await Promise.all([
      prisma.car.count(),
      prisma.user.count()
    ]);

    const activeCarCount = await prisma.car.count({ where: { isAvailable: true } });
    const activeUserCount = await prisma.user.count({ where: { isActive: true } });

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

    // Get top makes (Prisma groupBy)
    const topMakes = await prisma.car.groupBy(({
      by: ['make'],
      where: { isAvailable: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    } as unknown) as any) as { make: string; _count?: { id?: number } }[];

    logger.info('='.repeat(50));
    logger.info('🚗 TOP CAR MAKES');
    logger.info('='.repeat(50));
    topMakes.forEach((m, index) => {
      logger.info(`${index + 1}. ${m.make}: ${m._count?.id ?? 0} cars`);
    });

    process.exit(0);
  } catch (error) {
    logger.error('❌ Database status check failed:', error);
    process.exit(1);
  }
}

checkStatus();
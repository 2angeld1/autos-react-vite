import { connectWithRetry, createIndexes } from '@/config/database';
import { logger } from '@/utils/logger';

/**
 * Database migration script
 */
async function migrate(): Promise<void> {
  try {
    logger.info('🔄 Starting database migration...');

    await connectWithRetry();
    await createIndexes();

    // Add any additional migration logic here
    logger.info('✅ Database migration completed successfully');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

migrate();
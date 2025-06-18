import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

interface CacheItem {
  data: unknown;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private static cache = new Map<string, CacheItem>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set cache item
   */
  static set(key: string, data: unknown, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    logger.debug(`Cache set: ${key}`);
  }

  /**
   * Get cache item
   */
  static get(key: string): unknown | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      logger.debug(`Cache expired and removed: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return item.data;
  }

  /**
   * Delete cache item
   */
  static delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Clean expired items
   */
  static cleanup(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info(`Cache cleanup: ${cleaned} expired items removed`);
    }

    return cleaned;
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    totalItems: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  } {
    const items = Array.from(this.cache.values());
    const now = Date.now();

    let totalSize = 0;
    let oldestItem: number | null = null;
    let newestItem: number | null = null;

    for (const item of items) {
      totalSize += JSON.stringify(item.data).length;
      
      if (oldestItem === null || item.timestamp < oldestItem) {
        oldestItem = item.timestamp;
      }
      
      if (newestItem === null || item.timestamp > newestItem) {
        newestItem = item.timestamp;
      }
    }

    return {
      totalItems: this.cache.size,
      totalSize,
      oldestItem: oldestItem ? now - oldestItem : null,
      newestItem: newestItem ? now - newestItem : null
    };
  }

  /**
   * Cache middleware for Express
   */
  static middleware(ttl: number = this.defaultTTL) {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = `${req.method}:${req.originalUrl}`;
      const cached = this.get(key);

      if (cached) {
        logger.debug(`Serving from cache: ${key}`);
        return res.json(cached);
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (data: unknown) => {
        this.set(key, data, ttl);
        return originalJson(data);
      };

      next();
    };
  }

  /**
   * Start cleanup interval
   */
  static startCleanupInterval(intervalMs: number = 10 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

// Auto-start cleanup interval
if (process.env.NODE_ENV !== 'test') {
  CacheService.startCleanupInterval();
}
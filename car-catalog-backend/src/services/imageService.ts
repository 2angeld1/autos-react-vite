import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { logger } from '@/utils/logger';

export class ImageService {
  private static uploadDir = path.join(process.cwd(), 'uploads');

  /**
   * Download image from URL and save locally
   */
  static async downloadImage(imageUrl: string, filename: string): Promise<string> {
    try {
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream',
        timeout: 30000
      });

      const localPath = path.join(this.uploadDir, 'cars', filename);
      
      // Ensure directory exists
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writer = fs.createWriteStream(localPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          logger.info(`Image downloaded: ${filename}`);
          resolve(`/uploads/cars/${filename}`);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      logger.error(`Failed to download image ${imageUrl}:`, error);
      throw error;
    }
  }

  /**
   * Delete local image file
   */
  static deleteImage(imagePath: string): boolean {
    try {
      const fullPath = path.join(process.cwd(), imagePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        logger.info(`Image deleted: ${imagePath}`);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error(`Failed to delete image ${imagePath}:`, error);
      return false;
    }
  }

  /**
   * Validate image file
   */
  static validateImage(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File too large. Maximum size is 5MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Get image info
   */
  static getImageInfo(imagePath: string): {
    exists: boolean;
    size?: number;
    modifiedDate?: Date;
  } {
    try {
      const fullPath = path.join(process.cwd(), imagePath);
      
      if (!fs.existsSync(fullPath)) {
        return { exists: false };
      }

      const stats = fs.statSync(fullPath);
      
      return {
        exists: true,
        size: stats.size,
        modifiedDate: stats.mtime
      };
    } catch (error) {
      logger.error(`Failed to get image info for ${imagePath}:`, error);
      return { exists: false };
    }
  }

  /**
   * Clean up unused images
   */
  static async cleanupUnusedImages(): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    try {
      const Car = (await import('@/models/Car')).default;
      
      // Get all image files
      const carsDir = path.join(this.uploadDir, 'cars');
      if (!fs.existsSync(carsDir)) {
        return { deleted: 0, errors: [] };
      }

      const imageFiles = fs.readdirSync(carsDir);
      
      // Get all image URLs from database
      const cars = await Car.find({}, 'image').lean();
      const usedImages = new Set(cars.map(car => path.basename(car.image)));

      // Delete unused images
      for (const file of imageFiles) {
        if (!usedImages.has(file)) {
          try {
            const filePath = path.join(carsDir, file);
            fs.unlinkSync(filePath);
            deleted++;
            logger.info(`Deleted unused image: ${file}`);
          } catch (error) {
            errors.push(`Failed to delete ${file}: ${(error as Error).message}`);
          }
        }
      }

      logger.info(`Cleanup completed: ${deleted} images deleted`);
      return { deleted, errors };
    } catch (error) {
      logger.error('Image cleanup failed:', error);
      return { deleted, errors: [(error as Error).message] };
    }
  }

  /**
   * Optimize image (placeholder for future implementation)
   */
  static async optimizeImage(imagePath: string): Promise<string> {
    // Placeholder for image optimization
    // In production, you might use libraries like sharp or imagemin
    logger.info(`Image optimization placeholder for: ${imagePath}`);
    return imagePath;
  }

  /**
   * Generate placeholder image URL
   */
  static generatePlaceholder(width: number = 400, height: number = 300): string {
    return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=Car+Image`;
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    totalImages: number;
    totalSize: number;
    avgSize: number;
  } {
    try {
      const carsDir = path.join(this.uploadDir, 'cars');
      
      if (!fs.existsSync(carsDir)) {
        return { totalImages: 0, totalSize: 0, avgSize: 0 };
      }

      const files = fs.readdirSync(carsDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(carsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }

      return {
        totalImages: files.length,
        totalSize,
        avgSize: files.length > 0 ? Math.round(totalSize / files.length) : 0
      };
    } catch (error) {
      logger.error('Failed to get storage stats:', error);
      return { totalImages: 0, totalSize: 0, avgSize: 0 };
    }
  }
}
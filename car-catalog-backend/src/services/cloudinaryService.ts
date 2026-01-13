import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { logger } from '@/utils/logger';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload a file to Cloudinary
   * @param filePath Local path to the file
   * @param folder Target folder in Cloudinary
   */
  static async uploadImage(filePath: string, folder: string = 'autos'): Promise<any> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
      });
      logger.info(`File uploaded to Cloudinary: ${result.secure_url}`);
      return result;
    } catch (error) {
      logger.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId Public ID of the file
   */
  static async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`File deleted from Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      logger.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }
}

export default cloudinary;

import { Request, Response } from 'express';
import Brand from '@/models/Brand';
import { logger } from '@/utils/logger';

export class BrandController {
  /**
   * Get all brands (public)
   */
  static async getAllBrands(req: Request, res: Response): Promise<void> {
    try {
      const brands = await Brand.find({ status: 'active' }).sort({ name: 1 });
      
      res.status(200).json({
        success: true,
        count: brands.length,
        data: brands
      });
    } catch (error) {
      logger.error('Error getting brands:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve brands'
      });
    }
  }

  /**
   * Get featured brands
   */
  static async getFeaturedBrands(req: Request, res: Response): Promise<void> {
    try {
      const brands = await Brand.find({ 
        status: 'active',
        featured: true 
      }).sort({ name: 1 });
      
      res.status(200).json({
        success: true,
        count: brands.length,
        data: brands
      });
    } catch (error) {
      logger.error('Error getting featured brands:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured brands'
      });
    }
  }
}

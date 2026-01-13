import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import Promotion from '@/models/Promotion';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { CloudinaryService } from '@/services/cloudinaryService';
import fs from 'fs';

export class PromotionController {
  // Get all promotions
  static getAllPromotions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, search } = req.query;
    
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    
    res.json({ success: true, data: promotions });
  });

  // Get single promotion by ID
  static getPromotionById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);
    
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    
    res.json({ success: true, data: promotion });
  });

  // Validate promotion code (public endpoint for checkout)
  static validateCode = asyncHandler(async (req: Request, res: Response) => {
    const { code, purchaseAmount } = req.body;
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid or expired promotion code' 
      });
    }
    
    const now = new Date();
    
    // Check dates
    if (now < promotion.startDate || now > promotion.endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'This promotion is not currently active' 
      });
    }
    
    // Check usage limit
    if (promotion.usageLimit > 0 && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: 'This promotion has reached its usage limit' 
      });
    }
    
    // Check minimum purchase
    if (promotion.minPurchase && purchaseAmount < promotion.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${promotion.minPurchase} required` 
      });
    }
    
    // Calculate discount
    let discount = 0;
    if (promotion.type === 'percentage') {
      discount = (purchaseAmount * promotion.value) / 100;
      if (promotion.maxDiscount && discount > promotion.maxDiscount) {
        discount = promotion.maxDiscount;
      }
    } else {
      discount = promotion.value;
    }
    
    res.json({
      success: true,
      data: {
        code: promotion.code,
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
        discount: Math.round(discount * 100) / 100,
        finalAmount: Math.round((purchaseAmount - discount) * 100) / 100
      }
    });
  });

  // Create promotion (Admin only)
  static createPromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const promotionData = req.body;
    
    // Handle image upload
    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/promotions');
      promotionData.image = result.secure_url;
      promotionData.cloudinaryId = result.public_id;
      promotionData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
    
    promotionData.createdBy = req.user?.id;
    
    const promotion = new Promotion(promotionData);
    await promotion.save();
    
    logger.info(`Promotion created: ${promotion.code}`);
    res.status(201).json({ success: true, data: promotion });
  });

  // Update promotion (Admin only)
  static updatePromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Handle image upload
    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/promotions');
      updateData.image = result.secure_url;
      updateData.cloudinaryId = result.public_id;
      updateData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
    
    const promotion = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    
    logger.info(`Promotion updated: ${promotion.code}`);
    res.json({ success: true, data: promotion });
  });

  // Delete promotion (Admin only)
  static deletePromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);
    
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    
    // Delete image from Cloudinary
    if (promotion.cloudinaryId) {
      await CloudinaryService.deleteImage(promotion.cloudinaryId);
    }
    
    await Promotion.findByIdAndDelete(id);
    
    logger.info(`Promotion deleted: ${promotion.code}`);
    res.json({ success: true, message: 'Promotion deleted successfully' });
  });

  // Toggle promotion status (pause/activate)
  static toggleStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);
    
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    
    promotion.status = promotion.status === 'paused' ? 'active' : 'paused';
    await promotion.save();
    
    res.json({ success: true, data: promotion });
  });

  // Increment usage count (called after successful purchase)
  static usePromotion = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;
    
    const promotion = await Promotion.findOneAndUpdate(
      { code: code.toUpperCase(), status: 'active' },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    
    res.json({ success: true, data: promotion });
  });

  // Get promotion statistics
  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const total = await Promotion.countDocuments();
    const active = await Promotion.countDocuments({ status: 'active' });
    const scheduled = await Promotion.countDocuments({ status: 'scheduled' });
    const expired = await Promotion.countDocuments({ status: 'expired' });
    
    const topUsed = await Promotion.find()
      .sort({ usedCount: -1 })
      .limit(5)
      .select('name code usedCount');
    
    res.json({
      success: true,
      data: {
        total,
        active,
        scheduled,
        expired,
        topUsed
      }
    });
  });
}

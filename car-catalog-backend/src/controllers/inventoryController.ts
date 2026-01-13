import { Request, Response } from 'express';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Accessory from '@/models/Accessory';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { CloudinaryService } from '@/services/cloudinaryService';
import fs from 'fs';

export class InventoryController {
  // --- BRANDS ---
  static getAllBrands = asyncHandler(async (req: Request, res: Response) => {
    const brands = await Brand.find().sort({ name: 1 });
    res.json({ success: true, data: brands });
  });

  static createBrand = asyncHandler(async (req: Request, res: Response) => {
    const brandData = req.body;
    
    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/brands');
      brandData.logo = result.secure_url;
      brandData.cloudinaryId = result.public_id;
      brandData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const brand = new Brand(brandData);
    await brand.save();
    res.status(201).json({ success: true, data: brand });
  });

  static updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/brands');
      updateData.logo = result.secure_url;
      updateData.cloudinaryId = result.public_id;
      updateData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const brand = await Brand.findByIdAndUpdate(id, updateData, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, data: brand });
  });

  static deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    if (brand.cloudinaryId) {
      await CloudinaryService.deleteImage(brand.cloudinaryId);
    }

    await Brand.findByIdAndDelete(id);
    res.json({ success: true, message: 'Brand deleted' });
  });

  // --- CATEGORIES ---
  static getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find().populate('parentCategory').sort({ name: 1 });
    res.json({ success: true, data: categories });
  });

  static createCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryData = req.body;

    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/categories');
      categoryData.image = result.secure_url;
      categoryData.cloudinaryId = result.public_id;
      categoryData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const category = new Category(categoryData);
    await category.save();
    res.status(201).json({ success: true, data: category });
  });

  static updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/categories');
      updateData.image = result.secure_url;
      updateData.cloudinaryId = result.public_id;
      updateData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  });

  static deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (category.cloudinaryId) {
      await CloudinaryService.deleteImage(category.cloudinaryId);
    }

    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted' });
  });

  // --- ACCESSORIES ---
  static getAllAccessories = asyncHandler(async (req: Request, res: Response) => {
    const accessories = await Accessory.find().sort({ name: 1 });
    res.json({ success: true, data: accessories });
  });

  static createAccessory = asyncHandler(async (req: Request, res: Response) => {
    const accessoryData = req.body;

    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/accessories');
      accessoryData.image = result.secure_url;
      accessoryData.cloudinaryId = result.public_id;
      accessoryData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const accessory = new Accessory(accessoryData);
    await accessory.save();
    res.status(201).json({ success: true, data: accessory });
  });

  static updateAccessory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const result = await CloudinaryService.uploadImage(req.file.path, 'autos/accessories');
      updateData.image = result.secure_url;
      updateData.cloudinaryId = result.public_id;
      updateData.cloudinaryUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const accessory = await Accessory.findByIdAndUpdate(id, updateData, { new: true });
    if (!accessory) return res.status(404).json({ success: false, message: 'Accessory not found' });
    res.json({ success: true, data: accessory });
  });

  static deleteAccessory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const accessory = await Accessory.findById(id);
    if (!accessory) return res.status(404).json({ success: false, message: 'Accessory not found' });

    if (accessory.cloudinaryId) {
      await CloudinaryService.deleteImage(accessory.cloudinaryId);
    }

    await Accessory.findByIdAndDelete(id);
    res.json({ success: true, message: 'Accessory deleted' });
  });
}

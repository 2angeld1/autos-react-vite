import { Request, Response } from 'express';
import Car from '@/models/Car';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { CloudinaryService } from '@/services/cloudinaryService';
import fs from 'fs';
import path from 'path';
import { NotificationController } from './notificationController';

export class CarController {
  /**
   * Get all cars with filtering and pagination
   */
  static getAllCars = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      page = 1,
      limit = 12,
      make,
      model,
      year,
      minPrice,
      maxPrice,
      fuel_type,
      transmission,
      class: carClass,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filters: Record<string, unknown> = { isAvailable: true };

    if (make) filters.make = new RegExp(make as string, 'i');
    if (model) filters.carModel = new RegExp(model as string, 'i'); // Cambiado a carModel
    if (year) filters.year = parseInt(year as string);
    if (fuel_type) filters.fuel_type = fuel_type;
    if (transmission) filters.transmission = transmission;
    if (carClass) filters.class = new RegExp(carClass as string, 'i');

    // Price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) (filters.price as Record<string, unknown>).$gte = parseInt(minPrice as string);
      if (maxPrice) (filters.price as Record<string, unknown>).$lte = parseInt(maxPrice as string);
    }

    // Text search
    if (search) {
      filters.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = limit ? Math.max(1, Math.min(9999, parseInt(limit as string))) : undefined;
    const skip = limitNum ? (pageNum - 1) * limitNum : 0;

    // Execute query
    const [cars, total] = await Promise.all([
      Car.find(filters)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum || 0), // 0 means no limit
      Car.countDocuments(filters)
    ]);

    const totalPages = limitNum ? Math.ceil(total / limitNum) : 1;

    res.status(200).json({
      success: true,
      data: cars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      },
      filters: req.query
    });
  });

  /**
   * Get car by ID
   */
  static getCarById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const trimmedId = id.trim();

    logger.info(`Getting car by id: ${trimmedId}`);

    // Obtener auto por ID
    const car = await Car.findOne({ id: trimmedId });

    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Car not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: car
    });
  });

  /**
   * Get featured cars
   */
  static getFeaturedCars = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = 8 } = req.query;

    const featuredCars = await Car.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: featuredCars
    });
  });

  /**
   * Get similar cars
   */
  static getSimilarCars = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const trimmedId = id.trim();
    const { limit = 4 } = req.query;

    logger.info(`Getting similar cars for id: ${trimmedId}`);

    // Obtener auto similar
    const currentCar = await Car.findOne({ id: trimmedId }).lean();

    if (!currentCar) {
      res.status(404).json({
        success: false,
        message: 'Car not found'
      });
      return;
    }

    const similarCars = await Car.find({
      $and: [
        { _id: { $ne: currentCar._id } },
        { isAvailable: true },
        {
          $or: [
            { make: currentCar.make },
            { class: currentCar.class },
            {
              price: {
                $gte: currentCar.price * 0.8,
                $lte: currentCar.price * 1.2
              }
            }
          ]
        }
      ]
    })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: similarCars
    });
  });

  /**
   * Create new car (Admin only)
   */
  static createCar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const carData = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    logger.info(`req.files: ${files ? JSON.stringify(Object.keys(files)) : 'no files'}`);

    // Process main image (from upload.fields)
    const mainImageFile = files?.image?.[0];
    if (mainImageFile) {
      const cloudinaryResult = await CloudinaryService.uploadImage(mainImageFile.path, 'autos');
      carData.image = cloudinaryResult.secure_url;
      carData.cloudinaryId = cloudinaryResult.public_id;
      carData.cloudinaryUrl = cloudinaryResult.secure_url;
      if (fs.existsSync(mainImageFile.path)) {
        fs.unlinkSync(mainImageFile.path);
      }
      logger.info(`Main image uploaded to Cloudinary: ${carData.image}`);
    } else if (carData.imageUrl) {
      carData.image = carData.imageUrl;
      delete carData.imageUrl;
      logger.info(`Main image from file manager: ${carData.image}`);
    } else if (typeof carData.image === 'object' || !carData.image) {
      delete carData.image;
      logger.info('No main image provided');
    }

    // Process gallery images (multiple)
    const galleryImages: string[] = [];

    // Handle uploaded gallery files
    if (files && !Array.isArray(files) && files.galleryImages) {
      for (const file of files.galleryImages) {
        try {
          const cloudinaryResult = await CloudinaryService.uploadImage(file.path, 'autos');
          galleryImages.push(cloudinaryResult.secure_url);
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          logger.error(`Failed to upload gallery image: ${file.filename}`, err);
        }
      }
      logger.info(`Uploaded ${galleryImages.length} gallery images to Cloudinary`);
    }

    // Handle existing gallery URLs from file manager
    if (carData.existingGalleryImages) {
      try {
        const existingUrls = JSON.parse(carData.existingGalleryImages);
        if (Array.isArray(existingUrls)) {
          galleryImages.push(...existingUrls);
        }
      } catch (err) {
        logger.error('Failed to parse existingGalleryImages', err);
      }
      delete carData.existingGalleryImages;
    }

    carData.images = galleryImages;

    // Parse numeric fields
    const numericFields = ['year', 'price', 'cylinders', 'displacement', 'city_mpg', 'highway_mpg', 'combination_mpg'];
    numericFields.forEach(field => {
      if (carData[field] !== undefined) {
        carData[field] = parseFloat(carData[field]);
      }
    });

    // Parse boolean fields
    if (typeof carData.isAvailable === 'string') {
      carData.isAvailable = carData.isAvailable === 'true';
    }

    // Parse features
    if (carData.features && typeof carData.features === 'string') {
      try {
        carData.features = JSON.parse(carData.features);
      } catch (error) {
        carData.features = [];
      }
    }

    // Parse accessories
    if (carData.accessories && typeof carData.accessories === 'string') {
      try {
        carData.accessories = JSON.parse(carData.accessories);
      } catch (error) {
        carData.accessories = [];
      }
    }

    // Handle promotion
    if (carData.promotion === 'null' || carData.promotion === '') {
      carData.promotion = null;
    }

    // Generate unique ID
    if (!carData.id) {
      carData.id = `car-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Map model to carModel
    if (carData.model) {
      carData.carModel = carData.model;
      delete carData.model;
    }

    logger.info(`Final carData before save:`, carData);

    const car = new Car(carData);
    await car.save();

    // Create notification
    await NotificationController.create({
      title: 'Nuevo auto agregado',
      message: `${car.make} ${car.carModel} (${car.year}) ha sido añadido al catálogo.`,
      type: 'success',
      category: 'car',
      link: `/cars/${car.id || car._id}`
    });

    logger.info(`Car created by admin ${req.user?.email}:`, car.id);

    res.status(201).json({
      success: true,
      data: car,
      message: 'Car created successfully'
    });
  });

  /**
   * Update car (Admin only)
   */
  static updateCar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const trimmedId = id.trim();
    const updateData = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Process main image (from upload.fields)
    const mainImageFile = files?.image?.[0];
    if (mainImageFile) {
      const cloudinaryResult = await CloudinaryService.uploadImage(mainImageFile.path, 'autos');
      updateData.image = cloudinaryResult.secure_url;
      updateData.cloudinaryId = cloudinaryResult.public_id;
      updateData.cloudinaryUrl = cloudinaryResult.secure_url;
      if (fs.existsSync(mainImageFile.path)) {
        fs.unlinkSync(mainImageFile.path);
      }
      logger.info(`Main image uploaded: ${updateData.image}`);
    } else if (updateData.imageUrl) {
      updateData.image = updateData.imageUrl;
      delete updateData.imageUrl;
      logger.info(`Main image from file manager: ${updateData.image}`);
    } else if (updateData.removeImage === 'true') {
      updateData.image = '';
      delete updateData.removeImage;
      logger.info('Main image removed');
    } else {
      delete updateData.image;
      delete updateData.imageUrl;
      delete updateData.removeImage;
    }

    // Process gallery images
    const galleryImages: string[] = [];

    // Uploaded gallery files
    if (files && !Array.isArray(files) && files.galleryImages) {
      for (const file of files.galleryImages) {
        try {
          const cloudinaryResult = await CloudinaryService.uploadImage(file.path, 'autos');
          galleryImages.push(cloudinaryResult.secure_url);
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          logger.error(`Failed to upload gallery image: ${file.filename}`, err);
        }
      }
    }

    // Existing gallery URLs
    if (updateData.existingGalleryImages) {
      try {
        const existingUrls = JSON.parse(updateData.existingGalleryImages);
        if (Array.isArray(existingUrls)) {
          galleryImages.push(...existingUrls);
        }
      } catch (err) {
        logger.error('Failed to parse existingGalleryImages', err);
      }
      delete updateData.existingGalleryImages;
    }

    if (galleryImages.length > 0) {
      updateData.images = galleryImages;
    }

    // Parse numeric fields
    const numericFields = ['year', 'price', 'cylinders', 'displacement', 'city_mpg', 'highway_mpg', 'combination_mpg'];
    numericFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = parseFloat(updateData[field]);
      }
    });

    // Parse boolean fields
    if (typeof updateData.isAvailable === 'string') {
      updateData.isAvailable = updateData.isAvailable === 'true';
    }

    // Parse features
    if (updateData.features && typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (error) {
        updateData.features = [];
      }
    }

    // Parse accessories
    if (updateData.accessories && typeof updateData.accessories === 'string') {
      try {
        updateData.accessories = JSON.parse(updateData.accessories);
      } catch (error) {
        updateData.accessories = [];
      }
    }

    // Handle promotion
    if (updateData.promotion === 'null' || updateData.promotion === '') {
      updateData.promotion = null;
    }

    // Map model to carModel
    if (updateData.model) {
      updateData.carModel = updateData.model;
      delete updateData.model;
    }

    const car = await Car.findOneAndUpdate(
      { id: trimmedId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Car not found'
      });
      return;
    }

    logger.info(`Car updated by admin ${req.user?.email}:`, car.id);

    res.status(200).json({
      success: true,
      data: car,
      message: 'Car updated successfully'
    });
  });

  /**
   * Delete car (Admin only)
   */
  static deleteCar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const trimmedId = id.trim();

    logger.info(`Deleting car with id: ${trimmedId}`);

    // Eliminar auto
    const car = await Car.findOneAndUpdate(
      { id: trimmedId },
      { isAvailable: false },
      { new: true }
    );

    if (!car) {
      logger.info(`Car not found for deletion: ${trimmedId}`);
      res.status(404).json({
        success: false,
        message: 'Car not found'
      });
      return;
    }

    logger.info(`Car deleted successfully: ${car.id}`);

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  });

  /**
   * Get car statistics
   */
  static getCarStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await Car.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          uniqueMakes: { $addToSet: '$make' },
          uniqueClasses: { $addToSet: '$class' }
        }
      },
      {
        $project: {
          _id: 0,
          totalCars: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          totalMakes: { $size: '$uniqueMakes' },
          totalClasses: { $size: '$uniqueClasses' }
        }
      }
    ]);

    const makeStats = await Car.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$make',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          make: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          _id: 0
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        general: stats[0] || {},
        topMakes: makeStats
      }
    });
  });

  /**
   * Get unique makes
   */
  static getMakes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const makes = await Car.distinct('make', { isAvailable: true });

    res.status(200).json({
      success: true,
      data: makes.sort()
    });
  });

  /**
   * Get models by make
   */
  static getModelsByMake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { make } = req.params;
    const trimmedMake = make.trim();

    const models = await Car.distinct('carModel', { // Cambado a carModel
      make: new RegExp(trimmedMake, 'i'),
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      data: models.sort()
    });
  });

  /**
   * Search cars
   */
  static searchCars = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
      return;
    }

    const cars = await Car.find({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { make: { $regex: q, $options: 'i' } },
            { carModel: { $regex: q, $options: 'i' } }, // Cambado a carModel
            { class: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .limit(parseInt(limit as string))
      .select('id make carModel year price image'); // Incluir carModel

    res.status(200).json({
      success: true,
      data: cars
    });
  });
}
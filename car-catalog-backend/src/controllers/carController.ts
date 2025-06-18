import { Request, Response } from 'express';
import Car from '@/models/Car';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

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
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [cars, total] = await Promise.all([
      Car.find(filters)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Car.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limitNum);

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

    const car = await Car.findOne({ 
      $or: [{ _id: id }, { id: id }],
      isAvailable: true 
    }).lean();

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
      .limit(parseInt(limit as string))
      .lean();

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
    const { limit = 4 } = req.query;

    const currentCar = await Car.findOne({ 
      $or: [{ _id: id }, { id: id }] 
    }).lean();

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
    .limit(parseInt(limit as string))
    .lean();

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
    
    // Generate unique ID if not provided
    if (!carData.id) {
      carData.id = `car-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Cambiar model a carModel antes de crear
    if (carData.model) {
      carData.carModel = carData.model;
      delete carData.model;
    }

    const car = new Car(carData);
    await car.save();

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
    const updateData = req.body;

    // Cambiar model a carModel antes de actualizar
    if (updateData.model) {
      updateData.carModel = updateData.model;
      delete updateData.model;
    }

    const car = await Car.findOneAndUpdate(
      { $or: [{ _id: id }, { id: id }] },
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

    const car = await Car.findOneAndUpdate(
      { $or: [{ _id: id }, { id: id }] },
      { isAvailable: false },
      { new: true }
    );

    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Car not found'
      });
      return;
    }

    logger.info(`Car deleted by admin ${req.user?.email}:`, car.id);

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
    
    const models = await Car.distinct('carModel', { // Cambiado a carModel
      make: new RegExp(make, 'i'),
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
            { carModel: { $regex: q, $options: 'i' } }, // Cambiado a carModel
            { class: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .limit(parseInt(limit as string))
    .select('id make carModel year price image') // Incluir carModel
    .lean();

    res.status(200).json({
      success: true,
      data: cars
    });
  });
}
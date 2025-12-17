import { Response } from 'express';
import Favorite from '@/models/Favorite';
import Car from '@/models/Car';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export class FavoriteController {
  /**
   * Get user's favorite cars
   */
  static getFavorites = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const favorites = await Favorite.find({ userId: req.user!.id })
      .populate('carId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Favorite.countDocuments({ userId: req.user!.id });

    // Only keep favorites with an existing available car
    const validFavorites = favorites.filter((fav: any) => fav.carId !== null && fav.carId.isAvailable);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: validFavorites.map((fav: any) => ({
        ...fav,
        car: fav.carId
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  });

  /**
   * Add car to favorites
   */
  static addFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { carId } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car || car.isAvailable === false) {
      res.status(404).json({
        success: false,
        message: 'Car not found or not available'
      });
      return;
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({ userId: req.user!.id, carId });

    if (existingFavorite) {
      res.status(400).json({
        success: false,
        message: 'Car is already in favorites'
      });
      return;
    }

    // Create favorite
    const favorite = await Favorite.create({
      userId: req.user!.id,
      carId
    });

    const populatedFavorite = await Favorite.findById(favorite._id).populate('carId').lean();

    logger.info(`User ${req.user?.email} added car ${carId} to favorites`);

    res.status(201).json({
      success: true,
      data: {
        ...populatedFavorite,
        car: (populatedFavorite as any)?.carId
      },
      message: 'Car added to favorites'
    });
  });

  /**
   * Remove car from favorites
   */
  static removeFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { carId } = req.params;
    const result = await Favorite.deleteOne({ userId: req.user!.id, carId });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
      return;
    }

    logger.info(`User ${req.user?.email} removed car ${carId} from favorites`);

    res.status(200).json({
      success: true,
      message: 'Car removed from favorites'
    });
  });

  /**
   * Check if car is in user's favorites
   */
  static checkFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { carId } = req.params;
    const favorite = await Favorite.findOne({ userId: req.user!.id, carId });

    res.status(200).json({
      success: true,
      data: {
        isFavorite: !!favorite
      }
    });
  });

  /**
   * Get favorite statistics for user
   */
  static getFavoriteStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const favorites = await Favorite.find({ userId: req.user!.id }).populate('carId').lean();

    const available = favorites.filter((f: any) => f.carId !== null && f.carId.isAvailable);
    const totalFavorites = available.length;
    const prices: number[] = available.map((f: any) => f.carId?.price || 0);
    const avgPrice = prices.length > 0 ? +(prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2) : 0;
    const makes = new Set<string>();
    const fuelTypes = new Set<string>();
    available.forEach((f: any) => {
      const car = f.carId;
      if (!car) return;
      if (car.make) makes.add(car.make);
      if (car.fuel_type) fuelTypes.add(car.fuel_type);
    });

    res.status(200).json({
      success: true,
      data: {
        totalFavorites,
        avgPrice,
        uniqueMakes: makes.size,
        uniqueFuelTypes: fuelTypes.size
      }
    });
  });

  /**
   * Clear all favorites
   */
  static clearFavorites = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await Favorite.deleteMany({ userId: req.user!.id });

    logger.info(`User ${req.user?.email} cleared all favorites (${result.deletedCount} items)`);

    res.status(200).json({
      success: true,
      message: `Removed ${result.deletedCount} favorites`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  });
}
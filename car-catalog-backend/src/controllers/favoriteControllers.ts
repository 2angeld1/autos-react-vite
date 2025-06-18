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

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId: req.user!.id })
        .populate({
          path: 'carId',
          select: 'id make model year price image fuel_type transmission isAvailable',
          match: { isAvailable: true }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Favorite.countDocuments({ userId: req.user!.id })
    ]);

    // Filter out favorites where car is no longer available
    const validFavorites = favorites.filter(fav => fav.carId);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: validFavorites,
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
    if (!car || !car.isAvailable) {
      res.status(404).json({
        success: false,
        message: 'Car not found or not available'
      });
      return;
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId: req.user!.id,
      carId
    });

    if (existingFavorite) {
      res.status(400).json({
        success: false,
        message: 'Car is already in favorites'
      });
      return;
    }

    // Create favorite
    const favorite = new Favorite({
      userId: req.user!.id,
      carId
    });

    await favorite.save();

    // Populate car details
    await favorite.populate('carId', 'id make model year price image fuel_type transmission');

    logger.info(`User ${req.user?.email} added car ${carId} to favorites`);

    res.status(201).json({
      success: true,
      data: favorite,
      message: 'Car added to favorites'
    });
  });

  /**
   * Remove car from favorites
   */
  static removeFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { carId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user!.id,
      carId
    });

    if (!favorite) {
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

    const favorite = await Favorite.findOne({
      userId: req.user!.id,
      carId
    });

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
    const stats = await Favorite.aggregate([
      { $match: { userId: req.user!.id } },
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'car'
        }
      },
      { $unwind: '$car' },
      { $match: { 'car.isAvailable': true } },
      {
        $group: {
          _id: null,
          totalFavorites: { $sum: 1 },
          avgPrice: { $avg: '$car.price' },
          makes: { $addToSet: '$car.make' },
          fuelTypes: { $addToSet: '$car.fuel_type' }
        }
      },
      {
        $project: {
          _id: 0,
          totalFavorites: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          uniqueMakes: { $size: '$makes' },
          uniqueFuelTypes: { $size: '$fuelTypes' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalFavorites: 0,
        avgPrice: 0,
        uniqueMakes: 0,
        uniqueFuelTypes: 0
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
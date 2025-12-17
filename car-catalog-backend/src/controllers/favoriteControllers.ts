import { Response } from 'express';
import prisma from '@/config/prisma';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';
import type { Prisma } from '@prisma/client';

export class FavoriteController {
  /**
   * Get user's favorite cars
   */
  static getFavorites = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    type FavoriteWithCar = Prisma.FavoriteGetPayload<{ include: { car: true } }>;
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: { car: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }) as FavoriteWithCar[];

    const total = await prisma.favorite.count({ where: { userId: req.user!.id } });

    // Only keep favorites with an existing available car
    const validFavorites = favorites.filter((fav: FavoriteWithCar) => fav.car !== null && fav.car.isAvailable);

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
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car || car.isAvailable === false) {
      res.status(404).json({
        success: false,
        message: 'Car not found or not available'
      });
      return;
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findFirst({ where: { userId: req.user!.id, carId } });

    if (existingFavorite) {
      res.status(400).json({
        success: false,
        message: 'Car is already in favorites'
      });
      return;
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: { userId: req.user!.id, carId },
      include: { car: true }
    });

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
    const result = await prisma.favorite.deleteMany({ where: { userId: req.user!.id, carId } });

    if (result.count === 0) {
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
    const favorite = await prisma.favorite.findFirst({ where: { userId: req.user!.id, carId } });

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
    type FavoriteWithCar = Prisma.FavoriteGetPayload<{ include: { car: true } }>;
    const favorites = await prisma.favorite.findMany({ where: { userId: req.user!.id }, include: { car: true } }) as FavoriteWithCar[];

    const available = favorites.filter((f: FavoriteWithCar) => f.car !== null && f.car.isAvailable);
    const totalFavorites = available.length;
    const prices: number[] = available.map((f: FavoriteWithCar) => (f.car?.price as number) || 0);
    const avgPrice = prices.length > 0 ? +(prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2) : 0;
    const makes = new Set<string>();
    const fuelTypes = new Set<string>();
    available.forEach((f: FavoriteWithCar) => {
      const car = f.car;
      if (!car) return;
      if (car.make) makes.add(car.make);
      if (car.fuelType) fuelTypes.add(car.fuelType);
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
    const result = await prisma.favorite.deleteMany({ where: { userId: req.user!.id } });

    logger.info(`User ${req.user?.email} cleared all favorites (${result.count} items)`);

    res.status(200).json({
      success: true,
      message: `Removed ${result.count} favorites`,
      data: {
        deletedCount: result.count
      }
    });
  });
}
import Car from '@/models/Car';
import { ICar, ICarFilters } from '@/types/car';
import { logger } from '@/utils/logger';

export class CarService {
  /**
   * Import cars from external API or CSV
   */
  static async importCars(cars: ICar[]): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const carData of cars) {
      try {
        // Check if car already exists
        const existingCar = await Car.findOne({ id: carData.id });
        
        if (existingCar) {
          // Update existing car
          await Car.findByIdAndUpdate(existingCar._id, carData, { 
            runValidators: true 
          });
          success++;
        } else {
          // Create new car
          const car = new Car(carData);
          await car.save();
          success++;
        }
      } catch (error) {
        failed++;
        errors.push(`Failed to import car ${carData.id}: ${(error as Error).message}`);
        logger.error(`Car import failed:`, error);
      }
    }

    logger.info(`Car import completed: ${success} success, ${failed} failed`);
    
    return { success, failed, errors };
  }

  /**
   * Bulk update car availability
   */
  static async updateAvailability(carIds: string[], isAvailable: boolean): Promise<number> {
    try {
      const result = await Car.updateMany(
        { _id: { $in: carIds } },
        { isAvailable },
        { runValidators: true }
      );

      logger.info(`Updated availability for ${result.modifiedCount} cars`);
      return result.modifiedCount;
    } catch (error) {
      logger.error('Bulk availability update failed:', error);
      throw error;
    }
  }

  /**
   * Get cars by price range
   */
  static async getCarsByPriceRange(minPrice: number, maxPrice: number): Promise<ICar[]> {
    try {
      const cars = await Car.find({
        price: { $gte: minPrice, $lte: maxPrice },
        isAvailable: true
      }).lean();

      return cars;
    } catch (error) {
      logger.error('Get cars by price range failed:', error);
      throw error;
    }
  }

  /**
   * Get cars by fuel efficiency
   */
  static async getEfficientCars(minMpg: number): Promise<ICar[]> {
    try {
      const cars = await Car.find({
        combination_mpg: { $gte: minMpg },
        isAvailable: true
      })
      .sort({ combination_mpg: -1 })
      .lean();

      return cars;
    } catch (error) {
      logger.error('Get efficient cars failed:', error);
      throw error;
    }
  }

  /**
   * Generate car recommendations based on user preferences
   */
  static async getRecommendations(
    userPreferences: {
      maxPrice?: number;
      preferredMakes?: string[];
      fuelType?: string;
      minMpg?: number;
    },
    limit: number = 10
  ): Promise<ICar[]> {
    try {
      const filters: Record<string, unknown> = { isAvailable: true };

      if (userPreferences.maxPrice) {
        filters.price = { $lte: userPreferences.maxPrice };
      }

      if (userPreferences.preferredMakes && userPreferences.preferredMakes.length > 0) {
        filters.make = { $in: userPreferences.preferredMakes };
      }

      if (userPreferences.fuelType) {
        filters.fuel_type = userPreferences.fuelType;
      }

      if (userPreferences.minMpg) {
        filters.combination_mpg = { $gte: userPreferences.minMpg };
      }

      const cars = await Car.find(filters)
        .sort({ createdAt: -1, combination_mpg: -1 })
        .limit(limit)
        .lean();

      return cars;
    } catch (error) {
      logger.error('Get recommendations failed:', error);
      throw error;
    }
  }

  /**
   * Get trending cars (most viewed/popular)
   */
  static async getTrendingCars(limit: number = 10): Promise<ICar[]> {
    try {
      // For now, return newest cars. In production, you'd track views/clicks
      const cars = await Car.find({ isAvailable: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return cars;
    } catch (error) {
      logger.error('Get trending cars failed:', error);
      throw error;
    }
  }

  /**
   * Search cars with advanced filtering
   */
  static async advancedSearch(filters: ICarFilters & {
    features?: string[];
    yearRange?: { min: number; max: number };
    sortBy?: string;
  }): Promise<{ cars: ICar[]; total: number }> {
    try {
      const query: Record<string, unknown> = { isAvailable: true };

      // Build search query
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      if (filters.make) query.make = new RegExp(filters.make, 'i');
      if (filters.model) query.model = new RegExp(filters.model, 'i');
      if (filters.fuel_type) query.fuel_type = filters.fuel_type;
      if (filters.transmission) query.transmission = filters.transmission;
      if (filters.class) query.class = new RegExp(filters.class, 'i');

      // Price range
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) (query.price as Record<string, number>).$gte = filters.minPrice;
        if (filters.maxPrice) (query.price as Record<string, number>).$lte = filters.maxPrice;
      }

      // Year range
      if (filters.yearRange) {
        query.year = {
          $gte: filters.yearRange.min,
          $lte: filters.yearRange.max
        };
      }

      // Features
      if (filters.features && filters.features.length > 0) {
        query.features = { $in: filters.features };
      }

      // Pagination
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 50);
      const skip = (page - 1) * limit;

      // Sorting
      let sort: Record<string, 1 | -1> = { createdAt: -1 };
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            sort = { price: 1 };
            break;
          case 'price_desc':
            sort = { price: -1 };
            break;
          case 'year_asc':
            sort = { year: 1 };
            break;
          case 'year_desc':
            sort = { year: -1 };
            break;
          case 'mpg_desc':
            sort = { combination_mpg: -1 };
            break;
        }
      }

      const [cars, total] = await Promise.all([
        Car.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Car.countDocuments(query)
      ]);

      return { cars, total };
    } catch (error) {
      logger.error('Advanced search failed:', error);
      throw error;
    }
  }

  /**
   * Get cars needing maintenance (for admin)
   */
  static async getCarsNeedingAttention(): Promise<{
    oldCars: ICar[];
    expensiveCars: ICar[];
    lowEfficiencyCars: ICar[];
  }> {
    try {
      const currentYear = new Date().getFullYear();

      const [oldCars, expensiveCars, lowEfficiencyCars] = await Promise.all([
        // Cars older than 15 years
        Car.find({
          year: { $lt: currentYear - 15 },
          isAvailable: true
        }).lean(),

        // Cars priced above $100,000
        Car.find({
          price: { $gt: 100000 },
          isAvailable: true
        }).lean(),

        // Cars with low fuel efficiency
        Car.find({
          combination_mpg: { $lt: 20 },
          isAvailable: true
        }).lean()
      ]);

      return { oldCars, expensiveCars, lowEfficiencyCars };
    } catch (error) {
      logger.error('Get cars needing attention failed:', error);
      throw error;
    }
  }

  /**
   * Validate car data before import
   */
  static validateCarData(carData: Partial<ICar>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!carData.make) errors.push('Make is required');
    if (!carData.model) errors.push('Model is required');
    if (!carData.year || carData.year < 1900 || carData.year > new Date().getFullYear() + 2) {
      errors.push('Valid year is required');
    }
    if (!carData.price || carData.price < 0) errors.push('Valid price is required');
    if (!carData.image) errors.push('Image URL is required');
    if (!carData.fuel_type || !['gas', 'diesel', 'electricity', 'hybrid'].includes(carData.fuel_type)) {
      errors.push('Valid fuel type is required');
    }
    if (!carData.transmission || !['a', 'm'].includes(carData.transmission)) {
      errors.push('Valid transmission type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
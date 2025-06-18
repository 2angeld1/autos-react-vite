import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import { connectWithRetry } from '@/config/database';
import { CarService } from '@/services/carService';
import { logger } from '@/utils/logger';
import { ICar } from '@/types/car';

interface CSVCarData {
  make: string;
  model: string;
  year: string;
  price: string;
  fuel_type: string;
  transmission: string;
  cylinders: string;
  class: string;
  displacement: string;
  city_mpg: string;
  highway_mpg: string;
  combination_mpg: string;
  description?: string;
  image?: string;
}

export class CarImporter {
  /**
   * Import cars from CSV file
   */
  static async importFromCSV(filePath: string): Promise<void> {
    try {
      logger.info(`📂 Importing cars from CSV: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const cars: ICar[] = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row: CSVCarData) => {
            try {
              const car = this.parseCSVRow(row);
              if (car) {
                cars.push(car);
              }
            } catch (error) {
              logger.warn(`Skipping invalid row:`, error);
            }
          })
          .on('end', async () => {
            try {
              logger.info(`📊 Parsed ${cars.length} cars from CSV`);
              const result = await CarService.importCars(cars);
              
              logger.info(`✅ Import completed: ${result.success} success, ${result.failed} failed`);
              
              if (result.errors.length > 0) {
                logger.warn('Import errors:', result.errors);
              }
              
              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', reject);
      });
    } catch (error) {
      logger.error('CSV import failed:', error);
      throw error;
    }
  }

  /**
   * Import cars from external API
   */
  static async importFromAPI(apiUrl: string, apiKey?: string): Promise<void> {
    try {
      logger.info(`🌐 Importing cars from API: ${apiUrl}`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await axios.get(apiUrl, {
        headers,
        timeout: 30000
      });

      const cars = this.parseAPIResponse(response.data);
      
      logger.info(`📊 Parsed ${cars.length} cars from API`);
      
      const result = await CarService.importCars(cars);
      
      logger.info(`✅ Import completed: ${result.success} success, ${result.failed} failed`);
      
      if (result.errors.length > 0) {
        logger.warn('Import errors:', result.errors);
      }
    } catch (error) {
      logger.error('API import failed:', error);
      throw error;
    }
  }

  /**
   * Parse CSV row to car object
   */
  private static parseCSVRow(row: CSVCarData): ICar | null {
    try {
      // Validate required fields
      if (!row.make || !row.model || !row.year || !row.price) {
        throw new Error('Missing required fields');
      }

      const year = parseInt(row.year);
      const price = parseFloat(row.price);

      if (isNaN(year) || isNaN(price)) {
        throw new Error('Invalid year or price');
      }

      return {
        id: `${row.make}-${row.model}-${year}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-'),
        make: row.make.trim(),
        model: row.model.trim(),
        year,
        price,
        image: row.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(row.make + ' ' + row.model)}`,
        description: row.description || `${row.year} ${row.make} ${row.model}`,
        fuel_type: this.normalizeFuelType(row.fuel_type),
        transmission: this.normalizeTransmission(row.transmission),
        cylinders: parseInt(row.cylinders) || 4,
        class: row.class?.trim() || 'sedan',
        displacement: parseFloat(row.displacement) || 2.0,
        city_mpg: parseInt(row.city_mpg) || 25,
        highway_mpg: parseInt(row.highway_mpg) || 30,
        combination_mpg: parseInt(row.combination_mpg) || 27,
        isAvailable: true
      };
    } catch (error) {
      logger.warn(`Failed to parse CSV row:`, error);
      return null;
    }
  }

  /**
   * Parse API response to car array
   */
  private static parseAPIResponse(data: unknown): ICar[] {
    const cars: ICar[] = [];

    // Assuming API returns array of car objects
    const carArray = Array.isArray(data) ? data : (data as Record<string, unknown>).cars || (data as Record<string, unknown>).data || [];

    for (const item of carArray as Record<string, unknown>[]) {
      try {
        const car: ICar = {
          id: (item.id as string) || `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          make: (item.make as string) || (item.manufacturer as string),
          model: item.model as string,
          year: parseInt(item.year as string),
          price: parseFloat((item.price as string) || (item.msrp as string)),
          image: (item.image as string) || (item.photo_url as string) || `https://via.placeholder.com/400x300?text=${encodeURIComponent((item.make as string) + ' ' + (item.model as string))}`,
          description: (item.description as string) || `${item.year} ${item.make} ${item.model}`,
          fuel_type: this.normalizeFuelType((item.fuel_type as string) || (item.fuel as string)),
          transmission: this.normalizeTransmission(item.transmission as string),
          cylinders: parseInt(item.cylinders as string) || 4,
          class: (item.class as string) || (item.category as string) || 'sedan',
          displacement: parseFloat((item.displacement as string) || (item.engine_size as string)) || 2.0,
          city_mpg: parseInt((item.city_mpg as string) || (item.mpg_city as string)) || 25,
          highway_mpg: parseInt((item.highway_mpg as string) || (item.mpg_highway as string)) || 30,
          combination_mpg: parseInt((item.combination_mpg as string) || (item.mpg_combined as string)) || 27,
          features: (item.features as string[]) || [],
          isAvailable: true
        };

        const validation = CarService.validateCarData(car);
        if (validation.isValid) {
          cars.push(car);
        } else {
          logger.warn(`Invalid car data:`, validation.errors);
        }
      } catch (error) {
        logger.warn(`Failed to parse API car:`, error);
      }
    }

    return cars;
  }

  /**
   * Normalize fuel type
   */
  private static normalizeFuelType(fuelType: string): 'gas' | 'diesel' | 'electricity' | 'hybrid' {
    if (!fuelType) return 'gas';
    
    const normalized = fuelType.toLowerCase().trim();
    
    if (normalized.includes('electric') || normalized.includes('ev')) return 'electricity';
    if (normalized.includes('hybrid')) return 'hybrid';
    if (normalized.includes('diesel')) return 'diesel';
    
    return 'gas';
  }

  /**
   * Normalize transmission
   */
  private static normalizeTransmission(transmission: string): 'a' | 'm' {
    if (!transmission) return 'a';
    
    const normalized = transmission.toLowerCase().trim();
    
    if (normalized.includes('manual') || normalized.includes('stick') || normalized === 'm') {
      return 'm';
    }
    
    return 'a';
  }

  /**
   * Generate sample CSV file
   */
  static generateSampleCSV(outputPath: string): void {
    const csvContent = `make,model,year,price,fuel_type,transmission,cylinders,class,displacement,city_mpg,highway_mpg,combination_mpg,description
Toyota,Camry,2023,25000,gas,a,4,midsize car,2.5,28,39,32,Reliable mid-size sedan
Honda,Civic,2023,22000,gas,m,4,compact car,2.0,31,40,35,Compact car with sporty design
Tesla,Model 3,2023,45000,electricity,a,0,compact car,0,148,132,140,Electric luxury sedan
Ford,F-150,2023,35000,gas,a,6,pickup truck,3.3,20,24,22,America's best-selling truck`;

    fs.writeFileSync(outputPath, csvContent);
    logger.info(`📄 Sample CSV generated: ${outputPath}`);
  }
}

/**
 * CLI script for importing cars
 */
async function main() {
  try {
    await connectWithRetry();

    const args = process.argv.slice(2);
    const command = args[0];
    const source = args[1];

    switch (command) {
      case 'csv': {
        if (!source) {
          logger.error('Please provide CSV file path');
          process.exit(1);
        }
        await CarImporter.importFromCSV(source);
        break;
      }

      case 'api': {
        if (!source) {
          logger.error('Please provide API URL');
          process.exit(1);
        }
        const apiKey = args[2];
        await CarImporter.importFromAPI(source, apiKey);
        break;
      }

      case 'sample': {
        const outputPath = source || './sample-cars.csv';
        CarImporter.generateSampleCSV(outputPath);
        break;
      }

      default:
        logger.info('Usage: npm run import [csv|api|sample] <source> [apiKey]');
        logger.info('  csv <file>      - Import from CSV file');
        logger.info('  api <url> [key] - Import from API endpoint');
        logger.info('  sample [file]   - Generate sample CSV file');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Import script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
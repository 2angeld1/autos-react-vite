import { connectWithRetry } from '@/config/database';
import Car from '@/models/Car';
import User from '@/models/User';
import Favorite from '@/models/Favorite';
import { logger } from '@/utils/logger';
import { hashPassword } from '@/utils/helpers';

const sampleCars = [
  {
    id: "car-001",
    carModel: "Camry",
    make: "Toyota",
    year: 2023,
    price: 25000,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
    description: "Reliable mid-size sedan with excellent fuel economy and spacious interior.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 4,
    class: "midsize car",
    displacement: 2.5,
    city_mpg: 28,
    highway_mpg: 39,
    combination_mpg: 32,
    features: ["Bluetooth", "Backup Camera", "Cruise Control", "Air Conditioning"],
    isAvailable: true
  },
  {
    id: "car-002",
    carModel: "Civic",
    make: "Honda",
    year: 2023,
    price: 22000,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400",
    description: "Compact car with sporty design and advanced safety features.",
    fuel_type: "gas",
    transmission: "m",
    cylinders: 4,
    class: "compact car",
    displacement: 2.0,
    city_mpg: 31,
    highway_mpg: 40,
    combination_mpg: 35,
    features: ["Apple CarPlay", "Android Auto", "Lane Keeping Assist", "Collision Mitigation"],
    isAvailable: true
  },
  {
    id: "car-003",
    carModel: "Model 3",
    make: "Tesla",
    year: 2023,
    price: 45000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
    description: "Electric luxury sedan with autopilot capabilities and supercharging network.",
    fuel_type: "electricity",
    transmission: "a",
    cylinders: 1, // Cambiado de 0 a 1 para evitar error de validación
    class: "compact car",
    displacement: 0.5, // Cambiado de 0 a 0.5 para evitar error de validación
    city_mpg: 148,
    highway_mpg: 132,
    combination_mpg: 140,
    features: ["Autopilot", "Supercharging", "Over-the-Air Updates", "Premium Audio"],
    isAvailable: true
  },
  {
    id: "car-004",
    carModel: "F-150",
    make: "Ford",
    year: 2023,
    price: 35000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
    description: "America's best-selling truck with impressive towing capacity and durability.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 6,
    class: "pickup truck",
    displacement: 3.3,
    city_mpg: 20,
    highway_mpg: 24,
    combination_mpg: 22,
    features: ["4WD", "Towing Package", "Bed Liner", "Running Boards"],
    isAvailable: true
  },
  {
    id: "car-005",
    carModel: "X5",
    make: "BMW",
    year: 2023,
    price: 60000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
    description: "Luxury SUV with premium interior and advanced driving dynamics.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 6,
    class: "suv",
    displacement: 3.0,
    city_mpg: 21,
    highway_mpg: 26,
    combination_mpg: 23,
    features: ["Leather Seats", "Panoramic Sunroof", "Navigation", "Premium Sound"],
    isAvailable: true
  },
  {
    id: "car-006",
    carModel: "A4",
    make: "Audi",
    year: 2022,
    price: 38000,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    description: "Luxury compact sedan with quattro all-wheel drive and refined interior.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 4,
    class: "compact car",
    displacement: 2.0,
    city_mpg: 25,
    highway_mpg: 34,
    combination_mpg: 29,
    features: ["Quattro AWD", "Virtual Cockpit", "Bang & Olufsen Audio", "Heated Seats"],
    isAvailable: true
  },
  {
    id: "car-007",
    carModel: "Corvette",
    make: "Chevrolet",
    year: 2023,
    price: 65000,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    description: "American sports car icon with mid-engine design and thrilling performance.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 8,
    class: "two seater",
    displacement: 6.2,
    city_mpg: 15,
    highway_mpg: 27,
    combination_mpg: 19,
    features: ["Performance Exhaust", "Magnetic Ride Control", "Brembo Brakes", "Carbon Fiber"],
    isAvailable: true
  },
  {
    id: "car-008",
    carModel: "Leaf",
    make: "Nissan",
    year: 2023,
    price: 32000,
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
    description: "Affordable electric vehicle with proven reliability and efficiency.",
    fuel_type: "electricity",
    transmission: "a",
    cylinders: 1, // Cambiado de 0 a 1 para evitar error de validación
    class: "compact car",
    displacement: 0.5, // Cambiado de 0 a 0.5 para evitar error de validación
    city_mpg: 123,
    highway_mpg: 99,
    combination_mpg: 111,
    features: ["ProPILOT Assist", "e-Pedal", "NissanConnect", "Quick Charge"],
    isAvailable: true
  },
  {
    id: "car-009",
    carModel: "Wrangler",
    make: "Jeep",
    year: 2023,
    price: 40000,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    description: "Iconic off-road SUV with removable doors and roof for ultimate adventure.",
    fuel_type: "gas",
    transmission: "m",
    cylinders: 6,
    class: "suv",
    displacement: 3.6,
    city_mpg: 20,
    highway_mpg: 24,
    combination_mpg: 22,
    features: ["4x4 Capability", "Removable Doors", "Rock Rails", "Skid Plates"],
    isAvailable: true
  },
  {
    id: "car-010",
    carModel: "C-Class",
    make: "Mercedes-Benz",
    year: 2023,
    price: 42000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
    description: "Luxury compact sedan with cutting-edge technology and elegant design.",
    fuel_type: "gas",
    transmission: "a",
    cylinders: 4,
    class: "compact car",
    displacement: 2.0,
    city_mpg: 24,
    highway_mpg: 35,
    combination_mpg: 28,
    features: ["MBUX Infotainment", "Active Brake Assist", "Blind Spot Assist", "LED Headlights"],
    isAvailable: true
  },
  // Agregar más coches eléctricos e híbridos con valores válidos
  {
    id: "car-011",
    carModel: "Prius",
    make: "Toyota",
    year: 2023,
    price: 28000,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400",
    description: "World's most popular hybrid with exceptional fuel economy.",
    fuel_type: "hybrid",
    transmission: "a",
    cylinders: 4,
    class: "compact car",
    displacement: 1.8,
    city_mpg: 58,
    highway_mpg: 53,
    combination_mpg: 56,
    features: ["Hybrid Technology", "Smart Key", "Pre-Collision System", "Lane Departure Alert"],
    isAvailable: true
  },
  {
    id: "car-012",
    carModel: "Mustang Mach-E",
    make: "Ford",
    year: 2023,
    price: 48000,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400",
    description: "Electric SUV with Mustang performance and style.",
    fuel_type: "electricity",
    transmission: "a",
    cylinders: 1, // Valor mínimo válido para coches eléctricos
    class: "suv",
    displacement: 0.5, // Valor mínimo válido para coches eléctricos
    city_mpg: 105,
    highway_mpg: 93,
    combination_mpg: 100,
    features: ["SYNC 4A", "Ford Co-Pilot360", "Wireless Charging", "Premium Sound"],
    isAvailable: true
  }
];

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@carcatalog.com",
    password: "admin123456",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user"
  }
];

export class DataSeeder {
  static async seedCars() {
    try {
      logger.info('🌱 Seeding cars data...');
      
      await Car.deleteMany({});
      await Car.insertMany(sampleCars);
      
      logger.info(`✅ Successfully seeded ${sampleCars.length} cars`);
    } catch (error) {
      logger.error('❌ Failed to seed cars:', error);
      throw error;
    }
  }

  static async seedUsers() {
    try {
      logger.info('🌱 Seeding users data...');

      await User.deleteMany({});

      const usersWithHashedPasswords = await Promise.all(
        sampleUsers.map(async (user) => ({
          ...user,
          password: await hashPassword(user.password)
        }))
      );

      await User.insertMany(usersWithHashedPasswords);

      logger.info(`✅ Successfully seeded ${sampleUsers.length} users`);
    } catch (error) {
      logger.error('❌ Failed to seed users:', error);
      throw error;
    }
  }

  static async seedAll() {
    try {
      await this.seedUsers();
      await this.seedCars();
      logger.info('🎉 All data seeded successfully!');
    } catch (error) {
      logger.error('❌ Failed to seed data:', error);
      throw error;
    }
  }

  static async clearAll() {
    try {
      logger.info('🧹 Clearing all data...');

      await Promise.all([
        Car.deleteMany({}),
        User.deleteMany({}),
        Favorite.deleteMany({})
      ]);

      logger.info('✅ All data cleared successfully');
    } catch (error) {
      logger.error('❌ Failed to clear data:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    await connectWithRetry();

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'seed':
        await DataSeeder.seedAll();
        break;
      case 'clear':
        await DataSeeder.clearAll();
        break;
      case 'reset':
        await DataSeeder.clearAll();
        await DataSeeder.seedAll();
        break;
      default:
        logger.info('Usage: npm run seed [seed|clear|reset]');
        logger.info('  seed  - Add sample data to database');
        logger.info('  clear - Remove all data from database');
        logger.info('  reset - Clear and then seed data');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Seeder script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
import mongoose from 'mongoose';
import { DataSeeder } from './seedData';
import Car from '@/models/Car';
import User from '@/models/User';
import { connectWithRetry } from '@/config/database';
import { hashPassword } from '@/utils/helpers';
import { logger } from '@/utils/logger';

// Mock dependencies
jest.mock('@/config/database');
jest.mock('@/models/Car');
jest.mock('@/models/User');
jest.mock('@/utils/helpers');
jest.mock('@/utils/logger');
jest.mock('mongoose', () => ({
    connection: {
        db: {
            collection: jest.fn()
        }
    }
}));

// Type the mocked modules
const mockConnectWithRetry = connectWithRetry as jest.MockedFunction<typeof connectWithRetry>;
const mockCar = Car as jest.Mocked<typeof Car>;
const mockUser = User as jest.Mocked<typeof User>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockLogger = logger as jest.Mocked<typeof logger>;
const mockMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe('DataSeeder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup default mock implementations
        mockCar.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
        mockCar.insertMany = jest.fn().mockResolvedValue([]);
        mockUser.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
        mockUser.insertMany = jest.fn().mockResolvedValue([]);
        mockHashPassword.mockResolvedValue('hashedPassword123');
        
        // Mock mongoose connection
        const mockCollection = {
            deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
        };
        mockMongoose.connection.db.collection = jest.fn().mockReturnValue(mockCollection);
        
        // Mock logger methods
        mockLogger.info = jest.fn();
        mockLogger.error = jest.fn();
    });

    describe('seedCars', () => {
        it('should successfully seed cars data', async () => {
            const mockCars = [
                { id: 'car-001', make: 'Toyota', model: 'Camry' },
                { id: 'car-002', make: 'Honda', model: 'Civic' }
            ];
            
            mockCar.insertMany.mockResolvedValue(mockCars as any);

            await DataSeeder.seedCars();

            expect(mockCar.deleteMany).toHaveBeenCalledWith({});
            expect(mockCar.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    id: 'car-001',
                    make: 'Toyota',
                    model: 'Camry'
                })
            ]));
            expect(mockLogger.info).toHaveBeenCalledWith('🌱 Seeding cars data...');
            expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Successfully seeded'));
        });

        it('should handle errors during car seeding', async () => {
            const error = new Error('Database connection failed');
            mockCar.deleteMany.mockRejectedValue(error);

            await expect(DataSeeder.seedCars()).rejects.toThrow('Database connection failed');
            
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to seed cars:', error);
        });

        it('should handle insertMany failure', async () => {
            const error = new Error('Insert failed');
            mockCar.insertMany.mockRejectedValue(error);

            await expect(DataSeeder.seedCars()).rejects.toThrow('Insert failed');
            
            expect(mockCar.deleteMany).toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to seed cars:', error);
        });
    });

    describe('seedUsers', () => {
        it('should successfully seed users with hashed passwords', async () => {
            const mockUsers = [
                { name: 'Admin', email: 'admin@test.com', password: 'hashedPassword123', role: 'admin' },
                { name: 'User', email: 'user@test.com', password: 'hashedPassword123', role: 'user' }
            ];
            
            mockUser.insertMany.mockResolvedValue(mockUsers as any);

            await DataSeeder.seedUsers();

            expect(mockUser.deleteMany).toHaveBeenCalledWith({});
            expect(mockHashPassword).toHaveBeenCalledTimes(3); // 3 sample users
            expect(mockHashPassword).toHaveBeenCalledWith('admin123456');
            expect(mockHashPassword).toHaveBeenCalledWith('password123');
            
            expect(mockUser.insertMany).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Admin User',
                        email: 'admin@carcatalog.com',
                        password: 'hashedPassword123',
                        role: 'admin'
                    })
                ])
            );
            
            expect(mockLogger.info).toHaveBeenCalledWith('🌱 Seeding users data...');
            expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Successfully seeded'));
        });

        it('should handle password hashing errors', async () => {
            const error = new Error('Hashing failed');
            mockHashPassword.mockRejectedValue(error);

            await expect(DataSeeder.seedUsers()).rejects.toThrow('Hashing failed');
            
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to seed users:', error);
        });

        it('should handle user insertion errors', async () => {
            const error = new Error('User insertion failed');
            mockUser.insertMany.mockRejectedValue(error);

            await expect(DataSeeder.seedUsers()).rejects.toThrow('User insertion failed');
            
            expect(mockUser.deleteMany).toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to seed users:', error);
        });
    });

    describe('seedAll', () => {
        it('should successfully seed both users and cars', async () => {
            const seedUsersSpy = jest.spyOn(DataSeeder, 'seedUsers').mockResolvedValue();
            const seedCarsSpy = jest.spyOn(DataSeeder, 'seedCars').mockResolvedValue();

            await DataSeeder.seedAll();

            expect(seedUsersSpy).toHaveBeenCalled();
            expect(seedCarsSpy).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('🎉 All data seeded successfully!');
            
            seedUsersSpy.mockRestore();
            seedCarsSpy.mockRestore();
        });

        it('should handle errors during seedAll', async () => {
            const error = new Error('Seeding failed');
            const seedUsersSpy = jest.spyOn(DataSeeder, 'seedUsers').mockRejectedValue(error);
            const seedCarsSpy = jest.spyOn(DataSeeder, 'seedCars').mockResolvedValue();

            await expect(DataSeeder.seedAll()).rejects.toThrow('Seeding failed');
            
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to seed data:', error);
            
            seedUsersSpy.mockRestore();
            seedCarsSpy.mockRestore();
        });
    });

    describe('clearAll', () => {
        it('should successfully clear all collections', async () => {
            const mockFavoritesCollection = {
                deleteMany: jest.fn().mockResolvedValue({ deletedCount: 5 })
            };
            mockMongoose.connection.db.collection.mockReturnValue(mockFavoritesCollection);

            await DataSeeder.clearAll();

            expect(mockCar.deleteMany).toHaveBeenCalledWith({});
            expect(mockUser.deleteMany).toHaveBeenCalledWith({});
            expect(mockMongoose.connection.db.collection).toHaveBeenCalledWith('favorites');
            expect(mockFavoritesCollection.deleteMany).toHaveBeenCalledWith({});
            expect(mockLogger.info).toHaveBeenCalledWith('🧹 Clearing all data...');
            expect(mockLogger.info).toHaveBeenCalledWith('✅ All data cleared successfully');
        });

        it('should handle errors during clearAll', async () => {
            const error = new Error('Clear failed');
            mockCar.deleteMany.mockRejectedValue(error);

            await expect(DataSeeder.clearAll()).rejects.toThrow('Clear failed');
            
            expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to clear data:', error);
        });

        it('should handle favorites collection deletion error', async () => {
            const error = new Error('Favorites deletion failed');
            const mockFavoritesCollection = {
                deleteMany: jest.fn().mockRejectedValue(error)
            };
            mockMongoose.connection.db.collection.mockReturnValue(mockFavoritesCollection);

            await expect(DataSeeder.clearAll()).rejects.toThrow('Favorites deletion failed');
        });
    });

    describe('main function integration', () => {
        let originalArgv: string[];
        let exitSpy: jest.SpyInstance;

        beforeEach(() => {
            originalArgv = process.argv;
            exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit() was called');
            });
            mockConnectWithRetry.mockResolvedValue();
        });

        afterEach(() => {
            process.argv = originalArgv;
            exitSpy.mockRestore();
        });

        it('should execute seed command', async () => {
            process.argv = ['node', 'seedData.js', 'seed'];
            const seedAllSpy = jest.spyOn(DataSeeder, 'seedAll').mockResolvedValue();

            try {
                const { main } = await import('./seedData');
                await expect(main()).rejects.toThrow('process.exit() was called');
            } catch (error) {
                // Expected due to process.exit mock
            }

            expect(mockConnectWithRetry).toHaveBeenCalled();
            expect(seedAllSpy).toHaveBeenCalled();
            expect(exitSpy).toHaveBeenCalledWith(0);
            
            seedAllSpy.mockRestore();
        });

        it('should execute clear command', async () => {
            process.argv = ['node', 'seedData.js', 'clear'];
            const clearAllSpy = jest.spyOn(DataSeeder, 'clearAll').mockResolvedValue();

            try {
                const { main } = await import('./seedData');
                await expect(main()).rejects.toThrow('process.exit() was called');
            } catch (error) {
                // Expected due to process.exit mock
            }

            expect(clearAllSpy).toHaveBeenCalled();
            expect(exitSpy).toHaveBeenCalledWith(0);
            
            clearAllSpy.mockRestore();
        });

        it('should execute reset command', async () => {
            process.argv = ['node', 'seedData.js', 'reset'];
            const clearAllSpy = jest.spyOn(DataSeeder, 'clearAll').mockResolvedValue();
            const seedAllSpy = jest.spyOn(DataSeeder, 'seedAll').mockResolvedValue();

            try {
                const { main } = await import('./seedData');
                await expect(main()).rejects.toThrow('process.exit() was called');
            } catch (error) {
                // Expected due to process.exit mock
            }

            expect(clearAllSpy).toHaveBeenCalled();
            expect(seedAllSpy).toHaveBeenCalled();
            expect(exitSpy).toHaveBeenCalledWith(0);
            
            clearAllSpy.mockRestore();
            seedAllSpy.mockRestore();
        });

        it('should show usage for unknown command', async () => {
            process.argv = ['node', 'seedData.js', 'unknown'];

            try {
                const { main } = await import('./seedData');
                await expect(main()).rejects.toThrow('process.exit() was called');
            } catch (error) {
                // Expected due to process.exit mock
            }

            expect(mockLogger.info).toHaveBeenCalledWith('Usage: npm run seed [seed|clear|reset]');
            expect(exitSpy).toHaveBeenCalledWith(0);
        });

        it('should handle connection errors', async () => {
            process.argv = ['node', 'seedData.js', 'seed'];
            const connectionError = new Error('Connection failed');
            mockConnectWithRetry.mockRejectedValue(connectionError);

            try {
                const { main } = await import('./seedData');
                await expect(main()).rejects.toThrow('process.exit() was called');
            } catch (error) {
                // Expected due to process.exit mock
            }

            expect(mockLogger.error).toHaveBeenCalledWith('Seeder script failed:', connectionError);
            expect(exitSpy).toHaveBeenCalledWith(1);
        });
    });

    describe('data validation', () => {
        it('should contain valid sample cars data structure', async () => {
            await DataSeeder.seedCars();
            
            const carsData = mockCar.insertMany.mock.calls[0][0];
            
            expect(Array.isArray(carsData)).toBe(true);
            expect(carsData.length).toBeGreaterThan(0);
            
            carsData.forEach((car: any) => {
                expect(car).toHaveProperty('id');
                expect(car).toHaveProperty('make');
                expect(car).toHaveProperty('model');
                expect(car).toHaveProperty('year');
                expect(car).toHaveProperty('price');
                expect(car).toHaveProperty('fuel_type');
                expect(car).toHaveProperty('transmission');
                expect(car).toHaveProperty('isAvailable');
                expect(['gas', 'diesel', 'electricity', 'hybrid']).toContain(car.fuel_type);
                expect(['a', 'm']).toContain(car.transmission);
            });
        });

        it('should contain valid sample users data structure', async () => {
            await DataSeeder.seedUsers();
            
            const usersData = mockUser.insertMany.mock.calls[0][0];
            
            expect(Array.isArray(usersData)).toBe(true);
            expect(usersData.length).toBeGreaterThan(0);
            
            usersData.forEach((user: any) => {
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('password');
                expect(user).toHaveProperty('role');
                expect(['admin', 'user']).toContain(user.role);
                expect(user.password).toBe('hashedPassword123'); // Mocked hash
            });
        });
    });

    describe('error edge cases', () => {
        it('should handle Promise.all rejection in clearAll', async () => {
            const error = new Error('Promise.all failed');
            mockCar.deleteMany.mockRejectedValue(error);

            await expect(DataSeeder.clearAll()).rejects.toThrow('Promise.all failed');
        });

        it('should handle partial failures in user password hashing', async () => {
            mockHashPassword
                .mockResolvedValueOnce('hash1')
                .mockRejectedValueOnce(new Error('Hash failed'))
                .mockResolvedValueOnce('hash3');

            await expect(DataSeeder.seedUsers()).rejects.toThrow('Hash failed');
        });
    });
});
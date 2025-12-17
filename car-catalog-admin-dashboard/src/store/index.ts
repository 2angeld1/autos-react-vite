// Export all stores
export { useAuthStore } from './authSlice';
export { useCarsStore } from './carsSlice';
export { useUsersStore } from './usersSlice';

// Re-export types for convenience
export type { Car, User, CarFilters, UserFilters } from '@/types';
export type { DashboardStats, ApiResponse, PaginatedResponse } from '@/types';

// Import types for internal use
import type { Car, User } from '@/types';
// Import stores for internal use
import { useCarsStore } from './carsSlice';
import { useUsersStore } from './usersSlice';
import { useAuthStore } from './authSlice';

// Store utilities
export const resetAllStores = () => {
  // This function can be used to reset all stores when logging out
  useAuthStore.getState().reset();
  useCarsStore.getState().reset();
  useUsersStore.getState().reset();
};

// Store selectors for commonly used data
export const useCarStats = () => {
  const { cars, totalCars, loading } = useCarsStore();
  
  const availableCars = cars.filter((car: Car) => car.isAvailable).length;
  const unavailableCars = totalCars - availableCars;
  
  const byFuelType = cars.reduce((acc: Record<string, number>, car: Car) => {
    const fuelType = car.fuel_type || 'unknown';
    acc[fuelType] = (acc[fuelType] || 0) + 1;
    return acc;
  }, {});
  
  const byMake = cars.reduce((acc: Record<string, number>, car: Car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {});
  
  const averagePrice = cars.length > 0 
    ? cars.reduce((sum: number, car: Car) => sum + car.price, 0) / cars.length 
    : 0;

  return {
    total: totalCars,
    available: availableCars,
    unavailable: unavailableCars,
    byFuelType,
    byMake,
    averagePrice,
    loading,
  };
};

export const useUserStats = () => {
  const { users, totalUsers, loading } = useUsersStore();
  
  const activeUsers = users.filter((user: User) => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const admins = users.filter((user: User) => user.role === 'admin').length;
  const regularUsers = totalUsers - admins;
  
  return {
    total: totalUsers,
    active: activeUsers,
    inactive: inactiveUsers,
    admins,
    users: regularUsers,
    loading,
  };
};

// Combined dashboard stats
export const useDashboardStats = () => {
  const carStats = useCarStats();
  const userStats = useUserStats();
  const { cars } = useCarsStore();
  const { users } = useUsersStore();
  
  // Recent cars (last 5)
  const recentCars = cars
    .sort((a: Car, b: Car) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);
  
  // Recent users (last 5)
  const recentUsers = users
    .sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalCars: carStats.total,
    totalUsers: userStats.total,
    activeCars: carStats.available,
    activeUsers: userStats.active,
    recentCars,
    recentUsers,
    loading: carStats.loading || userStats.loading,
  };
};
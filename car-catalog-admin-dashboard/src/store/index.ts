// Export all stores
export { useAuthStore } from './authSlice';
export { useCarsStore } from './carsSlice';
export { useUsersStore } from './usersSlice';

// Re-export types for convenience
export type {
  Car,
  User,
  CarFilters,
  UserFilters,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// Store utilities
export const resetAllStores = () => {
  // This function can be used to reset all stores when logging out
  const { reset: resetAuth } = useAuthStore.getState();
  const { reset: resetCars } = useCarsStore.getState();
  const { reset: resetUsers } = useUsersStore.getState();

  resetAuth();
  resetCars();
  resetUsers();
};

// Store selectors for commonly used data
export const useCarStats = () => {
  const { cars, totalCars, loading } = useCarsStore();
  
  const availableCars = cars.filter(car => car.isAvailable).length;
  const unavailableCars = totalCars - availableCars;
  
  const byFuelType = cars.reduce((acc, car) => {
    acc[car.fuel_type] = (acc[car.fuel_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byMake = cars.reduce((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const averagePrice = cars.length > 0 
    ? cars.reduce((sum, car) => sum + car.price, 0) / cars.length 
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
  
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const admins = users.filter(user => user.role === 'admin').length;
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
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Recent users (last 5)
  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
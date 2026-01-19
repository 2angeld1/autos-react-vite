import { 
  fetchCars, 
  fetchCarById, 
  fetchFeaturedCars,
  searchCars,
  fetchSimilarCars,
  fetchMakes,
  fetchModelsByMake,
  fetchCarStats,
  // Legacy exports
  filterModernCars,
  enhanceCarWithImage,
  clearCarCache,
  clearAllCaches,
  getCacheStats
} from './carService';

// Import backend API client and services
export { backendApi } from './backendApi';
export { authService } from './authService';
export { backendCarService } from './backendCarService';
export { quoteService } from './quoteService';

// Re-export all car service functions
export {
  // Main API functions
  fetchCars,
  fetchCarById,
  fetchFeaturedCars,
  searchCars,
  fetchSimilarCars,
  fetchMakes,
  fetchModelsByMake,
  fetchCarStats,
  // Legacy (deprecated)
  filterModernCars,
  enhanceCarWithImage,
  clearCarCache,
  clearAllCaches,
  getCacheStats
};
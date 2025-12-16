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
import { 
  fetchCars, 
  fetchCarById, 
  fetchFeaturedCars,
  searchCars,
  fetchSimilarCars,
  fetchMakes,
  fetchModelsByMake,
  fetchCarStats
} from './carService';

// Import backend API client and services
export { backendApi } from './backendApi';
export { authService } from './authService';
export { backendCarService } from './backendCarService';
export { quoteService } from './quoteService';
export { promotionService } from './promotionService';

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
  fetchCarStats
};
import { enhanceCarWithImage, filterModernCars } from './carService'; 
import { fetchCars, fetchCarById, searchCars } from './carService';
import { getHighResCarImage } from './imageService';
import { getDefaultCarImage } from './carBrands';

// ✅ Exportar todas las funciones necesarias
export {
  // Car services
  enhanceCarWithImage,
  filterModernCars, // ✅ AGREGADO
  
  // Fetching functions
  fetchCars,
  fetchCarById, // ✅ AGREGADO
  searchCars,
  
  // Image functions
  getHighResCarImage,
  getDefaultCarImage
};
/**
 * Car Service - Simplified version using internal backend API
 * 
 * This service fetches car data exclusively from our own backend API
 * running at VITE_API_URL (default: http://localhost:5000/api)
 */

import type { Car, SearchFilters } from '@/types';

// Base URL for our backend API
const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

/**
 * Helper to normalize car data from backend
 * Backend uses 'carModel' internally but transforms to 'model' in toJSON
 * This ensures we always have 'model' available
 */
const normalizeCar = (car: any): Car => {
  return {
    ...car,
    id: car.id || car._id,
    model: car.model || car.carModel || '',
  };
};

/**
 * Fetch all cars with optional filters and pagination
 */
export const fetchCars = async (limit?: number): Promise<Car[]> => {
  const base = getApiUrl();
  
  try {
    const url = `${base}/cars${typeof limit === 'number' ? `?limit=${limit}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // Backend returns { success: boolean, data: Car[], pagination: {...} }
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map(normalizeCar);
    }
    
    // Fallback if backend returns array directly
    if (Array.isArray(json)) {
      return json.map(normalizeCar);
    }
    
    console.warn('Unexpected response format from /cars:', json);
    return [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

/**
 * Fetch a single car by ID
 */
export const fetchCarById = async (id: string): Promise<Car | null> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Car with ID ${id} not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // Backend returns { success: boolean, data: Car }
    if (json?.success && json.data) {
      return normalizeCar(json.data);
    }
    
    // Fallback if backend returns car directly
    if (json && json.make && (json.model || json.carModel)) {
      return normalizeCar(json);
    }
    
    console.warn(`Unexpected response format for car ${id}:`, json);
    return null;
  } catch (error) {
    console.error(`Error fetching car ${id}:`, error);
    return null;
  }
};

/**
 * Fetch featured cars (recent or highlighted)
 */
export const fetchFeaturedCars = async (limit: number = 8): Promise<Car[]> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/featured?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map(normalizeCar);
    }
    
    if (Array.isArray(json)) {
      return json.map(normalizeCar);
    }
    
    // Fallback to regular fetchCars if featured endpoint fails
    console.warn('Featured endpoint failed, falling back to regular cars');
    return fetchCars();
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    // Fallback to regular cars
    return fetchCars();
  }
};

/**
 * Search cars with filters
 */
export const searchCars = async (filters: SearchFilters): Promise<Car[]> => {
  const base = getApiUrl();
  
  try {
    // Build query params
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.set('search', filters.searchTerm);
    }
    
    if (filters.year) {
      params.set('year', filters.year);
    }
    
    const url = `${base}/cars/search?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      // Fallback to regular cars endpoint with filters
      const fallbackParams = new URLSearchParams();
      if (filters.searchTerm) {
        // Try to parse make/model from search term
        const term = filters.searchTerm.toLowerCase();
        fallbackParams.set('make', term.split(' ')[0] || '');
      }
      if (filters.year) {
        fallbackParams.set('year', filters.year);
      }
      
      const fallbackResponse = await fetch(`${base}/cars?${fallbackParams.toString()}`);
      const fallbackJson = await fallbackResponse.json();
      
      if (fallbackJson?.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data.map(normalizeCar);
      }
      
      return [];
    }
    
    const json = await response.json();
    
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map(normalizeCar);
    }
    
    if (Array.isArray(json)) {
      return json.map(normalizeCar);
    }
    
    return [];
  } catch (error) {
    console.error('Error searching cars:', error);
    return [];
  }
};

/**
 * Get similar cars to a given car
 */
export const fetchSimilarCars = async (carId: string, limit: number = 4): Promise<Car[]> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/${encodeURIComponent(carId)}/similar?limit=${limit}`);
    
    if (!response.ok) {
      return [];
    }
    
    const json = await response.json();
    
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map(normalizeCar);
    }
    
    if (Array.isArray(json)) {
      return json.map(normalizeCar);
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching similar cars for ${carId}:`, error);
    return [];
  }
};

/**
 * Get available car makes
 */
export const fetchMakes = async (): Promise<string[]> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/makes`);
    
    if (!response.ok) {
      return [];
    }
    
    const json = await response.json();
    
    if (json?.success && Array.isArray(json.data)) {
      return json.data;
    }
    
    if (Array.isArray(json)) {
      return json;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching makes:', error);
    return [];
  }
};

/**
 * Get models for a specific make
 */
export const fetchModelsByMake = async (make: string): Promise<string[]> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/makes/${encodeURIComponent(make)}/models`);
    
    if (!response.ok) {
      return [];
    }
    
    const json = await response.json();
    
    if (json?.success && Array.isArray(json.data)) {
      return json.data;
    }
    
    if (Array.isArray(json)) {
      return json;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching models for ${make}:`, error);
    return [];
  }
};

/**
 * Get car statistics
 */
export const fetchCarStats = async (): Promise<any> => {
  const base = getApiUrl();
  
  try {
    const response = await fetch(`${base}/cars/stats`);
    
    if (!response.ok) {
      return null;
    }
    
    const json = await response.json();
    
    if (json?.success) {
      return json.data || json;
    }
    
    return json;
  } catch (error) {
    console.error('Error fetching car stats:', error);
    return null;
  }
};

// ============================================
// Legacy exports for backward compatibility
// ============================================

/**
 * @deprecated Use fetchCars instead
 */
export const filterModernCars = (cars: Car[]): Car[] => cars;

/**
 * @deprecated No longer needed - backend handles image URLs
 */
export const enhanceCarWithImage = async (car: Car): Promise<Car> => car;

/**
 * @deprecated Cache is now handled by the browser/backend
 */
export const clearCarCache = (): void => {
  console.log('Cache cleared (no-op - handled by browser)');
};

/**
 * @deprecated Cache is now handled by the browser/backend
 */
export const clearAllCaches = (): void => {
  console.log('All caches cleared (no-op - handled by browser)');
};

/**
 * @deprecated No longer tracking cache stats
 */
export const getCacheStats = () => ({
  carCacheSize: 0,
  hasCache: false
});

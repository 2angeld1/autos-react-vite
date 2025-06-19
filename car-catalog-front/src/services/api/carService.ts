import { 
  setCarsInCache, 
  getCarsFromCache,
  isReliableImageUrl,
  saveImageCache,
  imageCache,
  hasImageRequestFailed,
  markImageRequestAsFailed,
  clearAllImageCaches
} from './cache';
import { getCarImageFromGoogle } from './imageService';
import { getDefaultCarImage } from './carBrands';
import { generateStableId } from './utils';
import { carApiClient } from './config'; // ✅ Quitar CAR_API_URL no usado
import type { Car, SearchFilters } from '@/types';

// ✅ CORREGIDO: Agregar id opcional a ApiCarData
interface ApiCarData {
  id?: string; // ✅ AGREGADO
  make?: string;
  model?: string;
  year?: number;
  class?: string;
  cylinders?: number;
  displacement?: number;
  fuel_type?: string;
  transmission?: string;
  highway_mpg?: number;
  city_mpg?: number;
  combination_mpg?: number;
  price?: number;
  image?: string;
  description?: string;
}

// ✅ ACTUALIZADO: Datos de respaldo con IDs incluidos
const getFallbackCarData = (): ApiCarData[] => {
  return [
    // Toyota
    {
      id: 'fallback-toyota-1',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      class: 'midsize sedan',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 32,
      city_mpg: 28,
      combination_mpg: 30,
      price: 28500,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Toyota Camry 2024 sedan de tamaño mediano con motor de gasolina.'
    },
    {
      id: 'fallback-toyota-2',
      make: 'Toyota',
      model: 'RAV4',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 30,
      city_mpg: 27,
      combination_mpg: 28,
      price: 32900,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Toyota RAV4 2024 SUV compacto con tracción integral.'
    },
    {
      id: 'fallback-toyota-3',
      make: 'Toyota',
      model: 'Corolla',
      year: 2024,
      class: 'compact sedan',
      cylinders: 4,
      displacement: 2.0,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 35,
      city_mpg: 31,
      combination_mpg: 33,
      price: 24200,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Toyota Corolla 2024 sedan compacto y eficiente.'
    },

    // Kia
    {
      id: 'fallback-kia-1',
      make: 'Kia',
      model: 'Sportage',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 2.4,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 28,
      city_mpg: 23,
      combination_mpg: 25,
      price: 28900,
      image: 'https://images.unsplash.com/photo-1558383817-dd10c33e799f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Kia Sportage 2024 SUV compacto con diseño moderno.'
    },
    {
      id: 'fallback-kia-2',
      make: 'Kia',
      model: 'Forte',
      year: 2024,
      class: 'compact sedan',
      cylinders: 4,
      displacement: 2.0,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 35,
      city_mpg: 27,
      combination_mpg: 31,
      price: 21900,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Kia Forte 2024 sedan compacto con gran valor.'
    },
    {
      id: 'fallback-kia-3',
      make: 'Kia',
      model: 'Telluride',
      year: 2024,
      class: 'midsize suv',
      cylinders: 6,
      displacement: 3.8,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 26,
      city_mpg: 20,
      combination_mpg: 23,
      price: 38900,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Kia Telluride 2024 SUV familiar de lujo.'
    },

    // Hyundai
    {
      id: 'fallback-hyundai-1',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 29,
      city_mpg: 24,
      combination_mpg: 26,
      price: 26900,
      image: 'https://images.unsplash.com/photo-1629293363663-08de80df7b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Hyundai Tucson 2024 SUV compacto con tecnología avanzada.'
    },
    {
      id: 'fallback-hyundai-2',
      make: 'Hyundai',
      model: 'Elantra',
      year: 2024,
      class: 'compact sedan',
      cylinders: 4,
      displacement: 2.0,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 38,
      city_mpg: 33,
      combination_mpg: 35,
      price: 22400,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Hyundai Elantra 2024 sedan compacto y eficiente.'
    },
    {
      id: 'fallback-hyundai-3',
      make: 'Hyundai',
      model: 'Santa Fe',
      year: 2024,
      class: 'midsize suv',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 28,
      city_mpg: 25,
      combination_mpg: 26,
      price: 34200,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Hyundai Santa Fe 2024 SUV familiar espacioso.'
    },

    // Tesla
    {
      id: 'fallback-tesla-1',
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      class: 'luxury sedan',
      cylinders: 0,
      displacement: 0,
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 134,
      city_mpg: 141,
      combination_mpg: 138,
      price: 42500,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Tesla Model 3 2024 sedán eléctrico de lujo.'
    },
    {
      id: 'fallback-tesla-2',
      make: 'Tesla',
      model: 'Model Y',
      year: 2024,
      class: 'luxury suv',
      cylinders: 0,
      displacement: 0,
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 122,
      city_mpg: 131,
      combination_mpg: 126,
      price: 54900,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Tesla Model Y 2024 SUV eléctrico de alto rendimiento.'
    },
    {
      id: 'fallback-tesla-3',
      make: 'Tesla',
      model: 'Model S',
      year: 2024,
      class: 'luxury sedan',
      cylinders: 0,
      displacement: 0,
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 120,
      city_mpg: 124,
      combination_mpg: 122,
      price: 89900,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Tesla Model S 2024 sedán eléctrico de lujo premium.'
    },

    // Nissan
    {
      id: 'fallback-nissan-1',
      make: 'Nissan',
      model: 'Frontier',
      year: 2024,
      class: 'compact pickup',
      cylinders: 6,
      displacement: 3.8,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 24,
      city_mpg: 18,
      combination_mpg: 21,
      price: 32900,
      image: 'https://images.unsplash.com/photo-1606016829667-c9f7ff88b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Nissan Frontier 2024 pickup compacta robusta y confiable.'
    },
    {
      id: 'fallback-nissan-2',
      make: 'Nissan',
      model: 'Pathfinder',
      year: 2024,
      class: 'midsize suv',
      cylinders: 6,
      displacement: 3.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 28,
      city_mpg: 23,
      combination_mpg: 25,
      price: 38900,
      image: 'https://images.unsplash.com/photo-1606016829667-c9f7ff88b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Nissan Pathfinder 2024 SUV familiar de tres filas.'
    },
    {
      id: 'fallback-nissan-3',
      make: 'Nissan',
      model: 'Altima',
      year: 2024,
      class: 'midsize sedan',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 32,
      city_mpg: 28,
      combination_mpg: 30,
      price: 26900,
      image: 'https://images.unsplash.com/photo-1606016829667-c9f7ff88b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Nissan Altima 2024 sedán mediano con tecnología avanzada.'
    },

    // Chevrolet
    {
      id: 'fallback-chevrolet-1',
      make: 'Chevrolet',
      model: 'Equinox',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 1.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 31,
      city_mpg: 26,
      combination_mpg: 28,
      price: 27900,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Chevrolet Equinox 2024 SUV compacto moderno y eficiente.'
    },
    {
      id: 'fallback-chevrolet-2',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2024,
      class: 'midsize sedan',
      cylinders: 4,
      displacement: 1.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 36,
      city_mpg: 29,
      combination_mpg: 32,
      price: 25900,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Chevrolet Malibu 2024 sedán mediano con tecnología avanzada.'
    },
    {
      id: 'fallback-chevrolet-3',
      make: 'Chevrolet',
      model: 'Tahoe',
      year: 2024,
      class: 'large suv',
      cylinders: 8,
      displacement: 5.3,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 23,
      city_mpg: 16,
      combination_mpg: 19,
      price: 58900,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Chevrolet Tahoe 2024 SUV grande familiar con gran capacidad.'
    },

    // Mitsubishi
    {
      id: 'fallback-mitsubishi-1',
      make: 'Mitsubishi',
      model: 'Outlander',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 2.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 30,
      city_mpg: 24,
      combination_mpg: 27,
      price: 34900,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Mitsubishi Outlander 2024 SUV compacto con garantía extendida.'
    },
    {
      id: 'fallback-mitsubishi-2',
      make: 'Mitsubishi',
      model: 'Eclipse Cross',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 1.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 28,
      city_mpg: 25,
      combination_mpg: 26,
      price: 26900,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Mitsubishi Eclipse Cross 2024 SUV compacto con diseño distintivo.'
    },
    {
      id: 'fallback-mitsubishi-3',
      make: 'Mitsubishi',
      model: 'Mirage',
      year: 2024,
      class: 'subcompact sedan',
      cylinders: 3,
      displacement: 1.2,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 41,
      city_mpg: 36,
      combination_mpg: 38,
      price: 16900,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Mitsubishi Mirage 2024 sedán subcompacto económico y eficiente.'
    },

    // Geely
    {
      id: 'fallback-geely-1',
      make: 'Geely',
      model: 'Coolray',
      year: 2024,
      class: 'compact suv',
      cylinders: 3,
      displacement: 1.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 35,
      city_mpg: 28,
      combination_mpg: 31,
      price: 22900,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Geely Coolray 2024 SUV compacto con motor turbo.'
    },
    {
      id: 'fallback-geely-2',
      make: 'Geely',
      model: 'Emgrand',
      year: 2024,
      class: 'compact sedan',
      cylinders: 4,
      displacement: 1.5,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 38,
      city_mpg: 30,
      combination_mpg: 34,
      price: 18900,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Geely Emgrand 2024 sedán compacto económico.'
    },
    {
      id: 'fallback-geely-3',
      make: 'Geely',
      model: 'Atlas',
      year: 2024,
      class: 'midsize suv',
      cylinders: 4,
      displacement: 2.0,
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 30,
      city_mpg: 24,
      combination_mpg: 27,
      price: 28900,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Geely Atlas 2024 SUV familiar espacioso.'
    }
  ];
};

// ✅ ACTUALIZADO: Configuración con 2 autos por marca
const API_CONFIG = {
  FEATURED_MAKES: [
    'toyota', 'kia', 'hyundai', 'nissan'
  ] as const,
  AMERICAN_MAKES: [
    'chevrolet'
  ] as const,
  JAPANESE_MAKES: [
    'nissan', 'mitsubishi'
  ] as const,
  OTHER_MAKES: [
    'tesla', 'geely'
  ] as const,
  CARS_PER_MAKE: 2,
  MAX_REQUESTS_PER_BATCH: 3,
  DELAY_BETWEEN_REQUESTS: 1500
};

// ✅ FUNCIÓN PARA OBTENER AUTOS DE LA API
const fetchCarsFromApi = async (make: string, limit: number = 10): Promise<ApiCarData[]> => {
  try {
    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    const apiUrl = import.meta.env.VITE_NINJA_API_URL;
    
    if (!apiKey || !apiUrl) {
      console.warn(`⚠️ API no configurada para ${make}`);
      return getFallbackDataForMake(make, limit);
    }

    // ✅ CORREGIDO: Solo make, sin limit
    const params: Record<string, string> = { 
      make: make.toLowerCase()
    };
        
    const response = await carApiClient.get(apiUrl, {
      params,
      timeout: 8000,
      headers: { 'X-Api-Key': apiKey }
    });
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ API devolvió ${response.data.length} resultados para ${make} (versión gratuita)`);
      // Limitar en el cliente
      return response.data.slice(0, limit);
    } else {
      console.warn(`⚠️ API no devolvió datos válidos para ${make}`);
      return getFallbackDataForMake(make, limit);
    }
    
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 400) {
        console.warn(`⚠️ Error 400 para ${make}: Parámetros no válidos en versión gratuita`);
      } else if (axiosError.response?.status === 403) {
        console.warn(`⚠️ Error 403 para ${make}: Límite de API alcanzado`);
      } else {
        console.error(`❌ API request failed for ${make}:`, error);
      }
    } else {
      console.error(`❌ API request failed for ${make}:`, error);
    }
    
    return getFallbackDataForMake(make, limit);
  }
};

// Helper para obtener datos de fallback filtrados por marca
const getFallbackDataForMake = (make: string, limit: number): ApiCarData[] => {
  const allFallbackData = getFallbackCarData();
  const makeData = allFallbackData.filter(car => 
    car.make?.toLowerCase() === make.toLowerCase()
  );
  
  return makeData.slice(0, limit);
};

// ✅ FUNCIÓN FILTERMODERNCAR AGREGADA
export const filterModernCars = (cars: Car[]): Car[] => {
  return cars.filter(car => {
    // ✅ CAMBIAR: Permitir autos desde 2015 en lugar de 2020
    if (car.year < 2015) return false;
    if (!car.make || !car.model) return false;
    if (!car.price || car.price < 10000 || car.price > 200000) return false;
    
    const problematicModels = ['insight', 'fit', 'spark'];
    if (problematicModels.includes(car.model.toLowerCase())) return false;
    
    return true;
  });
};
const modernizeOldCar = (car: Car): Car => {
  let modernYear = car.year;
  
  // Si el auto es muy antiguo, actualizarlo a una versión moderna
  if (car.year < 2015) {
    // Asignar años modernos basados en la marca
    const modernYears = [2020, 2021, 2022, 2023, 2024];
    const yearIndex = Math.abs(car.make.charCodeAt(0) + car.model.charCodeAt(0)) % modernYears.length;
    modernYear = modernYears[yearIndex];
    
    console.log(`🔄 Modernizando ${car.make} ${car.model} de ${car.year} a ${modernYear}`);
  }
  
  return {
    ...car,
    year: modernYear,
    price: car.price && car.price > 15000 ? car.price : generateRealisticPrice(car as ApiCarData)
  };
};
// ✅ FUNCIÓN FETCHCARBYID AGREGADA
export const fetchCarById = async (id: string): Promise<Car | null> => {
  try {
    console.log(`🔍 Buscando auto con ID: ${id}`);
    
    // 1. Buscar en cache principal
    const cachedCars = getCarsFromCache();
    const cachedCar = cachedCars.find(car => car.id === id);
    
    if (cachedCar) {
      console.log(`✅ Auto encontrado en cache principal: ${cachedCar.make} ${cachedCar.model}`);
      return cachedCar;
    }
    
    // 2. ✅ NUEVO: Buscar en cache de resultados de búsqueda
    const searchResults = getSearchResultsFromCache();
    const searchCar = searchResults.find(car => car.id === id);
    
    if (searchCar) {
      console.log(`✅ Auto encontrado en resultados de búsqueda: ${searchCar.make} ${searchCar.model}`);
      return searchCar;
    }
    
    // 3. Buscar en datos de fallback
    const fallbackData = getFallbackCarData();
    const fallbackCar = fallbackData.find(car => car.id === id);
    
    if (fallbackCar) {
      console.log(`✅ Auto encontrado en fallback: ${fallbackCar.make} ${fallbackCar.model}`);
      const processedCar = processCarData(fallbackCar as ApiCarData, 0);
      if (processedCar) {
        const enhancedCar = await enhanceCarWithImage(processedCar, 0);
        return enhancedCar;
      }
    }
    
    console.warn(`⚠️ Auto con ID ${id} no encontrado en ninguna fuente`);
    return null;
    
  } catch (error: unknown) {
    console.error(`❌ Error buscando auto con ID ${id}:`, error);
    return null;
  }
};

// ✅ CORREGIR: Función processCarData con tipado correcto
const processCarData = (carData: ApiCarData, index: number): Car | null => {
  try {
    if (!carData.make || !carData.model) {
      console.warn(`❌ Datos de auto inválidos en índice ${index}:`, carData);
      return null;
    }
    
    const processedCar: Car = {
      id: generateStableId(carData, index),
      make: String(carData.make),
      model: String(carData.model),
      year: Number(carData.year) || new Date().getFullYear(),
      price: Number(carData.price) || generateRealisticPrice(carData),
      image: String(carData.image || ''),
      description: String(carData.description || ''),
      fuel_type: String(carData.fuel_type || 'gas'),
      transmission: String(carData.transmission || 'a'),
      cylinders: Number(carData.cylinders) || 4,
      class: String(carData.class || 'sedan'),
      displacement: Number(carData.displacement) || 2.0,
      city_mpg: Number(carData.city_mpg) || 25,
      highway_mpg: Number(carData.highway_mpg) || 32,
      combination_mpg: Number(carData.combination_mpg) || 28
    };
    
    return processedCar;
    
  } catch (error) {
    console.error(`❌ Error procesando auto en índice ${index}:`, error);
    return null;
  }
};

// ✅ MEJORAR generateRealisticPrice - FUNCIÓN ÚNICA
const generateRealisticPrice = (carData: ApiCarData): number => {
  try {
    const make = carData.make?.toLowerCase() || '';
    const carClass = carData.class?.toLowerCase() || '';
    const fuelType = carData.fuel_type?.toLowerCase() || 'gas';
    const cylinders = carData.cylinders || 4;
    
    let basePrice = 25000;
    
    if (carClass.includes('subcompact')) {
      basePrice = 18000;
    } else if (carClass.includes('compact')) {
      basePrice = 22000;
    } else if (carClass.includes('midsize')) {
      basePrice = 28000;
    } else if (carClass.includes('large') || carClass.includes('full-size')) {
      basePrice = 35000;
    } else if (carClass.includes('luxury')) {
      basePrice = 45000;
    } else if (carClass.includes('suv')) {
      basePrice = 32000;
    } else if (carClass.includes('pickup')) {
      basePrice = 40000;
    }
    
    let brandMultiplier = 1.0;
    const luxuryBrands = ['mercedes', 'bmw', 'audi', 'lexus', 'acura', 'infiniti', 'tesla'];
    const premiumBrands = ['toyota', 'honda', 'nissan', 'mazda'];
    const valueBrands = ['kia', 'hyundai', 'mitsubishi'];
    const electricBrands = ['tesla', 'byd', 'nio'];
    
    if (luxuryBrands.includes(make)) {
      brandMultiplier = 1.6;
    } else if (electricBrands.includes(make) && fuelType === 'electricity') {
      brandMultiplier = 1.4;
    } else if (premiumBrands.includes(make)) {
      brandMultiplier = 1.2;
    } else if (valueBrands.includes(make)) {
      brandMultiplier = 0.85;
    } else if (['chevrolet', 'ford', 'dodge'].includes(make)) {
      brandMultiplier = 1.1;
    }
    
    if (fuelType === 'electricity') {
      basePrice *= 1.3;
    } else if (fuelType.includes('hybrid')) {
      basePrice *= 1.15;
    }
    
    if (cylinders >= 8) {
      basePrice *= 1.25;
    } else if (cylinders === 6) {
      basePrice *= 1.1;
    }
    
    basePrice *= brandMultiplier;
    
    const variation = 0.95 + (Math.random() * 0.1);
    basePrice *= variation;
    
    const finalPrice = Math.round(basePrice / 100) * 100;
    
    return Math.max(15000, Math.min(200000, finalPrice));
    
  } catch (error) {
    console.warn('⚠️ Error generando precio realista:', error);
    return 25000;
  }
};

// ✅ MODIFICADA: Función principal
export const fetchCars = async (limit: number = 24): Promise<Car[]> => {
  
  const { clearUnsplashCache } = await import('./cache');
  clearUnsplashCache();
  
  try {
    const currentCache = getCarsFromCache();
    if (currentCache.length > 0 && currentCache.length >= Math.min(limit, 15)) {
      return currentCache.slice(0, limit);
    }

    try {
      const savedCache = localStorage.getItem('carCatalogCache');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        if (Array.isArray(parsedCache) && parsedCache.length >= Math.min(limit, 15)) {
          setCarsInCache(parsedCache);
          return parsedCache.slice(0, limit);
        }
      }
    } catch (cacheError) {
      console.warn('⚠️ Error loading from localStorage:', cacheError);
    }
        
    const allCars: Car[] = [];

    const primaryMakes = ['toyota', 'kia', 'hyundai'];
    for (const make of primaryMakes) {
      try {
        const apiCars = await fetchCarsFromApi(make, API_CONFIG.CARS_PER_MAKE);
        
        if (apiCars.length > 0) {
          
          const processedCars = apiCars
            .map((carData, index) => processCarData(carData, index))
            .filter((car): car is Car => car !== null);
          
          const enhancedCars = await Promise.all(
            processedCars.map(async (car, index) => {
              try {
                return await enhanceCarWithImage(car, index);
              } catch (error) {
                console.warn(`⚠️ Error enhancing ${car.make} ${car.model}:`, error);
                return car;
              }
            })
          );
          
          const validCars = enhancedCars.filter((car): car is Car => car !== null);
          allCars.push(...validCars);
        }
        
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.DELAY_BETWEEN_REQUESTS));
      } catch (error) {
        console.error(`❌ Failed to fetch ${make} from API:`, error);
      }
    }

    const additionalMakes = ['tesla', 'nissan', 'chevrolet', 'mitsubishi'];
    for (const make of additionalMakes) {
      try {
        const apiCars = await fetchCarsFromApi(make, API_CONFIG.CARS_PER_MAKE);
        
        if (apiCars.length > 0) {
          const processedCars = apiCars
            .map((carData, index) => processCarData(carData, index))
            .filter((car): car is Car => car !== null);
          
          const enhancedCars = await Promise.all(
            processedCars.map(async (car, index) => {
              try {
                return await enhanceCarWithImage(car, index);
              } catch (error) {
                console.warn(`⚠️ Error enhancing ${car.make} ${car.model}:`, error);
                return car;
              }
            })
          );
          
          const validCars = enhancedCars.filter((car): car is Car => car !== null);
          allCars.push(...validCars);
        }
        
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.DELAY_BETWEEN_REQUESTS));
      } catch (error) {
        console.error(`❌ Failed to fetch ${make} from API:`, error);
      }
    }

    const fallbackData = getFallbackCarData();
    
    const allFeaturedMakes = ['toyota', 'kia', 'hyundai', 'tesla', 'geely', 'nissan', 'chevrolet', 'mitsubishi'];
    
    for (const targetMake of allFeaturedMakes) {
      const currentCount = allCars.filter(car => 
        car.make.toLowerCase() === targetMake.toLowerCase()
      ).length;
      
      if (currentCount < API_CONFIG.CARS_PER_MAKE) {
        const needed = API_CONFIG.CARS_PER_MAKE - currentCount;
        const fallbackCars = fallbackData
          .filter(car => car.make?.toLowerCase() === targetMake.toLowerCase())
          .slice(0, needed);
                
        const processedFallback = fallbackCars
          .map((carData, index) => processCarData(carData as ApiCarData, index))
          .filter((car): car is Car => car !== null);
        
        allCars.push(...processedFallback);
      }
    }

    const modernCars = filterModernCars(allCars);
    
    const finalCars = modernCars.slice(0, limit);
    
    const makesCounts: Record<string, number> = {};
    finalCars.forEach(car => {
      makesCounts[car.make] = (makesCounts[car.make] || 0) + 1;
    });
        
    setCarsInCache(finalCars);
    localStorage.setItem('carCatalogCache', JSON.stringify(finalCars));
    
    return finalCars;

  } catch (error) {
    console.error('❌ Error crítico en fetchCars:', error);
    
    const fallbackData = getFallbackCarData();
    const enhancedFallback = await Promise.all(
      fallbackData.slice(0, limit).map(async (carData, index) => {
        try {
          const processedCar = processCarData(carData as ApiCarData, index);
          if (!processedCar) return null;
          
          return await enhanceCarWithImage(processedCar, index);
        } catch (error) {
          console.warn(`⚠️ Error processing fallback car ${index}:`, error);
          return null;
        }
      })
    );
    
    const validFallback = enhancedFallback.filter((car): car is Car => car !== null);
    const modernFallback = filterModernCars(validFallback);
    
    setCarsInCache(modernFallback);
    localStorage.setItem('carCatalogCache', JSON.stringify(modernFallback));
    
    return modernFallback;
  }
};

// ✅ Limpiar funciones de cache
export const clearCarCache = (): void => {
  setCarsInCache([]);
};

export const getCacheStats = () => {
  const cars = getCarsFromCache();
  return {
    carCacheSize: cars.length,
    hasCache: cars.length > 0
  };
};

export const enhanceCarWithImage = async (car: Car, index: number): Promise<Car | null> => {
  if (!car || !car.make || !car.model) {
    console.warn('❌ Invalid car data:', car);
    return null;
  }

  try {
    // ✅ MODERNIZAR auto si es muy antiguo
    const modernizedCar = modernizeOldCar(car);
    
    const mpgData = simulatePremiumFields(modernizedCar as ApiCarData);
    const stableId = generateStableId(modernizedCar, index);
    
    let imageUrl = modernizedCar.image;
    const needsNewImage = !imageUrl || 
                         !isReliableImageUrl(imageUrl) ||
                         imageUrl.includes('unsplash.com') ||
                         imageUrl.includes('placeholder');
    
    if (needsNewImage) {
      const cacheKey = `${modernizedCar.make.toLowerCase()}-${modernizedCar.model.toLowerCase()}-${modernizedCar.year || 'unknown'}-v4`;
      
      if (imageCache[cacheKey] && isReliableImageUrl(imageCache[cacheKey])) {
        imageUrl = imageCache[cacheKey];
      } else if (!hasImageRequestFailed(cacheKey)) {
        try {
          const googleImage = await getCarImageFromGoogle(modernizedCar.make, modernizedCar.model, modernizedCar.year);
          
          if (googleImage && isReliableImageUrl(googleImage)) {
            imageUrl = googleImage;
            saveImageCache(cacheKey, googleImage, getDefaultCarImage);
          } else {
            imageUrl = getDefaultCarImage(modernizedCar.make);
            markImageRequestAsFailed(cacheKey);
          }
        } catch (imageError: unknown) {
          console.warn(`⚠️ Error fetching image for ${modernizedCar.make} ${modernizedCar.model}:`, imageError);
          imageUrl = getDefaultCarImage(modernizedCar.make);
          markImageRequestAsFailed(cacheKey);
        }
      } else {
        imageUrl = getDefaultCarImage(modernizedCar.make);
      }
    }

    const enhancedCar: Car = {
      ...modernizedCar,
      id: stableId,
      image: imageUrl,
      city_mpg: modernizedCar.city_mpg || mpgData.city_mpg,
      highway_mpg: modernizedCar.highway_mpg || mpgData.highway_mpg,
      combination_mpg: modernizedCar.combination_mpg || mpgData.combination_mpg,
      price: modernizedCar.price && modernizedCar.price > 10000 ? modernizedCar.price : generateRealisticPrice(modernizedCar as ApiCarData),
      description: modernizedCar.description || generateCarDescription(modernizedCar)
    };

    // ✅ CAMBIAR: Ahora solo filtrar autos extremadamente antiguos
    if (enhancedCar.year < 2015) {
      console.warn(`⚠️ Auto demasiado antiguo después de modernización: ${enhancedCar.make} ${enhancedCar.model} ${enhancedCar.year}`);
      return null;
    }

    return enhancedCar;

  } catch (error: unknown) {
    console.error(`❌ Error enhancing car ${car.make} ${car.model}:`, error);
    return null;
  }
};

// ✅ MEJORAR la función simulatePremiumFields - ELIMINAR displacement no usado
const simulatePremiumFields = (carData: ApiCarData): { city_mpg: number; highway_mpg: number; combination_mpg: number } => {
  try {
    if (carData.city_mpg && carData.highway_mpg && carData.combination_mpg) {
      return {
        city_mpg: carData.city_mpg,
        highway_mpg: carData.highway_mpg,
        combination_mpg: carData.combination_mpg
      };
    }

    const fuelType = carData.fuel_type?.toLowerCase() || 'gas';
    const cylinders = carData.cylinders || 4;
    // ✅ ELIMINAR displacement no usado
    const isHybrid = carData.model?.toLowerCase().includes('hybrid') || carData.fuel_type?.toLowerCase().includes('hybrid');
    const isElectric = fuelType === 'electricity';
    
    let baseCityMpg: number;
    let baseHighwayMpg: number;

    if (isElectric) {
      baseCityMpg = 110 + Math.random() * 40;
      baseHighwayMpg = 100 + Math.random() * 30;
    } else if (isHybrid) {
      baseCityMpg = 45 + Math.random() * 15;
      baseHighwayMpg = 40 + Math.random() * 15;
    } else {
      if (cylinders <= 3) {
        baseCityMpg = 30 + Math.random() * 10;
        baseHighwayMpg = 35 + Math.random() * 10;
      } else if (cylinders === 4) {
        baseCityMpg = 25 + Math.random() * 8;
        baseHighwayMpg = 32 + Math.random() * 8;
      } else if (cylinders === 6) {
        baseCityMpg = 20 + Math.random() * 6;
        baseHighwayMpg = 28 + Math.random() * 6;
      } else {
        baseCityMpg = 15 + Math.random() * 5;
        baseHighwayMpg = 22 + Math.random() * 6;
      }
    }

    const make = carData.make?.toLowerCase() || '';
    let brandMultiplier = 1.0;
    
    if (['toyota', 'honda', 'nissan', 'hyundai', 'kia'].includes(make)) {
      brandMultiplier = 1.05;
    } else if (['tesla', 'byd', 'nio'].includes(make)) {
      brandMultiplier = 1.1;
    } else if (['chevrolet', 'ford', 'ram', 'gmc'].includes(make)) {
      brandMultiplier = 0.95;
    }

    const finalCityMpg = Math.max(15, Math.round(baseCityMpg * brandMultiplier));
    const finalHighwayMpg = Math.max(20, Math.round(baseHighwayMpg * brandMultiplier));
    const combinationMpg = Math.round((finalCityMpg + finalHighwayMpg) / 2);

    return {
      city_mpg: finalCityMpg,
      highway_mpg: finalHighwayMpg,
      combination_mpg: combinationMpg
    };

  } catch (error) {
    console.warn('⚠️ Error simulating premium fields:', error);
    return {
      city_mpg: 25,
      highway_mpg: 32,
      combination_mpg: 28
    };
  }
};

// ✅ NUEVA función para generar descripción del auto
const generateCarDescription = (car: Car): string => {
  const make = car.make || 'Unknown';
  const model = car.model || 'Unknown';
  const year = car.year || 2024;
  const fuelType = car.fuel_type || 'gas';
  const transmission = car.transmission === 'a' ? 'automática' : 'manual';
  const carClass = car.class || 'sedan';
  
  const isElectric = fuelType === 'electricity';
  const isHybrid = model.toLowerCase().includes('hybrid') || fuelType.toLowerCase().includes('hybrid');
  const isLuxury = carClass.includes('luxury') || ['mercedes', 'bmw', 'audi', 'tesla', 'lexus'].includes(make.toLowerCase());
  
  let description = `${make} ${model} ${year}`;
  
  if (carClass.includes('suv')) {
    description += ' SUV';
  } else if (carClass.includes('pickup')) {
    description += ' pickup';
  } else if (carClass.includes('sedan')) {
    description += ' sedán';
  } else {
    description += ` ${carClass}`;
  }
  
  if (isElectric) {
    description += ' eléctrico';
  } else if (isHybrid) {
    description += ' híbrido';
  } else {
    description += ` con motor de ${fuelType === 'gas' ? 'gasolina' : fuelType}`;
  }
  
  description += ` y transmisión ${transmission}`;
  
  if (isLuxury) {
    description += ', con acabados de lujo y tecnología avanzada';
  } else if (isElectric) {
    description += ', con cero emisiones y carga rápida';
  } else if (isHybrid) {
    description += ', combinando eficiencia y rendimiento';
  } else {
    description += ', confiable y eficiente';
  }
  
  description += '.';
  
  return description;
};

// ✅ NUEVO: Cache temporal para resultados de búsqueda
let searchResultsCache: Car[] = [];

// ✅ NUEVO: Función para guardar resultados de búsqueda
const saveSearchResultsToCache = (cars: Car[]): void => {
  searchResultsCache = cars;
  
  // También guardar en localStorage temporal
  try {
    localStorage.setItem('searchResultsCache', JSON.stringify(cars));
  } catch (error) {
    console.warn('⚠️ Error guardando resultados de búsqueda:', error);
  }
};

// ✅ NUEVO: Función para obtener resultados de búsqueda
const getSearchResultsFromCache = (): Car[] => {
  if (searchResultsCache.length > 0) {
    return searchResultsCache;
  }
  
  // Intentar cargar desde localStorage
  try {
    const saved = localStorage.getItem('searchResultsCache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        searchResultsCache = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn('⚠️ Error cargando resultados de búsqueda:', error);
  }
  
  return [];
};

// ✅ ACTUALIZAR searchCars para guardar resultados
export const searchCars = async (filters: SearchFilters): Promise<Car[]> => {
  try {
    console.log('🔍 Buscando con filtros:', filters);
    
    // Si no hay filtros, devolver cache
    if (!filters.searchTerm && !filters.year) {
      console.log('📦 Sin filtros, devolviendo cache');
      const results = getCarsFromCache().slice(0, 16);
      saveSearchResultsToCache(results); // ✅ Guardar en cache de búsqueda
      return results;
    }

    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    const apiUrl = import.meta.env.VITE_NINJA_API_URL;
    
    let searchResults: Car[] = [];

    // ✅ SIEMPRE buscar en API si hay término de búsqueda
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      
      if (apiKey && apiUrl) {
        console.log(`🌐 Buscando en API para: ${searchTerm}`);
        
        // ✅ Detectar si es una marca conocida o cualquier término
        const knownMakes = ['toyota', 'kia', 'hyundai', 'tesla', 'nissan', 'chevrolet', 'mitsubishi', 'geely'];
        const foundMake = knownMakes.find(make => searchTerm.includes(make));
        
        if (foundMake) {
          // Buscar por marca conocida
          console.log(`🔍 Marca conocida detectada: ${foundMake}`);
          try {
            const apiResults = await searchInApi({ make: foundMake });
            searchResults.push(...apiResults);
            
            // Filtrar por modelo si se especificó
            const words = searchTerm.split(' ');
            if (words.length > 1 && apiResults.length > 0) {
              const modelWords = words.filter(word => word !== foundMake);
              if (modelWords.length > 0) {
                const modelTerm = modelWords.join(' ').toLowerCase();
                searchResults = searchResults.filter(car => 
                  car.model.toLowerCase().includes(modelTerm)
                );
              }
            }
          } catch (apiError) {
            console.warn(`⚠️ Error en API para marca conocida ${foundMake}:`, apiError);
          }
        } else {
          // ✅ Buscar cualquier término como marca en API
          console.log(`🔍 Término desconocido, buscando como marca: ${searchTerm}`);
          try {
            // Intentar el término completo como marca
            const firstWord = searchTerm.split(' ')[0];
            const apiResults = await searchInApi({ make: firstWord });
            
            if (apiResults.length > 0) {
              console.log(`✅ Encontrados ${apiResults.length} resultados para marca: ${firstWord}`);
              searchResults.push(...apiResults);
              
              // Si hay más palabras, filtrar por modelo
              const words = searchTerm.split(' ');
              if (words.length > 1) {
                const modelWords = words.slice(1);
                const modelTerm = modelWords.join(' ').toLowerCase();
                searchResults = searchResults.filter(car => 
                  car.model.toLowerCase().includes(modelTerm)
                );
              }
            } else {
              console.log(`📭 No se encontraron resultados para marca: ${firstWord}`);
            }
          } catch (apiError) {
            console.warn(`⚠️ Error en API para término ${searchTerm}:`, apiError);
          }
        }
      } else {
        console.warn('⚠️ API no configurada, no se puede buscar término desconocido');
      }
    }

    // ✅ Buscar en caché como complemento (no reemplazo)
    console.log(`🔍 Buscando en caché como complemento...`);
    const localResults = searchInLocalCache(filters, false); // false = no usar fallback si está vacío
    
    // ✅ Combinar resultados de API y cache, evitando duplicados
    const combinedResults = [...searchResults];
    
    localResults.forEach(localCar => {
      const isDuplicate = combinedResults.some(car => 
        car.make.toLowerCase() === localCar.make.toLowerCase() &&
        car.model.toLowerCase() === localCar.model.toLowerCase() &&
        car.year === localCar.year
      );
      
      if (!isDuplicate) {
        combinedResults.push(localCar);
      }
    });

    // Aplicar filtro de año si existe
    let finalResults = combinedResults;
    if (filters.year && filters.year.trim()) {
      const targetYear = parseInt(filters.year);
      if (!isNaN(targetYear)) {
        finalResults = finalResults.filter(car => car.year === targetYear);
      }
    }

    console.log(`✅ Búsqueda completada: ${finalResults.length} resultados (${searchResults.length} de API + ${combinedResults.length - searchResults.length} de caché)`);
    
    // ✅ Si no hay resultados y no se encontró nada en API, mostrar mensaje específico
    if (finalResults.length === 0 && filters.searchTerm) {
      console.log(`ℹ️ No se encontraron resultados para "${filters.searchTerm}". Marca puede no estar disponible en la API.`);
    }
    
    const limitedResults = finalResults.slice(0, 16);
    
    // ✅ NUEVO: Guardar resultados en cache de búsqueda
    saveSearchResultsToCache(limitedResults);
    
    return limitedResults;

  } catch (error: unknown) {
    console.error('❌ Error en búsqueda:', error);
    
    // Fallback: usar solo cache local
    console.log('📦 Fallback: usando solo cache local');
    const fallbackResults = searchInLocalCache(filters, true); // true = usar fallback si está vacío
    saveSearchResultsToCache(fallbackResults); // ✅ Guardar fallback también
    return fallbackResults;
  }
};

const searchInLocalCache = (filters: SearchFilters, useFallbackIfEmpty: boolean = true): Car[] => {
  console.log('🔍 Buscando en cache local con filtros:', filters);
  
  const cachedCars = getCarsFromCache();
  let filteredCars = cachedCars;

  // ✅ Solo usar datos de fallback si se especifica Y el cache está vacío
  if (filteredCars.length === 0 && useFallbackIfEmpty) {
    console.log('📦 Cache vacío, usando datos de fallback');
    const fallbackData = getFallbackCarData();
    filteredCars = fallbackData
      .map((carData, index) => processCarData(carData as ApiCarData, index))
      .filter((car): car is Car => car !== null);
  }

  // Filtrar por término de búsqueda
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const term = filters.searchTerm.toLowerCase();
    filteredCars = filteredCars.filter(car => 
      car.make.toLowerCase().includes(term) || 
      car.model.toLowerCase().includes(term) ||
      `${car.make} ${car.model}`.toLowerCase().includes(term)
    );
  }

  // Filtrar por año
  if (filters.year && filters.year.trim()) {
    const year = parseInt(filters.year);
    if (!isNaN(year)) {
      filteredCars = filteredCars.filter(car => car.year === year);
    }
  }

  console.log(`📦 Cache local: ${filteredCars.length} resultados encontrados`);
  return filteredCars;
};
// ✅ NUEVA: Función helper para buscar en la API
const searchInApi = async (params: Record<string, string>): Promise<Car[]> => {
  try {
    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    const apiUrl = import.meta.env.VITE_NINJA_API_URL;
    
    if (!apiKey || !apiUrl) {
      console.warn('⚠️ API no configurada');
      return [];
    }

    const cleanParams: Record<string, string> = {};
    
    // Solo incluir parámetros básicos permitidos
    const allowedParams = ['make', 'model', 'year'];
    allowedParams.forEach(key => {
      if (params[key]) {
        cleanParams[key] = params[key];
      }
    });
    
    console.log(`🌐 Consultando API con parámetros:`, cleanParams);
    
    const response = await carApiClient.get(apiUrl, {
      params: cleanParams,
      timeout: 10000,
      headers: { 'X-Api-Key': apiKey }
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(`📊 API devolvió ${response.data.length} resultados para marca: ${cleanParams.make}`);
      
      // Procesar resultados - limitar en el cliente
      const enhancedResults = await Promise.all(
        response.data.slice(0, 8).map(async (carData: ApiCarData, index: number) => {
          try {
            const processedCar = processCarData(carData, index);
            if (!processedCar) return null;
            
            const enhancedCar = await enhanceCarWithImage(processedCar, index);
            return enhancedCar;
          } catch (processingError) {
            console.warn(`⚠️ Error procesando auto ${index}:`, processingError);
            return null;
          }
        })
      );

      const validResults = enhancedResults.filter((car): car is Car => car !== null);
      
      console.log(`✅ ${validResults.length} autos procesados exitosamente desde API`);
      return validResults;
    } else {
      console.log(`📭 API no devolvió resultados para marca: ${cleanParams.make}`);
      return [];
    }

  } catch (error: unknown) {
    console.error('❌ Error en consulta API:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 400) {
        console.warn(`⚠️ Error 400: Marca "${params.make}" no válida o no encontrada en API`);
      } else if (axiosError.response?.status === 403) {
        console.warn('⚠️ Error 403: Límite de API alcanzado');
      } else if (axiosError.response?.status === 429) {
        console.warn('⚠️ Error 429: Demasiadas requests');
      }
    }
    
    return [];
  }
};
// ✅ USAR fetchFeaturedCars también con filterModernCars
export const fetchFeaturedCars = async (): Promise<Car[]> => {
  try {
    const allCars = await fetchCars(24);
    const modernCars = filterModernCars(allCars);
    return modernCars.slice(0, 16);
  } catch (error) {
    console.error('❌ Error fetching featured cars:', error);
    const fallbackData = getFallbackCarData();
    const processedFallback = fallbackData
      .map((carData, index) => processCarData(carData as ApiCarData, index))
      .filter((car): car is Car => car !== null);
    
    return filterModernCars(processedFallback).slice(0, 16);
  }
};

// ✅ ACTUALIZAR clearAllCaches para incluir cache de búsqueda
export const clearAllCaches = (): void => {
  try {
    // ✅ Limpiar cache de autos principal
    setCarsInCache([]);
    
    // ✅ Limpiar cache de búsqueda
    searchResultsCache = [];
    
    // ✅ Limpiar todos los caches de imágenes
    clearAllImageCaches();
    
    // ✅ Limpiar localStorage
    localStorage.removeItem('carCatalogCache');
    localStorage.removeItem('searchResultsCache');
    localStorage.removeItem('carImageCache');
    localStorage.removeItem('imageRequestFailed');
    
    console.log('✅ Todos los caches limpiados exitosamente');
    
  } catch (error) {
    console.warn('⚠️ Error limpiando caches:', error);
  }
};
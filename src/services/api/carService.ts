import { carApiClient, CAR_API_URL } from './config';
import { 
  setCarsInCache, 
  getCarsFromCache,
  isReliableImageUrl // ✅ AGREGAR IMPORT
} from './cache';
import { generateStableId } from './utils';
import type { Car, SearchFilters } from '@/types';
import { getDefaultCarImage } from './carBrands'; // ✅ Agregar esta importación

// ✅ DEFINIR INTERFACES QUE FALTAN
interface ApiCarData {
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
}


// ✅ ACTUALIZADO: Datos de respaldo con Mitsubishi y Chevrolet en lugar de Ford
const getFallbackCarData = () => {
  return [
    // Toyota (sin cambios)
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

    // Kia (sin cambios)
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

    // Hyundai (sin cambios)
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

    // Tesla (sin cambios)
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

    // Nissan (sin cambios)
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

    // ✅ NUEVO: Chevrolet (reemplaza Ford)
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

    // ✅ NUEVO: Mitsubishi
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

    // Geely (sin cambios)
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
    'toyota', 'kia', 'hyundai', 'nissan'  // Marcas principales de la API
  ] as const,
  AMERICAN_MAKES: [
    'chevrolet'  // Solo Chevrolet ahora
  ] as const,
  JAPANESE_MAKES: [
    'nissan', 'mitsubishi'  // Nissan y Mitsubishi
  ] as const,
  OTHER_MAKES: [
    'tesla', 'geely'  // Tesla y marcas chinas
  ] as const,
  CARS_PER_MAKE: 2, // ✅ CAMBIADO: Solo 2 autos por marca
  MAX_REQUESTS_PER_BATCH: 3,
  DELAY_BETWEEN_REQUESTS: 1500
};

// ✅ CORREGIDA: Función para probar la API
const testApiAvailability = async (make: string): Promise<boolean> => {
  try {
    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    if (!apiKey || !CAR_API_URL) {
      return false;
    }
    
    const response = await carApiClient.get(CAR_API_URL, {
      params: { make, limit: 1 },
      timeout: 5000,
      headers: { 'X-Api-Key': apiKey }
    });
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return true;
    } else {
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error testing API availability for ${make}:`, error);
    return false;
  }
};

// ✅ FUNCIÓN PARA OBTENER AUTOS DE LA API
const fetchCarsFromApi = async (make: string, limit: number = 10): Promise<ApiCarData[]> => {
  try {
    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    const apiUrl = import.meta.env.VITE_NINJA_API_URL;
    
    if (!apiKey || !apiUrl) {
      console.warn('⚠️ API keys not configured, using fallback data');
      return getFallbackDataForMake(make, limit);
    }
        
    const response = await carApiClient.get(apiUrl, {
      params: { make, limit },
      timeout: 8000,
      headers: { 'X-Api-Key': apiKey }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn(`⚠️ API returned no data for ${make}, using fallback`);
      return getFallbackDataForMake(make, limit);
    }
    
  } catch (error) {
    console.error(`❌ API request failed for ${make}:`, error);
    return getFallbackDataForMake(make, limit);
  }
};

// Helper para obtener datos de fallback filtrados por marca
const getFallbackDataForMake = (make: string, limit: number): ApiCarData[] => {
  const allFallbackData = getFallbackCarData();
  const makeData = allFallbackData.filter(car => 
    car.make.toLowerCase() === make.toLowerCase()
  );
  
  return makeData.slice(0, limit);
};

// ✅ MODIFICADA: Función principal para asegurar Toyota, Kia, Hyundai en featured
export const fetchCars = async (limit: number = 24): Promise<Car[]> => {
  
  // ✅ LIMPIAR cache de Unsplash para forzar búsquedas reales
  const { clearUnsplashCache } = await import('./cache');
  clearUnsplashCache();
  
  try {
    // Verificar cache
    if (carCache.length > 0 && carCache.length >= Math.min(limit, 15)) {
      // ✅ USAR filterModernCars en el cache
      const modernCars = filterModernCars(carCache);
      return modernCars.slice(0, limit);
    }

    // Intentar cargar desde localStorage
    try {
      const savedCache = localStorage.getItem('carCatalogCache');
      if (savedCache) {
        const cachedCars = JSON.parse(savedCache) as Car[];
        if (Array.isArray(cachedCars) && cachedCars.length >= Math.min(limit, 10)) {
          // ✅ USAR filterModernCars en localStorage
          const modernCachedCars = filterModernCars(cachedCars);
          carCache = modernCachedCars;
          setCarsInCache(modernCachedCars);
          return modernCachedCars.slice(0, limit);
        }
      }
    } catch (cacheError) {
      console.warn('⚠️ Error leyendo cache:', cacheError);
    }
        
    const allCars: Car[] = [];

    // ✅ 1. FORZAR Toyota, Kia, Hyundai desde API primero
    const primaryMakes = ['toyota', 'kia', 'hyundai'];
    for (const make of primaryMakes) {
      try {
        const apiCars = await fetchCarsFromApi(make, API_CONFIG.CARS_PER_MAKE);
        
        for (const apiCar of apiCars.slice(0, API_CONFIG.CARS_PER_MAKE)) {
          const enhancedCar = await enhanceCarWithImage(apiCar as Car, allCars.length);
          if (enhancedCar) {
            allCars.push(enhancedCar);
          }
        }
        
        // Pequeña pausa entre marcas
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`⚠️ Error processing ${make}:`, error);
      }
    }

    // ✅ 2. Luego Tesla y marcas adicionales
    const additionalMakes = ['tesla', 'nissan', 'chevrolet', 'mitsubishi'];
    for (const make of additionalMakes) {
      const isAvailable = await testApiAvailability(make);
      
      if (isAvailable) {
        try {
          const apiCars = await fetchCarsFromApi(make, API_CONFIG.CARS_PER_MAKE);
          
          for (const apiCar of apiCars.slice(0, API_CONFIG.CARS_PER_MAKE)) {
            const enhancedCar = await enhanceCarWithImage(apiCar as Car, allCars.length);
            if (enhancedCar) {
              allCars.push(enhancedCar);
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.warn(`⚠️ Error processing ${make}:`, error);
        }
      }
    }

    // ✅ 3. Agregar datos de fallback para marcas que faltan
    const fallbackData = getFallbackCarData();
    
    // ✅ ASEGURAR que tenemos todas las marcas featured
    const allFeaturedMakes = ['toyota', 'kia', 'hyundai', 'tesla', 'geely', 'nissan', 'chevrolet', 'mitsubishi'];
    
    for (const targetMake of allFeaturedMakes) {
      // Solo agregar del fallback si no tenemos suficientes de esa marca
      const existingCount = allCars.filter(car => car.make.toLowerCase() === targetMake).length;
      
      if (existingCount < API_CONFIG.CARS_PER_MAKE) {
        const neededCount = API_CONFIG.CARS_PER_MAKE - existingCount;
        const fallbackCars = fallbackData
          .filter(car => car.make.toLowerCase() === targetMake)
          .slice(0, neededCount);
        
        for (const fallbackCar of fallbackCars) {
          const enhancedCar = await enhanceCarWithImage(fallbackCar as Car, allCars.length);
          if (enhancedCar) {
            allCars.push(enhancedCar);
          }
        }
      }
    }

    // ✅ USAR filterModernCars antes de finalizar
    const modernCars = filterModernCars(allCars);
    
    const finalCars = modernCars.slice(0, limit);
    
    // ✅ VERIFICAR que tenemos las marcas principales
    const makesCounts: Record<string, number> = {};
    finalCars.forEach(car => {
      makesCounts[car.make.toLowerCase()] = (makesCounts[car.make.toLowerCase()] || 0) + 1;
    });
    
    // Guardar en cache
    carCache = finalCars;
    localStorage.setItem('carCatalogCache', JSON.stringify(finalCars));
    setCarsInCache(finalCars);
    
    return finalCars;

  } catch (error) {
    console.error('❌ Error crítico en fetchCars:', error);
    
    // Fallback completo
    const fallbackData = getFallbackCarData();
    const enhancedFallback = await Promise.all(
      fallbackData.slice(0, limit).map(async (car, index) => {
        const enhancedCar = await enhanceCarWithImage(car as Car, index);
        return enhancedCar || car as Car;
      })
    );
    
    const validFallback = enhancedFallback.filter((car): car is Car => car !== null);
    // ✅ USAR filterModernCars en el fallback también
    const modernFallback = filterModernCars(validFallback);
    
    carCache = modernFallback;
    localStorage.setItem('carCatalogCache', JSON.stringify(modernFallback));
    setCarsInCache(modernFallback);
    
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

let carCache: Car[] = [];

export const enhanceCarWithImage = async (car: Car, index: number): Promise<Car | null> => {
  if (!car || !car.make || !car.model) {
    console.warn('❌ Invalid car data:', car);
    return null;
  }

  try {
    const mpgData = simulatePremiumFields(car as ApiCarData);
    const stableId = generateStableId(car, index);
    
    // ✅ MODIFICADO: Forzar búsqueda de Google Images para todas las marcas
    let imageUrl = car.image;
    const needsNewImage = !imageUrl || 
                         !isReliableImageUrl(imageUrl) ||
                         imageUrl.includes('unsplash.com') ||
                         imageUrl.includes('placeholder');
    
    if (needsNewImage) {
      
      try {
        // ✅ CORREGIDO: Importar correctamente la función
        const { getCarImageFromGoogle } = await import('./imageService');
        
        // ✅ Intentar múltiples búsquedas para asegurar resultado
        let googleImage = await getCarImageFromGoogle(car.make, car.model, car.year);
        
        // Si no funciona con año, intentar sin año
        if (!googleImage || googleImage.includes('placeholder') || googleImage === getDefaultCarImage(car.make)) {
          googleImage = await getCarImageFromGoogle(car.make, car.model);
        }
        
        // Si aún no funciona, intentar solo con la marca
        if (!googleImage || googleImage.includes('placeholder') || googleImage === getDefaultCarImage(car.make)) {
          googleImage = await getCarImageFromGoogle(`${car.make} car exterior`);
        }
        
        // Verificar si la imagen de Google es válida
        if (googleImage && isReliableImageUrl(googleImage) && !googleImage.includes('placeholder')) {
          imageUrl = googleImage;
        } else {
          const { getDefaultCarImage } = await import('./carBrands');
          imageUrl = getDefaultCarImage(car.make);
        }
      } catch (imageError) {
        console.warn(`❌ Error en búsqueda de imagen para ${car.make} ${car.model}:`, imageError);
        const { getDefaultCarImage } = await import('./carBrands');
        imageUrl = getDefaultCarImage(car.make);
      }
    }

    const enhancedCar: Car = {
      ...car,
      id: stableId,
      image: imageUrl,
      city_mpg: car.city_mpg || mpgData.city_mpg,
      highway_mpg: car.highway_mpg || mpgData.highway_mpg,
      combination_mpg: car.combination_mpg || mpgData.combination_mpg,
      price: car.price && car.price > 10000 ? car.price : generateRealisticPrice(car as ApiCarData),
      description: car.description || generateCarDescription(car)
    };

    if (enhancedCar.year < 2020) {
      return null;
    }

    return enhancedCar;

  } catch (error) {
    console.error(`❌ Error enhancing car ${car.make} ${car.model}:`, error);
    return null;
  }
};

// ✅ MEJORAR la función simulatePremiumFields para ser más realista
const simulatePremiumFields = (carData: ApiCarData): { city_mpg: number; highway_mpg: number; combination_mpg: number } => {
  try {
    // Si ya tiene datos completos de MPG, usarlos
    if (carData.city_mpg && carData.highway_mpg && carData.combination_mpg) {
      return {
        city_mpg: carData.city_mpg,
        highway_mpg: carData.highway_mpg,
        combination_mpg: carData.combination_mpg
      };
    }

    // ✅ Valores base por tipo de combustible y cilindros
    const fuelType = carData.fuel_type?.toLowerCase() || 'gas';
    const cylinders = carData.cylinders || 4;
    const displacement = carData.displacement || 2.0;
    const isHybrid = carData.model?.toLowerCase().includes('hybrid') || carData.fuel_type?.toLowerCase().includes('hybrid');
    const isElectric = fuelType === 'electricity';
    
    let baseCityMpg: number;
    let baseHighwayMpg: number;

    if (isElectric) {
      // Vehículos eléctricos (MPGe)
      baseCityMpg = 120 + Math.random() * 30; // 120-150 MPGe
      baseHighwayMpg = 100 + Math.random() * 25; // 100-125 MPGe
    } else if (isHybrid) {
      // Vehículos híbridos
      baseCityMpg = 45 + Math.random() * 15; // 45-60 MPG
      baseHighwayMpg = 40 + Math.random() * 12; // 40-52 MPG
    } else {
      // Vehículos de gasolina
      if (cylinders <= 3) {
        baseCityMpg = 30 + Math.random() * 8; // 30-38 MPG
        baseHighwayMpg = 35 + Math.random() * 10; // 35-45 MPG
      } else if (cylinders === 4) {
        baseCityMpg = 25 + Math.random() * 8; // 25-33 MPG
        baseHighwayMpg = 30 + Math.random() * 8; // 30-38 MPG
      } else if (cylinders === 6) {
        baseCityMpg = 20 + Math.random() * 6; // 20-26 MPG
        baseHighwayMpg = 25 + Math.random() * 7; // 25-32 MPG
      } else {
        // 8+ cilindros
        baseCityMpg = 15 + Math.random() * 5; // 15-20 MPG
        baseHighwayMpg = 20 + Math.random() * 6; // 20-26 MPG
      }
      
      // Ajustar por desplazamiento
      if (displacement > 3.0) {
        baseCityMpg *= 0.9;
        baseHighwayMpg *= 0.9;
      }
    }

    // ✅ Ajustar por marca (algunas marcas son más eficientes)
    const make = carData.make?.toLowerCase() || '';
    let brandMultiplier = 1.0;
    
    if (['toyota', 'honda', 'nissan', 'hyundai', 'kia'].includes(make)) {
      brandMultiplier = 1.05; // +5% eficiencia
    } else if (['tesla', 'byd', 'nio'].includes(make)) {
      brandMultiplier = 1.1; // +10% para eléctricos
    } else if (['chevrolet', 'ford', 'ram', 'gmc'].includes(make)) {
      brandMultiplier = 0.95; // -5% para americanos
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
    // Valores de respaldo seguros
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
  
  // Determinar características especiales
  const isElectric = fuelType === 'electricity';
  const isHybrid = model.toLowerCase().includes('hybrid') || fuelType.toLowerCase().includes('hybrid');
  const isLuxury = carClass.includes('luxury') || ['mercedes', 'bmw', 'audi', 'tesla', 'lexus'].includes(make.toLowerCase());
  
  let description = `${make} ${model} ${year}`;
  
  // Añadir tipo de vehículo
  if (carClass.includes('suv')) {
    description += ' SUV';
  } else if (carClass.includes('pickup')) {
    description += ' pickup';
  } else if (carClass.includes('sedan')) {
    description += ' sedán';
  } else {
    description += ` ${carClass}`;
  }
  
  // Añadir características de propulsión
  if (isElectric) {
    description += ' eléctrico';
  } else if (isHybrid) {
    description += ' híbrido';
  } else {
    description += ` con motor de ${fuelType === 'gas' ? 'gasolina' : fuelType}`;
  }
  
  // Añadir transmisión
  description += ` y transmisión ${transmission}`;
  
  // Añadir características especiales
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

// ✅ MEJORAR generateRealisticPrice para ser más preciso
const generateRealisticPrice = (carData: ApiCarData): number => {
  try {
    const make = carData.make?.toLowerCase() || '';
    const model = carData.model?.toLowerCase() || '';
    const year = carData.year || 2024;
    const carClass = carData.class?.toLowerCase() || '';
    const fuelType = carData.fuel_type?.toLowerCase() || 'gas';
    const cylinders = carData.cylinders || 4;
    
    // ✅ Precio base por categoría de vehículo
    let basePrice = 25000; // Precio base por defecto
    
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
      if (carClass.includes('compact')) {
        basePrice = 26000;
      } else if (carClass.includes('midsize')) {
        basePrice = 32000;
      } else {
        basePrice = 40000;
      }
    } else if (carClass.includes('pickup')) {
      basePrice = 30000;
    }
    
    // ✅ Multiplicador por marca
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
      brandMultiplier = 1.1;
    } else if (valueBrands.includes(make)) {
      brandMultiplier = 0.9;
    } else if (['chevrolet', 'ford', 'dodge'].includes(make)) {
      brandMultiplier = 1.0;
    }
    
    // ✅ Ajustar por tipo de combustible
    if (fuelType === 'electricity') {
      brandMultiplier *= 1.2;
    } else if (model.includes('hybrid')) {
      brandMultiplier *= 1.1;
    }
    
    // ✅ Ajustar por cilindros (más cilindros = más caro)
    if (cylinders >= 8) {
      brandMultiplier *= 1.3;
    } else if (cylinders === 6) {
      brandMultiplier *= 1.1;
    }
    
    // ✅ Ajustar por año (autos más nuevos son más caros)
    const currentYear = new Date().getFullYear();
    const ageMultiplier = Math.max(0.8, 1 - ((currentYear - year) * 0.05));
    
    // ✅ Modelos específicos conocidos
    const modelPriceAdjustments: Record<string, number> = {
      'model s': 1.8,
      'model x': 2.0,
      'model 3': 1.3,
      'prius': 1.1,
      'camry': 1.0,
      'corolla': 0.9,
      'rav4': 1.1,
      'highlander': 1.3,
      'accord': 1.1,
      'civic': 0.9,
      'silverado': 1.2,
      'f-150': 1.2,
      'tahoe': 1.5,
      'suburban': 1.6,
      'corvette': 2.2,
      'mustang': 1.4
    };
    
    const modelMultiplier = modelPriceAdjustments[model] || 1.0;
    
    // ✅ Calcular precio final
    const finalPrice = Math.round(basePrice * brandMultiplier * ageMultiplier * modelMultiplier);
    
    // ✅ Asegurar rangos realistas
    const minPrice = 15000;
    const maxPrice = fuelType === 'electricity' ? 120000 : 80000;
    
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice));
        
    return clampedPrice;

  } catch (error) {
    console.warn('⚠️ Error generating realistic price:', error);
    return 25000; // Precio de respaldo
  }
};

// ✅ USAR filterModernCars en searchCars también
export const searchCars = async (filters: SearchFilters): Promise<Car[]> => {
  try {
    const cachedCars = getCarsFromCache();
    if (cachedCars.length === 0) {
      const freshCars = await fetchCars(30);
      const filteredResults = freshCars.filter(car => {
        if (filters.searchTerm && !car.make.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
            !car.model.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
        }
        if (filters.year && car.year.toString() !== filters.year) return false;
        if (filters.fuelType && car.fuel_type !== filters.fuelType) return false;
        if (filters.transmission && car.transmission !== filters.transmission) return false;
        return true;
      });
      
      // ✅ USAR filterModernCars en los resultados de búsqueda
      const modernResults = filterModernCars(filteredResults);
      return modernResults.slice(0, 20);
    }
    
    const filteredResults = cachedCars.filter(car => {
      if (filters.searchTerm && !car.make.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !car.model.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.year && car.year.toString() !== filters.year) return false;
      if (filters.fuelType && car.fuel_type !== filters.fuelType) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      return true;
    });

    // ✅ USAR filterModernCars en los resultados del cache
    const modernResults = filterModernCars(filteredResults);
    return modernResults.slice(0, 20);

  } catch (error) {
    console.error('Error in searchCars:', error);
    return [];
  }
};

// ✅ USAR filterModernCars en fetchFeaturedCars también
export const fetchFeaturedCars = async (): Promise<Car[]> => {
  try {
    if (carCache.length >= 12) {
      const modernCars = filterModernCars(carCache);
      return modernCars.slice(0, 12);
    }

    const cars = await fetchCars(24);
    const modernCars = filterModernCars(cars);
    return modernCars.slice(0, 12);

  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return [];
  }
};

// ✅ MEJORADA: Función filterModernCars más específica
const filterModernCars = (cars: Car[]): Car[] => {
  return cars.filter(car => {
    // Filtrar autos muy antiguos
    if (car.year < 2018) {
      return false;
    }
    
    // Filtrar datos incompletos o poco realistas
    if (!car.make || !car.model) {
      return false;
    }
    
    // Filtrar precios poco realistas (muy bajos o muy altos)
    if (car.price && (car.price < 10000 || car.price > 200000)) {
      return false;
    }
    
    return true;
  });
};

export const fetchCarById = async (id: string): Promise<Car> => {
  try {    
    // Primero buscar en el cache
    const cachedCars = getCarsFromCache();
    const cachedCar = cachedCars.find(car => car.id === id);
    
    if (cachedCar) {
      return cachedCar;
    }

    // Si no está en cache, intentar recargar todos los autos
    const allCars = await fetchCars(30);
    const foundCar = allCars.find(car => car.id === id);
    
    if (foundCar) {
      return foundCar;
    }

    // Si aún no se encuentra, buscar en datos de fallback
    const fallbackData = getFallbackCarData();
    const fallbackCar = fallbackData.find(car => car.id === id);
    
    if (fallbackCar) {
      return fallbackCar as Car;
    }

    throw new Error(`No se encontró el vehículo con ID: ${id}`);

  } catch (error) {
    console.error(`❌ Error buscando auto con ID ${id}:`, error);
    throw new Error('No se pudo cargar el vehículo solicitado');
  }
};
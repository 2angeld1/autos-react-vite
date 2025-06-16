import type { Car } from '@/types';

// Tipo para la función getDefaultCarImage
type GetDefaultCarImageFunction = (make: string) => string;

// In-memory storage to maintain data across navigations
export let carCache: Car[] = []; // ✅ Corregido: Car[] en lugar de string[]
export let imageCache: Record<string, string> = {}; // Cache to avoid repeated searches
export let imageRequestFailed: Record<string, boolean> = {}; // To remember which requests failed and avoid loops

// Function to validate if a URL is likely reliable (MUCHO MÁS PERMISIVO)
export const isReliableImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    
    // ✅ SOLO rechazar placeholders obvios
    const badPatterns = [
      'placeholder.com',
      'placehold.it',
      'via.placeholder.com'
    ];
    
    const isBadUrl = badPatterns.some(pattern => 
      urlObj.hostname.includes(pattern) || url.includes(pattern)
    );
    
    if (isBadUrl) {
      return false;
    }
    
    // ✅ Aceptar TODO lo demás
    return true;
  } catch (error) {
    console.warn('Invalid URL provided to isReliableImageUrl:', url, error);
    return false;
  }
};

// ✅ Agregar funciones que faltan
export const hasImageRequestFailed = (key: string): boolean => {
  return imageRequestFailed[key] === true;
};

export const markImageRequestAsFailed = (key: string): void => {
  imageRequestFailed[key] = true;
};

export const setCarsInCache = (cars: Car[]): void => {
  carCache = cars;
  
  // Intentar guardar en localStorage también
  try {
    localStorage.setItem('carCatalogCache', JSON.stringify(cars));
  } catch (e) {
    console.warn('Error saving car cache to localStorage:', e);
  }
};

export const getCarsFromCache = (): Car[] => {
  return carCache;
};

export const clearAllCaches = (): void => {
  try {
    // Limpiar todos los caches
    carCache = [];
    imageCache = {}; // ✅ IMPORTANTE: Limpiar el cache de imágenes
    imageRequestFailed = {}; // ✅ IMPORTANTE: Resetear registro de fallos
    
    // Limpiar localStorage
    localStorage.removeItem('carCatalogCache');
    localStorage.removeItem('carImageCache');
    localStorage.removeItem('imageRequestFailed');
    
    console.log('✅ Todos los caches limpiados completamente');
  } catch (error) {
    console.warn('⚠️ Error limpiando caches:', error);
  }
};

// Agregar función para limpiar cache completo
export const forceClearAllCaches = (): void => {
    try {
        // Limpiar memoria
        carCache = [];
        imageCache = {};
        imageRequestFailed = {};
        
        // Limpiar localStorage
        localStorage.removeItem('carImageCache');
        localStorage.removeItem('carCatalogCache');
        localStorage.removeItem('imageRequestFailed');
        
    } catch (e) {
        console.warn('Error limpiando cachés:', e);
    }
};

// ✅ Función para obtener información del caché
export const getCacheInfo = (): {
  carCacheSize: number;
  imageCacheSize: number;
  failedRequestsSize: number;
  errors: string[];
} => {
  const errors: string[] = [];
  
  try {
    return {
      carCacheSize: carCache.length,
      imageCacheSize: Object.keys(imageCache).length,
      failedRequestsSize: Object.keys(imageRequestFailed).length,
      errors
    };
  } catch (error) {
    console.warn('Invalid URL provided to isReliableImageUrl:', URL, error);
    errors.push('Error obteniendo información de caché');
    return {
      carCacheSize: 0,
      imageCacheSize: 0,
      failedRequestsSize: 0,
      errors
    };
  }
};

// ✅ Función para validar el caché de imágenes
export const validateImageCache = (): boolean => {
  try {
    // Validar que todas las URLs en caché sean confiables
    for (const [key, url] of Object.entries(imageCache)) {
      if (!isReliableImageUrl(url)) {
        console.warn(`URL no confiable encontrada en caché: ${key} -> ${url}`);
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

// Initial loading of the image cache with filtering of unreliable URLs
(function loadImageCache() {
  try {
    const savedImageCache = localStorage.getItem('carImageCache');
    if (savedImageCache) {
      const parsedCache = JSON.parse(savedImageCache);
      // Verify that it is a valid object
      if (parsedCache && typeof parsedCache === 'object') {
        // Filter only reliable URLs (anti-loop improvement)
        const reliableCache: Record<string, string> = {};

        for (const [key, url] of Object.entries(parsedCache)) {
          if (typeof url === 'string' && isReliableImageUrl(url)) {
            reliableCache[key] = url;
          }
        }

        imageCache = reliableCache;
      }
    }
  } catch (e) {
    console.warn('Error loading image cache from localStorage:', e);
  }
})();

// ✅ Cargar también el caché de autos
(function loadCarCache() {
  try {
    const savedCarCache = localStorage.getItem('carCatalogCache');
    if (savedCarCache) {
      const parsedCache = JSON.parse(savedCarCache);
      if (Array.isArray(parsedCache)) {
        carCache = parsedCache;
      }
    }
  } catch (e) {
    console.warn('Error loading car cache from localStorage:', e);
  }
})();

// Helper function to save the image cache with enhanced protection
export const saveImageCache = (key: string, value: string, getDefaultCarImage: GetDefaultCarImageFunction): void => {
  let finalValue = value;
  
  // Only save reliable URLs to cache (anti-loop improvement)
  if (!isReliableImageUrl(value)) {
    console.warn(`Unreliable URL discarded: ${value}`);
    // Replace with a guaranteed URL
    const [make, model] = key.split('-');
    const brandFallback = getDefaultCarImage(make || '');

    // If the brand image is also unreliable, use placeholder
    if (!isReliableImageUrl(brandFallback)) {
      const carText = encodeURIComponent(`${make || 'Car'} ${model || ''}`);
      finalValue = `https://placehold.co/800x450/1a1a1a/ffffff?text=${carText}`;
    } else {
      finalValue = brandFallback;
    }
  }

  // Update the entry in the cache
  imageCache[key] = finalValue;

  // Attempt to save to localStorage (with size limitation)
  try {
    // Check if the cache is not too large
    if (Object.keys(imageCache).length > 500) {
      // If there are too many entries, remove the oldest ones
      const entries = Object.entries(imageCache);
      // Keep only the 400 most recent
      const newCache = Object.fromEntries(entries.slice(-400));
      imageCache = newCache;
    }

    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
  } catch (e) {
    console.warn('Error saving image cache to localStorage:', e);

    // If there's a quota error, try to reduce the size
    if (e instanceof Error && e.name === 'QuotaExceededError') {
      try {
        // Drastically reduce the cache and retry
        const entries = Object.entries(imageCache);
        const reducedCache = Object.fromEntries(entries.slice(-200)); // Keep only 200
        imageCache = reducedCache;
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (innerError) {
        console.error('Could not save cache even after reducing it:', innerError);
      }
    }
  }
};

// Function to clean the image cache (new, to avoid infinite loop)
export const cleanImageCache = (getDefaultCarImage: GetDefaultCarImageFunction): void => {
  const cleanedCache: Record<string, string> = {};

  // Filter only reliable URLs
  for (const [key, url] of Object.entries(imageCache)) {
    if (isReliableImageUrl(url)) {
      cleanedCache[key] = url;
    } else {
      // ⚠️ Reemplaza URLs rotas con placeholders
      const [make, model] = key.split('-');
      const brandFallback = getDefaultCarImage(make || '');

      // If the brand image is also unreliable, use placeholder
      if (!isReliableImageUrl(brandFallback)) {
        const carText = encodeURIComponent(`${make || 'Car'} ${model || ''}`);
        cleanedCache[key] = `https://placehold.co/800x450/1a1a1a/ffffff?text=${carText}`;
      } else {
        cleanedCache[key] = brandFallback;
      }
    }
  }

  // Replace complete cache
  imageCache = cleanedCache;

  // Save to localStorage
  try {
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
  } catch (e) {
    console.warn('Error saving cleaned cache:', e);
  }
};

// ✅ NUEVO: Función para limpiar específicamente el cache de Geely
export const clearGeelyCacheEntries = (): void => {
  try {
    // Buscar y eliminar entradas de Geely en el cache de imágenes
    const keysToDelete = Object.keys(imageCache).filter(key => 
      key.toLowerCase().includes('geely') || 
      key.toLowerCase().includes('coolray')
    );
    
    console.log(`🧹 Eliminando ${keysToDelete.length} entradas de cache de Geely:`, keysToDelete);
    
    keysToDelete.forEach(key => {
      delete imageCache[key];
      delete imageRequestFailed[key]; // También limpiar fallos
    });
    
    // Actualizar localStorage
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
    
    console.log('✅ Cache de Geely limpiado exitosamente');
  } catch (error) {
    console.warn('⚠️ Error limpiando cache de Geely:', error);
  }
};

// ✅ NUEVO: Función para limpiar cache y forzar nuevas búsquedas
export const clearProblematicCache = (): void => {
  try {
    // Limpiar cache de imágenes problemáticas
    const keysToDelete = Object.keys(imageCache).filter(key => {
      const url = imageCache[key];
      return url.includes('placeholder') || 
             url.includes('dreamstime') ||
             url.includes('logo') ||
             !url.includes('unsplash.com');
    });
    
    console.log(`🧹 Eliminando ${keysToDelete.length} entradas problemáticas del cache`);
    
    keysToDelete.forEach(key => {
      delete imageCache[key];
      delete imageRequestFailed[key];
    });
    
    // Actualizar localStorage
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
    
    console.log('✅ Cache problemático limpiado');
  } catch (error) {
    console.warn('⚠️ Error limpiando cache problemático:', error);
  }
};

// ✅ AÑADIR función para limpiar cache de Unsplash
export const clearUnsplashCache = (): void => {
  try {
    const keysToDelete = Object.keys(imageCache).filter(key => {
      const url = imageCache[key];
      return url.includes('unsplash.com') || url.includes('placeholder');
    });
    
    console.log(`🧹 Eliminando ${keysToDelete.length} imágenes de Unsplash del cache`);
    
    keysToDelete.forEach(key => {
      delete imageCache[key];
      delete imageRequestFailed[key];
    });
    
    // Actualizar localStorage
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
    localStorage.setItem('imageRequestFailed', JSON.stringify(imageRequestFailed));
    
    console.log('✅ Cache de Unsplash limpiado');
  } catch (error) {
    console.warn('⚠️ Error limpiando cache de Unsplash:', error);
  }
};

// ✅ NUEVA función para limpiar cache específico de marcas problemáticas
export const clearProblematicBrandsCache = (): void => {
  try {
    const problematicBrands = ['tesla', 'mitsubishi', 'nissan', 'chevrolet', 'geely'];
    
    const keysToDelete = Object.keys(imageCache).filter(key => 
      problematicBrands.some(brand => key.toLowerCase().includes(brand.toLowerCase()))
    );
    
    console.log(`🧹 Eliminando ${keysToDelete.length} entradas de cache para marcas problemáticas`);
    
    keysToDelete.forEach(key => {
      delete imageCache[key];
      delete imageRequestFailed[key];
    });
    
    // Actualizar localStorage
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
    localStorage.setItem('imageRequestFailed', JSON.stringify(imageRequestFailed));
    
    console.log('✅ Cache de marcas problemáticas limpiado');
  } catch (error) {
    console.warn('⚠️ Error limpiando cache de marcas problemáticas:', error);
  }
};
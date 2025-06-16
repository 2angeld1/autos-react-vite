import axios from 'axios';
import { 
  GOOGLE_SEARCH_URL, 
  GOOGLE_API_KEY, 
  GOOGLE_SEARCH_ENGINE_ID 
} from './config';
import { 
  imageCache, 
  isReliableImageUrl 
} from './cache';
import { getDefaultCarImage } from './carBrands';

// Corregir el cliente HTTP para búsqueda de imágenes
const imageSearchClient = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
    // Eliminar 'User-Agent' que causa el error
  }
});

export const getCarImageFromGoogle = async (
  makeOrQuery: string, 
  model?: string, 
  year?: number
): Promise<string> => {
  // ✅ MEJORADO: Construir query más específica
  let searchQuery: string;
  
  if (model && year) {
    searchQuery = `${makeOrQuery} ${model} ${year} car exterior front view`;
  } else if (model) {
    searchQuery = `${makeOrQuery} ${model} car exterior front`;
  } else {
    // Si es solo marca o query general
    searchQuery = makeOrQuery.includes('car') ? makeOrQuery : `${makeOrQuery} car exterior`;
  }
  
  const cacheKey = `${makeOrQuery.toLowerCase()}-${model?.toLowerCase() || 'unknown'}-${year || 'any'}-v4`; // Versión v4 para evitar cache viejo
  
  // ✅ MEJORADO: Verificar cache pero ser más estricto
  if (imageCache[cacheKey] && 
      isReliableImageUrl(imageCache[cacheKey]) && 
      !imageCache[cacheKey].includes('unsplash.com') &&
      !imageCache[cacheKey].includes('placeholder')) {
    console.log(`🎯 Cache hit para: ${searchQuery} - ${imageCache[cacheKey]}`);
    return imageCache[cacheKey];
  }
  
  try {
    if (!GOOGLE_SEARCH_URL || !GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.warn('⚠️ Google Search API no configurada');
      return getDefaultCarImage(makeOrQuery);
    }
    
    console.log(`🔍 Buscando en Google Images: "${searchQuery}"`);
    
    // ✅ MEJORADO: Parámetros de búsqueda más específicos
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: searchQuery,
      searchType: 'image',
      num: '10',
      safe: 'active',
      imgType: 'photo',
      imgSize: 'medium',
      fileType: 'jpg,png',
      // ✅ NUEVO: Filtros adicionales para mejores resultados
      imgColorType: 'color',
      rights: 'cc_publicdomain,cc_attribute,cc_sharealike,cc_noncommercial'
    });
    
    const url = `${GOOGLE_SEARCH_URL}?${params.toString()}`;
    const response = await imageSearchClient.get(url, { timeout: 12000 }); // Más tiempo
    
    const data = response.data as { items?: Array<{ link: string; title?: string; snippet?: string }> };
    
    if (data.items && Array.isArray(data.items)) {
      console.log(`📸 Encontradas ${data.items.length} imágenes para ${searchQuery}`);
      
      // ✅ MEJORADO: Sistema de puntuación más inteligente
      const scoredImages: Array<{url: string, score: number, title: string}> = [];
      
      for (const item of data.items) {
        const imageUrl = item.link;
        const title = item.title?.toLowerCase() || '';
        const snippet = item.snippet?.toLowerCase() || '';
        
        if (!imageUrl || typeof imageUrl !== 'string') continue;
        
        try {
          const urlObj = new URL(imageUrl);
          const domain = urlObj.hostname.toLowerCase();
          
          // ✅ RECHAZAR dominios problemáticos
          const badDomains = [
            'unsplash.com', 'images.unsplash.com',
            'placeholder.com', 'placehold.it', 'via.placeholder.com',
            'thumbs.dreamstime.com', 'preview.redd.it',
            'i.pinimg.com', 'cdn.pixabay.com'
          ];
          
          if (badDomains.some(bad => domain.includes(bad))) {
            console.log(`⚠️ Dominio rechazado: ${domain}`);
            continue;
          }
          
          // ✅ SISTEMA DE PUNTUACIÓN MEJORADO
          let score = 0;
          
          // Puntos por marca específica
          const make = makeOrQuery.toLowerCase();
          if (title.includes(make) || snippet.includes(make)) score += 5;
          if (imageUrl.toLowerCase().includes(make)) score += 3;
          
          // Puntos por modelo específico
          if (model) {
            const modelLower = model.toLowerCase();
            if (title.includes(modelLower) || snippet.includes(modelLower)) score += 4;
            if (imageUrl.toLowerCase().includes(modelLower)) score += 2;
          }
          
          // Puntos por año
          if (year) {
            const yearStr = year.toString();
            if (title.includes(yearStr) || snippet.includes(yearStr)) score += 2;
          }
          
          // Puntos por términos de auto
          const carKeywords = ['car', 'auto', 'vehicle', 'sedan', 'suv', 'coupe', 'exterior', 'front'];
          carKeywords.forEach(keyword => {
            if (title.includes(keyword)) score += 1;
            if (snippet.includes(keyword)) score += 0.5;
          });
          
          // BONUS por dominios de confianza
          const trustedDomains = [
            'edmunds.com', 'cars.com', 'autotrader.com', 'caranddriver.com', 
            'motortrend.com', 'toyota.com', 'kia.com', 'hyundai.com',
            'tesla.com', 'nissanusa.com', 'chevrolet.com', 'mitsubishi.com'
          ];
          if (trustedDomains.some(trusted => domain.includes(trusted))) {
            score += 10;
            console.log(`🏆 Sitio de confianza: ${domain} (+10 puntos)`);
          }
          
          // Penalizar términos no deseados
          const badKeywords = ['person', 'people', 'interior', 'dashboard', 'logo', 'emblem'];
          badKeywords.forEach(keyword => {
            if (title.includes(keyword) || snippet.includes(keyword)) score -= 2;
          });
          
          scoredImages.push({
            url: imageUrl,
            score: score,
            title: title
          });
          
        } catch (urlError) {
          console.warn(`⚠️ URL inválida: ${imageUrl}`, urlError);
          continue;
        }
      }
      
      // ✅ Ordenar por puntuación y tomar la mejor
      scoredImages.sort((a, b) => b.score - a.score);
      
      for (const scoredImage of scoredImages) {
        console.log(`🔢 Imagen candidata: ${scoredImage.url.substring(0, 50)}... Score: ${scoredImage.score}`);
        
        if (scoredImage.score >= 3) { // Umbral mínimo
          console.log(`✅ IMAGEN SELECCIONADA! (puntaje: ${scoredImage.score})`);
          
          // Guardar en cache
          imageCache[cacheKey] = scoredImage.url;
          try {
            localStorage.setItem('carImageCache', JSON.stringify(imageCache));
          } catch (e) {
            console.warn('Error saving to localStorage:', e);
          }
          return scoredImage.url;
        }
      }
      
      console.log(`⚠️ No se encontraron imágenes de calidad para "${searchQuery}"`);
    } else {
      console.warn(`⚠️ No se encontraron resultados para: ${searchQuery}`);
    }
    
    // Si llegamos aquí, usar imagen por defecto
    return getDefaultCarImage(makeOrQuery);
    
  } catch (error) {
    console.error(`❌ Error en búsqueda de Google para ${searchQuery}:`, error);
    return getDefaultCarImage(makeOrQuery);
  }
};

// ✅ SIMPLIFICADO: Función para obtener imágenes de alta resolución
export const getHighResCarImage = async (
  make: string,
  model?: string,
  year?: number
): Promise<string> => {
  const searchQuery = model && year 
    ? `${make} ${model} ${year} car high resolution` 
    : `${make} car high resolution`;
  
  console.log(`🔍 Searching high-res image for: ${searchQuery}`);
  
  try {
    const imageUrl = await getCarImageFromGoogle(searchQuery, model, year);
    
    if (imageUrl && !imageUrl.includes('placeholder')) {
      console.log(`✅ High-res image found: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`⚠️ No high-res image found, using standard search`);
    return await getCarImageFromGoogle(make, model, year);
    
  } catch (error) {
    console.error(`❌ High-res search failed for ${searchQuery}:`, error);
    return getDefaultCarImage(make);
  }
};

// ✅ SIMPLIFICADO: Función para buscar múltiples imágenes
export const getMultipleCarImages = async (
  make: string,
  model?: string,
  year?: number,
  count: number = 3
): Promise<string[]> => {
  const searchQuery = model && year 
    ? `${make} ${model} ${year} car` 
    : `${make} car`;
  
  try {
    if (!GOOGLE_SEARCH_URL || !GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.warn('⚠️ Google Search API not configured');
      return Array(count).fill(getDefaultCarImage(make));
    }
    
    console.log(`🔍 Searching multiple images for: ${searchQuery}`);
    
    // ✅ CORREGIDO: Verificar que todas las variables son válidas antes de usar URLSearchParams
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY, // Ya verificamos que no es undefined arriba
      cx: GOOGLE_SEARCH_ENGINE_ID, // Ya verificamos que no es undefined arriba
      q: searchQuery,
      searchType: 'image',
      num: Math.min(count * 2, 10).toString(),
      safe: 'active',
      imgType: 'photo'
    });
    
    const url = `${GOOGLE_SEARCH_URL}?${params.toString()}`;
    const response = await imageSearchClient.get(url, { timeout: 8000 });
    
    const data = response.data as { items?: Array<{ link: string; title?: string; snippet?: string }> };
    const validImages: string[] = [];
    
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (validImages.length >= count) break;
        
        const imageUrl = item.link;
        
        if (!imageUrl || typeof imageUrl !== 'string') continue;
        
        try {
          const urlObj = new URL(imageUrl);
          const domain = urlObj.hostname.toLowerCase();
          
          const badDomains = ['placeholder.com', 'placehold.it', 'via.placeholder.com'];
          const isBadDomain = badDomains.some(bad => domain.includes(bad));
          
          if (!isBadDomain) {
            validImages.push(imageUrl);
            console.log(`✅ Valid image ${validImages.length}: ${imageUrl}`);
          }
          
        } catch {
          continue;
        }
      }
    }
    
    while (validImages.length < count) {
      validImages.push(getDefaultCarImage(make));
    }
    
    console.log(`📸 Found ${validImages.length} images for ${searchQuery}`);
    return validImages;
    
  } catch (error) {
    console.error(`❌ Multiple image search failed for ${searchQuery}:`, error);
    return Array(count).fill(getDefaultCarImage(make));
  }
};

export const getImageQuality = async (imageUrl: string): Promise<'high' | 'medium' | 'low'> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD', mode: 'no-cors' });
    
    const contentLength = response.headers.get('content-length');
    
    if (contentLength) {
      const sizeKB = parseInt(contentLength) / 1024;
      
      if (sizeKB > 500) return 'high';
      if (sizeKB > 100) return 'medium';
      return 'low';
    }
    
    return 'medium';
    
  } catch {
    return 'low';
  }
};

export const clearImageCache = (): void => {
  Object.keys(imageCache).forEach(key => {
    delete imageCache[key];
  });
  console.log('🧹 Image cache cleared');
};

export const getImageCacheStats = () => {
  const cacheSize = Object.keys(imageCache).length;
  const cacheKeys = Object.keys(imageCache);
  
  return {
    size: cacheSize,
    keys: cacheKeys,
    entries: imageCache
  };
};

export const checkImageValidity = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });
    
    clearTimeout(timeoutId);
    
    return response.ok || response.type === 'opaque' || response.status === 0;
    
  } catch {
    return false;
  }
};
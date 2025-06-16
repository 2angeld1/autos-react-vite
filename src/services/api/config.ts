import axios from 'axios';

// ✅ Variables de entorno para Vite (usando import.meta.env)
export const CAR_API_KEY: string | undefined = import.meta.env.VITE_NINJA_API_KEY;
export const CAR_API_URL: string | undefined = import.meta.env.VITE_NINJA_API_URL;
export const GOOGLE_API_KEY: string | undefined = import.meta.env.VITE_GOOGLE_API_KEY;
export const GOOGLE_SEARCH_ENGINE_ID: string | undefined = import.meta.env.VITE_GOOGLE_CSE_ID;
export const GOOGLE_SEARCH_URL: string | undefined = import.meta.env.VITE_GOOGLE_SEARCH_URL;

// Constantes
export const PLACEHOLDER_IMAGE_BASE: string = 'https://placehold.co/';

export const RELIABLE_DOMAINS = [
  'images.unsplash.com',
  'cdn.pixabay.com',
  'images.pexels.com',
  // ✅ Dominios de Google Images
  'googleusercontent.com',
  'gstatic.com',
  'lh3.googleusercontent.com', 
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'lh7.googleusercontent.com',
  // ✅ Dominios de autos
  'cdn.carbuzz.com',
  'cdn.caranddriver.com',
  'media.ed.edmunds-media.com',
  'cdn.bmwgroup.com',
  'cdn.ford.com',
  'cdn.toyota.com',
  'cdn.honda.com',
  'cdn.mercedes-benz.com',
  'cdn.audi.com',
  'media.chevrolet.com',
  'cdn.nissanusa.com',
  'cdn.kia.com',
  'cdn.hyundaiusa.com',
  'cdn.vw.com',
  'cdn.porsche.com',
  'cdn.lexus.com',
  'cdn.tesla.com',
  'static.cargurus.com',
  'inv.assets.ansira.net',
  'platform.cstatic-images.com',
  // ✅ NUEVOS: Más dominios de imágenes válidos
  'i.imgur.com',
  'upload.wikimedia.org',
  'live.staticflickr.com',
  'c1.staticflickr.com',
  'c2.staticflickr.com',
  'images-na.ssl-images-amazon.com',
  'www.topgear.com',
  'cdn.motor1.com',
  'www.motortrend.com',
  'hips.hearstapps.com',
  'www.automobilemag.com'
];

// ✅ REDUCIDO: Solo dominios realmente problemáticos
export const UNRELIABLE_DOMAINS = [
  'buyatoyota.com',
  'di-enrollment-api.s3.amazonaws.com',
  'dealer-assets.com',
  'file.kelleybluebookimages.com', // Solo el específico problemático
  'placeholder.com',
  'placehold.it',
  'via.placeholder.com'
];

export const FALLBACK_URLS = {
  CAR_IMAGE: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
  NO_IMAGE: 'https://placehold.co/800x450/1a1a1a/ffffff?text=Imagen+No+Disponible',
  ERROR_IMAGE: 'https://placehold.co/800x450/dc2626/ffffff?text=Error+de+Imagen'
} as const;

export const REQUEST_TIMEOUTS = {
  CAR_API: 10000,
  IMAGE_SEARCH: 8000,
  IMAGE_LOAD: 5000
} as const;

// Clientes API (sin tipado explícito)
export const carApiClient = axios.create({
  timeout: REQUEST_TIMEOUTS.CAR_API,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(CAR_API_KEY && { 'X-Api-Key': CAR_API_KEY })
  }
});

export const imageSearchClient = axios.create({
  timeout: REQUEST_TIMEOUTS.IMAGE_SEARCH,
  headers: {
    'Accept': 'application/json'
  }
});

// Funciones utilitarias
export const buildGoogleSearchUrl = (searchTerm: string): string | null => {
  if (!GOOGLE_SEARCH_URL || !GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    return null;
  }
  
  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    cx: GOOGLE_SEARCH_ENGINE_ID,
    q: searchTerm,
    searchType: 'image',
    num: '10',
    safe: 'active'
  });
  
  return `${GOOGLE_SEARCH_URL}?${params.toString()}`;
};

export const generatePlaceholderUrl = (
  width = 800, 
  height = 450, 
  text = 'Auto', 
  bgColor = '1a1a1a', 
  textColor = 'ffffff'
): string => {
  const encodedText = encodeURIComponent(text);
  return `${PLACEHOLDER_IMAGE_BASE}${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
};

// Funciones de validación
export const checkApiConfiguration = (): {
  carApi: boolean;
  googleApi: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  const carApi = !!(CAR_API_KEY && CAR_API_URL);
  const googleApi = !!(GOOGLE_API_KEY && GOOGLE_SEARCH_ENGINE_ID && GOOGLE_SEARCH_URL);
  
  if (!carApi) warnings.push('Car API no configurada');
  if (!googleApi) warnings.push('Google API no configurada');
  
  return { carApi, googleApi, warnings };
};

export const checkApiHealth = async (): Promise<{
  carApi: boolean;
  imageApi: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];
  let carApi = false;
  let imageApi = false;

  try {
    if (CAR_API_URL && CAR_API_KEY) {
      await carApiClient.get(`${CAR_API_URL}?limit=1`);
      carApi = true;
    }
  } catch {
    errors.push('Car API no responde');
  }

  try {
    if (GOOGLE_SEARCH_URL && GOOGLE_API_KEY && GOOGLE_SEARCH_ENGINE_ID) {
      const testUrl = buildGoogleSearchUrl('test');
      if (testUrl) {
        await imageSearchClient.get(testUrl);
        imageApi = true;
      }
    }
  } catch {
    errors.push('Google Search API no responde');
  }

  return { carApi, imageApi, errors };
};

// Otras funciones que otros archivos esperan
export const getEnvironmentConfig = () => ({
  CAR_API_KEY,
  CAR_API_URL,
  GOOGLE_API_KEY,
  GOOGLE_SEARCH_ENGINE_ID,
  GOOGLE_SEARCH_URL
});

export const isReliableDomain = (domain: string): boolean => {
  return RELIABLE_DOMAINS.some(reliableDomain => 
    domain.toLowerCase().includes(reliableDomain.toLowerCase())
  );
};

export const getFallbackUrl = (type: keyof typeof FALLBACK_URLS): string => {
  return FALLBACK_URLS[type];
};
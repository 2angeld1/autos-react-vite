import { PLACEHOLDER_IMAGE_BASE } from './config';
import { isReliableImageUrl } from './cache';
import { getDefaultCarImage } from './carBrands';

// ✅ Tipos simples para reemplazar any
type UnknownCarData = Record<string, unknown>;

interface CarData {
  make: string;
  model: string;
  year: number;
}

// Function to generate a guaranteed fallback image URL (new to avoid loop)
export const getGuaranteedImage = (make: string | undefined, model: string | undefined): string => {
  const safeMake = make || 'unknown';
  const brandFallback = getDefaultCarImage(safeMake);

  if (!isReliableImageUrl(brandFallback)) {
    const carText = encodeURIComponent(`${make || 'Car'} ${model || ''}`);
    return `${PLACEHOLDER_IMAGE_BASE}800x450/1a1a1a/ffffff?text=${carText}`;
  }

  return brandFallback;
};

// Function to generate a stable ID based on car properties
export const generateStableId = (car: { make?: string; model?: string; year?: number; cylinders?: number; fuel_type?: string } | null, index: number): string => {
  if (!car) return `car-${index}`;

  const make = car.make || 'unknown';
  const model = car.model || 'unknown';
  const year = car.year || 0;
  const cylinders = car.cylinders || 0;
  const fuelType = car.fuel_type || 'unknown';

  const idBase = `${make}-${model}-${year}-${cylinders}-${fuelType}`;
  let hash = 0;

  for (let i = 0; i < idBase.length; i++) {
    const char = idBase.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `car-${Math.abs(hash)}-${index}`;
};

// ✅ Función auxiliar SIN ANY - versión simple
export const sanitizeCarData = (car: UnknownCarData): CarData => {
  return {
    make: typeof car.make === 'string' ? car.make : 'unknown',
    model: typeof car.model === 'string' ? car.model : 'unknown',
    year: typeof car.year === 'number' ? car.year : new Date().getFullYear()
  };
};

// ✅ Función de validación SIN ANY - versión simple
export const isValidCarData = (car: unknown): car is UnknownCarData => {
  return (
    car !== null &&
    car !== undefined &&
    typeof car === 'object'
  );
};

// ✅ Resto de funciones sin cambios...
export const createPlaceholderImage = (make?: string, model?: string, width = 800, height = 450): string => {
  const carText = encodeURIComponent(`${make || 'Car'} ${model || ''}`.trim());
  return `${PLACEHOLDER_IMAGE_BASE}${width}x${height}/1a1a1a/ffffff?text=${carText}`;
};

export const createCarHash = (input: string): number => {
  let hash = 0;
  if (input.length === 0) return hash;
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash);
};

export const generateCarId = (car: { make?: string; model?: string; year?: number; cylinders?: number; fuel_type?: string } | null, fallbackIndex: number = 0): string => {
  if (!car || !isValidCarData(car)) {
    return `car-fallback-${fallbackIndex}`;
  }

  const sanitized = sanitizeCarData(car);
  const cylinders = car.cylinders || 0;
  const fuelType = car.fuel_type || 'unknown';
  
  const idBase = `${sanitized.make}-${sanitized.model}-${sanitized.year}-${cylinders}-${fuelType}`;
  const hash = createCarHash(idBase);
  
  return `car-${hash}-${fallbackIndex}`;
};
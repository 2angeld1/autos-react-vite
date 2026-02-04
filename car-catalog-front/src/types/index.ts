export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: string[]; // Array de URLs para galería múltiple
  description?: string;
  fuel_type?: string;
  transmission?: string;
  cylinders?: number;
  class?: string;
  trim?: string;
  displacement?: number;
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
  features?: string[]; // Lista de características del vehículo
  isAvailable?: boolean;
}

// ✅ SIMPLIFICADO: Solo marca/modelo y año
export interface SearchFilters {
  searchTerm?: string;
  make?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  year?: string;
  category?: string;
}

export interface CarContextType {
  cars: Car[];
  loading: boolean;
  error: string | null;
  handleSearch: (filters: SearchFilters) => Promise<void>;
  favorites: string[];
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (carId: string) => void;
  getFavorites: () => Car[];
}

export interface Review {
  id: string;
  carId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  car?: {
    make: string;
    model: string;
    year: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number; // ✅ Asegurar que sea number
  price: number;
  image: string;
  description?: string;
  fuel_type?: string;
  transmission?: string;
  cylinders?: number;
  class?: string;
  trim?: string;
  displacement?: number; 
  // ✅ Añadir las propiedades que faltan
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
}

export interface SearchFilters {
  searchTerm?: string;
  year?: string;
  fuelType?: string;
  transmission?: string;
  price?: string;
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

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
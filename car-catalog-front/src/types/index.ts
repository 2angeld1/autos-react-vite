export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
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
}

// ✅ SIMPLIFICADO: Solo marca/modelo y año
export interface SearchFilters {
  searchTerm?: string; // Para marca y modelo
  year?: string;       // Para año
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
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  fuel_type: 'gas' | 'diesel' | 'electricity' | 'hybrid';
  transmission: 'a' | 'm';
  cylinders: number;
  class: string;
  displacement: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  features?: string[];
  image?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  search: string;
  make: string;
  fuelType: string;
  transmission: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  isAvailable: string;
}

export interface CarStats {
  total: number;
  available: number;
  unavailable: number;
  byFuelType: Record<string, number>;
  byMake: Record<string, number>;
  averagePrice: number;
  recentCars: Car[];
}
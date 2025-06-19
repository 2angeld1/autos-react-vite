import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchCars, searchCars } from '../services/api';
import type { Car, SearchFilters } from '@/types';

interface CarContextType {
  cars: Car[];
  loading: boolean;
  error: string | null;
  handleSearch: (filters: SearchFilters) => Promise<void>;
  favorites: string[];
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (carId: string) => void;
  getFavorites: () => Car[];
}

const CarContext = createContext<CarContextType | undefined>(undefined);

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load cars on initial mount
  useEffect(() => {
    const loadInitialCars = async () => {
      try {
        setLoading(true);
        const initialCars = await fetchCars();
        setCars(initialCars);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    // Load favorites from localStorage
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('carFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error('Error loading favorites from localStorage:', err);
      }
    };

    loadFavorites();
    loadInitialCars();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('carFavorites', JSON.stringify(favorites));
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err);
    }
  }, [favorites]);

  // Handle search
  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      const searchResults = await searchCars(filters);
      setCars(searchResults);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Check if a car is a favorite
  const isFavorite = (carId: string): boolean => {
    return favorites.includes(carId);
  };

  // Add or remove a car from favorites
  const toggleFavorite = (carId: string): void => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(carId)) {
        return prevFavorites.filter(id => id !== carId);
      } else {
        return [...prevFavorites, carId];
      }
    });
  };

  // Get favorite cars
  const getFavorites = (): Car[] => {
    return cars.filter(car => favorites.includes(car.id));
  };

  const value: CarContextType = {
    cars,
    loading,
    error,
    handleSearch,
    favorites,
    isFavorite,
    toggleFavorite,
    getFavorites
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCarContext = (): CarContextType => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

// Exportar el contexto para compatibilidad
export { CarContext };
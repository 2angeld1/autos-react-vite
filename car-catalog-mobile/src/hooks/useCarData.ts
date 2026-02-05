import { useState, useEffect } from 'react';
import { fetchCars } from '@/services/api';
import type { Car } from '@/types';

interface UseCarDataReturn {
  cars: Car[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useCarData = (): UseCarDataReturn => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getCars = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Error desconocido al cargar los autos'));
      }
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return { cars, loading, error, refetch: getCars };
};

export default useCarData;
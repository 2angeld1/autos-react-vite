import { useState, useEffect } from 'react';
import { fetchCars } from '@/services/api';
import type { Car } from '@/types';

interface UseCarDataReturn {
  cars: Car[];
  loading: boolean;
  error: Error | null;
}

const useCarData = (): UseCarDataReturn => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getCars = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCars();
        setCars(data);
      } catch (err) {
        // Manejo de errores más específico en TypeScript
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

    getCars();
  }, []);

  return { cars, loading, error };
};

export default useCarData;
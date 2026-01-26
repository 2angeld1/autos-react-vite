import { useState, useEffect } from 'react';
import { fetchCarById, fetchSimilarCars } from '@/services/api';
import type { Car } from '@/types';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';

export const useCarDetail = (id: string) => {
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const data = await fetchCarById(id);
        setCar(data);
        
        if (data && (data.id || (data as any)._id)) {
          const similar = await fetchSimilarCars(data.id || (data as any)._id);
          setSimilarCars(similar);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCar();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCarImage = (car: any) => {
    if (car.image) return car.image;
    if (car.images && car.images.length > 0) return car.images[0];
    if (car.imageUrl) return car.imageUrl;
    return DEFAULT_IMAGE;
  };

  return { car, similarCars, loading, formatPrice, getCarImage };
};

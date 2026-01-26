import { useState, useEffect } from 'react';
import { type Promotion, promotionsService } from '../services/api/promotions';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionsService.getActive();
      setPromotions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  return {
    promotions,
    loading,
    error,
    refresh: fetchPromotions
  };
};

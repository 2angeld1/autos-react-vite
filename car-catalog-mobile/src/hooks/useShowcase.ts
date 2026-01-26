import { useState, useMemo } from 'react';
import useCarData from './useCarData';
import { type SortOption } from '../components/PreferencesModal';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';

export const useShowcase = () => {
  const { cars, loading } = useCarData();
  
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [showPreferences, setShowPreferences] = useState(false);

  const sortedCars = useMemo(() => {
    const filtered = [...cars].filter(car => {
      if (!searchText) return true;
      const lower = searchText.toLowerCase();
      return (
        car.make?.toLowerCase().includes(lower) || 
        car.model?.toLowerCase().includes(lower)
      );
    });

    switch (sortOption) {
      case 'price-asc':
        return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'year-desc':
        return filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
      default:
        return filtered;
    }
  }, [cars, sortOption, searchText]);

  const handleRefresh = (event: CustomEvent<any>) => {
    setTimeout(() => {
      window.location.reload(); 
      event.detail.complete();
    }, 1000);
  };

  const getCarImage = (car: any) => {
    if (car.image) return car.image;
    if (car.images && car.images.length > 0) return car.images[0];
    if (car.imageUrl) return car.imageUrl;
    return DEFAULT_IMAGE;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return {
    sortedCars,
    loading,
    searchText, setSearchText,
    viewMode, setViewMode,
    sortOption, setSortOption,
    showPreferences, setShowPreferences,
    handleRefresh,
    getCarImage,
    formatPrice
  };
};

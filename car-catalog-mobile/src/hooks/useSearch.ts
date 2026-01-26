import { useState, useEffect } from 'react';
import { searchCars, getBrands, fetchCars, type Brand } from '@/services/api';

export const useSearch = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [yearRange, setYearRange] = useState({ lower: 2015, upper: 2024 });
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
      const loadBrands = async () => {
          const data = await getBrands();
          if (data) setBrands(data);
    };
      loadBrands();
    
    // Load initial cars (Catalog)
    const initialLoad = async () => {
       try {
           const res = await fetchCars();
        setResults(res);
       } catch(e) { console.error(e) }
    };
    initialLoad();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const filters: any = {};
      if (selectedMake) filters.searchTerm = selectedMake;
      if (yearRange.lower > 2015) filters.year = yearRange.lower.toString();
      
      const res = await searchCars(filters);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return {
      brands,
    selectedMake, setSelectedMake,
    yearRange, setYearRange,
    results,
    isSearching,
    handleSearch
  };
};

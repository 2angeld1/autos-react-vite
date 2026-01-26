import { useState, useEffect } from 'react';
import { fetchMakes, searchCars } from '@/services/api';

export const useSearch = () => {
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [yearRange, setYearRange] = useState({ lower: 2015, upper: 2024 });
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadMakes = async () => {
      const data = await fetchMakes();
      if (data) setMakes(data);
    };
    loadMakes();
    
    // Load initial cars (Catalog)
    const initialLoad = async () => {
       try {
        const res = await searchCars({});
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
    makes,
    selectedMake, setSelectedMake,
    yearRange, setYearRange,
    results,
    isSearching,
    handleSearch
  };
};

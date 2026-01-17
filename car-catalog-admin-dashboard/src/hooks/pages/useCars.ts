import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, CarFilters } from '@/types';
import { useGet } from '@/hooks/useApi';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export const useCars = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [filters, setFilters] = useState<CarFilters>({
    search: '',
    make: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    isAvailable: '',
  });

  // API hooks
  const {
    data: carsResponse,
    loading: carsLoading,
    execute: fetchCars
  } = useGet<{
    success: boolean;
    data: Car[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    filters: any;
  }>('/cars');

  // Fetch cars when filters or pagination changes
  useEffect(() => {
    fetchCars('', {});
  }, [fetchCars]);

  const handleAddCar = () => {
    navigate('/cars/add');
  };

  const handleEditCar = (car: Car) => {
    navigate(`/cars/${car.id}/edit`);
  };

  const handleDeleteCar = async (car: Car) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el auto "${car.make} ${car.model}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/cars/${car.id}`);
        toast.success('Auto eliminado exitosamente');
        // Refrescar la lista de autos
        fetchCars('', {});
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar el auto');
      }
    }
  };

  const handleViewCar = (car: Car) => {
    navigate(`/cars/${car.id}`);
  };

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      make: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      isAvailable: '',
    });
  };

  return {
    t,
    state: {
      filters,
      carsResponse,
      carsLoading,
    },
    actions: {
      setFilters,
      handleAddCar,
      handleEditCar,
      handleDeleteCar,
      handleViewCar,
      handleFiltersChange,
      handleResetFilters,
    },
  };
};

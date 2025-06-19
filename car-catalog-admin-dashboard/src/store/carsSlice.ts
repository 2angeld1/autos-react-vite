import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import type { Car, CarFilters } from '@/types';

interface CarsState {
  // Data
  cars: Car[];
  currentCar: Car | null;
  totalCars: number;
  totalPages: number;
  currentPage: number;
  
  // Filters and sorting
  filters: CarFilters;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  
  // Loading states
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  fetchCars: (params?: any) => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  createCar: (carData: FormData) => Promise<void>;
  updateCar: (id: string, carData: FormData) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  toggleCarAvailability: (id: string) => Promise<void>;
  setFilters: (filters: Partial<CarFilters>) => void;
  setSorting: (key: string, direction: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  reset: () => void;
}

const initialFilters: CarFilters = {
  search: '',
  make: '',
  fuelType: '',
  transmission: '',
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  isAvailable: '',
};

export const useCarsStore = create<CarsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      cars: [],
      currentCar: null,
      totalCars: 0,
      totalPages: 0,
      currentPage: 1,
      filters: initialFilters,
      sortKey: 'createdAt',
      sortDirection: 'desc',
      loading: false,
      saving: false,
      deleting: false,
      error: null,

      // Actions
      fetchCars: async (params) => {
        set({ loading: true, error: null });
        try {
          const state = get();
          const queryParams = new URLSearchParams();
          
          // Add current state params
          queryParams.append('page', state.currentPage.toString());
          queryParams.append('limit', '10');
          queryParams.append('sortBy', state.sortKey);
          queryParams.append('sortOrder', state.sortDirection);
          
          // Add filters
          Object.entries(state.filters).forEach(([key, value]) => {
            if (value) {
              queryParams.append(key, value);
            }
          });
          
          // Override with custom params if provided
          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                queryParams.set(key, value.toString());
              }
            });
          }

          console.log('🔍 Fetching cars with params:', queryParams.toString());

          const response = await api.get(`/admin/cars?${queryParams.toString()}`);
          
          if (response.data.success) {
            const { cars, total, pages, currentPage } = response.data.data;
            set({
              cars: cars || [],
              totalCars: total || 0,
              totalPages: pages || 0,
              currentPage: currentPage || 1,
              loading: false,
              error: null
            });
          } else {
            throw new Error(response.data.message || 'Failed to fetch cars');
          }
        } catch (error: any) {
          console.error('❌ Error fetching cars:', error);
          set({
            cars: [],
            totalCars: 0,
            totalPages: 0,
            loading: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch cars'
          });
          toast.error('Failed to fetch cars');
        }
      },

      fetchCarById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/cars/${id}`);
          if (response.data.success) {
            set({
              currentCar: response.data.data,
              loading: false,
              error: null
            });
          } else {
            throw new Error(response.data.message || 'Failed to fetch car');
          }
        } catch (error: any) {
          console.error('❌ Error fetching car:', error);
          set({
            currentCar: null,
            loading: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch car'
          });
          toast.error('Failed to fetch car details');
        }
      },

      createCar: async (carData) => {
        set({ saving: true, error: null });
        try {
          const response = await api.post('/cars', carData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (response.data.success) {
            toast.success('Car created successfully');
            // Refresh cars list
            await get().fetchCars();
          } else {
            throw new Error(response.data.message || 'Failed to create car');
          }
        } catch (error: any) {
          console.error('❌ Error creating car:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to create car';
          set({ error: errorMessage, saving: false });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ saving: false });
        }
      },

      updateCar: async (id, carData) => {
        set({ saving: true, error: null });
        try {
          const response = await api.put(`/cars/${id}`, carData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (response.data.success) {
            toast.success('Car updated successfully');
            // Refresh cars list
            await get().fetchCars();
          } else {
            throw new Error(response.data.message || 'Failed to update car');
          }
        } catch (error: any) {
          console.error('❌ Error updating car:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update car';
          set({ error: errorMessage, saving: false });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ saving: false });
        }
      },

      deleteCar: async (id) => {
        set({ deleting: true, error: null });
        try {
          const response = await api.delete(`/cars/${id}`);
          
          if (response.data.success) {
            toast.success('Car deleted successfully');
            // Refresh cars list
            await get().fetchCars();
          } else {
            throw new Error(response.data.message || 'Failed to delete car');
          }
        } catch (error: any) {
          console.error('❌ Error deleting car:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to delete car';
          set({ error: errorMessage, deleting: false });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ deleting: false });
        }
      },

      toggleCarAvailability: async (id) => {
        set({ error: null });
        try {
          const response = await api.patch(`/cars/${id}/toggle-availability`);
          
          if (response.data.success) {
            toast.success('Car availability updated');
            // Refresh cars list
            await get().fetchCars();
          } else {
            throw new Error(response.data.message || 'Failed to update car availability');
          }
        } catch (error: any) {
          console.error('❌ Error toggling car availability:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update car availability';
          set({ error: errorMessage });
          toast.error(errorMessage);
        }
      },

      setFilters: (newFilters) => {
        const state = get();
        set({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        });
      },

      setSorting: (key, direction) => {
        set({
          sortKey: key,
          sortDirection: direction,
          currentPage: 1, // Reset to first page when sorting changes
        });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          cars: [],
          currentCar: null,
          totalCars: 0,
          totalPages: 0,
          currentPage: 1,
          filters: initialFilters,
          sortKey: 'createdAt',
          sortDirection: 'desc',
          loading: false,
          saving: false,
          deleting: false,
          error: null,
        });
      },
    }),
    {
      name: 'cars-store',
    }
  )
);
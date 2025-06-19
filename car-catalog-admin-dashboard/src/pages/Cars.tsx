import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Car, CarFilters } from '@/types';
import { useGet, usePost, usePut } from '@/hooks/useApi';
import Button from '@/components/common/Button';
import { CarTable, CarForm, CarFilters as CarFiltersComponent } from '@/components/cars';
import { Breadcrumb } from '@/components/layout';
import toast from 'react-hot-toast';

const Cars: React.FC = () => {
  const [filters, setFilters] = React.useState<CarFilters>({
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
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortKey, setSortKey] = React.useState<string>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  const [showCarForm, setShowCarForm] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState<Car | undefined>();

  // API hooks
  const { 
    data: carsResponse, 
    loading: carsLoading, 
    execute: fetchCars 
  } = useGet<{ cars: Car[]; total: number; pages: number }>('/admin/cars');

  const { execute: createCar, loading: createLoading } = usePost('/admin/cars');
  const { execute: updateCar, loading: updateLoading } = usePut('/admin/cars');

  // Fetch cars when filters or pagination changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    // Add pagination and sorting
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());
    params.append('sortBy', sortKey);
    params.append('sortOrder', sortDirection);

    fetchCars(`?${params.toString()}`);
  }, [filters, currentPage, sortKey, sortDirection, fetchCars, pageSize]);

  const breadcrumbItems = [
    { label: 'Cars', current: true },
  ];

  const handleAddCar = () => {
    setSelectedCar(undefined);
    setShowCarForm(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setShowCarForm(true);
  };

  const handleDeleteCar = (car: Car) => {
    console.log('Delete car:', car);
  };

  const handleViewCar = (car: Car) => {
    console.log('View car:', car);
  };

  const handleCarSubmit = async (formData: FormData) => {
    try {
      if (selectedCar) {
        await updateCar(`/${selectedCar.id}`, formData);
        toast.success('Car updated successfully');
      } else {
        await createCar('', formData);
        toast.success('Car created successfully');
      }
      setShowCarForm(false);
      fetchCars();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
          <p className="text-gray-600">Manage your car inventory</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success('Export feature coming soon')}
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success('Import feature coming soon')}
            icon={<Upload className="h-4 w-4" />}
          >
            Import
          </Button>
          <Button
            onClick={handleAddCar}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Car
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CarFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        loading={carsLoading}
      />

      {/* Table */}
      <CarTable
        cars={carsResponse?.cars || []}
        loading={carsLoading}
        onEdit={handleEditCar}
        onDelete={handleDeleteCar}
        onView={handleViewCar}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Car Form Modal */}
      <CarForm
        car={selectedCar}
        isOpen={showCarForm}
        onClose={() => setShowCarForm(false)}
        onSubmit={handleCarSubmit}
        loading={createLoading || updateLoading}
      />
    </div>
  );
};

export default Cars;
import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Car, CarFilters } from '@/types';
import { useGet } from '@/hooks/useApi';
import Button from '@/components/common/Button';
import { CarTable, CarFilters as CarFiltersComponent } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import toast from 'react-hot-toast';

const Cars: React.FC = () => {
  const navigate = useNavigate();

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
  React.useEffect(() => {
    fetchCars('', {});
  }, [fetchCars]);

  const breadcrumbItems = [
    { label: 'Cars', current: true },
  ];

  const handleAddCar = () => {
    navigate('/cars/add');
  };

  const handleEditCar = (car: Car) => {
    navigate(`/cars/${car.id}/edit`); // ✅ Ahora sí navega al "edit"
  };

  const handleDeleteCar = (car: Car) => {
    console.log('Delete car:', car);
  };

  const handleViewCar = (car: Car) => {
    navigate(`/cars/${car.id}`); // ✅ Usa el campo id
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
        cars={carsResponse?.data || []}
        loading={carsLoading}
        onEdit={handleEditCar}
        onDelete={handleDeleteCar}
        onView={handleViewCar}
      />
    </div>
  );
};

export default Cars;
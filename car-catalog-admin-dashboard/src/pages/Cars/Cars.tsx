import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Car, CarFilters } from '@/types';
import { useGet } from '@/hooks/useApi';
import Button from '@/components/common/Button';
import { CarTable, CarFilters as CarFiltersComponent } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import { api } from '@/services/api'; // Asegúrate de importar api
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // Agrega esta importación si no está

const Cars: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    { label: t('nav.cars'), current: true },
  ];

  const handleAddCar = () => {
    navigate('/cars/add');
  };

  const handleEditCar = (car: Car) => {
    navigate(`/cars/${car.id}/edit`); // ✅ Ahora sí navega al "edit"
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
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.cars')}</h1>
          <p className="text-gray-600">{t('cars.manageCars')}</p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success(t('common.comingSoon'))}
            icon={<Download className="h-4 w-4" />}
          >
            {t('common.export')}
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success(t('common.comingSoon'))}
            icon={<Upload className="h-4 w-4" />}
          >
            {t('common.import')}
          </Button>
          <Button
            onClick={handleAddCar}
            icon={<Plus className="h-4 w-4" />}
          >
            {t('cars.addCar')}
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
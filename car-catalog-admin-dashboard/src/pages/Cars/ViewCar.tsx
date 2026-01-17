import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '@/components/layout';
import { useGet } from '@/hooks/useApi';
import { Car } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Fuel, 
  Gauge, 
  Calendar, 
  DollarSign,
  Settings2,
  Zap,
  Car as CarIcon,
  Share2,
  Heart,
  Printer,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { formatCurrency } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

// Spec Card Component
const SpecCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
}> = ({ icon, label, value, subValue }) => (
  <motion.div variants={scaleIn} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
    </div>
  </motion.div>
);

// Fuel Efficiency Component
const FuelEfficiency: React.FC<{ city: number; highway: number; combined: number }> = ({ 
  city, highway, combined 
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Droplets className="h-5 w-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">Fuel Efficiency</h3>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-xl">
        <div className="text-2xl font-bold text-blue-600">{city}</div>
        <div className="text-xs text-gray-600 mt-1">City MPG</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-xl">
        <div className="text-2xl font-bold text-green-600">{highway}</div>
        <div className="text-xs text-gray-600 mt-1">Highway MPG</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-xl">
        <div className="text-2xl font-bold text-purple-600">{combined}</div>
        <div className="text-xs text-gray-600 mt-1">Combined MPG</div>
      </div>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min((combined / 50) * 100, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full"
      />
    </div>
    <p className="text-xs text-gray-500 text-center">
      Efficiency rating based on combined MPG (Max: 50 MPG)
    </p>
  </div>
);

const ViewCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: carResponse, loading, execute: fetchCar } = useGet<{
    success: boolean;
    data: Car;
  }>(`/cars/${id}`);

  React.useEffect(() => {
    if (id) {
      fetchCar('', {});
    }
  }, [id, fetchCar]);

  const handleEditCar = () => {
    navigate(`/cars/${id}/edit`);
  };

  const handleDeleteCar = async (car: Car) => {
    const result = await Swal.fire({
      title: '¿Eliminar auto?',
      html: `
        <div class="text-left">
          <p class="text-gray-600 mb-2">Estás a punto de eliminar:</p>
          <p class="font-semibold text-lg">${car.make} ${car.model} ${car.year}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/cars/${car.id}`);
        toast.success('Auto eliminado exitosamente');
        navigate('/cars');
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar el auto');
      }
    }
  };

  const breadcrumbItems = [
    { label: t('nav.cars'), href: '/cars' },
    { label: carResponse?.data ? `${carResponse.data.make} ${carResponse.data.model}` : t('cars.viewCar'), current: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!carResponse?.data) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <CarIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">{t('cars.notFoundTitle') || 'Car not found'}</h2>
        <p className="text-gray-500 mt-2">{t('cars.notFoundMessage') || "The car you're looking for doesn't exist or has been removed."}</p>
        <Button
          variant="primary"
          onClick={() => navigate('/cars')}
          className="mt-6"
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          {t('cars.backToList')}
        </Button>
      </motion.div>
    );
  }

  const car = carResponse.data;

  const fuelTypeLabels: Record<string, string> = {
    gas: 'Gasoline',
    diesel: 'Diesel',
    electricity: 'Electric',
    hybrid: 'Hybrid',
  };

  const transmissionLabels: Record<string, string> = {
    a: 'Automatic',
    m: 'Manual',
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <motion.div variants={slideUp}>
        <Breadcrumb items={breadcrumbItems} />
      </motion.div>

      {/* Header Actions */}
      <motion.div variants={slideUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/cars')}
          icon={<ArrowLeft className="h-4 w-4" />}
          className="self-start"
        >
          {t('cars.backToList')}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
          <Button variant="ghost" size="sm" icon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
          <Button variant="ghost" size="sm" icon={<Heart className="h-4 w-4" />}>
            Save
          </Button>
          <div className="w-px h-6 bg-gray-300" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditCar}
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteCar(car)}
            icon={<Trash2 className="h-4 w-4" />}
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Quick Info */}
        <motion.div variants={staggerContainer} className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <motion.div variants={scaleIn}>
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={car.image?.startsWith('http') ? car.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${car.image}`}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect fill="%23f3f4f6" width="800" height="400"/><text x="400" y="200" text-anchor="middle" fill="%239ca3af" font-size="24">No Image Available</text></svg>';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={car.isAvailable ? 'success' : 'error'}
                    className="text-sm px-3 py-1 shadow-lg"
                  >
                    {car.isAvailable ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        Sold
                      </span>
                    )}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-white/80 text-lg">{car.year}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div variants={slideUp}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            </Card>
          </motion.div>

          {/* Specifications Grid */}
          <motion.div variants={slideUp}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <SpecCard
                    icon={<Calendar className="h-5 w-5" />}
                    label="Year"
                    value={car.year}
                  />
                  <SpecCard
                    icon={<Fuel className="h-5 w-5" />}
                    label="Fuel Type"
                    value={fuelTypeLabels[car.fuel_type] || car.fuel_type}
                  />
                  <SpecCard
                    icon={<Settings2 className="h-5 w-5" />}
                    label="Transmission"
                    value={transmissionLabels[car.transmission] || car.transmission}
                  />
                  <SpecCard
                    icon={<Zap className="h-5 w-5" />}
                    label="Cylinders"
                    value={car.cylinders}
                    subValue="Engine Configuration"
                  />
                  <SpecCard
                    icon={<Gauge className="h-5 w-5" />}
                    label="Displacement"
                    value={`${car.displacement}L`}
                    subValue="Engine Size"
                  />
                  <SpecCard
                    icon={<CarIcon className="h-5 w-5" />}
                    label="Class"
                    value={car.class}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <motion.div variants={slideUp}>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Price & Details */}
        <motion.div variants={staggerContainer} className="space-y-6">
          {/* Price Card */}
          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white overflow-hidden">
              <div className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-primary-100 text-sm font-medium uppercase tracking-wide">Price</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(car.price)}</p>
                <div className="flex items-center gap-2 mt-4 text-primary-100">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Competitive market price</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-6 bg-white text-primary-700 border-white hover:bg-primary-50"
                  icon={<DollarSign className="h-4 w-4" />}
                >
                  Request Quote
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Fuel Efficiency */}
          <motion.div variants={slideUp}>
            <Card>
              <div className="p-6">
                <FuelEfficiency
                  city={car.city_mpg}
                  highway={car.highway_mpg}
                  combined={car.combination_mpg}
                />
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={slideUp}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={handleEditCar}
                    icon={<Edit className="h-4 w-4" />}
                  >
                    Edit Car Details
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => navigate('/cars/add')}
                    icon={<CarIcon className="h-4 w-4" />}
                  >
                    Add Similar Car
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteCar(car)}
                    icon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete This Car
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Meta Info */}
          <motion.div variants={slideUp}>
            <Card>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Car ID</span>
                  <span className="font-mono text-gray-900">{car.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{new Date(car.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewCar;
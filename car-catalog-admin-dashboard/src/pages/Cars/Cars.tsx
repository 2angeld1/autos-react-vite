import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { CarTable, CarFilters as CarFiltersComponent } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import toast from 'react-hot-toast';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';
import { useCars } from '@/hooks/pages/useCars';

const Cars: React.FC = () => {
  const { t, state, actions } = useCars();
  const { filters, carsResponse, carsLoading } = state;

  const breadcrumbItems = [
    { label: t('nav.cars'), current: true },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <motion.div
        variants={staggerContainer}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <motion.div variants={slideUp}>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.cars')}</h1>
          <p className="text-gray-600">{t('cars.manageCars')}</p>
        </motion.div>

        <motion.div variants={slideUp} className="mt-4 sm:mt-0 flex gap-3">
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
            onClick={actions.handleAddCar}
            icon={<Plus className="h-4 w-4" />}
          >
            {t('cars.addCar')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={slideUp}>
        <CarFiltersComponent
          filters={filters}
          onFiltersChange={actions.handleFiltersChange}
          onReset={actions.handleResetFilters}
          loading={carsLoading}
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={slideUp}>
        <CarTable
          cars={carsResponse?.data || []}
          loading={carsLoading}
          onEdit={actions.handleEditCar}
          onDelete={actions.handleDeleteCar}
          onView={actions.handleViewCar}
        />
      </motion.div>
    </motion.div>
  );
};

export default Cars;
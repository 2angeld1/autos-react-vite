import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Car } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Edit, Trash, Eye } from 'lucide-react';

interface CarTableProps {
  cars: Car[];
  loading?: boolean;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onView: (car: Car) => void;
}

const CarTable: React.FC<CarTableProps> = ({
  cars,
  loading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<Car>[] = [
    {
      id: 'image',
      header: '',
      accessorFn: (row) => row.image,
      cell: ({ row }) => {
        const img = row.original.image as string | undefined;
        const src = img
          ? img.startsWith('http')
            ? img
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`
          : undefined;

        return (
          <div className="flex items-center">
            {src ? (
              <img
                src={src}
                alt={`${row.original.make} ${row.original.model}`}
                className="w-20 h-12 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect fill="%23f3f4f6" width="200" height="120"/><text x="100" y="60" text-anchor="middle" fill="%239ca3af" font-size="12">No Image</text></svg>';
                }}
              />
            ) : (
              <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">{t('cars.noImage')}</div>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 80,
    },
    {
      accessorKey: 'make',
      header: t('cars.make'),
    },
    {
      accessorKey: 'model',
      header: t('cars.model'),
    },
    {
      accessorKey: 'year',
      header: t('cars.year'),
    },
    {
      accessorKey: 'price',
      header: t('cars.price'),
      cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
    },
    {
      accessorKey: 'fuel_type',
      header: t('cars.fuelType'),
      cell: ({ getValue }) => <Badge variant="info">{getValue<string>()}</Badge>,
    },
    {
      accessorKey: 'transmission',
      header: t('cars.transmission'),
      cell: ({ getValue }) => <Badge variant="success">{getValue<string>() === 'a' ? t('cars.automatic') : t('cars.manual')}</Badge>,
    },
    {
      accessorKey: 'isAvailable',
      header: t('cars.isAvailable'),
      cell: ({ getValue }) => (
        <Badge variant={getValue<boolean>() ? 'success' : 'error'}>
          {getValue<boolean>() ? t('common.yes') : t('common.no')}
        </Badge>
      ),
    },
    {
      id: 'actions',
        header: t('common.actions'),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
            icon={<Eye className="h-4 w-4" />}
          >
            {t('common.view')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
            icon={<Edit className="h-4 w-4" />}
          >
            {t('common.edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
            icon={<Trash className="h-4 w-4" />}
          >
            {t('common.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={cars}
      columns={columns}
      loading={loading}
      searchable={false}
    />
  );
};

export default CarTable;
import React from 'react';
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
  const columns: ColumnDef<Car>[] = [
    {
      accessorKey: 'make',
      header: 'Marca',
    },
    {
      accessorKey: 'carModel',
      header: 'Modelo',
    },
    {
      accessorKey: 'year',
      header: 'Año',
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
    },
    {
      accessorKey: 'fuel_type',
      header: 'Combustible',
      cell: ({ getValue }) => <Badge variant="info">{getValue<string>()}</Badge>,
    },
    {
      accessorKey: 'transmission',
      header: 'Transmisión',
      cell: ({ getValue }) => <Badge variant="success">{getValue<string>() === 'a' ? 'Automática' : 'Manual'}</Badge>,
    },
    {
      accessorKey: 'isAvailable',
      header: 'Disponible',
      cell: ({ getValue }) => (
        <Badge variant={getValue<boolean>() ? 'success' : 'error'}>
          {getValue<boolean>() ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
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
            Ver
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
            Editar
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
            Eliminar
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
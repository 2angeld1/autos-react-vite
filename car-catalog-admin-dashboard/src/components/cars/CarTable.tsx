import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import Table, { Column } from '@/components/common/Table';
import Button from '@/components/common/Button';
import { Car } from '@/types';

interface CarTableProps {
  cars: Car[];
  loading?: boolean;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onView: (car: Car) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

const CarTable: React.FC<CarTableProps> = ({
  cars,
  loading = false,
  onEdit,
  onDelete,
  onView,
  sortKey,
  sortDirection,
  onSort,
}) => {
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  const columns: Column<Car>[] = [
    {
      key: 'image',
      title: 'Image',
      width: '80px',
      render: (value, record) => (
        <div className="flex-shrink-0">
          <img
            src={value || '/placeholder-car.jpg'}
            alt={`${record.make} ${record.model}`}
            className="h-12 w-16 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
            }}
          />
        </div>
      ),
    },
    {
      key: 'make',
      title: 'Make',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.model}</div>
        </div>
      ),
    },
    {
      key: 'year',
      title: 'Year',
      sortable: true,
      align: 'center',
      width: '100px',
      render: (value) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      align: 'right',
      width: '120px',
      render: (value) => (
        <span className="font-medium text-gray-900">
          ${value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'fuel_type',
      title: 'Fuel Type',
      width: '100px',
      render: (value) => {
        const fuelTypeLabels = {
          gas: 'Gas',
          diesel: 'Diesel',
          electricity: 'Electric',
          hybrid: 'Hybrid',
        };
        const fuelTypeColors = {
          gas: 'bg-blue-100 text-blue-800',
          diesel: 'bg-yellow-100 text-yellow-800',
          electricity: 'bg-green-100 text-green-800',
          hybrid: 'bg-purple-100 text-purple-800',
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fuelTypeColors[value as keyof typeof fuelTypeColors]}`}>
            {fuelTypeLabels[value as keyof typeof fuelTypeLabels]}
          </span>
        );
      },
    },
    {
      key: 'transmission',
      title: 'Trans.',
      width: '80px',
      align: 'center',
      render: (value) => (
        <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
          {value === 'a' ? 'Auto' : 'Manual'}
        </span>
      ),
    },
    {
      key: 'isAvailable',
      title: 'Status',
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Added',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const rowActions = (car: Car) => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowActionsMenu(showActionsMenu === car.id ? null : car.id);
        }}
        icon={<MoreHorizontal className="h-4 w-4" />}
        aria-label="More actions"
      />
      
      {showActionsMenu === car.id && (
        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(car);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(car);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(car);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Close actions menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowActionsMenu(null);
    };

    if (showActionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActionsMenu]);

  return (
    <Table
      columns={columns}
      data={cars}
      loading={loading}
      rowKey="id"
      onSort={onSort}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onRowClick={(car) => onView(car)}
      rowActions={rowActions}
      emptyText="No cars found"
      className="cursor-pointer"
    />
  );
};

export default CarTable;
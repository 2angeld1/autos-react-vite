import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export interface CarFilters {
  search: string;
  make: string;
  fuelType: string;
  transmission: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  isAvailable: string;
}

interface CarFiltersProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

const CarFiltersComponent: React.FC<CarFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateFilter = (key: keyof CarFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'search' && value !== ''
  );

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search cars by make, model, or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={<Filter className="h-4 w-4" />}
          >
            {showAdvanced ? 'Hide' : 'Show'} Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onReset}
              icon={<X className="h-4 w-4" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <select
                value={filters.make}
                onChange={(e) => updateFilter('make', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Makes</option>
                <option value="Acura">Acura</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Lexus">Lexus</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Nissan">Nissan</option>
                <option value="Tesla">Tesla</option>
                <option value="Toyota">Toyota</option>
                <option value="Volkswagen">Volkswagen</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => updateFilter('fuelType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Fuel Types</option>
                <option value="gas">Gas</option>
                <option value="diesel">Diesel</option>
                <option value="electricity">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => updateFilter('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Transmissions</option>
                <option value="a">Automatic</option>
                <option value="m">Manual</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={filters.isAvailable}
                onChange={(e) => updateFilter('isAvailable', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Price and Year Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="text-sm"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Range
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min Year"
                  min="1990"
                  max={currentYear}
                  value={filters.minYear}
                  onChange={(e) => updateFilter('minYear', e.target.value)}
                  className="text-sm"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  placeholder="Max Year"
                  min="1990"
                  max={currentYear}
                  value={filters.maxYear}
                  onChange={(e) => updateFilter('maxYear', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-500">Active filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (key === 'search' || !value) return null;
                
                let label = key;
                let displayValue = value;

                // Format labels and values
                switch (key) {
                  case 'fuelType':
                    label = 'Fuel';
                    displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                    break;
                  case 'transmission':
                    label = 'Trans';
                    displayValue = value === 'a' ? 'Auto' : 'Manual';
                    break;
                  case 'isAvailable':
                    label = 'Status';
                    displayValue = value === 'true' ? 'Available' : 'Unavailable';
                    break;
                  case 'minPrice':
                    label = 'Min Price';
                    displayValue = `$${parseInt(value).toLocaleString()}`;
                    break;
                  case 'maxPrice':
                    label = 'Max Price';
                    displayValue = `$${parseInt(value).toLocaleString()}`;
                    break;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                  >
                    {label}: {displayValue}
                    <button
                      onClick={() => updateFilter(key as keyof CarFilters, '')}
                      className="hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarFiltersComponent;
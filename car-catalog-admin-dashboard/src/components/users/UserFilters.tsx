import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export interface UserFilters {
  search: string;
  role: string;
  isActive: string;
  lastLoginDays: string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateFilter = (key: keyof UserFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'search' && value !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users by name or email..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => updateFilter('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => updateFilter('isActive', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Last Login */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Login
              </label>
              <select
                value={filters.lastLoginDays}
                onChange={(e) => updateFilter('lastLoginDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">Any Time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="never">Never logged in</option>
              </select>
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
                  case 'role':
                    label = 'Role';
                    displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                    break;
                  case 'isActive':
                    label = 'Status';
                    displayValue = value === 'true' ? 'Active' : 'Inactive';
                    break;
                  case 'lastLoginDays':
                    label = 'Last Login';
                    if (value === 'never') {
                      displayValue = 'Never';
                    } else {
                      displayValue = `Last ${value} days`;
                    }
                    break;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                  >
                    {label}: {displayValue}
                    <button
                      onClick={() => updateFilter(key as keyof UserFilters, '')}
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

export default UserFiltersComponent;
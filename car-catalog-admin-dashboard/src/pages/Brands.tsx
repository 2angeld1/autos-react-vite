import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Car,
  Globe,
  MapPin,
  MoreVertical,
  TrendingUp,
  Eye
} from 'lucide-react';
import Button from '@/components/common/Button';

// Mock data for brands
const mockBrands = [
  {
    id: '1',
    name: 'Toyota',
    country: 'Japan',
    founded: 1937,
    logo: '/api/placeholder/80/80',
    carsCount: 45,
    website: 'https://toyota.com',
    status: 'active',
    featured: true
  },
  {
    id: '2',
    name: 'BMW',
    country: 'Germany',
    founded: 1916,
    logo: '/api/placeholder/80/80',
    carsCount: 38,
    website: 'https://bmw.com',
    status: 'active',
    featured: true
  },
  {
    id: '3',
    name: 'Ford',
    country: 'USA',
    founded: 1903,
    logo: '/api/placeholder/80/80',
    carsCount: 32,
    website: 'https://ford.com',
    status: 'active',
    featured: false
  },
  {
    id: '4',
    name: 'Mercedes-Benz',
    country: 'Germany',
    founded: 1926,
    logo: '/api/placeholder/80/80',
    carsCount: 41,
    website: 'https://mercedes-benz.com',
    status: 'active',
    featured: true
  },
  {
    id: '5',
    name: 'Honda',
    country: 'Japan',
    founded: 1948,
    logo: '/api/placeholder/80/80',
    carsCount: 28,
    website: 'https://honda.com',
    status: 'active',
    featured: false
  },
  {
    id: '6',
    name: 'Chevrolet',
    country: 'USA',
    founded: 1911,
    logo: '/api/placeholder/80/80',
    carsCount: 25,
    website: 'https://chevrolet.com',
    status: 'active',
    featured: false
  },
  {
    id: '7',
    name: 'Audi',
    country: 'Germany',
    founded: 1909,
    logo: '/api/placeholder/80/80',
    carsCount: 35,
    website: 'https://audi.com',
    status: 'active',
    featured: true
  },
  {
    id: '8',
    name: 'Tesla',
    country: 'USA',
    founded: 2003,
    logo: '/api/placeholder/80/80',
    carsCount: 8,
    website: 'https://tesla.com',
    status: 'active',
    featured: true
  },
];

const countries = ['All', 'Japan', 'Germany', 'USA', 'Italy', 'UK'];

const Brands: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || brand.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const totalCars = mockBrands.reduce((sum, brand) => sum + brand.carsCount, 0);
  const featuredCount = mockBrands.filter(b => b.featured).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                <Building2 className="h-7 w-7" />
              </div>
              Brands
            </h1>
            <p className="text-gray-500 mt-1">Manage car manufacturers and brands</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Add Brand
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Brands</p>
              <p className="text-2xl font-bold text-gray-900">{mockBrands.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{totalCars}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured Brands</p>
              <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Countries</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(mockBrands.map(b => b.country)).size}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 items-center">
            <MapPin className="h-5 w-5 text-gray-400" />
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCountry === country
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBrands.map(brand => (
          <div
            key={brand.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  {brand.featured && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{brand.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{brand.country}</span>
                <span className="text-gray-300">•</span>
                <span>Founded {brand.founded}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">{brand.carsCount}</span>
                  <span className="text-sm text-gray-500">cars</span>
                </div>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="flex-1" icon={<Eye className="h-4 w-4" />}>
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" icon={<Edit2 className="h-4 w-4" />}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" icon={<Trash2 className="h-4 w-4" />}>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No brands found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Brands;

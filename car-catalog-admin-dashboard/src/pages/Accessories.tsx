import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  Tag,
  MoreVertical,
  Eye
} from 'lucide-react';
import Button from '@/components/common/Button';

// Mock data for accessories
const mockAccessories = [
  {
    id: '1',
    name: 'Premium Floor Mats Set',
    category: 'Interior',
    price: 89.99,
    stock: 45,
    compatible: ['Sedan', 'SUV', 'Coupe'],
    image: '/api/placeholder/100/100',
    status: 'active'
  },
  {
    id: '2',
    name: 'Roof Cargo Box 500L',
    category: 'Exterior',
    price: 349.99,
    stock: 12,
    compatible: ['SUV', 'Wagon'],
    image: '/api/placeholder/100/100',
    status: 'active'
  },
  {
    id: '3',
    name: 'LED Headlight Upgrade Kit',
    category: 'Lighting',
    price: 199.99,
    stock: 28,
    compatible: ['Sedan', 'SUV', 'Coupe', 'Truck'],
    image: '/api/placeholder/100/100',
    status: 'active'
  },
  {
    id: '4',
    name: 'Wireless Phone Charger Mount',
    category: 'Electronics',
    price: 45.99,
    stock: 67,
    compatible: ['All'],
    image: '/api/placeholder/100/100',
    status: 'active'
  },
  {
    id: '5',
    name: 'All-Weather Trunk Liner',
    category: 'Interior',
    price: 75.00,
    stock: 0,
    compatible: ['Sedan', 'Coupe'],
    image: '/api/placeholder/100/100',
    status: 'out_of_stock'
  },
  {
    id: '6',
    name: 'Performance Air Filter',
    category: 'Performance',
    price: 54.99,
    stock: 89,
    compatible: ['All'],
    image: '/api/placeholder/100/100',
    status: 'active'
  },
];

const categories = ['All', 'Interior', 'Exterior', 'Lighting', 'Electronics', 'Performance'];

const Accessories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAccessories = mockAccessories.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || acc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = mockAccessories.reduce((sum, acc) => sum + (acc.price * acc.stock), 0);
  const totalItems = mockAccessories.reduce((sum, acc) => sum + acc.stock, 0);
  const outOfStock = mockAccessories.filter(acc => acc.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
                <Wrench className="h-7 w-7" />
              </div>
              Accessories
            </h1>
            <p className="text-gray-500 mt-1">Manage car accessories and parts inventory</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Add Accessory
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{mockAccessories.length}</p>
            </div>
            <div className="p-3 bg-violet-100 rounded-lg">
              <Package className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="h-5 w-5 text-gray-400" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccessories.map(accessory => (
          <div
            key={accessory.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{accessory.name}</h3>
                    <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                      {accessory.category}
                    </span>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-bold text-gray-900">${accessory.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className={`text-lg font-bold ${accessory.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {accessory.stock} units
                  </p>
                </div>
              </div>

              <div className="py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Compatible with:</p>
                <div className="flex flex-wrap gap-1">
                  {accessory.compatible.map(type => (
                    <span
                      key={type}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
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

      {filteredAccessories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No accessories found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Accessories;

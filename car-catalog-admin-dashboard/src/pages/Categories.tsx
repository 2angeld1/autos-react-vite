import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Car,
  FolderTree,
  ChevronRight,
  MoreVertical,
  GripVertical,
  Eye,
  Image
} from 'lucide-react';
import Button from '@/components/common/Button';

// Mock data for categories
const mockCategories = [
  {
    id: '1',
    name: 'Sedans',
    slug: 'sedans',
    description: 'Compact and mid-size sedans for everyday driving',
    carsCount: 45,
    image: '/api/placeholder/200/120',
    featured: true,
    status: 'active',
    children: [
      { id: '1-1', name: 'Compact Sedans', carsCount: 18 },
      { id: '1-2', name: 'Mid-Size Sedans', carsCount: 15 },
      { id: '1-3', name: 'Full-Size Sedans', carsCount: 12 },
    ]
  },
  {
    id: '2',
    name: 'SUVs',
    slug: 'suvs',
    description: 'Sport utility vehicles for adventure and family',
    carsCount: 62,
    image: '/api/placeholder/200/120',
    featured: true,
    status: 'active',
    children: [
      { id: '2-1', name: 'Compact SUVs', carsCount: 22 },
      { id: '2-2', name: 'Mid-Size SUVs', carsCount: 25 },
      { id: '2-3', name: 'Full-Size SUVs', carsCount: 15 },
    ]
  },
  {
    id: '3',
    name: 'Sports Cars',
    slug: 'sports-cars',
    description: 'High-performance vehicles for driving enthusiasts',
    carsCount: 28,
    image: '/api/placeholder/200/120',
    featured: true,
    status: 'active',
    children: [
      { id: '3-1', name: 'Coupes', carsCount: 16 },
      { id: '3-2', name: 'Convertibles', carsCount: 12 },
    ]
  },
  {
    id: '4',
    name: 'Trucks',
    slug: 'trucks',
    description: 'Pickup trucks for work and recreation',
    carsCount: 35,
    image: '/api/placeholder/200/120',
    featured: false,
    status: 'active',
    children: [
      { id: '4-1', name: 'Light-Duty Trucks', carsCount: 20 },
      { id: '4-2', name: 'Heavy-Duty Trucks', carsCount: 15 },
    ]
  },
  {
    id: '5',
    name: 'Electric Vehicles',
    slug: 'electric',
    description: 'Zero-emission electric cars',
    carsCount: 24,
    image: '/api/placeholder/200/120',
    featured: true,
    status: 'active',
    children: []
  },
  {
    id: '6',
    name: 'Hybrid',
    slug: 'hybrid',
    description: 'Fuel-efficient hybrid vehicles',
    carsCount: 18,
    image: '/api/placeholder/200/120',
    featured: false,
    status: 'active',
    children: []
  },
  {
    id: '7',
    name: 'Luxury',
    slug: 'luxury',
    description: 'Premium luxury automobiles',
    carsCount: 42,
    image: '/api/placeholder/200/120',
    featured: true,
    status: 'active',
    children: [
      { id: '7-1', name: 'Luxury Sedans', carsCount: 18 },
      { id: '7-2', name: 'Luxury SUVs', carsCount: 24 },
    ]
  },
  {
    id: '8',
    name: 'Vans & Minivans',
    slug: 'vans',
    description: 'Family and commercial vans',
    carsCount: 12,
    image: '/api/placeholder/200/120',
    featured: false,
    status: 'inactive',
    children: []
  },
];

const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = mockCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCars = mockCategories.reduce((sum, cat) => sum + cat.carsCount, 0);
  const activeCategories = mockCategories.filter(c => c.status === 'active').length;
  const featuredCategories = mockCategories.filter(c => c.featured).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white">
                <Tag className="h-7 w-7" />
              </div>
              Categories
            </h1>
            <p className="text-gray-500 mt-1">Organize cars into categories and subcategories</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{mockCategories.length}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <FolderTree className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Categories</p>
              <p className="text-2xl font-bold text-green-600">{activeCategories}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-amber-600">{featuredCategories}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Tag className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{totalCars}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredCategories.map(category => (
            <div key={category.id}>
              {/* Main Category */}
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <button className="p-1 text-gray-400 hover:text-gray-600 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </button>

                  {/* Expand Toggle */}
                  {category.children.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedCategories.has(category.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="w-7" />
                  )}

                  {/* Category Image */}
                  <div className="w-20 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.featured && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                          Featured
                        </span>
                      )}
                      {category.status === 'inactive' && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{category.description}</p>
                  </div>

                  {/* Slug */}
                  <div className="hidden lg:block">
                    <p className="text-xs text-gray-400">Slug</p>
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      /{category.slug}
                    </code>
                  </div>

                  {/* Cars Count */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Cars</p>
                    <p className="font-bold text-gray-900">{category.carsCount}</p>
                  </div>

                  {/* Subcategories Count */}
                  <div className="text-center hidden md:block">
                    <p className="text-xs text-gray-400">Subcategories</p>
                    <p className="font-bold text-gray-900">{category.children.length}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />} />
                    <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50" 
                      icon={<Trash2 className="h-4 w-4" />} 
                    />
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories.has(category.id) && category.children.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {category.children.map((sub, index) => (
                    <div
                      key={sub.id}
                      className={`flex items-center gap-4 px-4 py-3 ml-16 ${
                        index !== category.children.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <GripVertical className="h-4 w-4 text-gray-300" />
                      <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{sub.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Car className="h-4 w-4" />
                        <span>{sub.carsCount} cars</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" icon={<Edit2 className="h-3 w-3" />} />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50" 
                          icon={<Trash2 className="h-3 w-3" />} 
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 px-4 py-3 ml-16">
                    <div className="w-4" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-pink-600 hover:bg-pink-50"
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add Subcategory
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Categories;

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  MapPin,
  TrendingUp,
  Loader2,
  Check
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import BrandForm from '@/components/brands/BrandForm';
import { inventoryService, Brand } from '@/services/inventory';
import toast from 'react-hot-toast';

const countries = ['All', 'Japan', 'Germany', 'USA', 'Italy', 'UK', 'France', 'South Korea'];

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getBrands();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = () => {
    setEditingBrand(undefined);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      const response = await inventoryService.deleteBrand(id);
      if (response.success) {
        toast.success('Brand deleted successfully');
        fetchBrands();
      }
    } catch (error) {
      toast.error('Failed to delete brand');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingBrand) {
        await inventoryService.updateBrand(editingBrand._id, formData);
        toast.success('Brand updated successfully');
      } else {
        await inventoryService.createBrand(formData);
        toast.success('Brand created successfully');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error('Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || brand.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const featuredCount = brands.filter(b => b.featured).length;

  if (loading && brands.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

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
            onClick={handleAddBrand}
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
              <p className="text-2xl font-bold text-gray-900">{brands.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured Brands</p>
              <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Countries</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(brands.map(b => b.country)).size}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{brands.filter(b => b.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
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
          <div className="flex gap-2 items-center flex-wrap">
            <MapPin className="h-5 w-5 text-gray-400" />
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCountry === country
                    ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
            key={brand._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {brand.featured && (
                    <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  {brand.status === 'inactive' && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{brand.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{brand.country}</span>
                {brand.founded && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>Founded {brand.founded}</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm truncate max-w-[150px]"
                  >
                    {brand.website || 'No website'}
                  </a>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="flex-1" icon={<Edit2 className="h-4 w-4" />} onClick={() => handleEditBrand(brand)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDeleteBrand(brand._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No brands found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <BrandForm
          brand={editingBrand}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Brands;

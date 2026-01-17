import React from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import AccessoryForm from '@/components/accessories/AccessoryForm';
import { useAccessories } from '@/hooks/pages/useAccessories';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

const Accessories: React.FC = () => {
  const { state, actions } = useAccessories();
  const {
    accessories,
    loading,
    searchTerm,
    selectedCategory,
    isModalOpen,
    editingAccessory,
    isSubmitting,
    filteredAccessories,
    stats,
    categories,
  } = state;

  if (loading && accessories.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gray-50 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <motion.div variants={scaleIn} className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white">
                <Package className="h-7 w-7" />
              </motion.div>
              Accessories
            </h1>
            <p className="text-gray-500 mt-1">Manage car parts, add-ons and accessories</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
            onClick={actions.handleAddAccessory}
          >
            Add Accessory
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Accessories</p>
              <p className="text-2xl font-bold text-gray-900">{accessories.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="h-5 w-5 text-gray-400" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => actions.setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Accessories Table-like Grid */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAccessories.map(accessory => (
                <tr key={accessory._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                        {accessory.image ? (
                          <img src={accessory.image} alt={accessory.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{accessory.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {accessory.compatible?.join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium border dark:border-gray-600">
                      {accessory.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">${accessory.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${accessory.stock === 0 ? 'text-red-600' :
                        accessory.stock < 10 ? 'text-amber-600' :
                          'text-gray-900'
                        }`}>
                        {accessory.stock}
                      </span>
                      <span className="text-gray-400 text-xs">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {accessory.stock === 0 ? (
                      <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                        <Package className="h-4 w-4" /> Out of stock
                      </span>
                    ) : accessory.stock < 10 ? (
                      <span className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                        <AlertTriangle className="h-4 w-4" /> Low stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" /> In stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} onClick={() => actions.handleEditAccessory(accessory)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => actions.handleDeleteAccessory(accessory._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredAccessories.length === 0 && !loading && (
        <motion.div variants={slideUp} className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No accessories found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        size="md"
        title={editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}
      >
        <AccessoryForm
          accessory={editingAccessory}
          onSubmit={actions.handleSubmit}
          onClose={() => actions.setIsModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>
    </motion.div>
  );
};

export default Accessories;

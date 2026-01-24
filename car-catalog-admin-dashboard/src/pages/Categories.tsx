import React from 'react';
import {Tag,Plus,Search,Edit2,Trash2,FolderTree,ChevronRight,Image as ImageIcon,Loader2} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import CategoryForm from '@/components/categories/CategoryForm';
import { useCategories } from '@/hooks/pages/useCategories';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

const Categories: React.FC = () => {
  const { state, actions } = useCategories();
  const {categories,loading,searchTerm,expandedCategories,isModalOpen,editingCategory,isSubmitting,mainCategories,} = state;

  if (loading && categories.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-pink-600 animate-spin" />
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
              <motion.div variants={scaleIn} className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white">
                <Tag className="h-7 w-7" />
              </motion.div>
              Categories
            </h1>
            <p className="text-gray-500 mt-1">Organize cars into categories and subcategories</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
            className="bg-pink-600 hover:bg-pink-700 border-pink-600"
            onClick={actions.handleAddCategory}
          >
            Add Category
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <FolderTree className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-amber-600">{categories.filter(c => c.featured).length}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Tag className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subcategories</p>
              <p className="text-2xl font-bold text-blue-600">{categories.filter(c => c.parentCategory).length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderTree className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Categories List */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {mainCategories.map(category => {
            const subs = actions.getSubcategories(category._id);
            return (
              <div key={category._id}>
                {/* Main Category */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Expand Toggle */}
                    {subs.length > 0 ? (
                      <button
                        onClick={() => actions.toggleExpand(category._id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ChevronRight
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            expandedCategories.has(category._id) ? 'rotate-90' : ''
                            }`}
                        />
                      </button>
                    ) : (
                      <div className="w-7" />
                    )}

                    {/* Category Image */}
                    <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
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
                      <p className="text-sm text-gray-500 truncate">{category.description || 'No description'}</p>
                    </div>

                    {/* Slug */}
                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-400">Slug</p>
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        /{category.slug}
                      </code>
                    </div>

                    {/* Subcategories Count */}
                    <div className="text-center hidden md:block w-32">
                      <p className="text-xs text-gray-400">Subcategories</p>
                      <p className="font-bold text-gray-900">{subs.length}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} onClick={() => actions.handleEditCategory(category)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => actions.handleDeleteCategory(category._id)}
                      />
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                <AnimatePresence>
                  {expandedCategories.has(category._id) && subs.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border-t border-gray-100 overflow-hidden"
                    >
                      {subs.map((sub, index) => (
                        <div
                          key={sub._id}
                          className={`flex items-center gap-4 px-4 py-3 ml-12 ${index !== subs.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                        >
                          <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-700">{sub.name}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" icon={<Edit2 className="h-3 w-3" />} onClick={() => actions.handleEditCategory(sub)} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              icon={<Trash2 className="h-3 w-3" />}
                              onClick={() => actions.handleDeleteCategory(sub._id)}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {mainCategories.length === 0 && !loading && (
        <motion.div variants={slideUp} className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </motion.div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        size="lg"
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={actions.handleSubmit}
          onClose={() => actions.setIsModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>
    </motion.div>
  );
};

export default Categories;

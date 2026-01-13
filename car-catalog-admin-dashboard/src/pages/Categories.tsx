import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderTree,
  ChevronRight,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import CategoryForm from '@/components/categories/CategoryForm';
import { inventoryService, Category } from '@/services/inventory';
import toast from 'react-hot-toast';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All its subcategories will become top-level or orphaned. Continue?')) return;
    try {
      const response = await inventoryService.deleteCategory(id);
      if (response.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await inventoryService.updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await inventoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories by parent
  const mainCategories = filteredCategories.filter(c => !c.parentCategory);
  const getSubcategories = (parentId: string) =>
    categories.filter(c => {
      const pId = typeof c.parentCategory === 'string'
        ? c.parentCategory
        : c.parentCategory?._id;
      return pId === parentId;
    });

  if (loading && categories.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-pink-600 animate-spin" />
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
            className="bg-pink-600 hover:bg-pink-700 border-pink-600"
            onClick={handleAddCategory}
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
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <FolderTree className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.status === 'active').length}</p>
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
              <p className="text-2xl font-bold text-amber-600">{categories.filter(c => c.featured).length}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Tag className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subcategories</p>
              <p className="text-2xl font-bold text-blue-600">{categories.filter(c => c.parentCategory).length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderTree className="h-6 w-6 text-blue-600" />
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
          {mainCategories.map(category => {
            const subs = getSubcategories(category._id);
            return (
              <div key={category._id}>
                {/* Main Category */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Expand Toggle */}
                    {subs.length > 0 ? (
                      <button
                        onClick={() => toggleExpand(category._id)}
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
                      <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} onClick={() => handleEditCategory(category)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => handleDeleteCategory(category._id)}
                      />
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category._id) && subs.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100">
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
                          <Button variant="ghost" size="sm" icon={<Edit2 className="h-3 w-3" />} onClick={() => handleEditCategory(sub)} />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            icon={<Trash2 className="h-3 w-3" />}
                            onClick={() => handleDeleteCategory(sub._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {mainCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Categories;

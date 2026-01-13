import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tag, X, Plus, Check, FolderTree, AlignLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Category } from '@/services/inventory';

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  featured: boolean;
  parentCategory: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories, onSubmit, onClose, loading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormData>({
    defaultValues: category ? {
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
      featured: category.featured,
      parentCategory: typeof category.parentCategory === 'string' 
        ? category.parentCategory 
        : category.parentCategory?._id || ''
    } : {
      status: 'active',
      featured: false,
      parentCategory: ''
    }
  });

  const nameValue = watch('name');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (!category && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-0]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, setValue, category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'parentCategory' && !value) return;
      formData.append(key, value.toString());
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    await onSubmit(formData);
  };

  const availableParents = categories.filter(c => c._id !== category?._id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <form id="category-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-pink-500 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Tag className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/10 rounded-xl transition-opacity flex items-center justify-center">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Plus className="h-4 w-4 text-gray-600" />
              </div>
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Category Cover</h3>
            <p className="text-sm text-gray-500 mt-1">Recommended size 800x450px.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Category Name"
            startIcon={<Tag className="h-4 w-4" />}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="e.g. Sedans"
          />
          <Input
            label="Slug"
            startIcon={<AlignLeft className="h-4 w-4" />}
            {...register('slug', { required: 'Slug is required' })}
            error={errors.slug?.message}
            placeholder="e.g. sedans"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <textarea
             {...register('description')}
             rows={3}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
             placeholder="Describe this category..."
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <div className="relative">
              <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                {...register('parentCategory')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm appearance-none"
              >
                <option value="">None (Top Level)</option>
                {availableParents.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer group pt-2">
          <div className="relative">
            <input
              type="checkbox"
              {...register('featured')}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </div>
          <span className="text-sm font-medium text-gray-700">Display on Home / Featured</span>
        </label>
      </form>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="category-form"
          variant="primary"
          className="bg-pink-600 hover:bg-pink-700 border-pink-600"
          loading={loading}
          icon={<Check className="h-4 w-4" />}
        >
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryForm;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, X, Plus, Check, DollarSign, Package, Car } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Accessory } from '@/services/inventory';

interface AccessoryFormProps {
  accessory?: Accessory;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface AccessoryFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  compatible: string;
  status: 'active' | 'out_of_stock' | 'inactive';
}

const AccessoryForm: React.FC<AccessoryFormProps> = ({ accessory, onSubmit, onClose, loading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(accessory?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AccessoryFormData>({
    defaultValues: accessory ? {
      name: accessory.name,
      category: accessory.category,
      price: accessory.price,
      stock: accessory.stock,
      compatible: accessory.compatible?.join(', ') || '',
      status: accessory.status
    } : {
      status: 'active',
      price: 0,
      stock: 0
    }
  });

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

  const onFormSubmit = async (data: AccessoryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'compatible') {
        const compatibleArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
        formData.append(key, JSON.stringify(compatibleArray));
      } else {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">
          {accessory ? 'Edit Accessory' : 'Add New Accessory'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <form id="accessory-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Package className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/10 rounded-2xl transition-opacity flex items-center justify-center">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Plus className="h-4 w-4 text-gray-600" />
              </div>
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Accessory Photo</h3>
            <p className="text-sm text-gray-500 mt-1">Clear photo of the item.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Accessory Name"
            startIcon={<Settings className="h-4 w-4" />}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="e.g. Roof Rack"
          />
          <Input
            label="Category"
            startIcon={<Package className="h-4 w-4" />}
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
            placeholder="e.g. Exterior"
          />
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            startIcon={<DollarSign className="h-4 w-4" />}
            {...register('price', { required: 'Price is required' })}
            error={errors.price?.message}
          />
          <Input
            label="Stock Quantity"
            type="number"
            startIcon={<Package className="h-4 w-4" />}
            {...register('stock', { required: 'Stock is required' })}
            error={errors.stock?.message}
          />
        </div>

        <Input
          label="Compatible Models"
          startIcon={<Car className="h-4 w-4" />}
          {...register('compatible')}
          placeholder="e.g. Toyota Camry, Honda Accord"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="accessory-form"
          variant="primary"
          loading={loading}
          icon={<Check className="h-4 w-4" />}
        >
          {accessory ? 'Update Accessory' : 'Create Accessory'}
        </Button>
      </div>
    </div>
  );
};

export default AccessoryForm;

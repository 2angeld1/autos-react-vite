import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Plus, Globe, Calendar, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Brand } from '@/services/inventory';

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface BrandFormData {
  name: string;
  country: string;
  founded: number;
  website: string;
  status: 'active' | 'inactive';
  featured: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSubmit, onClose, loading }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BrandFormData>({
    defaultValues: brand ? {
      name: brand.name,
      country: brand.country,
      founded: brand.founded,
      website: brand.website,
      status: brand.status,
      featured: brand.featured
    } : {
      status: 'active',
      featured: false
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: BrandFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">


      <form id="brand-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/10 rounded-2xl transition-opacity flex items-center justify-center">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Plus className="h-4 w-4 text-gray-600" />
              </div>
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Brand Logo</h3>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG or SVG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Brand Name"
            startIcon={<Building2 className="h-4 w-4" />}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="e.g. Toyota"
          />
          <Input
            label="Country"
            startIcon={<Globe className="h-4 w-4" />}
            {...register('country', { required: 'Country is required' })}
            error={errors.country?.message}
            placeholder="e.g. Japan"
          />
          <Input
            label="Founded Year"
            type="number"
            startIcon={<Calendar className="h-4 w-4" />}
            {...register('founded')}
            placeholder="e.g. 1937"
          />
          <Input
            label="Website"
            startIcon={<Globe className="h-4 w-4" />}
            {...register('website')}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                {...register('featured')}
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Featured Brand</span>
          </label>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              {...register('status')}
              className="text-sm border-gray-200 rounded-lg focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </form>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="brand-form"
          variant="primary"
          loading={loading}
          icon={<Check className="h-4 w-4" />}
        >
          {brand ? 'Update Brand' : 'Create Brand'}
        </Button>
      </div>
    </div>
  );
};

export default BrandForm;

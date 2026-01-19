import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Percent, Check, Calendar, Tag, DollarSign, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Dropzone } from '@/components/common';
import { ImagePicker } from '@/components/files';
import { Promotion } from '@/services/promotions';
import { FileItem } from '@/types';
import { filesService } from '@/services/files';

interface PromotionFormProps {
  promotion?: Promotion;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface PromotionFormData {
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  applicableTo: string;
  description: string;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onSubmit, onClose, loading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(promotion?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileItem, setSelectedFileItem] = useState<FileItem | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromotionFormData>({
    defaultValues: promotion ? {
      name: promotion.name,
      code: promotion.code,
      type: promotion.type,
      value: promotion.value,
      minPurchase: promotion.minPurchase || 0,
      maxDiscount: promotion.maxDiscount || 0,
      startDate: formatDate(promotion.startDate),
      endDate: formatDate(promotion.endDate),
      usageLimit: promotion.usageLimit,
      applicableTo: promotion.applicableTo || '',
      description: promotion.description || ''
    } : {
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 0
    }
  });

  const promoType = watch('type');


  const handleImagePickerSelect = (file: FileItem) => {
    setSelectedFileItem(file);
    setImageFile(null);
    setImagePreview(filesService.getFileUrl(file));
  };

  const onFormSubmit = async (data: PromotionFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (selectedFileItem) {
      formData.append('imageUrl', filesService.getFileUrl(selectedFileItem));
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">


      <form id="promotion-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Banner Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Promotion Banner</label>
          <Dropzone
            onFilesDrop={(files) => {
              const file = files[0];
              if (file) {
                setImageFile(file);
                setSelectedFileItem(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            preview={imagePreview}
            onRemove={() => {
              setImageFile(null);
              setSelectedFileItem(null);
              setImagePreview(null);
            }}
            onLibraryClick={() => setShowImagePicker(true)}
            description="Arrastra el banner de la promoción aquí"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Optional banner image for the promotion.</p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Promotion Name"
            startIcon={<Percent className="h-4 w-4" />}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="e.g. Summer Sale 2024"
          />
          <Input
            label="Promo Code"
            startIcon={<Tag className="h-4 w-4" />}
            {...register('code', { required: 'Code is required' })}
            error={errors.code?.message}
            placeholder="e.g. SUMMER24"
            className="uppercase"
          />
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <Input
            label={promoType === 'percentage' ? 'Discount (%)' : 'Discount ($)'}
            type="number"
            startIcon={promoType === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
            {...register('value', { required: 'Value is required', min: 0 })}
            error={errors.value?.message}
          />
          <Input
            label="Max Discount ($)"
            type="number"
            startIcon={<DollarSign className="h-4 w-4" />}
            {...register('maxDiscount')}
            placeholder="0 = no limit"
          />
        </div>

        {/* Purchase Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Purchase ($)"
            type="number"
            startIcon={<DollarSign className="h-4 w-4" />}
            {...register('minPurchase')}
            placeholder="0"
          />
          <Input
            label="Usage Limit"
            type="number"
            startIcon={<Clock className="h-4 w-4" />}
            {...register('usageLimit')}
            placeholder="0 = unlimited"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            startIcon={<Calendar className="h-4 w-4" />}
            {...register('startDate', { required: 'Start date is required' })}
            error={errors.startDate?.message}
          />
          <Input
            label="End Date"
            type="date"
            startIcon={<Calendar className="h-4 w-4" />}
            {...register('endDate', { required: 'End date is required' })}
            error={errors.endDate?.message}
          />
        </div>

        {/* Additional Info */}
        <Input
          label="Applicable To"
          {...register('applicableTo')}
          placeholder="e.g. SUVs, Electric Vehicles, All Cars"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            placeholder="Describe the promotion..."
          />
        </div>
      </form>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="promotion-form"
          variant="primary"
          className="bg-orange-600 hover:bg-orange-700 border-orange-600"
          loading={loading}
          icon={<Check className="h-4 w-4" />}
        >
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </div>
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImagePickerSelect}
        currentImage={imagePreview}
        title="Seleccionar Banner de Promoción"
      />
    </div>
  );
};

export default PromotionForm;

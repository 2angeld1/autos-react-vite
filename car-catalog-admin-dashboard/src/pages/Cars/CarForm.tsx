import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import Input from '@/components/common/Input';
import { Dropzone } from '@/components/common';
import { ImagePicker } from '@/components/files';
import { filesService } from '@/services/files';
import { Car, FileItem } from '@/types';
import { useGet } from '@/hooks/useApi';
import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/animations/variants';
import { X, Plus, Image as ImageIcon } from 'lucide-react';

interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  fuel_type: 'gas' | 'diesel' | 'electricity' | 'hybrid';
  transmission: 'a' | 'm';
  cylinders: number;
  class: string;
  displacement: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  features: string;
  isAvailable: boolean;
  accessories: string[];
  promotion: string;
}

interface ImageItem {
  id: string;
  file?: File;
  url?: string;
  isMain: boolean;
}

interface CarFormProps {
  car?: Car;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({
  car,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { t } = useTranslation();

  // Multi-image state
  const [images, setImages] = React.useState<ImageItem[]>([]);
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  // Fetch Inventory Data
  const { data: brandsResponse } = useGet<any>('/inventory/brands', { immediate: true });
  const { data: categoriesResponse } = useGet<any>('/inventory/categories', { immediate: true });
  const { data: accessoriesResponse } = useGet<any>('/inventory/accessories', { immediate: true });
  const { data: promotionsResponse } = useGet<any>('/promotions', { immediate: true });

  const brands = React.useMemo(() => brandsResponse?.data || [], [brandsResponse]);
  const categories = React.useMemo(() => categoriesResponse?.data || [], [categoriesResponse]);
  const accessories = React.useMemo(() => accessoriesResponse?.data || [], [accessoriesResponse]);
  const promotions = React.useMemo(() => promotionsResponse?.data || [], [promotionsResponse]);

  // Initialize images from car data
  React.useEffect(() => {
    if (car) {
      const initialImages: ImageItem[] = [];

      // Main image
      if (car.image) {
        const imageUrl = car.image.startsWith('http')
          ? car.image
          : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${car.image}`;
        initialImages.push({
          id: 'main-' + Date.now(),
          url: imageUrl,
          isMain: true
        });
      }

      // Additional images
      if ((car as any).images && Array.isArray((car as any).images)) {
        (car as any).images.forEach((img: string, index: number) => {
          if (img && img !== car.image) {
            const imgUrl = img.startsWith('http')
              ? img
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`;
            initialImages.push({
              id: `gallery-${index}-${Date.now()}`,
              url: imgUrl,
              isMain: false
            });
          }
        });
      }

      setImages(initialImages);
    } else {
      setImages([]);
    }
  }, [car]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      description: '',
      fuel_type: 'gas',
      transmission: 'a',
      cylinders: 4,
      class: 'SUV',
      displacement: 2.0,
      city_mpg: 0,
      highway_mpg: 0,
      combination_mpg: 0,
      features: '',
      isAvailable: true,
      accessories: [],
      promotion: '',
    }
  });

  // When the `car` prop changes, populate the form
  React.useEffect(() => {
    if (car) {
      let currentAccessories: string[] = [];
      if (Array.isArray((car as any).accessories)) {
        currentAccessories = (car as any).accessories.map((a: any) => typeof a === 'object' ? a._id || a.id : a);
      }

      let currentPromotion = '';
      if ((car as any).promotion) {
        currentPromotion = typeof (car as any).promotion === 'object'
          ? (car as any).promotion._id || (car as any).promotion.id
          : (car as any).promotion;
      }

      reset({
        make: car.make,
        model: (car as any).model ?? (car as any).carModel ?? '',
        year: car.year,
        price: car.price,
        description: car.description,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        cylinders: car.cylinders,
        class: car.class,
        displacement: car.displacement,
        city_mpg: car.city_mpg,
        highway_mpg: car.highway_mpg,
        combination_mpg: car.combination_mpg,
        features: car.features?.join(', ') || '',
        isAvailable: car.isAvailable,
        accessories: currentAccessories,
        promotion: currentPromotion,
      });
    }
  }, [car, reset]);

  // Handle adding new images from file drop
  const handleFilesDrop = (files: File[]) => {
    const newImages: ImageItem[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isMain: images.length === 0 && index === 0 // First image is main if no images exist
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  // Handle image from library picker
  const handleImagePickerSelect = (file: FileItem) => {
    const url = filesService.getFileUrl(file);
    const newImage: ImageItem = {
      id: `lib-${Date.now()}`,
      url,
      isMain: images.length === 0
    };
    setImages(prev => [...prev, newImage]);
    setShowImagePicker(false);
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // If we removed the main image, make the first one main
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  // Set image as main
  const setAsMain = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === id
    })));
  };

  const onFormSubmit = async (data: CarFormData) => {
    // Validate at least one image for new cars
    if (!car && images.length === 0) {
      toast.error('Se requiere al menos una imagen');
      return;
    }

    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'features') {
        const featuresArray = typeof value === 'string'
          ? value.split(',').map((f: string) => f.trim()).filter((f: string) => f)
          : value;
        formData.append(key, JSON.stringify(featuresArray));
      } else if (key === 'accessories') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'promotion') {
        if (value) formData.append(key, value.toString());
        else formData.append(key, '');
      } else {
        formData.append(key, value.toString());
      }
    });

    // Handle images
    const mainImage = images.find(img => img.isMain);
    const galleryImages = images.filter(img => !img.isMain);

    // Main image
    if (mainImage) {
      if (mainImage.file) {
        formData.append('image', mainImage.file);
      } else if (mainImage.url) {
        formData.append('imageUrl', mainImage.url);
      }
    }

    // Gallery images (additional)
    const galleryUrls: string[] = [];
    galleryImages.forEach((img) => {
      if (img.file) {
        formData.append('galleryImages', img.file);
      } else if (img.url) {
        galleryUrls.push(img.url);
      }
    });

    if (galleryUrls.length > 0) {
      formData.append('existingGalleryImages', JSON.stringify(galleryUrls));
    }

    if (car) {
      formData.append('id', car.id);
    }

    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setImages([]);
    onClose();
  };

  const formContent = (
    <motion.form
      id="car-form"
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Multi-Image Upload Section */}
      <motion.div variants={slideUp}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del Auto
          <span className="text-xs text-gray-400 ml-2">(La primera imagen será la principal)</span>
        </label>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${img.isMain ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
                }`}
            >
              <img
                src={img.url}
                alt="Car"
                className="w-full h-24 object-cover"
              />

              {/* Main badge */}
              {img.isMain && (
                <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                  Principal
                </div>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => setAsMain(img.id)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-orange-100"
                    title="Establecer como principal"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Eliminar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div
            onClick={() => document.getElementById('multi-image-input')?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Agregar</span>
          </div>
        </div>

        {/* Hidden file input for multiple images */}
        <input
          id="multi-image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) handleFilesDrop(files);
            e.target.value = '';
          }}
          className="hidden"
        />

        {/* Dropzone for drag & drop */}
        {images.length === 0 && (
          <Dropzone
            onFilesDrop={handleFilesDrop}
            multiple={true}
            onLibraryClick={() => setShowImagePicker(true)}
            description="Arrastra múltiples imágenes o haz clic para subir"
          />
        )}

        {/* Library button when images exist */}
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline"
          >
            Seleccionar del Gestor de Archivos
          </button>
        )}
      </motion.div>

      {/* Basic Information */}
      <motion.div variants={slideUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cars.make')}
          </label>
          <input
            {...register('make', { required: 'La marca es requerida' })}
            list="brands-list"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('cars.exampleMake')}
          />
          <datalist id="brands-list">
            {brands.map((b: any) => (
              <option key={b._id || b.id} value={b.name} />
            ))}
          </datalist>
          {errors.make && (
            <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        <Input
          label={t('cars.model')}
          {...register('model', { required: 'El modelo es requerido' })}
          error={errors.model?.message}
          placeholder={t('cars.exampleModel')}
        />
        <Input
          type="number"
          {...register('year', {
            required: 'El año es requerido',
            min: { value: 1900, message: 'El año debe ser 1900 o posterior' },
            max: { value: new Date().getFullYear() + 1, message: 'El año no puede ser en el futuro' }
          })}
          error={errors.year?.message}
          placeholder={t('cars.exampleYear')}
        />
        <Input
          type="number"
          {...register('price', {
            required: 'El precio es requerido',
            min: { value: 0, message: 'El precio debe ser positivo' }
          })}
          error={errors.price?.message}
          placeholder={t('cars.examplePrice')}
        />
      </motion.div>

      {/* Description */}
      <motion.div variants={slideUp}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('cars.description')}
        </label>
          <textarea
            {...register('description', { required: t('validation.required') as string })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('cars.descriptionPlaceholder')}
          />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </motion.div>

      {/* Technical Specifications */}
      <motion.div variants={slideUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cars.fuelType')}
          </label>
          <select
            {...register('fuel_type', { required: t('validation.required') as string })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{t('common.select') || 'Select fuel type'}</option>
            <option value="gas">{t('cars.gas')}</option>
            <option value="diesel">{t('cars.diesel')}</option>
            <option value="electricity">{t('cars.electric')}</option>
            <option value="hybrid">{t('cars.hybrid')}</option>
          </select>
          {errors.fuel_type && (
            <p className="mt-1 text-sm text-red-600">{errors.fuel_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cars.transmission')}
          </label>
          <select
            {...register('transmission', { required: t('validation.required') as string })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{t('common.select') || 'Select'}</option>
            <option value="a">{t('cars.automatic')}</option>
            <option value="m">{t('cars.manual')}</option>
          </select>
          {errors.transmission && (
            <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
          )}
        </div>

        <Input
          label={t('cars.cylinders')}
          type="number"
          {...register('cylinders', {
            required: 'Los cilindros son requeridos',
            min: { value: 1, message: 'Debe ser al menos 1' }
          })}
          error={errors.cylinders?.message}
          placeholder="4"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cars.class')}
          </label>
          <select
            {...register('class', { required: t('validation.required') as string })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{t('common.select') || 'Select class'}</option>
            {categories.map((c: any) => (
              <option key={c._id || c.id} value={c.name}>{c.name}</option>
            ))}
            {categories.length === 0 && (
              <option value="SUV">SUV</option>
            )}
          </select>
          {errors.class && (
            <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
          )}
        </div>

        <Input
          label={t('cars.displacement')}
          type="number"
          step="0.1"
          {...register('displacement', {
            required: t('validation.required') as string,
            min: { value: 0, message: t('validation.minValue', { min: 0 }) }
          })}
          error={errors.displacement?.message}
          placeholder="2.0"
        />

        <Input
          label={t('cars.cityMpg')}
          type="number"
          {...register('city_mpg', {
            required: t('validation.required') as string,
            min: { value: 0, message: t('validation.minValue', { min: 0 }) }
          })}
          error={errors.city_mpg?.message}
          placeholder="25"
        />

        <Input
          label={t('cars.highwayMpg')}
          type="number"
          {...register('highway_mpg', {
            required: t('validation.required') as string,
            min: { value: 0, message: t('validation.minValue', { min: 0 }) }
          })}
          error={errors.highway_mpg?.message}
          placeholder="32"
        />

        <Input
          label={t('cars.combinedMpg')}
          type="number"
          {...register('combination_mpg', {
            required: t('validation.required') as string,
            min: { value: 0, message: t('validation.minValue', { min: 0 }) }
          })}
          error={errors.combination_mpg?.message}
          placeholder="28"
        />
      </motion.div>

      {/* Extras: Accessories & Promotions */}
      <motion.div variants={slideUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Accesorios
          </label>
          <select
            multiple
            {...register('accessories')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            style={{ minHeight: '100px' }}
          >
            {accessories.map((acc: any) => (
              <option key={acc._id || acc.id} value={acc._id || acc.id}>
                {acc.name} ({acc.price ? `$${acc.price}` : 'Free'})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (o Cmd) para seleccionar múltiples.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promoción
          </label>
          <select
            {...register('promotion')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Sin promoción</option>
            {promotions.map((p: any) => (
              <option key={p._id || p.id} value={p._id || p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div variants={slideUp}>
        <Input
          label={t('cars.features')}
          {...register('features')}
          error={errors.features?.message}
          placeholder={t('cars.featuresPlaceholder')}
          helperText={t('cars.featuresPlaceholder')}
        />
      </motion.div>

      {/* Availability */}
      <motion.div variants={slideUp} className="flex items-center">
        <input
          type="checkbox"
          id="isAvailable"
          {...register('isAvailable')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
          {t('cars.isAvailable')}
        </label>
      </motion.div>
    </motion.form>
  );

  return (
    <div className="space-y-6">
      {formContent}
      <motion.div variants={slideUp} className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          loading={loading}
          form="car-form"
        >
          {car ? t('cars.editCar') : t('cars.addCar')}
        </Button>
      </motion.div>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImagePickerSelect}
        currentImage={images.length > 0 ? images[0].url : null}
        title={t('cars.selectImage')}
      />
    </div>
  );
};

export default CarForm;
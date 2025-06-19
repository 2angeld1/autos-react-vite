import React from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { Car } from '@/types';

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
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    car?.image || null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: car ? {
      make: car.make,
      model: car.model,
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
    } : undefined,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(car?.image || null);
  };

  const onFormSubmit = async (data: CarFormData) => {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'features') {
        // Convert comma-separated string to array
        const featuresArray = value.split(',').map(f => f.trim()).filter(f => f);
        formData.append(key, JSON.stringify(featuresArray));
      } else {
        formData.append(key, value.toString());
      }
    });

    // Add image if selected
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    // Add car ID if editing
    if (car) {
      formData.append('id', car.id);
    }

    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setImagePreview(car?.image || null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={car ? 'Edit Car' : 'Add New Car'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            form="car-form"
          >
            {car ? 'Update Car' : 'Add Car'}
          </Button>
        </>
      }
    >
      <form id="car-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Image
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Car preview"
                className="h-32 w-48 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Upload an image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Make"
            {...register('make', { required: 'Make is required' })}
            error={errors.make?.message}
            placeholder="Toyota, Honda, etc."
          />
          <Input
            label="Model"
            {...register('model', { required: 'Model is required' })}
            error={errors.model?.message}
            placeholder="Camry, Civic, etc."
          />
          <Input
            label="Year"
            type="number"
            {...register('year', { 
              required: 'Year is required',
              min: { value: 1900, message: 'Year must be 1900 or later' },
              max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
            })}
            error={errors.year?.message}
            placeholder="2023"
          />
          <Input
            label="Price"
            type="number"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={errors.price?.message}
            placeholder="25000"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the car's features and condition..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              {...register('fuel_type', { required: 'Fuel type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select fuel type</option>
              <option value="gas">Gas</option>
              <option value="diesel">Diesel</option>
              <option value="electricity">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.fuel_type && (
              <p className="mt-1 text-sm text-red-600">{errors.fuel_type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              {...register('transmission', { required: 'Transmission is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select transmission</option>
              <option value="a">Automatic</option>
              <option value="m">Manual</option>
            </select>
            {errors.transmission && (
              <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
            )}
          </div>

          <Input
            label="Cylinders"
            type="number"
            {...register('cylinders', { 
              required: 'Cylinders is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            error={errors.cylinders?.message}
            placeholder="4"
          />

          <Input
            label="Class"
            {...register('class', { required: 'Class is required' })}
            error={errors.class?.message}
            placeholder="Compact, SUV, etc."
          />

          <Input
            label="Displacement (L)"
            type="number"
            step="0.1"
            {...register('displacement', { 
              required: 'Displacement is required',
              min: { value: 0, message: 'Must be positive' }
            })}
            error={errors.displacement?.message}
            placeholder="2.0"
          />

          <Input
            label="City MPG"
            type="number"
            {...register('city_mpg', { 
              required: 'City MPG is required',
              min: { value: 0, message: 'Must be positive' }
            })}
            error={errors.city_mpg?.message}
            placeholder="25"
          />

          <Input
            label="Highway MPG"
            type="number"
            {...register('highway_mpg', { 
              required: 'Highway MPG is required',
              min: { value: 0, message: 'Must be positive' }
            })}
            error={errors.highway_mpg?.message}
            placeholder="32"
          />

          <Input
            label="Combined MPG"
            type="number"
            {...register('combination_mpg', { 
              required: 'Combined MPG is required',
              min: { value: 0, message: 'Must be positive' }
            })}
            error={errors.combination_mpg?.message}
            placeholder="28"
          />
        </div>

        {/* Features */}
        <Input
          label="Features"
          {...register('features')}
          error={errors.features?.message}
          placeholder="Bluetooth, GPS, Leather Seats, etc. (comma separated)"
          helperText="Enter features separated by commas"
        />

        {/* Availability */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            {...register('isAvailable')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
            Car is available for sale
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default CarForm;
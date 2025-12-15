import React from 'react';
import { useForm } from 'react-hook-form';
import { ImageIcon, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ImagePicker } from '@/components/files';
import { filesService } from '@/services/files';
import { Car, FileItem } from '@/types';

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
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [selectedFileItem, setSelectedFileItem] = React.useState<FileItem | null>(null);
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);

  // Initialize image preview from car data
  React.useEffect(() => {
    if (car?.image) {
      // Check if it's a relative URL and prepend base URL
      const imageUrl = car.image.startsWith('http') 
        ? car.image 
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${car.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    setRemoveCurrentImage(false);
    setSelectedImage(null);
    setSelectedFileItem(null);
  }, [car]);

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
      setSelectedFileItem(null);
      setRemoveCurrentImage(false);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePickerSelect = (file: FileItem) => {
    setSelectedFileItem(file);
    setSelectedImage(null);
    setRemoveCurrentImage(false);
    setImagePreview(filesService.getFileUrl(file));
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedFileItem(null);
    setImagePreview(null);
    setRemoveCurrentImage(true);
  };

  const onFormSubmit = async (data: CarFormData) => {
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'features') {
        // Convert comma-separated string to array
        const featuresArray = value.split(',').map((f: string) => f.trim()).filter((f: string) => f);
        formData.append(key, JSON.stringify(featuresArray));
      } else {
        formData.append(key, value.toString());
      }
    });

    // Handle image
    if (selectedImage && selectedImage.size > 0) {
      // New file upload
      formData.append('image', selectedImage);
      console.log('Image added to FormData:', selectedImage.name, 'size:', selectedImage.size);
    } else if (selectedFileItem) {
      // Image selected from file manager
      formData.append('imageUrl', filesService.getFileUrl(selectedFileItem));
      console.log('Image URL added to FormData:', filesService.getFileUrl(selectedFileItem));
    } else if (removeCurrentImage) {
      // User wants to remove the image
      formData.append('removeImage', 'true');
      console.log('Remove image flag added');
    }
    // If none of the above, don't send image field (keep existing)

    // Add car ID if editing
    if (car) {
      formData.append('id', car.id);
    }

    // Log all FormData contents
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setSelectedFileItem(null);
    setImagePreview(null);
    setRemoveCurrentImage(false);
    onClose();
  };

  const formContent = (
    <form id="car-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen del Auto
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Vista previa del auto"
              className="h-32 w-48 object-cover rounded-lg border"
              onError={(e) => {
                // If image fails to load, show placeholder
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128" viewBox="0 0 192 128"><rect fill="%23f3f4f6" width="192" height="128"/><text x="96" y="64" text-anchor="middle" fill="%239ca3af" font-size="12">Image not found</text></svg>';
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
              title="Eliminar imagen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setShowImagePicker(true)}
              >
                Seleccionar del Gestor de Archivos
              </Button>
              <span className="text-xs text-gray-400">o</span>
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Subir una imagen nueva
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP hasta 5MB</p>
          </div>
        )}
        
        {/* Show option to change image when one is selected */}
        {imagePreview && (
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImagePicker(true)}
            >
              Cambiar imagen
            </Button>
            <label className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                size="sm"
              >
                Subir nueva
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Marca"
          {...register('make', { required: 'La marca es requerida' })}
          error={errors.make?.message}
          placeholder="Toyota, Honda, etc."
        />
        <Input
          label="Modelo"
          {...register('model', { required: 'El modelo es requerido' })}
          error={errors.model?.message}
          placeholder="Camry, Civic, etc."
        />
        <Input
          label="Año"
          type="number"
          {...register('year', {
            required: 'El año es requerido',
            min: { value: 1900, message: 'El año debe ser 1900 o posterior' },
            max: { value: new Date().getFullYear() + 1, message: 'El año no puede ser en el futuro' }
          })}
          error={errors.year?.message}
          placeholder="2023"
        />
        <Input
          label="Precio"
          type="number"
          {...register('price', {
            required: 'El precio es requerido',
            min: { value: 0, message: 'El precio debe ser positivo' }
          })}
          error={errors.price?.message}
          placeholder="25000"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          {...register('description', { required: 'La descripción es requerida' })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe las características y condición del auto..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Combustible
          </label>
          <select
            {...register('fuel_type', { required: 'El tipo de combustible es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo de combustible</option>
            <option value="gas">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="electricity">Electricidad</option>
            <option value="hybrid">Híbrido</option>
          </select>
          {errors.fuel_type && (
            <p className="mt-1 text-sm text-red-600">{errors.fuel_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmisión
          </label>
          <select
            {...register('transmission', { required: 'La transmisión es requerida' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccionar transmisión</option>
            <option value="a">Automática</option>
            <option value="m">Manual</option>
          </select>
          {errors.transmission && (
            <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
          )}
        </div>

        <Input
          label="Cilindros"
          type="number"
          {...register('cylinders', {
            required: 'Los cilindros son requeridos',
            min: { value: 1, message: 'Debe ser al menos 1' }
          })}
          error={errors.cylinders?.message}
          placeholder="4"
        />

        <Input
          label="Clase"
          {...register('class', { required: 'La clase es requerida' })}
          error={errors.class?.message}
          placeholder="Compacto, SUV, etc."
        />

        <Input
          label="Desplazamiento (L)"
          type="number"
          step="0.1"
          {...register('displacement', {
            required: 'El desplazamiento es requerido',
            min: { value: 0, message: 'Debe ser positivo' }
          })}
          error={errors.displacement?.message}
          placeholder="2.0"
        />

        <Input
          label="MPG Ciudad"
          type="number"
          {...register('city_mpg', {
            required: 'MPG Ciudad es requerido',
            min: { value: 0, message: 'Debe ser positivo' }
          })}
          error={errors.city_mpg?.message}
          placeholder="25"
        />

        <Input
          label="MPG Carretera"
          type="number"
          {...register('highway_mpg', {
            required: 'MPG Carretera es requerido',
            min: { value: 0, message: 'Must be positive' }
          })}
          error={errors.highway_mpg?.message}
          placeholder="32"
        />

        <Input
          label="MPG Combinado"
          type="number"
          {...register('combination_mpg', {
            required: 'MPG Combinado es requerido',
            min: { value: 0, message: 'Debe ser positivo' }
          })}
          error={errors.combination_mpg?.message}
          placeholder="28"
        />
      </div>

      {/* Features */}
      <Input
        label="Características"
        {...register('features')}
        error={errors.features?.message}
        placeholder="Bluetooth, GPS, Asientos de cuero, etc."
        helperText="Ingresar características separadas por comas"
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
          El auto está disponible para venta
        </label>
      </div>
    </form>
  );

  // Always render as page
  return (
    <div className="space-y-6">
      {formContent}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
          form="car-form"
        >
          {car ? 'Actualizar Auto' : 'Agregar Auto'}
        </Button>
      </div>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImagePickerSelect}
        currentImage={imagePreview}
        title="Seleccionar Imagen del Auto"
      />
    </div>
  );
};

export default CarForm;
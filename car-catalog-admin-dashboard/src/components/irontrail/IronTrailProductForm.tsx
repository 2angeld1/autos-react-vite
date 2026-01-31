import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, Check, DollarSign, Package, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropzone from '@/components/common/Dropzone';
import { filesService } from '@/services/files';
import { IronTrailProduct, IronTrailProductInput, IronTrailCategoryOption } from '@/services/irontrail';

interface IronTrailProductFormProps {
    product?: IronTrailProduct;
    categories: IronTrailCategoryOption[];
    onSubmit: (data: IronTrailProductInput) => Promise<void>;
    onClose: () => void;
    loading?: boolean;
}

interface FormData {
    name: string;
    sku: string;
    ironCategory: string;
    price: number;
    comparePrice: number;
    stock: number;
    description: string;
    thumbnail: string;
}

const IronTrailProductForm: React.FC<IronTrailProductFormProps> = ({ 
    product, 
    categories,
    onSubmit, 
    onClose, 
    loading 
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: product ? {
            name: product.name,
            sku: product.sku || '',
            ironCategory: product.specs?.ironCategory || '',
            price: product.price,
            comparePrice: product.comparePrice || 0,
            stock: product.stock,
            description: product.specs?.description || '',
            thumbnail: product.thumbnail,
        } : {
            price: 0,
            comparePrice: 0,
            stock: 0,
            ironCategory: categories[0]?.value || 'suspension',
        }
    });

    const thumbnailUrl = watch('thumbnail');

    // Update preview when thumbnail URL changes
    useEffect(() => {
        if (thumbnailUrl) {
            setImagePreview(thumbnailUrl);
        }
    }, [thumbnailUrl]);

    const handleFilesDrop = async (files: File[]) => {
        if (files.length === 0) return;

        try {
            setUploading(true);
            const uploadedFiles = await filesService.uploadFiles(files, 'irontrail'); // Organize in irontrail folder
            if (uploadedFiles.length > 0) {
                const file = uploadedFiles[0];
                const url = filesService.getFileUrl(file);
                setValue('thumbnail', url, { shouldValidate: true });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            // Optionally add error toast here
        } finally {
            setUploading(false);
        }
    };

    const onFormSubmit = async (data: FormData) => {
        const payload: IronTrailProductInput = {
            name: data.name,
            sku: data.sku || undefined,
            ironCategory: data.ironCategory as any,
            price: Number(data.price),
            comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
            stock: Number(data.stock),
            thumbnail: data.thumbnail,
            description: data.description,
        };
        await onSubmit(payload);
    };

    return (
        <div className="space-y-6">
            <form id="irontrail-product-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Image Upload Area */}
                {/* Image Upload Stack */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Imagen del Producto *
                    </label>

                    {/* 1. Large Dropzone */}
                    <div className="w-full">
                        {uploading ? (
                            <div className="h-48 w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 animate-pulse">
                                <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Subiendo imagen...</p>
                            </div>
                        ) : (
                            <Dropzone
                                onFilesDrop={handleFilesDrop}
                                className="h-48 w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
                                description="Arrastra una imagen aquí o haz clic para abrir el navegador"
                                accept="image/*"
                                preview={imagePreview}
                                onRemove={() => {
                                    setValue('thumbnail', '', { shouldValidate: true });
                                    setImagePreview(null);
                                }}
                            />
                        )}
                    </div>

                    {/* 2. URL Input Backup */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm mb-4">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O ingresa URL manualmente</span>
                        </div>

                        <Input
                            startIcon={<ImageIcon className="h-4 w-4" />}
                            {...register('thumbnail', { required: 'La imagen es requerida' })}
                            error={errors.thumbnail?.message}
                            placeholder="https://example.com/image.jpg"
                            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre del Producto *"
                        startIcon={<Settings className="h-4 w-4" />}
                        {...register('name', { required: 'El nombre es requerido' })}
                        error={errors.name?.message}
                        placeholder="ej: Kit MRR Pro 2.0"
                    />
                    <Input
                        label="SKU"
                        startIcon={<Tag className="h-4 w-4" />}
                        {...register('sku')}
                        placeholder="ej: IRON-SUSP-001"
                    />
                </div>

                {/* Category Selector - DYNAMIC FROM ENUM */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría IronTrail *
                    </label>
                    <select
                        {...register('ironCategory', { required: 'La categoría es requerida' })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                    {errors.ironCategory && (
                        <p className="text-red-500 text-xs mt-1">{errors.ironCategory.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Precio ($) *"
                        type="number"
                        step="0.01"
                        startIcon={<DollarSign className="h-4 w-4" />}
                        {...register('price', { required: 'El precio es requerido', min: 0 })}
                        error={errors.price?.message}
                    />
                    <Input
                        label="Precio Anterior ($)"
                        type="number"
                        step="0.01"
                        startIcon={<DollarSign className="h-4 w-4 text-gray-400" />}
                        {...register('comparePrice')}
                        placeholder="Para mostrar descuento"
                    />
                    <Input
                        label="Stock *"
                        type="number"
                        startIcon={<Package className="h-4 w-4" />}
                        {...register('stock', { required: 'El stock es requerido', min: 0 })}
                        error={errors.stock?.message}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                        placeholder="Describe las características del producto..."
                    />
                </div>
            </form>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="irontrail-product-form"
                    variant="primary"
                    loading={loading}
                    icon={<Check className="h-4 w-4" />}
                    className="!bg-amber-500 hover:!bg-amber-600"
                >
                    {product ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
            </div>
        </div>
    );
};

export default IronTrailProductForm;

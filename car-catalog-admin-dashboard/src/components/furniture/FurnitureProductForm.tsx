import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Sofa, Check, DollarSign, Package, Image as ImageIcon, Tag, Loader2, Ruler } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropzone from '@/components/common/Dropzone';
import { filesService } from '@/services/files';
import { FurnitureProduct, FurnitureProductInput, FurnitureCategoryOption } from '@/services/furniture';

interface Props {
    product?: FurnitureProduct;
    categories: FurnitureCategoryOption[];
    onSubmit: (data: FurnitureProductInput) => Promise<void>;
    onClose: () => void;
    loading?: boolean;
}

interface FormData {
    name: string;
    sku: string;
    furnitureCategory: string;
    price: number;
    comparePrice: number;
    stock: number;
    description: string;
    material: string;
    dimensions: string;
    style: string;
    thumbnail: string;
}

const FurnitureProductForm: React.FC<Props> = ({ product, categories, onSubmit, onClose, loading }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: product ? {
            name: product.name, sku: product.sku || '',
            furnitureCategory: product.specs?.furnitureCategory || '',
            price: product.price, comparePrice: product.comparePrice || 0, stock: product.stock,
            description: product.specs?.description || '', material: product.specs?.material || '',
            dimensions: product.specs?.dimensions || '', style: product.specs?.style || '',
            thumbnail: product.thumbnail,
        } : { price: 0, comparePrice: 0, stock: 0, furnitureCategory: categories[0]?.value || 'living' }
    });

    const thumbnailUrl = watch('thumbnail');
    useEffect(() => { if (thumbnailUrl) setImagePreview(thumbnailUrl); }, [thumbnailUrl]);

    const handleFilesDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploading(true);
            const uploaded = await filesService.uploadFiles(files, 'decohaus');
            if (uploaded.length > 0) setValue('thumbnail', filesService.getFileUrl(uploaded[0]), { shouldValidate: true });
        } finally { setUploading(false); }
    };

    const onFormSubmit = async (data: FormData) => {
        await onSubmit({
            name: data.name, sku: data.sku || undefined,
            furnitureCategory: data.furnitureCategory,
            price: Number(data.price),
            comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
            stock: Number(data.stock), thumbnail: data.thumbnail,
            description: data.description, material: data.material,
            dimensions: data.dimensions, style: data.style,
        });
    };

    return (
        <div className="space-y-6">
            <form id="furniture-product-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Image */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Imagen del Producto *</label>
                    <div className="w-full">
                        {uploading ? (
                            <div className="h-48 w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 animate-pulse">
                                <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                                <p className="text-sm text-gray-500">Subiendo imagen...</p>
                            </div>
                        ) : (
                            <Dropzone
                                onFilesDrop={handleFilesDrop}
                                className="h-48 w-full bg-gray-50 dark:bg-gray-800 border-gray-300 hover:border-amber-500 transition-colors"
                                description="Arrastra una imagen aquí o haz clic para subir"
                                accept="image/*"
                                preview={imagePreview}
                                onRemove={() => { setValue('thumbnail', '', { shouldValidate: true }); setImagePreview(null); }}
                            />
                        )}
                    </div>
                    <Input
                        startIcon={<ImageIcon className="h-4 w-4" />}
                        {...register('thumbnail', { required: 'La imagen es requerida' })}
                        error={errors.thumbnail?.message}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre *" startIcon={<Sofa className="h-4 w-4" />} {...register('name', { required: 'El nombre es requerido' })} error={errors.name?.message} placeholder="ej: Sofá Modular Velvet" />
                    <Input label="SKU" startIcon={<Tag className="h-4 w-4" />} {...register('sku')} placeholder="ej: DH-SOFA-001" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría DecoHaus *</label>
                        <select {...register('furnitureCategory', { required: true })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm bg-white">
                            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                        </select>
                    </div>
                    <Input label="Material" {...register('material')} placeholder="ej: Roble Macizo, Terciopelo" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Dimensiones" startIcon={<Ruler className="h-4 w-4" />} {...register('dimensions')} placeholder="ej: 200x90x75cm" />
                    <Input label="Estilo" {...register('style')} placeholder="ej: Escandinavo, Industrial" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Precio ($) *" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4" />} {...register('price', { required: true, min: 0 })} error={errors.price?.message} />
                    <Input label="Precio Anterior ($)" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4 text-gray-400" />} {...register('comparePrice')} />
                    <Input label="Stock *" type="number" startIcon={<Package className="h-4 w-4" />} {...register('stock', { required: true, min: 0 })} error={errors.stock?.message} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm resize-none" placeholder="Describe el mueble, su uso y características..." />
                </div>
            </form>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button type="submit" form="furniture-product-form" variant="primary" loading={loading} icon={<Check className="h-4 w-4" />} className="!bg-amber-700 hover:!bg-amber-800">
                    {product ? 'Actualizar Mueble' : 'Crear Mueble'}
                </Button>
            </div>
        </div>
    );
};

export default FurnitureProductForm;

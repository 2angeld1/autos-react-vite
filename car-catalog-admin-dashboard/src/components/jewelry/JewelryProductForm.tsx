import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Gem, Check, DollarSign, Package, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropzone from '@/components/common/Dropzone';
import { filesService } from '@/services/files';
import { JewelryProduct, JewelryProductInput, JewelryCategoryOption } from '@/services/jewelry';

interface Props {
    product?: JewelryProduct;
    categories: JewelryCategoryOption[];
    onSubmit: (data: JewelryProductInput) => Promise<void>;
    onClose: () => void;
    loading?: boolean;
}

interface FormData {
    name: string;
    sku: string;
    jewelryCategory: string;
    price: number;
    comparePrice: number;
    stock: number;
    description: string;
    material: string;
    carats: string;
    thumbnail: string;
}

const JewelryProductForm: React.FC<Props> = ({ product, categories, onSubmit, onClose, loading }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: product ? {
            name: product.name, sku: product.sku || '',
            jewelryCategory: product.specs?.jewelryCategory || '',
            price: product.price, comparePrice: product.comparePrice || 0, stock: product.stock,
            description: product.specs?.description || '', material: product.specs?.material || '',
            carats: product.specs?.carats || '', thumbnail: product.thumbnail,
        } : { price: 0, comparePrice: 0, stock: 0, jewelryCategory: categories[0]?.value || 'rings' }
    });

    const thumbnailUrl = watch('thumbnail');
    useEffect(() => { if (thumbnailUrl) setImagePreview(thumbnailUrl); }, [thumbnailUrl]);

    const handleFilesDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploading(true);
            const uploaded = await filesService.uploadFiles(files, 'luxjewel');
            if (uploaded.length > 0) setValue('thumbnail', filesService.getFileUrl(uploaded[0]), { shouldValidate: true });
        } finally { setUploading(false); }
    };

    const onFormSubmit = async (data: FormData) => {
        await onSubmit({
            name: data.name, sku: data.sku || undefined,
            jewelryCategory: data.jewelryCategory,
            price: Number(data.price),
            comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
            stock: Number(data.stock), thumbnail: data.thumbnail,
            description: data.description, material: data.material, carats: data.carats,
        });
    };

    return (
        <div className="space-y-6">
            <form id="jewelry-product-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Image */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Imagen del Producto *</label>
                    <div className="w-full">
                        {uploading ? (
                            <div className="h-48 w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 animate-pulse">
                                <Loader2 className="h-8 w-8 text-pink-500 animate-spin mb-2" />
                                <p className="text-sm text-gray-500">Subiendo imagen...</p>
                            </div>
                        ) : (
                            <Dropzone
                                onFilesDrop={handleFilesDrop}
                                className="h-48 w-full bg-gray-50 dark:bg-gray-800 border-gray-300 hover:border-pink-400 transition-colors"
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
                    <Input label="Nombre *" startIcon={<Gem className="h-4 w-4" />} {...register('name', { required: 'El nombre es requerido' })} error={errors.name?.message} placeholder="ej: Anillo Solitario Eterno" />
                    <Input label="SKU" startIcon={<Tag className="h-4 w-4" />} {...register('sku')} placeholder="ej: LJ-RING-001" />
                </div>

                {/* Jewelry-specific fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría LuxJewel *</label>
                        <select {...register('jewelryCategory', { required: true })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm bg-white">
                            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                        </select>
                    </div>
                    <Input label="Material" {...register('material')} placeholder="ej: Oro 18k, Plata 925" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Input label="Quilates / Peso" {...register('carats')} placeholder="ej: 1.5ct, 18g" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Precio ($) *" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4" />} {...register('price', { required: true, min: 0 })} error={errors.price?.message} />
                    <Input label="Precio Anterior ($)" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4 text-gray-400" />} {...register('comparePrice')} />
                    <Input label="Stock *" type="number" startIcon={<Package className="h-4 w-4" />} {...register('stock', { required: true, min: 0 })} error={errors.stock?.message} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm resize-none" placeholder="Describe la pieza y sus detalles..." />
                </div>
            </form>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button type="submit" form="jewelry-product-form" variant="primary" loading={loading} icon={<Check className="h-4 w-4" />} className="!bg-pink-600 hover:!bg-pink-700">
                    {product ? 'Actualizar Joya' : 'Crear Joya'}
                </Button>
            </div>
        </div>
    );
};

export default JewelryProductForm;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, Check, DollarSign, Package, Image as ImageIcon, Tag } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
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

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
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
    React.useEffect(() => {
        if (thumbnailUrl) {
            setImagePreview(thumbnailUrl);
        }
    }, [thumbnailUrl]);

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
                {/* Image Preview */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-amber-400/50">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Package className="h-10 w-10 text-amber-500" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Imagen del Producto</h3>
                        <p className="text-sm text-gray-500 mt-1">Ingresa la URL de la imagen principal.</p>
                    </div>
                </div>

                <Input
                    label="URL de Imagen *"
                    startIcon={<ImageIcon className="h-4 w-4" />}
                    {...register('thumbnail', { required: 'La imagen es requerida' })}
                    error={errors.thumbnail?.message}
                    placeholder="https://example.com/image.jpg"
                />

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

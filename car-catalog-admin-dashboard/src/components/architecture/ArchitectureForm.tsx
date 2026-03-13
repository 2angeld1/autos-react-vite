import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Compass, Check, DollarSign, Image as ImageIcon, Tag, Loader2, Ruler, Layers, FileText } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropzone from '@/components/common/Dropzone';
import { filesService } from '@/services/files';
import { ArchitectureProject, ArchitectureProjectInput, ArchitectureCategoryOption } from '@/services/architecture';

interface Props {
    product?: ArchitectureProject;
    categories: ArchitectureCategoryOption[];
    onSubmit: (data: ArchitectureProjectInput) => Promise<void>;
    onClose: () => void;
    loading?: boolean;
}

interface FormData {
    name: string;
    sku: string;
    projectCategory: string;
    price: number;
    comparePrice: number;
    description: string;
    area: number;
    levels: number;
    style: string;
    thumbnail: string;
    planUrl: string; // Para el PDF del plano
}

const ArchitectureForm: React.FC<Props> = ({ product, categories, onSubmit, onClose, loading }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPlan, setUploadingPlan] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: product ? {
            name: product.name, sku: product.sku || '',
            projectCategory: product.specs?.projectCategory || '',
            price: product.price, comparePrice: product.comparePrice || 0,
            description: product.specs?.description || '', area: product.specs?.area || 0,
            levels: product.specs?.levels || 1, style: product.specs?.style || '',
            thumbnail: product.thumbnail,
            planUrl: product.files?.[0] || '',
        } : { price: 0, comparePrice: 0, levels: 1, projectCategory: categories[0]?.value || 'residencial' }
    });

    const thumbnailUrl = watch('thumbnail');
    const planUrl = watch('planUrl');

    useEffect(() => { if (thumbnailUrl) setImagePreview(thumbnailUrl); }, [thumbnailUrl]);

    const handleImageDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploadingImage(true);
            const uploaded = await filesService.uploadFiles(files, 'architect/images');
            if (uploaded.length > 0) setValue('thumbnail', filesService.getFileUrl(uploaded[0]), { shouldValidate: true });
        } finally { setUploadingImage(false); }
    };

    const handlePlanDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploadingPlan(true);
            const uploaded = await filesService.uploadFiles(files, 'architect/plans');
            if (uploaded.length > 0) setValue('planUrl', filesService.getFileUrl(uploaded[0]), { shouldValidate: true });
        } finally { setUploadingPlan(false); }
    };

    const onFormSubmit = async (data: FormData) => {
        await onSubmit({
            name: data.name, sku: data.sku || undefined,
            projectCategory: data.projectCategory,
            price: Number(data.price),
            comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
            thumbnail: data.thumbnail,
            images: [data.thumbnail], // Por ahora galería simple
            files: data.planUrl ? [data.planUrl] : [],
            description: data.description,
            area: Number(data.area),
            levels: Number(data.levels),
            style: data.style,
        });
    };

    return (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            <form id="architecture-project-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Image & Plan Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary-600" /> Render Principal *
                        </label>
                        {uploadingImage ? (
                            <div className="h-40 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-primary-200 animate-pulse">
                                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                            </div>
                        ) : (
                            <Dropzone
                                onFilesDrop={handleImageDrop}
                                className="h-40 bg-gray-50 dark:bg-gray-800 border-gray-300 hover:border-primary-500"
                                description="Sube el render (JPG/PNG)"
                                accept="image/*"
                                preview={imagePreview}
                                onRemove={() => { setValue('thumbnail', '', { shouldValidate: true }); setImagePreview(null); }}
                            />
                        )}
                        <input type="hidden" {...register('thumbnail', { required: 'La imagen es requerida' })} />
                        {errors.thumbnail && <p className="text-xs text-red-500">{errors.thumbnail.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" /> Planos Técnicos (PDF)
                        </label>
                        {uploadingPlan ? (
                            <div className="h-40 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200 animate-pulse">
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="relative h-40">
                                {planUrl ? (
                                    <div className="h-full w-full bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 flex flex-col items-center justify-center p-4">
                                        <FileText className="h-10 w-10 text-blue-600 mb-2" />
                                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300 truncate w-full text-center">Planos Subidos</p>
                                        <button 
                                            type="button" 
                                            onClick={() => setValue('planUrl', '')}
                                            className="mt-2 text-xs text-red-600 hover:underline"
                                        >Eliminar</button>
                                    </div>
                                ) : (
                                    <Dropzone
                                        onFilesDrop={handlePlanDrop}
                                        className="h-40 border-gray-300 hover:border-blue-500"
                                        description="Sube el PDF de los planos"
                                        accept="application/pdf"
                                    />
                                )}
                            </div>
                        )}
                        <input type="hidden" {...register('planUrl')} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre del Proyecto *" startIcon={<Compass className="h-4 w-4" />} {...register('name', { required: 'El nombre es obligatorio' })} error={errors.name?.message} placeholder="ej: Casa Mirador del Valle" />
                    <Input label="Código/Referencia" startIcon={<Tag className="h-4 w-4" />} {...register('sku')} placeholder="ej: ARCH-2024-001" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría del Proyecto *</label>
                        <select {...register('projectCategory', { required: true })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm bg-white">
                            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                        </select>
                    </div>
                    <Input label="Estilo Arquitectónico" {...register('style')} placeholder="ej: Brutalista, Contemporáneo, Colonial" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Área Total (m²)" type="number" startIcon={<Ruler className="h-4 w-4" />} {...register('area')} placeholder="ej: 350" />
                    <Input label="Niveles / Pisos" type="number" startIcon={<Layers className="h-4 w-4" />} {...register('levels')} placeholder="ej: 2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Precio del Proyecto ($) *" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4" />} {...register('price', { required: true, min: 0 })} error={errors.price?.message} />
                    <Input label="Valor estimado construcción ($)" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4 text-gray-400" />} {...register('comparePrice')} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Memoria Descriptiva / Notas</label>
                    <textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm resize-none" placeholder="Describe los detalles del proyecto, materiales recomendados..." />
                </div>
            </form>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button type="submit" form="architecture-project-form" variant="primary" loading={loading} icon={<Check className="h-4 w-4" />} className="!bg-primary-700 hover:!bg-primary-800 shadow-lg shadow-primary-700/20">
                    {product ? 'Actualizar Proyecto' : 'Publicar Proyecto'}
                </Button>
            </div>
        </div>
    );
};

export default ArchitectureForm;

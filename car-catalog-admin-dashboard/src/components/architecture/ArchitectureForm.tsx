import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Compass, DollarSign, Image as ImageIcon, Tag, Loader2, 
    Ruler, Layers, FileText, LayoutGrid, Check
} from 'lucide-react';
import Input from '@/components/common/Input';
import Dropzone from '@/components/common/Dropzone';
import Wizard, { WizardStep } from '@/components/common/Wizard';
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
    projectSubCategory: string;
    price: number;
    comparePrice: number;
    description: string;
    area: number;
    levels: number;
    style: string;
    thumbnail: string;
    gallery: string[];
    planUrl: string;
}

const STEPS: WizardStep[] = [
    { id: 1, title: 'Tipología', description: 'Selección visual', icon: LayoutGrid },
    { id: 2, title: 'Identidad', description: 'Nombre y estilo', icon: Compass },
    { id: 3, title: 'Detalles', description: 'Especificaciones', icon: Ruler },
    { id: 4, title: 'Finanzas', description: 'Precio y valor', icon: DollarSign },
    { id: 5, title: 'Multimedia', description: 'Renders y planos', icon: ImageIcon },
];

const ArchitectureForm: React.FC<Props> = ({ product, categories, onSubmit, onClose, loading }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.thumbnail || null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPlan, setUploadingPlan] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: product ? {
            name: product.name, sku: product.sku || '',
            projectCategory: product.specs?.projectCategory || '',
            projectSubCategory: product.specs?.projectSubCategory || '',
            price: product.price, comparePrice: product.comparePrice || 0,
            description: product.specs?.description || '', area: product.specs?.area || 0,
            levels: product.specs?.levels || 1, style: product.specs?.style || '',
            thumbnail: product.thumbnail,
            gallery: product.images || [],
            planUrl: product.files?.[0] || '',
        } : { 
            price: 0, 
            comparePrice: 0, 
            levels: 1, 
            gallery: [],
            projectCategory: categories[0]?.value || '',
            projectSubCategory: categories[0]?.subcategories?.[0]?.value || '' 
        }
    });

    const selectedCategory = watch('projectCategory');
    const subCategories = categories.find(c => c.value === selectedCategory)?.subcategories || [];

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

    const handleGalleryDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploadingImage(true);
            const uploaded = await filesService.uploadFiles(files, 'architect/gallery');
            if (uploaded.length > 0) {
                const newUrls = uploaded.map(file => filesService.getFileUrl(file));
                const currentGallery = watch('gallery') || [];
                setValue('gallery', [...currentGallery, ...newUrls], { shouldValidate: true });
            }
        } finally { setUploadingImage(false); }
    };

    const removeGalleryImage = (index: number) => {
        const currentGallery = watch('gallery') || [];
        const newGallery = currentGallery.filter((_, i) => i !== index);
        setValue('gallery', newGallery, { shouldValidate: true });
    };

    const handlePlanDrop = async (files: File[]) => {
        if (!files.length) return;
        try {
            setUploadingPlan(true);
            const uploaded = await filesService.uploadFiles(files, 'architect/plans');
            if (uploaded.length > 0) setValue('planUrl', filesService.getFileUrl(uploaded[0]), { shouldValidate: true });
        } finally { setUploadingPlan(false); }
    };

    const validateStep = async () => {
        let fieldsToValidate: (keyof FormData)[] = [];
        if (currentStep === 1) fieldsToValidate = ['projectSubCategory'];
        if (currentStep === 2) fieldsToValidate = ['name', 'projectCategory'];
        if (currentStep === 4) fieldsToValidate = ['price'];
        if (currentStep === 5) fieldsToValidate = ['thumbnail'];

        return await trigger(fieldsToValidate);
    };

    const onFormSubmit = async (data: FormData) => {
        await onSubmit({
            name: data.name, sku: data.sku || undefined,
            projectCategory: data.projectCategory,
            projectSubCategory: data.projectSubCategory,
            price: Number(data.price),
            comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
            thumbnail: data.thumbnail,
            images: [data.thumbnail, ...data.gallery],
            files: data.planUrl ? [data.planUrl] : [],
            description: data.description,
            area: Number(data.area),
            levels: Number(data.levels),
            style: data.style,
        });
    };

    return (
        <Wizard
            steps={STEPS}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onClose={onClose}
            onSubmit={handleSubmit(onFormSubmit)}
            canNext={validateStep}
            loading={loading}
            submitLabel={product ? 'Actualizar Proyecto' : 'Publicar Proyecto'}
            accentColor="sky"
        >
            {currentStep === 1 && (
                <div className="space-y-6">
                    <div className="bg-sky-50/50 dark:bg-sky-900/5 p-3.5 rounded-2xl border border-sky-100/50 dark:border-sky-800/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-sky-900/30 rounded-xl shadow-sm text-sky-600">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-black text-sky-900 dark:text-sky-100">Selecciona la Tipología</h3>
                                <p className="text-[11px] text-sky-600/70 dark:text-sky-400/70 text-left">¿Qué tipo de {categories.find(c => c.value === selectedCategory)?.label.toLowerCase()} vas a publicar?</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {subCategories.map(sub => (
                            <button
                                key={sub.value}
                                onClick={() => {
                                    setValue('projectSubCategory', sub.value);
                                    trigger('projectSubCategory');
                                }}
                                className={`
                                    relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group
                                    ${watch('projectSubCategory') === sub.value 
                                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-lg shadow-sky-500/10' 
                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-sky-200 dark:hover:border-sky-800'}
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-2xl mb-4 flex items-center justify-center transition-colors
                                    ${watch('projectSubCategory') === sub.value 
                                        ? 'bg-sky-500 text-white' 
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:text-sky-500'}
                                `}>
                                    <Layers className="h-5 w-5" />
                                </div>
                                <span className={`font-bold block text-sm ${watch('projectSubCategory') === sub.value ? 'text-sky-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {sub.label}
                                </span>
                                {watch('projectSubCategory') === sub.value && (
                                    <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                                        <div className="bg-sky-500 rounded-full p-1">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    {errors.projectSubCategory && (
                        <p className="text-xs text-red-500 text-center font-bold">Por favor selecciona una tipología para continuar</p>
                    )}
                </div>
            )}

            {currentStep === 2 && (
                <div className="space-y-5 text-left">
                    <div className="bg-sky-50/50 dark:bg-sky-900/10 p-4 rounded-2xl mb-6 text-left">
                        <h3 className="text-sm font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 uppercase tracking-wider text-left">
                            <Compass className="h-4 w-4" /> Identidad del Proyecto
                        </h3>
                        <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-1 text-left">Define el nombre principal y la especialidad.</p>
                    </div>

                    <Input 
                        label="Nombre del Proyecto *" 
                        startIcon={<Compass className="h-4 w-4" />} 
                        {...register('name', { required: 'El nombre es obligatorio' })} 
                        error={errors.name?.message} 
                        placeholder="ej: Casa Mirador del Valle" 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Código/Referencia" startIcon={<Tag className="h-4 w-4" />} {...register('sku')} placeholder="ej: ARCH-2024-001" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-bold text-sky-700 dark:text-sky-400">
                                <Check className="h-4 w-4" />
                                {categories.find(c => c.value === watch('projectCategory'))?.label || 'Especialidad Seleccionada'}
                            </div>
                        </div>
                    </div>
                    <Input label="Estilo Arquitectónico" startIcon={<LayoutGrid className="h-4 w-4" />} {...register('style')} placeholder="ej: Brutalista, Minimalista" />
                </div>
            )}

            {currentStep === 3 && (
                <div className="space-y-5 text-left">
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl mb-6 text-left">
                        <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2 uppercase tracking-wider text-left">
                            <Ruler className="h-4 w-4" /> Especificaciones Técnicas
                        </h3>
                        <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1 text-left">Detalles de escala y memoria descriptiva del diseño.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Área Total (m²)" type="number" startIcon={<Ruler className="h-4 w-4" />} {...register('area')} placeholder="ej: 350" />
                        <Input label="Niveles / Pisos" type="number" startIcon={<Layers className="h-4 w-4" />} {...register('levels')} placeholder="ej: 2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Memoria Descriptiva / Notas</label>
                        <textarea {...register('description')} rows={6} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm bg-white dark:bg-gray-800 dark:text-white resize-none transition-all" placeholder="Describe los detalles del proyecto, materiales recomendados..." />
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-5 text-left">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl mb-6 text-left">
                        <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 uppercase tracking-wider text-left">
                            <DollarSign className="h-4 w-4" /> Valoración del Proyecto
                        </h3>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 text-left">Define el precio de venta de los planos y el costo de obra proyectado.</p>
                    </div>

                    <div className="space-y-6">
                        <Input label="Precio Venta de Planos / Proyecto ($) *" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4" />} {...register('price', { required: 'El precio es requerido', min: 0 })} error={errors.price?.message} />
                        <Input label="Valor Estimado de Construcción ($)" type="number" step="0.01" startIcon={<DollarSign className="h-4 w-4 text-gray-400" />} {...register('comparePrice')} placeholder="Opcional. Para referencia del cliente" />
                    </div>
                </div>
            )}

            {currentStep === 5 && (
                <div className="space-y-5 text-left">
                    <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl mb-6 text-left">
                        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 uppercase tracking-wider text-left">
                            <ImageIcon className="h-4 w-4" /> Material Visual y Planos
                        </h3>
                        <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 text-left">Sube el render principal (portada) y los archivos PDF técnicos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-sky-600" /> Render Principal *
                            </label>
                            {uploadingImage ? (
                                <div className="h-44 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-sky-200 animate-pulse">
                                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                                </div>
                            ) : (
                                <Dropzone
                                    onFilesDrop={handleImageDrop}
                                    className="h-44 bg-gray-50 dark:bg-gray-800 border-gray-300 hover:border-sky-500 rounded-2xl"
                                    description="Portada del proyecto"
                                    accept="image/*"
                                    preview={imagePreview}
                                    onRemove={() => { setValue('thumbnail', '', { shouldValidate: true }); setImagePreview(null); }}
                                />
                            )}
                            <input type="hidden" {...register('thumbnail', { required: 'La imagen de portada es obligatoria' })} />
                            {errors.thumbnail && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.thumbnail.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" /> Planos Técnicos (PDF)
                            </label>
                            {uploadingPlan ? (
                                <div className="h-44 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200 animate-pulse">
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                </div>
                            ) : (
                                <div className="relative h-44">
                                    {planUrl ? (
                                        <div className="h-full w-full bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 flex flex-col items-center justify-center p-4">
                                            <FileText className="h-10 w-10 text-blue-600 mb-2" />
                                            <p className="text-xs font-bold text-blue-800 dark:text-blue-300 truncate w-full text-center">PLANOS CARGADOS</p>
                                            <button 
                                                type="button" 
                                                onClick={() => setValue('planUrl', '')}
                                                className="mt-3 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-[10px] font-bold text-red-600 border border-red-100 hover:bg-red-50 transition-colors"
                                            >ELIMINAR ARCHIVO</button>
                                        </div>
                                    ) : (
                                        <Dropzone
                                            onFilesDrop={handlePlanDrop}
                                            className="h-44 border-gray-300 hover:border-blue-500 rounded-2xl"
                                            description="Sube el set de planos PDF"
                                            accept="application/pdf"
                                        />
                                    )}
                                </div>
                            )}
                            <input type="hidden" {...register('planUrl')} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-sky-600" /> Galería de Imágenes (Adicionales)
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {watch('gallery')?.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                    <img src={url} alt="Gallery item" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Check className="h-3 w-3 rotate-45" />
                                    </button>
                                </div>
                            ))}
                            <Dropzone
                                onFilesDrop={handleGalleryDrop}
                                className="aspect-square bg-gray-50 dark:bg-gray-800 border-gray-200 hover:border-sky-500 rounded-xl flex items-center justify-center p-2"
                                description=""
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
            )}
        </Wizard>
    );
};

export default ArchitectureForm;

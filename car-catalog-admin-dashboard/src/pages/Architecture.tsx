import React, { useMemo } from 'react';
import { 
  Loader2, Plus, Edit2, Trash2, Compass, Layers, Ruler, FileText,
  Home, Building2, Factory, Landmark, LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ArchitectureForm from '@/components/architecture/ArchitectureForm';
import { useArchitecture } from '@/hooks/pages/useArchitecture';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

// CategoryIcon removed as it's not used anymore in the main grid or filters


const Architecture: React.FC = () => {
    const { state, actions } = useArchitecture();
    const {
        loading, isModalOpen, editingProduct,
        isSubmitting, filteredProducts, categories, selectedGroup
    } = state;

    const groupCategoriesOptions = useMemo(() => {
        const filtered = categories.filter(cat => {
            const val = cat.value.toLowerCase();
            if (selectedGroup === 'houses') return val.includes('casa') || val.includes('mansion');
            if (selectedGroup === 'buildings') return val.includes('edificio') || val.includes('conjunto');
            if (selectedGroup === 'commercial') return val.includes('comercial');
            if (selectedGroup === 'urbanism') return val.includes('urbanismo');
            if (selectedGroup === 'industrial') return val.includes('industrial');
            if (selectedGroup === 'institutional') return val.includes('institucional') || val.includes('salud');
            return false;
        });
        return [{ value: 'all', label: 'Todos', icon: 'LayoutGrid' }, ...filtered];
    }, [selectedGroup, categories]);

    if (loading && filteredProducts.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary-700 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <motion.div variants={slideUp} className="mb-10 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-indigo-500/5 border border-indigo-50 dark:border-indigo-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                               Nexus Architect Hub
                           </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-4 tracking-tighter">
                            <motion.div
                                variants={scaleIn}
                                className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-700 rounded-2xl text-white shadow-2xl shadow-indigo-500/40"
                            >
                                {selectedGroup === 'houses' ? <Home className="h-8 w-8" /> : 
                                 selectedGroup === 'buildings' ? <Building2 className="h-8 w-8" /> :
                                 selectedGroup === 'industrial' ? <Factory className="h-8 w-8" /> :
                                 selectedGroup === 'institutional' ? <Landmark className="h-8 w-8" /> :
                                 <LayoutGrid className="h-8 w-8" />}
                            </motion.div>
                            {selectedGroup ? <span>Hub de <span className="text-sky-600 capitalize">{selectedGroup.replace('houses', 'Casas').replace('buildings', 'Edificios').replace('commercial', 'Comercial').replace('urbanism', 'Urbanismo').replace('industrial', 'Industrial').replace('institutional', 'Hospitalario')}</span></span> : 'Architecture Hub'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium max-w-2xl">
                            {selectedGroup 
                                ? `Selecciona una especialidad dentro de ${selectedGroup} para ver tus proyectos y diseños.`
                                : 'Gestiona tu ecosistema de diseño: desde asesorías iniciales y venta de planos hasta grandes desarrollos urbanísticos y corporativos.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="primary"
                            icon={<Plus className="h-5 w-5" />}
                            onClick={actions.handleAddProduct}
                            className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-2xl !py-4 !px-8 shadow-xl shadow-indigo-600/20 transform transition-transform border-none text-base font-bold"
                        >
                            Nuevo Proyecto o Servicio
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Projects Grid Container */}
            {selectedGroup && (
                <div className="pt-4">
                    <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(project => (
                    <motion.div
                        key={project._id}
                        variants={slideUp}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-primary-700 shadow-sm">
                                {project.specs?.projectCategory || 'General'}
                            </div>
                            {project.files && project.files.length > 0 && (
                                <div className="absolute bottom-3 right-3 p-2 bg-blue-600 rounded-lg text-white shadow-lg">
                                    <FileText className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate">{project.name}</h3>
                                <span className="text-xl font-black text-primary-700 dark:text-primary-400">${project.price.toLocaleString()}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Ruler className="h-3.5 w-3.5" /> {project.specs?.area || 0} m²
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Layers className="h-3.5 w-3.5" /> {project.specs?.levels || 1} Niveles
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} onClick={() => actions.handleEditProduct(project)} />
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" icon={<Trash2 className="h-4 w-4" />} onClick={() => actions.handleDeleteProduct(project._id)} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${project.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {project.isAvailable ? 'PUBLICADO' : 'BORRADOR'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </motion.div>
                </div>
            )}

            {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-20">
                    <Compass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay proyectos encontrados</h3>
                    <p className="text-gray-500">Comienza subiendo tu primer diseño arquitectónico</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => actions.setIsModalOpen(false)}
                size="xl"
                title={editingProduct ? 'Editar Proyecto Arquitectónico' : 'Nuevo Proyecto para Architect'}
            >
                <ArchitectureForm
                    product={editingProduct}
                    categories={groupCategoriesOptions.filter(c => c.value !== 'all')}
                    onSubmit={actions.handleSubmit}
                    onClose={() => actions.setIsModalOpen(false)}
                    loading={isSubmitting}
                />
            </Modal>
        </motion.div>
    );
};

export default Architecture;

import React from 'react';
import { Loader2, Plus, Search, Edit2, Trash2, Filter, DollarSign, Compass, Layers, Ruler, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ArchitectureForm from '@/components/architecture/ArchitectureForm';
import { useArchitecture } from '@/hooks/pages/useArchitecture';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

const Architecture: React.FC = () => {
    const { state, actions } = useArchitecture();
    const {
        loading, searchTerm, selectedCategory, isModalOpen, editingProduct,
        isSubmitting, filteredProducts, stats, categoryOptions, categories
    } = state;

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
            <motion.div variants={slideUp} className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <motion.div
                                variants={scaleIn}
                                className="p-2 bg-gradient-to-br from-primary-700 to-indigo-800 rounded-xl text-white shadow-lg shadow-primary-700/20"
                            >
                                <Compass className="h-7 w-7" />
                            </motion.div>
                            Estudio de Arquitectura
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Administra tus diseños, planos y renders de alta gama</p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<Plus className="h-5 w-5" />}
                        onClick={actions.handleAddProduct}
                        className="!bg-primary-700 hover:!bg-primary-800 shadow-md shadow-primary-700/20"
                    >
                        Nuevo Proyecto
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Diseños</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
                        </div>
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <Compass className="h-6 w-6 text-primary-700 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos Activos</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeProjects}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor Catálogo</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Promedio / Proyecto</p>
                            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">${Math.round(stats.priceAvg).toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Layers className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={slideUp} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar proyectos..."
                            value={searchTerm}
                            onChange={(e) => actions.setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2 items-center flex-wrap w-full md:w-auto">
                        <Filter className="h-5 w-5 text-gray-400 hidden md:block" />
                        {categoryOptions.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => actions.setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.value
                                        ? 'bg-primary-700 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Projects Grid */}
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
                size="md"
                title={editingProduct ? 'Editar Proyecto Arquitectónico' : 'Nuevo Proyecto para Architect'}
            >
                <ArchitectureForm
                    product={editingProduct}
                    categories={categories}
                    onSubmit={actions.handleSubmit}
                    onClose={() => actions.setIsModalOpen(false)}
                    loading={isSubmitting}
                />
            </Modal>
        </motion.div>
    );
};

export default Architecture;

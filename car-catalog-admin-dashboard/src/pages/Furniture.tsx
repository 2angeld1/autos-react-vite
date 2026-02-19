import React from 'react';
import { Loader2, Plus, Search, Edit2, Trash2, Filter, DollarSign, Package, AlertTriangle, CheckCircle2, Sofa } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FurnitureProductForm from '@/components/furniture/FurnitureProductForm';
import { useFurniture } from '@/hooks/pages/useFurniture';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '@/animations/variants';

const Furniture: React.FC = () => {
    const { state, actions } = useFurniture();
    const {
        loading, searchTerm, selectedCategory, isModalOpen, editingProduct,
        isSubmitting, filteredProducts, stats, categoryOptions, categories, pagination
    } = state;

    if (loading && filteredProducts.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 text-amber-700 animate-spin" />
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
                                className="p-2 bg-gradient-to-br from-amber-700 to-yellow-800 rounded-xl text-white shadow-lg shadow-amber-700/20"
                            >
                                <Sofa className="h-7 w-7" />
                            </motion.div>
                            DecoHaus
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona sofás, mesas, camas, iluminación y decoración</p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<Plus className="h-5 w-5" />}
                        onClick={actions.handleAddProduct}
                        className="!bg-amber-700 hover:!bg-amber-800 shadow-md shadow-amber-700/20"
                    >
                        Agregar Mueble
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Muebles</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <Sofa className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Agotados</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.outOfStockCount}</p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor Inventario</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stock Bajo</p>
                            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.lowStockCount}</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-amber-700 dark:text-amber-400" />
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
                            placeholder="Buscar muebles DecoHaus..."
                            value={searchTerm}
                            onChange={(e) => actions.setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                    <div className="flex gap-2 items-center flex-wrap w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter className="h-5 w-5 text-gray-400 hidden md:block" />
                        {categoryOptions.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => actions.setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.value
                                        ? 'bg-amber-700 text-white shadow-md shadow-amber-700/20'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Products Table */}
            <motion.div variants={slideUp} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mueble</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredProducts.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border">
                                                {product.thumbnail ? (
                                                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Sofa className="h-6 w-6 text-amber-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.sku || 'Sin SKU'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium border border-amber-100">
                                            {product.specs?.furnitureCategory || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {product.specs?.material || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {product.comparePrice && product.comparePrice > product.price && (
                                            <span className="text-xs text-gray-400 line-through ml-2">${product.comparePrice.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : 'text-gray-900 dark:text-gray-300'}`}>
                                            {product.stock}
                                        </span>
                                        <span className="text-gray-400 text-xs ml-1">uds</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.stock === 0 ? (
                                            <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium"><Package className="h-4 w-4" /> Agotado</span>
                                        ) : product.stock < 5 ? (
                                            <span className="flex items-center gap-1.5 text-amber-600 text-sm font-medium"><AlertTriangle className="h-4 w-4" /> Stock Bajo</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Disponible</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />} onClick={() => actions.handleEditProduct(product)} />
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" icon={<Trash2 className="h-4 w-4" />} onClick={() => actions.handleDeleteProduct(product._id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {filteredProducts.length === 0 && !loading && (
                <motion.div variants={slideUp} className="text-center py-12">
                    <Sofa className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay muebles en DecoHaus</h3>
                    <p className="text-gray-500">Agrega tu primer mueble de diseño para comenzar</p>
                </motion.div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => actions.handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagination.page === page ? 'bg-amber-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => actions.setIsModalOpen(false)}
                size="md"
                title={editingProduct ? 'Editar Mueble DecoHaus' : 'Nuevo Mueble DecoHaus'}
            >
                <FurnitureProductForm
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

export default Furniture;

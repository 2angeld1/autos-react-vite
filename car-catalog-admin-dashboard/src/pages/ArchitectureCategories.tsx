import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, Search, Edit2, Trash2, Layers, ChevronRight, 
    Check, X, LayoutGrid, Info
} from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import api from '@/services/api';

interface Subcategory {
    _id?: string;
    name: string;
    slug: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    subcategories: Subcategory[];
}

const ArchitectureCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subName, setSubName] = useState('');
    const [tempSubcategories, setTempSubcategories] = useState<Subcategory[]>([]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/architecture/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setDescription(category.description || '');
            setTempSubcategories(category.subcategories);
        } else {
            setEditingCategory(null);
            setName('');
            setDescription('');
            setTempSubcategories([]);
        }
        setIsModalOpen(true);
    };

    const addSubcategory = () => {
        if (!subName.trim()) return;
        const slug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setTempSubcategories([...tempSubcategories, { name: subName, slug }]);
        setSubName('');
    };

    const removeSubcategory = (index: number) => {
        setTempSubcategories(tempSubcategories.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // En una implementación real llamaríamos al backend
        console.log('Enviando...', { name, description, tempSubcategories });
        setIsModalOpen(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-sky-500 rounded-xl shadow-lg shadow-sky-500/20">
                            <Layers className="h-7 w-7 text-white" />
                        </div>
                        Gestión de Especialidades
                    </h1>
                    <p className="text-gray-500 mt-1">Configura las categorías y tipologías para el estudio.</p>
                </div>
                <Button 
                    variant="primary" 
                    icon={<Plus className="h-5 w-5" />} 
                    onClick={() => handleOpenModal()}
                    className="!bg-sky-600 hover:!bg-sky-700 shadow-xl shadow-sky-500/20 px-6 py-3"
                >
                    Nueva Especialidad
                </Button>
            </div>

            {/* Top Toolbar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-sky-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-widest px-4 py-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                    <Info className="h-4 w-4" />
                    {categories.length} Especialidades registradas
                </div>
            </div>

            {/* Categories List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl border border-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <motion.div 
                            key={category._id}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-2xl">
                                        <LayoutGrid className="h-6 w-6 text-sky-600" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleOpenModal(category)} className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{category.name || (category as any).label}</h3>
                                <p className="text-xs text-gray-500 mb-6 line-clamp-2">{category.description || 'Sin descripción detallada.'}</p>
                                
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Tipologías ({category.subcategories.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {category.subcategories.slice(0, 4).map((sub, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-medium rounded-full">
                                                {sub.name}
                                            </span>
                                        ))}
                                        {category.subcategories.length > 4 && (
                                            <span className="px-3 py-1 bg-sky-50 dark:bg-sky-900/30 text-sky-600 text-[11px] font-bold rounded-full">
                                                +{category.subcategories.length - 4} más
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: {category.slug}</span>
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-sky-500 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Configurar Especialidad' : 'Crear Nueva Especialidad'}
                size="lg"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <Input 
                            label="Nombre de la Especialidad" 
                            placeholder="ej: Casas, Edificios, Mansiones"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                            <textarea 
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-sky-500 text-sm h-32 resize-none"
                                placeholder="Describe brevemente de qué trata esta sección..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Subcategories Editor */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Plus className="h-4 w-4 text-sky-500" /> Añadir Tipologías (Subcategorías)
                        </h4>
                        
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="ej: 1 Piso, Con Terraza..."
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-sky-500 text-sm shadow-sm"
                                value={subName}
                                onChange={(e) => setSubName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
                            />
                            <Button onClick={addSubcategory} className="!bg-sky-600 px-4">Añadir</Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tempSubcategories.map((sub, index) => (
                                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm group">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{sub.name}</span>
                                    <button onClick={() => removeSubcategory(index)} className="p-1 hover:text-red-500 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button 
                            variant="primary" 
                            className="!bg-sky-600 px-8" 
                            icon={<Check className="h-4 w-4" />}
                            onClick={handleSubmit}
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
};

export default ArchitectureCategories;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { DecoLayout } from '../layout/DecoLayout';
import DecoCard from '../components/DecoCard';
import { furnitureService, FurnitureProduct } from '../services/furnitureService';

const CATEGORIES = ['TODOS', 'SALA', 'COMEDOR', 'DORMITORIO', 'OFICINA', 'EXTERIOR', 'ILUMINACIÓN', 'DECORACIÓN'];

const CatalogoPage = () => {
    const [products, setProducts] = useState<FurnitureProduct[]>([]);
    const [active, setActive] = useState('TODOS');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        furnitureService.getAllProducts().then(data => { setProducts(data); setLoading(false); });
    }, []);

    const filtered = products.filter(p => {
        const matchCat = active === 'TODOS' || p.category.toUpperCase().includes(active);
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <DecoLayout>
            {/* Hero */}
            <section className="h-[35vh] flex items-end px-8 pb-12 bg-[#1a1a1a] relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920"
                    alt="Catálogo"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 container mx-auto max-w-6xl">
                    <p className="text-xs tracking-[0.4em] uppercase text-[#C9A078] mb-3">Colección Completa</p>
                    <h1 className="text-6xl font-black text-white leading-none">Catálogo</h1>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-0 z-30 bg-white shadow-sm py-4 px-8">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`text-xs py-2 px-4 rounded-full font-semibold transition-all ${active === cat
                                    ? 'bg-[#1a1a1a] text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar mueble..."
                            className="bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B6F47] w-52"
                        />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-12 px-8 bg-[#F5F0EB]">
                <div className="container mx-auto max-w-6xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-3 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <p className="text-xs tracking-wider uppercase text-gray-400 mb-8">
                                {filtered.length} productos encontrados
                            </p>
                            <motion.div
                                key={`${active}-${search}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:!grid-cols-5 gap-6"
                            >
                                {filtered.map(p => (
                                    <DecoCard key={p._id} {...p} />
                                ))}
                            </motion.div>
                            {filtered.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-xl font-semibold text-gray-400">No hay productos en esta categoría</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </DecoLayout>
    );
};

export default CatalogoPage;

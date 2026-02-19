import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { JewelLayout } from '../layout/JewelLayout';
import JewelCard from '../components/JewelCard';
import { jewelService, JewelProduct } from '../services/jewelService';

const CATEGORIES = ['TODOS', 'ANILLOS', 'COLLARES', 'PULSERAS', 'ARETES', 'RELOJES', 'COMPROMISO', 'SETS'];

const CatalogoPage = () => {
    const [products, setProducts] = useState<JewelProduct[]>([]);
    const [active, setActive] = useState('TODOS');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        jewelService.getAllProducts().then(data => { setProducts(data); setLoading(false); });
    }, []);

    const filtered = products.filter(p => {
        const matchCat = active === 'TODOS' || p.category.toUpperCase().includes(active);
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <JewelLayout>
            {/* Hero */}
            <section className="h-[40vh] flex items-end justify-start relative overflow-hidden px-8 pb-16">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/images/luxjewel-catalogo-hero.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a090c] via-[#0a090c]/70 to-transparent" />
                <div className="relative z-10 max-w-6xl mx-auto w-full container">
                    <p className="text-[10px] tracking-[0.5em] uppercase font-sans text-[#C9A84C] mb-3">Haute Joaillerie</p>
                    <h1 className="text-6xl md:text-8xl font-bold italic text-white leading-none">Colección</h1>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-0 z-30 bg-[#0a090c]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-5 px-8">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`text-[10px] tracking-[0.3em] uppercase font-sans px-4 py-2 transition-all ${active === cat
                                    ? 'bg-[#C9A84C] text-black'
                                    : 'text-gray-400 border border-gray-700 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar pieza..."
                            className="bg-transparent border border-gray-700 pl-9 pr-4 py-2 text-xs font-sans text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A84C] w-56"
                        />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16 px-8 bg-[#08070d]">
                <div className="container mx-auto max-w-6xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <p className="text-xs tracking-[0.3em] uppercase font-sans text-gray-500 mb-10">
                                {filtered.length} piezas encontradas
                            </p>
                            <motion.div
                                key={`${active}-${search}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:!grid-cols-5 gap-8"
                            >
                                {filtered.map(p => (
                                    <JewelCard key={p._id} {...p} />
                                ))}
                            </motion.div>
                            {filtered.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-2xl italic text-gray-600">No hay piezas en esta colección</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </JewelLayout>
    );
};

export default CatalogoPage;

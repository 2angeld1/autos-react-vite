import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';
import { staggerContainer, slideUp } from '../animations/variants';
import ProductCard from '../components/ProductCard';
import { ironService, IronProduct } from '../services/ironService';
import TireTracksBackground from '../components/TireTracksBackground';

const categories = ['TODOS', 'SUSPENSIÓN', 'RESORTES', 'SNORKEL', 'RESCATE', 'ELEVACIÓN', 'ILUMINACIÓN', 'PROTECCIÓN'];

const CatalogoPage = () => {
    const [allProducts, setAllProducts] = useState<IronProduct[]>([]);
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const products = await ironService.getAllProducts();
            setAllProducts(products);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = allProducts.filter(p => {
        const matchesCategory = activeCategory === 'TODOS' || p.category.toUpperCase() === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <IronLayout>
            {/* HERO CON TIRE TRACKS */}
            <section className="h-[50vh] flex items-center justify-center relative overflow-hidden">
                <TireTracksBackground opacity={0.4} />
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center relative z-10"
                >
                    <h1 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
                        CATÁLOGO
                    </h1>
                    <p className="text-[#FFD700] mt-4 text-xl font-bold uppercase tracking-[0.2em]">
                        Explora la Aventura
                    </p>
                </motion.div>
            </section>

            {/* FILTERS */}
            <section className="py-8 bg-gray-100 sticky top-16 z-30 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* SEARCH */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white text-sm font-bold uppercase focus:outline-none focus:border-[#FFD700]"
                            />
                        </div>

                        {/* CATEGORY FILTERS */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                                        activeCategory === cat 
                                            ? 'bg-[#FFD700] text-black' 
                                            : 'bg-white text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-8 lg:px-12 max-w-7xl">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 mb-8 font-bold uppercase">
                                Mostrando {filteredProducts.length} productos
                            </p>
                            <motion.div 
                                    key={`${activeCategory}-${searchQuery}`}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:!grid-cols-4 gap-6"
                                variants={staggerContainer}
                                initial="hidden"
                                    animate="visible"
                            >
                                    {filteredProducts.map((product) => (
                                        <motion.div key={product._id || product.title} variants={slideUp} className="pb-4">
                                        <ProductCard {...product} />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 text-gray-400">
                                    <p className="text-2xl font-bold uppercase">No se encontraron productos</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </IronLayout>
    );
};

export default CatalogoPage;

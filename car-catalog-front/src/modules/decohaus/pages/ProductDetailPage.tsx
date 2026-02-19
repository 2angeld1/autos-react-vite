import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Leaf, Truck, Shield, ArrowRight, Minus, Plus, Info, Ruler, Package } from 'lucide-react';
import { DecoLayout } from '../layout/DecoLayout';
import { furnitureService, FurnitureProduct } from '../services/furnitureService';
import DecoCard from '../components/DecoCard';

const TABS = [
    { id: 'detalle', label: 'Detalles', icon: Info },
    { id: 'dimensiones', label: 'Dimensiones', icon: Ruler },
    { id: 'envio', label: 'Envío', icon: Package },
];

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<FurnitureProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('detalle');
    const [related, setRelated] = useState<FurnitureProduct[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            if (id) {
                const data = await furnitureService.getProductById(id);
                setProduct(data || null);

                if (data) {
                    const all = await furnitureService.getAllProducts();
                    setRelated(all.filter(p => p._id !== data._id).slice(0, 5));
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <DecoLayout>
            <div className="h-screen flex items-center justify-center bg-[#F5F0EB]">
                <div className="w-12 h-12 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
            </div>
        </DecoLayout>
    );

    if (!product) return (
        <DecoLayout>
            <div className="h-screen flex flex-col items-center justify-center bg-[#F5F0EB] p-8 text-center">
                <h2 className="text-4xl font-black mb-4">Pieza no encontrada</h2>
                <Link to="/decohaus/catalogo" className="text-[#8B6F47] font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                    Volver al catálogo <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </DecoLayout>
    );

    return (
        <DecoLayout>
            {/* Hero Banner Genérico y Compacto */}
            <section className="relative h-[35vh] flex items-center justify-center overflow-hidden bg-[#000]">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920"
                        className="w-full h-full object-cover opacity-60"
                        alt="Ambiente DecoHaus"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
                </div>
                <div className="container mx-auto px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-[10px] tracking-[0.5em] uppercase text-[#8B6F47] mb-3 font-bold">Exclusividad</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Detalle de Pieza</h2>
                    </motion.div>
                </div>
            </section>

            {/* Breadcrumb */}
            <nav className="border-b border-gray-100 py-4 px-8 bg-white">
                <div className="container mx-auto max-w-7xl flex items-center gap-2 text-xs font-medium text-gray-400">
                    <Link to="/decohaus" className="hover:text-[#1a1a1a] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/decohaus/catalogo" className="hover:text-[#1a1a1a] transition-colors">Catálogo</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#1a1a1a]">{product.title}</span>
                </div>
            </nav>

            {/* Main Product Section */}
            <section className="bg-white py-12 md:py-20 px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="aspect-[4/5] bg-[#F5F0EB] rounded-[2rem] overflow-hidden group relative">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay badge */}
                                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B6F47]">Artesanal</p>
                                </div>
                            </div>
                            {/* Secondary images (placeholder since we only have one) */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-square bg-[#F5F0EB] rounded-2xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <div className="flex flex-col pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <p className="text-xs tracking-[0.4em] uppercase text-[#8B6F47] mb-4">{product.category}</p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-[1.1] mb-6">
                                    {product.title}
                                </h1>
                                <div className="flex items-center gap-6 mb-10">
                                    <span className="text-3xl font-bold text-[#1a1a1a]">${product.price}</span>
                                    <div className="h-8 w-px bg-gray-200" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 font-sans tracking-wider">(24 Reseñas)</span>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                                    {product.description || "Una pieza maestra de diseño contemporáneo que combina la calidez de los materiales naturales con líneas arquitectónicas puras. Perfecta para elevar cualquier ambiente moderno."}
                                </p>

                                {/* Tabs Layout */}
                                <div className="border-b border-gray-100 flex gap-8 mb-8">
                                    {TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`pb-4 text-xs font-bold uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-[#1a1a1a]' : 'text-gray-300 hover:text-[#555]'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <tab.icon className="w-3 h-3" />
                                                {tab.label}
                                            </span>
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#8B6F47] rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="min-h-[120px] mb-12">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm text-gray-500 leading-relaxed"
                                        >
                                            {activeTab === 'detalle' && (
                                                <div className="grid grid-cols-2 gap-y-4">
                                                    <div><p className="font-bold text-[#1a1a1a] mb-1">Material</p><p>{product.material || "Madera Maciza de Roble"}</p></div>
                                                    <div><p className="font-bold text-[#1a1a1a] mb-1">Acabado</p><p>Natural Mate</p></div>
                                                    <div><p className="font-bold text-[#1a1a1a] mb-1">Cuidado</p><p>Paño húmedo suave</p></div>
                                                    <div><p className="font-bold text-[#1a1a1a] mb-1">Estilo</p><p>Scandinavian Modern</p></div>
                                                </div>
                                            )}
                                            {activeTab === 'dimensiones' && (
                                                <div className="space-y-4">
                                                    <p><span className="font-bold text-[#1a1a1a]">Medidas generales:</span> {product.dimensions || "120 x 45 x 75 cm"}</p>
                                                    <p><span className="font-bold text-[#1a1a1a]">Peso estimado:</span> 15.5 kg</p>
                                                    <div className="p-4 bg-[#F5F0EB] rounded-xl flex items-center gap-4">
                                                        <Ruler className="text-[#8B6F47] w-5 h-5" />
                                                        <p className="text-xs">Verifica que los accesos (puertas/ascensores) tengan las medidas adecuadas antes de comprar.</p>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'envio' && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3"><Truck className="w-4 h-4 text-[#8B6F47]" /> <span>Envío Gratis en compras mayores a $500</span></div>
                                                    <div className="flex items-center gap-3"><Package className="w-4 h-4 text-[#8B6F47]" /> <span>Tiempo estimado: 5-8 días hábiles</span></div>
                                                    <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-[#8B6F47]" /> <span>Embalaje reforzado de alta seguridad</span></div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-xl p-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button className="flex-1 bg-[#1a1a1a] text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-[#8B6F47] transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/10">
                                        Añadir al carrito
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Badges */}
                                <div className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-100 pt-10">
                                    <div className="flex items-center gap-3">
                                        <Leaf className="w-5 h-5 text-[#8B6F47]" />
                                        <span className="text-xs font-medium text-gray-500">Material Sustentable</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-[#8B6F47]" />
                                        <span className="text-xs font-medium text-gray-500">Diseño Patentado</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* RELATED PRODUCTS */}
            {related.length > 0 && (
                <section className="py-24 px-8 bg-[#F5F0EB]">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex justify-between items-end mb-12 px-4">
                            <div>
                                <p className="text-xs tracking-[0.4em] uppercase text-[#8B6F47] mb-3">Sugerencias</p>
                                <h2 className="text-4xl font-black text-[#1a1a1a]">Completa el Estilo</h2>
                            </div>
                            <Link to="/decohaus/catalogo" className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#8B6F47] hover:gap-4 transition-all uppercase tracking-widest">
                                Ver todo <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {related.map(p => (
                                <DecoCard key={p._id} {...p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </DecoLayout>
    );
};

export default ProductDetailPage;

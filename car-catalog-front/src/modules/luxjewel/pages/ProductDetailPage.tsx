import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Award, ShieldCheck, Heart, Share2, ArrowRight, Truck } from 'lucide-react';
import { JewelLayout } from '../layout/JewelLayout';
import { jewelService, JewelProduct } from '../services/jewelService';
import JewelCard from '../components/JewelCard';

const TABS = [
    { id: 'pieza', label: 'La Pieza' },
    { id: 'metales', label: 'Metales & Piedras' },
    { id: 'envio', label: 'Maison Services' },
];

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<JewelProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pieza');
    const [related, setRelated] = useState<JewelProduct[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            if (id) {
                const data = await jewelService.getProductById(id);
                setProduct(data || null);

                if (data) {
                    const all = await jewelService.getAllProducts();
                    setRelated(all.filter(p => p._id !== data._id).slice(0, 4));
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <JewelLayout>
            <div className="h-screen flex items-center justify-center bg-[#0a090c]">
                <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            </div>
        </JewelLayout>
    );

    if (!product) return (
        <JewelLayout>
            <div className="h-screen flex flex-col items-center justify-center bg-[#0a090c] p-8 text-center text-white">
                <h2 className="text-4xl font-bold italic mb-4">Pieza no encontrada</h2>
                <Link to="/luxjewel/catalogo" className="text-[#C9A84C] font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                    Volver a la colección <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </JewelLayout>
    );

    return (
        <JewelLayout>
            {/* Header Spacer */}
            <div className="h-24" />

            <div className="bg-[#0a090c] min-h-screen">
                {/* Breadcrumb Section */}
                <div className="container mx-auto max-w-7xl px-8 py-6 border-b border-[#C9A84C]/10">
                    <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-sans">
                        <Link to="/luxjewel" className="hover:text-[#C9A84C] transition-colors">La Maison</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/luxjewel/catalogo" className="hover:text-[#C9A84C] transition-colors">Colección</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#C9A84C]">{product.title}</span>
                    </nav>
                </div>

                {/* Product Detail Content */}
                <section className="py-12 md:py-24 px-8 overflow-hidden">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                            {/* Visuals Column */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="aspect-square bg-gradient-to-b from-[#1a181d] to-[#0a090c] border border-[#C9A84C]/10 relative p-12 lg:p-20 overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C9A84C]/5 via-transparent to-transparent opacity-50" />
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-contain relative z-10 transition-transform duration-[2s] group-hover:scale-110"
                                    />
                                    {/* Action icons overlay */}
                                    <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
                                        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="aspect-square bg-[#1a181d] border border-[#C9A84C]/5 overflow-hidden p-4 group cursor-pointer">
                                            <img src={product.image} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Info Column */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col pt-4 lg:pt-0"
                            >
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <span className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] font-sans">Elegancia Exclusiva</span>
                                        <h1 className="text-5xl lg:text-7xl font-bold italic text-white leading-tight tracking-wider">
                                            {product.title}
                                        </h1>
                                        <div className="flex items-center gap-6">
                                            <span className="text-3xl font-light tracking-[0.2em] text-[#C9A84C] underline underline-offset-[12px] decoration-[#C9A84C]/30 text-sans">
                                                $ {product.price}
                                            </span>
                                            <div className="px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-[9px] uppercase tracking-widest rounded-full">
                                                Disponible
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                                        {product.description || "Una expresión sublime de la maestría joyera. Esta pieza ha sido esculpida con precisión absoluta para capturar la esencia de la luz y el lujo eterno."}
                                    </p>

                                    {/* Tabs */}
                                    <div className="space-y-6 pt-8 border-t border-[#C9A84C]/10">
                                        <div className="flex gap-10">
                                            {TABS.map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`text-[10px] tracking-[0.3em] uppercase font-sans transition-all relative pb-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                                                        }`}
                                                >
                                                    {tab.label}
                                                    {activeTab === tab.id && (
                                                        <motion.div layoutId="jewelTabLine" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A84C]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="min-h-[120px]">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={activeTab}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-xs text-gray-500 leading-loose tracking-widest font-sans uppercase"
                                                >
                                                    {activeTab === 'pieza' && (
                                                        <ul className="space-y-3">
                                                            <li><span className="text-gray-300 font-bold">Colección:</span> Atelier Premium</li>
                                                            <li><span className="text-gray-300 font-bold">Estilo:</span> Contemporary Classic</li>
                                                            <li><span className="text-gray-300 font-bold">Referencia:</span> LUX-{product._id?.substring(18) || "8823"}</li>
                                                            <li><span className="text-gray-300 font-bold">Refinado:</span> Pulido a mano espejo</li>
                                                        </ul>
                                                    )}
                                                    {activeTab === 'metales' && (
                                                        <ul className="space-y-3">
                                                            <li><span className="text-gray-300 font-bold">Material Base:</span> {product.material || "Oro Blanco de 18 Kilates"}</li>
                                                            <li><span className="text-gray-300 font-bold">Peso Metal:</span> 4.2 gr (promedio)</li>
                                                            <li><span className="text-gray-300 font-bold">Certificación:</span> Sello Real de Pureza LuxJewel</li>
                                                            <li><span className="text-gray-300 font-bold">Garantía:</span> Vitalicia por defectos de fabricación</li>
                                                        </ul>
                                                    )}
                                                    {activeTab === 'envio' && (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4 border border-[#C9A84C]/10 p-4 bg-white/5">
                                                                <Award className="w-5 h-5 text-[#C9A84C]" />
                                                                <div>
                                                                    <p className="text-white font-bold mb-1">Empaque Maison</p>
                                                                    <p className="normal-case text-[10px]">Cofre forrado en terciopelo negro y seda italiana.</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 border border-[#C9A84C]/10 p-4 bg-white/5">
                                                                <Truck className="w-5 h-5 text-[#C9A84C]" />
                                                                <div>
                                                                    <p className="text-white font-bold mb-1">Envío Asegurado</p>
                                                                    <p className="normal-case text-[10px]">Servicio express nacional gratuito con seguro de transporte.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-10 space-y-4">
                                        <button className="w-full bg-[#C9A84C] text-black py-5 uppercase tracking-[0.4em] font-sans text-xs font-bold hover:bg-[#b09140] transition-all flex items-center justify-center gap-4">
                                            Adquirir esta pieza
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <button className="w-full border border-[#C9A84C]/30 text-[#C9A84C] py-4 uppercase tracking-[0.2em] font-sans text-[10px] hover:bg-[#C9A84C]/5 transition-all">
                                            Consultar con un especialista
                                        </button>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="grid grid-cols-2 gap-8 pt-12">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-[#C9A84C]/60" />
                                            <span className="text-[9px] uppercase tracking-widest text-gray-500">Transacción Protegida</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Award className="w-4 h-4 text-[#C9A84C]/60" />
                                            <span className="text-[9px] uppercase tracking-widest text-gray-500">Certificado Autenticidad</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* RELATED PRODUCTS */}
                {related.length > 0 && (
                    <section className="py-24 px-8 bg-[#0a090c] border-t border-[#C9A84C]/5">
                        <div className="container mx-auto max-w-7xl">
                            <div className="flex justify-between items-end mb-16 px-4">
                                <div className="space-y-4">
                                    <span className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] font-sans">Sugerencias Maison</span>
                                    <h2 className="text-4xl font-bold italic text-white tracking-widest leading-none">Otras Joyas Perfectas</h2>
                                </div>
                                <Link to="/luxjewel/catalogo" className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-sans text-[#C9A84C] hover:gap-6 transition-all underline underline-offset-8 decoration-[#C9A84C]/30">
                                    Ver toda la colección <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                                {related.map(p => (
                                    <JewelCard key={p._id} {...p} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </JewelLayout>
    );
};

export default ProductDetailPage;

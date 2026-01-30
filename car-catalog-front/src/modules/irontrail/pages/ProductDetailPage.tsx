import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Truck, ShieldCheck, Share2 } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';
import { ironService, IronProduct } from '../services/ironService';
import ProductGallery from '../components/ProductGallery';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IronProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
             if (id) {
                const data = await ironService.getProductById(id);
                setProduct(data || null);
             }
             setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FFD700] rounded-full animate-spin border-t-transparent" /></div>;

    if (!product) {
        return (
            <IronLayout>
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                    <h2 className="text-4xl font-black uppercase text-gray-300">Producto No Encontrado</h2>
                    <Link to="/irontrail/catalogo" className="mt-4 text-[#FFD700] font-bold underline">Volver al Catálogo</Link>
                </div>
            </IronLayout>
        );
    }

    return (
        <IronLayout headerVariant="solid">
            {/* Spacer for fixed header */}
            <div className="h-16" />
            
            <div className="bg-gray-50 min-h-screen pb-12">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* BREADCRUMB - Subtle bar */}
                    <div className="py-4 mb-8 border-b border-gray-200">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/irontrail" className="text-gray-500 hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                            <span className="text-gray-300">/</span>
                            <Link to="/irontrail/catalogo" className="text-gray-500 hover:text-gray-900 transition-colors">
                                Catálogo
                            </Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* IMAGE SECTION - GALLERY */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <ProductGallery 
                                images={[product.image, product.image, product.image, product.image]} 
                                title={product.title} 
                            />
                        </motion.div>

                        {/* INFO SECTION */}
                        <motion.div 
                             initial={{ opacity: 0, x: 50 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">{product.title}</h1>
                            <div className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                                ${product.price}
                                <span className="text-sm font-normal text-gray-500 line-through">$1,499</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                {product.description || "Diseñado para resistir las condiciones más extremas del Outback australiano. Este producto ha sido probado rigurosamente para garantizar un rendimiento superior en cualquier terreno."}
                            </p>

                            {/* SPECS GRID */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Material</div>
                                    <div className="font-bold text-sm">Acero Reforzado</div>
                                </div>
                                <div className="bg-gray-50 p-4 border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Garantía</div>
                                    <div className="font-bold text-sm">3 Años / 60k km</div>
                                </div>
                                <div className="bg-gray-50 p-4 border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Instalación</div>
                                    <div className="font-bold text-sm">Bolt-On (Directa)</div>
                                </div>
                                <div className="bg-gray-50 p-4 border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Origen</div>
                                    <div className="font-bold text-sm">Australia</div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col gap-4">
                                <button className="w-full bg-black text-white hover:bg-[#FFD700] hover:text-black transition-colors font-black uppercase py-4 text-xl tracking-widest">
                                    Solicitar Cotización
                                </button>
                                <div className="flex gap-4">
                                     <button className="flex-1 border border-gray-300 font-bold uppercase py-3 text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50">
                                        <Info className="w-4 h-4" /> Ficha Técnica
                                     </button>
                                     <button className="flex-1 border border-gray-300 font-bold uppercase py-3 text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50">
                                        <Truck className="w-4 h-4" /> Envío Gratis*
                                     </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Compra Segura
                                </div>
                                <div className="flex items-center gap-2 hover:text-[#FFD700] cursor-pointer transition-colors">
                                    <Share2 className="w-4 h-4" /> Compartir
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </IronLayout>
    );
};

export default ProductDetailPage;

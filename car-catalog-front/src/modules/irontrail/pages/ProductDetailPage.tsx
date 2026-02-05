import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Truck, ShieldCheck, Share2, ChevronRight, Check, Star, Zap, X, Send, Phone, Mail, User } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';
import { ironService, IronProduct } from '../services/ironService';

// Tabs for product details
const TABS = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'especificaciones', label: 'Especificaciones' },
    { id: 'compatibilidad', label: 'Compatibilidad' },
];

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IronProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('descripcion');
    const [relatedProducts, setRelatedProducts] = useState<IronProduct[]>([]);
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);

    // Generate gallery images (use product images or fallback)
    const galleryImages = product?.images && product.images.length > 1
        ? product.images
        : (product ? [product.image, product.image, product.image, product.image] : []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                const data = await ironService.getProductById(id);
                setProduct(data || null);

                // Fetch related products (same category)
                if (data) {
                    const all = await ironService.getAllProducts();
                    const related = all.filter(p => p.category === data.category && p._id !== data._id).slice(0, 4);
                    setRelatedProducts(related.length > 0 ? related : all.filter(p => p._id !== data._id).slice(0, 4));
                }
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    // Auto-loop gallery images
    useEffect(() => {
        if (!product || galleryImages.length <= 1) return;

        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % galleryImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#FFD700] rounded-full animate-spin border-t-transparent" />
        </div>
    );

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
            
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-10 lg:px-12 py-8">
                    {/* BREADCRUMB */}
                    <nav className="flex items-center gap-2 text-sm my-8">
                        <Link to="/irontrail" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <Link to="/irontrail/catalogo" className="text-gray-500 hover:text-gray-900 transition-colors">Catálogo</Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 my-8">
                        {/* IMAGE GALLERY */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {/* Main Image */}
                            <div className="relative aspect-square bg-white border-2 border-gray-100 overflow-hidden group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        src={galleryImages[selectedImage]}
                                        alt={product.title}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full object-contain p-8"
                                    />
                                </AnimatePresence>

                                {/* Badge */}
                                <div className="absolute top-4 left-4 bg-[#FFD700] text-black text-xs font-black uppercase px-3 py-1">
                                    {product.category}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 mt-4">
                                {galleryImages.slice(0, 4).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`!w-20 !h-20 !bg-white !border-2 !p-1 transition-all flex-shrink-0 ${selectedImage === i
                                            ? '!border-[#FFD700] !ring-2 !ring-[#FFD700]/30 scale-105'
                                            : '!border-gray-200 hover:!border-gray-400 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="!w-full !h-full !object-cover" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* PRODUCT INFO */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col"
                        >
                            {/* Title & Price */}
                            <div className="mb-6">
                                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                    {product.title}
                                </h1>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-gray-900">${product.price}</span>
                                    <span className="text-lg text-gray-400 line-through">$1,499</span>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">AHORRA 15%</span>
                                </div>
                            </div>

                            {/* Quick Features */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { icon: ShieldCheck, label: '3 Años Garantía' },
                                    { icon: Truck, label: 'Envío Gratis' },
                                    { icon: Zap, label: 'Instalación Directa' },
                                ].map((feature) => (
                                    <div key={feature.label} className="text-center p-3 bg-white border border-gray-100">
                                        <feature.icon className="w-5 h-5 mx-auto mb-1 text-[#FFD700]" />
                                        <span className="text-[10px] font-bold uppercase text-gray-600 leading-tight block">{feature.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* TABS */}
                            <div className="border-b border-gray-200 mb-6">
                                <div className="flex gap-0">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.id
                                                ? 'text-black'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD700]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* TAB CONTENT */}
                            <div className="flex-1 mb-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'descripcion' && (
                                        <motion.div
                                            key="descripcion"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-gray-600 leading-relaxed space-y-4"
                                        >
                                            <p>{product.description || "Diseñado para resistir las condiciones más extremas del Outback australiano. Este producto ha sido probado rigurosamente para garantizar un rendimiento superior en cualquier terreno."}</p>
                                            <ul className="space-y-2">
                                                {['Tecnología Nitro Gas de alta presión', 'Cuerpo de acero reforzado', 'Pistones de 60mm de diámetro', 'Ajuste de rebote en 12 etapas'].map((item) => (
                                                    <li key={item} className="flex items-start gap-2">
                                                        <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {activeTab === 'especificaciones' && (
                                        <motion.div
                                            key="especificaciones"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="grid grid-cols-2 gap-3"
                                        >
                                            {[
                                                ['Material', 'Acero Reforzado'],
                                                ['Garantía', '3 Años / 60k km'],
                                                ['Instalación', 'Bolt-On (Directa)'],
                                                ['Origen', 'Australia'],
                                                ['Diámetro Pistón', '60mm'],
                                                ['Presión Gas', '150 PSI'],
                                                ['Peso', '4.2 kg'],
                                                ['Acabado', 'Recubrimiento Zinc'],
                                            ].map(([label, value]) => (
                                                <div key={label} className="bg-white p-4 border border-gray-100">
                                                    <div className="text-xs text-gray-400 font-bold uppercase">{label}</div>
                                                    <div className="font-bold text-sm text-gray-900">{value}</div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === 'compatibilidad' && (
                                        <motion.div
                                            key="compatibilidad"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-3"
                                        >
                                            <p className="text-gray-600 text-sm mb-4">Este producto es compatible con los siguientes vehículos:</p>
                                            {[
                                                { brand: 'Toyota', models: 'Hilux 2015-2024, 4Runner 2010-2024, Land Cruiser 200' },
                                                { brand: 'Nissan', models: 'Patrol Y61/Y62, Frontier 2016-2024' },
                                                { brand: 'Ford', models: 'Ranger 2019-2024, F-150 2015-2024' },
                                            ].map((vehicle) => (
                                                <div key={vehicle.brand} className="bg-white p-4 border border-gray-100 flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-sm">
                                                        {vehicle.brand[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm">{vehicle.brand}</div>
                                                        <div className="text-xs text-gray-500">{vehicle.models}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* CTA BUTTONS */}
                            <div className="space-y-4 mt-auto">
                                <button
                                    onClick={() => { setQuoteModalOpen(true); setQuoteSubmitted(false); }}
                                    className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-all font-black uppercase py-5 text-xl tracking-widest flex items-center justify-center gap-3 -skew-x-[5deg] shadow-lg hover:shadow-xl"
                                >
                                    <span className="skew-x-[5deg] flex items-center gap-3">
                                        <Star className="w-6 h-6" />
                                        Solicitar Cotización
                                    </span>
                                </button>
                                <a
                                    href={`https://wa.me/50760000000?text=Hola, quiero ordenar el producto: ${product.title} (Precio: $${product.price}) que vi en su sitio web.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all font-black uppercase py-4 text-lg tracking-widest flex items-center justify-center gap-3 -skew-x-[5deg] shadow-lg"
                                >
                                    <span className="skew-x-[5deg] flex items-center gap-3">
                                        <Phone className="w-5 h-5" />
                                        Ordenar por WhatsApp
                                    </span>
                                </a>
                                <div className="flex gap-3">
                                    <button className="flex-1 border-2 border-gray-200 font-bold uppercase py-3 text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        <Info className="w-4 h-4" /> Ficha Técnica
                                    </button>
                                    <button className="flex-1 border-2 border-gray-200 font-bold uppercase py-3 text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        <Share2 className="w-4 h-4" /> Compartir
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="py-16 bg-white border-t border-gray-100">
                        <div className="container mx-auto px-10 lg:px-12">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">También te podría interesar</h2>
                                    <div className="w-12 h-1 bg-[#FFD700] mt-2" />
                                </div>
                                <Link to="/irontrail/catalogo" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FFD700] transition-colors uppercase tracking-wider">
                                    Ver Todo <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                {relatedProducts.map((item, i) => (
                                    <motion.div
                                        key={item._id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="w-full sm:w-[260px] flex-shrink-0"
                                    >
                                        <Link
                                            to={`/irontrail/product/${item._id}`}
                                            className="group block bg-white border border-gray-200 hover:border-[#FFD700] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                                        >
                                            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-[#FFD700] p-1.5 rounded-full shadow-sm">
                                                        <ChevronRight className="w-3 h-3 text-black" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.category}</div>
                                                <h3 className="font-bold text-sm uppercase leading-tight mb-3 text-gray-900 line-clamp-2 min-h-[2.5em] group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                                                    <div className="font-black text-lg text-gray-900">${item.price}</div>
                                                    <span className="text-[10px] font-bold text-[#FFD700] uppercase">Ver detalle</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* MOBILE STICKY CTA */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#FFD700] p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="font-black text-lg">${product.price}</div>
                            <div className="text-xs text-gray-500 truncate">{product.title}</div>
                        </div>
                        <button
                            onClick={() => { setQuoteModalOpen(true); setQuoteSubmitted(false); }}
                            className="bg-[#FFD700] text-black font-black uppercase px-6 py-3 text-sm -skew-x-[10deg] shadow-lg"
                        >
                            <span className="skew-x-[10deg] block">COTIZAR</span>
                        </button>
                    </div>
                </div>

                {/* Spacer for mobile sticky CTA */}
                <div className="lg:hidden h-24" />

                {/* QUOTE MODAL */}
                <AnimatePresence>
                    {quoteModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                            onClick={() => setQuoteModalOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-full max-w-lg relative overflow-hidden"
                            >
                                {/* Header */}
                                <div className="bg-black text-white p-6 relative">
                                    <button
                                        onClick={() => setQuoteModalOpen(false)}
                                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    <div className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">Cotización</div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{product.title}</h3>
                                    <div className="text-xl font-bold mt-2">${product.price}</div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {!quoteSubmitted ? (
                                        <form onSubmit={(e) => { e.preventDefault(); setQuoteSubmitted(true); }} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre"
                                                        required
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        placeholder="Teléfono"
                                                        required
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    placeholder="Correo electrónico"
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                                />
                                            </div>
                                            <div>
                                                <select className="w-full px-4 py-3 bg-gray-100 font-bold text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]">
                                                    <option>Selecciona tu vehículo</option>
                                                    <option>Toyota Hilux 2020</option>
                                                    <option>Toyota 4Runner 2019</option>
                                                    <option>Nissan Frontier 2021</option>
                                                    <option>Ford Ranger 2022</option>
                                                    <option>Jeep Wrangler 2020</option>
                                                    <option>Otro</option>
                                                </select>
                                            </div>
                                            <div>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Mensaje adicional (opcional)"
                                                    className="w-full px-4 py-3 bg-gray-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-[#FFD700] text-black font-black uppercase py-4 text-lg tracking-wider flex items-center justify-center gap-3 hover:bg-[#E6C200] transition-colors -skew-x-[5deg]"
                                            >
                                                <span className="skew-x-[5deg] flex items-center gap-2">
                                                    <Send className="w-5 h-5" />
                                                    Enviar Solicitud
                                                </span>
                                            </button>
                                        </form>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Check className="w-10 h-10 text-green-600" />
                                            </div>
                                            <h4 className="text-2xl font-black uppercase italic mb-2">¡Solicitud Enviada!</h4>
                                            <p className="text-gray-600 mb-6">Nos pondremos en contacto contigo en menos de 24 horas.</p>
                                            <button
                                                onClick={() => setQuoteModalOpen(false)}
                                                className="bg-black text-white font-bold uppercase px-8 py-3 hover:bg-gray-800 transition-colors"
                                            >
                                                Cerrar
                                            </button>
                                            </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </IronLayout>
    );
};

export default ProductDetailPage;

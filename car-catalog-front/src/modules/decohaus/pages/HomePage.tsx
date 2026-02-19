import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DecoLayout } from '../layout/DecoLayout';
import DecoCard from '../components/DecoCard';
import { furnitureService, FurnitureProduct } from '../services/furnitureService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faTools, faTruckFast, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const ROOMS = [
    { label: 'Sala', icon: '🛋️', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
    { label: 'Comedor', icon: '🍽️', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600' },
    { label: 'Dormitorio', icon: '🛏️', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
    { label: 'Oficina', icon: '🖥️', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600' },
];

const DecoHausHome = () => {
    const [products, setProducts] = useState<FurnitureProduct[]>([]);

    useEffect(() => {
        furnitureService.getAllProducts().then(setProducts);
    }, []);

    return (
        <DecoLayout>
            {/* HERO — Full Screen Premium Banner */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax effect (simulated) */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920"
                        alt="Escena Interior DecoHaus"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

                {/* Content */}
                <div className="container mx-auto px-8 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-px w-12 bg-[#8B6F47]" />
                                <p className="text-xs tracking-[0.5em] uppercase text-white font-medium">Estética & Funcionalidad</p>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                                Diseña tu <br />
                                <span className="italic font-light text-[#F5F0EB]/90">propio refugio</span>
                            </h1>

                            <p className="text-[#F5F0EB]/80 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                                Curaduría de mobiliario artesanal que fusiona la calidez del diseño nórdico con la sofisticación moderna. Piezas hechas para durar toda una vida.
                            </p>

                            <div className="flex flex-wrap gap-6 pt-4">
                                <Link
                                    to="/decohaus/catalogo"
                                    className="group flex items-center gap-4 bg-[#8B6F47] text-white px-10 py-5 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 rounded-full shadow-2xl"
                                >
                                    Explorar Catálogo
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.span>
                                </Link>
                                <Link
                                    to="#inspire"
                                    className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 rounded-full"
                                >
                                    Inspiración
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <p className="text-[10px] tracking-[0.4em] uppercase text-white/60 font-medium">Deslizar</p>
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
                </motion.div>
            </section>

            {/* ROOMS GRID */}
            <section className="py-20 px-8 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-xs tracking-[0.4em] uppercase text-[#8B6F47] mb-3">Por ambientes</p>
                            <h2 className="text-4xl font-black text-[#1a1a1a]">Inspírate</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {ROOMS.map((room, i) => (
                            <motion.div
                                key={room.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden aspect-[3/4] cursor-pointer rounded-2xl"
                            >
                                <img src={room.img} alt={room.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-xl font-bold text-white">{room.icon} {room.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="py-20 px-8 bg-[#F5F0EB]">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-xs tracking-[0.4em] uppercase text-[#8B6F47] mb-3">Más vendidos</p>
                            <h2 className="text-4xl font-black text-[#1a1a1a]">Favoritos</h2>
                        </div>
                        <Link to="/decohaus/catalogo" className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#8B6F47] hover:gap-4 transition-all">
                            Ver todo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.slice(0, 5).map(p => (
                            <DecoCard key={p._id} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUE PROPS — Re-diseñado con FontAwesome y estética Premium */}
            <section className="py-24 px-8 bg-white overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            {
                                icon: faLeaf,
                                title: 'Artesanía Sostenible',
                                desc: 'Madera con certificación FSC y procesos de bajo impacto ambiental.',
                                color: 'bg-emerald-50 text-emerald-700'
                            },
                            {
                                icon: faTools,
                                title: 'Montaje Intuitivo',
                                desc: 'Diseño inteligente pensado para que disfrutes tu mueble en minutos.',
                                color: 'bg-amber-50 text-amber-700'
                            },
                            {
                                icon: faTruckFast,
                                title: 'Logística de Guante Blanco',
                                desc: 'Entrega especializada directa hasta tu salón, con máximo cuidado.',
                                color: 'bg-blue-50 text-blue-700'
                            },
                            {
                                icon: faShieldAlt,
                                title: 'Calidad Asegurada',
                                desc: 'Garantía extendida de 2 años y 30 días de prueba sin compromiso.',
                                color: 'bg-purple-50 text-purple-700'
                            },
                        ].map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group relative flex flex-col items-start"
                            >
                                {/* Contenedor de Icono */}
                                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                    <FontAwesomeIcon icon={v.icon} className="text-xl" />
                                </div>

                                {/* Contenido */}
                                <h3 className="text-lg font-black text-[#1a1a1a] mb-3 tracking-tight group-hover:text-[#8B6F47] transition-colors">
                                    {v.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {v.desc}
                                </p>

                                {/* Línea decorativa inferior */}
                                <div className="mt-6 w-8 h-[2px] bg-[#8B6F47]/20 group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </DecoLayout>
    );
};

export default DecoHausHome;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JewelLayout } from '../layout/JewelLayout';
import JewelCard from '../components/JewelCard';
import { jewelService, JewelProduct } from '../services/jewelService';

const CATEGORIES = ['ANILLOS', 'COLLARES', 'PULSERAS', 'RELOJES', 'ARETES', 'SETS'];

const LuxJewelHome = () => {
    const [products, setProducts] = useState<JewelProduct[]>([]);

    useEffect(() => {
        jewelService.getAllProducts().then(setProducts);
    }, []);

    return (
        <JewelLayout>
            {/* HERO */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* High-End Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: `url('/images/luxjewel-home-hero.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a090c]/90 via-[#0a090c]/20 to-[#0a090c]" />
                <div className="absolute inset-0 bg-black/40" />

                {/* Decorative lines */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />
                <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="relative z-10 text-center px-8 max-w-5xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C9A84C]" />
                        <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C9A84C]" />
                    </div>

                    <p className="text-[12px] tracking-[0.8em] uppercase font-sans text-[#C9A84C] mb-8 font-medium">L'Excellence Éternelle</p>

                    <h1 className="text-7xl md:text-[10rem] font-bold italic text-white leading-none tracking-tighter mb-10">
                        LuxJewel
                    </h1>

                    <p className="text-gray-400 text-xl font-sans leading-relaxed max-w-2xl mx-auto mb-16 italic font-light">
                        Donde la maestría del diamante se encuentra con el alma del diseño. Creado para perdurar en el tiempo.
                    </p>

                    <Link
                        to="/luxjewel/catalogo"
                        className="group relative inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-[#C9A84C]/30 text-white px-12 py-5 text-xs tracking-[0.5em] uppercase font-sans hover:bg-[#C9A84C] hover:text-black transition-all duration-500 overflow-hidden"
                    >
                        <span className="relative z-10">Explorar Colección</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </motion.div>
            </section>

            {/* CATEGORÍAS */}
            <section className="py-20 bg-[#0a090c] px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <p className="text-[10px] tracking-[0.5em] uppercase font-sans text-[#C9A84C] mb-4">Las Colecciones</p>
                        <h2 className="text-4xl font-bold italic text-white tracking-wide">Encuentra tu Pieza</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="border border-[#C9A84C]/20 p-6 text-center hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-300 cursor-pointer group"
                            >
                                <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-gray-400 group-hover:text-[#C9A84C] transition-colors">{cat}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCTS DESTACADOS */}
            <section className="py-20 bg-[#08070d] px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <p className="text-[10px] tracking-[0.5em] uppercase font-sans text-[#C9A84C] mb-3">Selección Curada</p>
                            <h2 className="text-3xl font-bold italic text-white tracking-wide">Piezas Destacadas</h2>
                        </div>
                        <Link
                            to="/luxjewel/catalogo"
                            className="hidden md:flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-sans text-[#C9A84C] hover:gap-4 transition-all"
                        >
                            Ver Todo <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 4).map(p => (
                            <JewelCard key={p._id} {...p} image={p.image} title={p.title} price={p.price} category={p.category} material={p.material} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CRAFTSMANSHIP SECTION */}
            <section className="py-24 bg-[#0a090c] px-8">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="aspect-video bg-[#13111a] relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"
                                alt="Artesanía"
                                className="w-full h-full object-cover opacity-70"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a090c] to-transparent" />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-[10px] tracking-[0.5em] uppercase font-sans text-[#C9A84C]">Artesanía</p>
                        <h2 className="text-4xl font-bold italic text-white leading-tight">
                            Cada Detalle,<br />Una Promesa
                        </h2>
                        <p className="text-gray-400 font-sans leading-relaxed">
                            Nuestros joyeros combinan técnicas centenarias con diseño contemporáneo.
                            Desde el boceto hasta la pieza terminada, cada joya pasa por más de 40 horas de trabajo manual.
                        </p>
                        <div className="grid grid-cols-3 gap-6 pt-4">
                            {[{ n: '40+', l: 'Horas de trabajo' }, { n: '18k', l: 'Oro certificado' }, { n: '100%', l: 'Garantía vitalicia' }].map(s => (
                                <div key={s.l}>
                                    <p className="text-2xl font-bold text-[#C9A84C]">{s.n}</p>
                                    <p className="text-xs font-sans text-gray-500 mt-1">{s.l}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </JewelLayout>
    );
};

export default LuxJewelHome;

import { motion } from 'framer-motion';
import { Sparkles, History, Globe, ShieldCheck } from 'lucide-react';
import { JewelLayout } from '../layout/JewelLayout';

const MaisonPage = () => {
    return (
        <JewelLayout>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/images/luxjewel-maison-hero.png')` }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a090c] via-transparent to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="relative z-10 text-center px-8"
                >
                    <p className="text-[10px] tracking-[0.6em] uppercase text-[#C9A84C] mb-6">Herencia & Prestigio</p>
                    <h1 className="text-6xl md:text-8xl font-bold italic text-white tracking-widest mb-6">La Maison</h1>
                    <div className="h-px w-24 bg-[#C9A84C] mx-auto opacity-50" />
                </motion.div>
            </section>

            {/* Historia / Legado */}
            <section className="py-24 bg-[#0a090c] px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C9A84C]/30 rounded-full">
                                <History className="w-3 h-3 text-[#C9A84C]" />
                                <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]">Desde 1924</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold italic text-white leading-tight"> Un Siglo de <br /> Brillantez Eterna</h2>
                            <p className="text-gray-400 font-sans leading-relaxed text-lg">
                                Fundada en el corazón de París, LuxJewel nació con una visión clara: elevar el arte de la joyería a una forma de expresión atemporal. Lo que comenzó como un pequeño taller familiar se ha convertido en una casa de renombre internacional.
                            </p>
                            <p className="text-gray-500 font-sans leading-relaxed">
                                Cada década de nuestra historia ha sido marcada por piezas icónicas que han adornado a la realeza y a visionarios del arte, manteniendo siempre la técnica artesanal como nuestro norte inamovible.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/5] bg-[#1a1a1a] rounded-sm overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=1000"
                                className="w-full h-full object-cover opacity-80"
                                alt="Historia LuxJewel"
                            />
                            <div className="absolute inset-0 border-[20px] border-[#C9A84C]/5 pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="py-24 bg-[#08070d] border-y border-[#C9A84C]/10 px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-16 text-center">
                        <div className="space-y-6">
                            <Sparkles className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                            <h3 className="text-xl font-bold italic text-white tracking-widest">Excelencia</h3>
                            <p className="text-gray-500 text-sm font-sans leading-relaxed">Solo los diamantes más puros y los metales más nobles encuentran su lugar en nuestras creaciones.</p>
                        </div>
                        <div className="space-y-6">
                            <Globe className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                            <h3 className="text-xl font-bold italic text-white tracking-widest">Sustentabilidad</h3>
                            <p className="text-gray-500 text-sm font-sans leading-relaxed">Comprometidos con la ética minera y el respeto al medio ambiente en cada paso de nuestro proceso.</p>
                        </div>
                        <div className="space-y-6">
                            <ShieldCheck className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                            <h3 className="text-xl font-bold italic text-white tracking-widest">Confianza</h3>
                            <p className="text-gray-500 text-sm font-sans leading-relaxed">Garantía vitalicia y certificados gemológicos internacionales para cada una de nuestras piezas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cita Final */}
            <section className="py-32 bg-[#0a090c] text-center px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="text-[#C9A84C] text-5xl font-serif">"</span>
                    <h2 className="text-3xl md:text-4xl font-light italic text-white leading-relaxed mb-8">
                        La joyería no es solo adorno, es el reflejo de una historia que nunca deja de brillar.
                    </h2>
                    <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C]">Maire de l'Atelier LuxJewel</p>
                </motion.div>
            </section>
        </JewelLayout>
    );
};

export default MaisonPage;

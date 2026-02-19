import { motion } from 'framer-motion';
import { PenTool, Gem, Diamond, Award, ArrowRight } from 'lucide-react';
import { JewelLayout } from '../layout/JewelLayout';

const AtelierPage = () => {
    return (
        <JewelLayout>
            {/* Split Hero */}
            <section className="relative h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-[#0a090c]">
                <div className="flex flex-col justify-center px-8 lg:px-24 py-20 order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] mb-6">Savoir-Faire</p>
                        <h1 className="text-5xl md:text-7xl font-bold italic text-white leading-tight mb-8">
                            El Corazón de <br /> la Creación
                        </h1>
                        <p className="text-gray-400 font-sans leading-relaxed text-lg max-w-lg mb-10">
                            En nuestro Atelier, el tiempo se detiene. Aquí es donde los sueños se tallan en metal precioso y las gemas encuentran su destino final en manos de nuestros maestros joyeros.
                        </p>
                        <button className="flex items-center gap-4 text-[#C9A84C] text-[10px] tracking-[0.4em] uppercase font-bold hover:gap-6 transition-all group">
                            Descubra el Proceso <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
                <div className="relative order-1 lg:order-2 h-full min-h-[400px]">
                    <img
                        src="/images/luxjewel-atelier-hero.png"
                        className="w-full h-full object-cover opacity-60"
                        alt="Atelier LuxJewel"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a090c] to-transparent lg:hidden" />
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a090c] to-transparent hidden lg:block" />
                </div>
            </section>

            {/* Pasos del Proceso */}
            <section className="py-32 bg-[#0a090c] px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: PenTool,
                                title: "El Boceto Maestro",
                                desc: "Cada pieza comienza con un dibujo a mano alzada, capturando la esencia y el flujo de los diamantes antes de su creación."
                            },
                            {
                                icon: Gem,
                                title: "Selección de Piedras",
                                desc: "Nuestros gemólogos viajan por el mundo para seleccionar solo gemas con claridad y color excepcionales."
                            },
                            {
                                icon: Award,
                                title: "Talla y Engaste",
                                desc: "Técnicas milenarias de engaste invisible y pavé microscópico aseguran que el brillo sea absoluto desde cada ángulo."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="p-10 border border-[#C9A84C]/10 bg-[#0d0c11] hover:border-[#C9A84C]/30 transition-all text-center"
                            >
                                <item.icon className="w-10 h-10 text-[#C9A84C] mx-auto mb-8" />
                                <h3 className="text-xl font-bold italic text-white mb-6 tracking-widest">{item.title}</h3>
                                <p className="text-gray-500 text-sm font-sans leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Banner CTA */}
            <section className="py-24 bg-[#08070d] relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 blur-[100px] pointer-events-none">
                    <Diamond className="w-[500px] h-[500px] text-[#C9A84C]" />
                </div>

                <div className="container mx-auto px-8 relative z-10 text-center">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] mb-8">Piezas a Medida</p>
                    <h2 className="text-4xl md:text-6xl font-bold italic text-white mb-12 max-w-4xl mx-auto leading-tight">
                        Transforme una Promesa en una <br /> Realidad Inmortal
                    </h2>
                    <p className="text-gray-400 font-sans text-lg max-w-2xl mx-auto mb-16">
                        Ofrecemos un servicio de diseño exclusivo para clientes que desean crear algo único en el mundo. Desde la elección de la piedra bruta hasta el pulido final.
                    </p>
                    <div className="flex justify-center">
                        <button className="border border-[#C9A84C] text-[#C9A84C] px-12 py-5 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#C9A84C] hover:text-black transition-all">
                            Agendar Consultoría Privada
                        </button>
                    </div>
                </div>
            </section>
        </JewelLayout>
    );
};

export default AtelierPage;

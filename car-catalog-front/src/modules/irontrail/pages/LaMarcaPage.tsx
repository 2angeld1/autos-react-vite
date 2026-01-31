import { motion } from 'framer-motion';
import { Shield, Target, Award, Zap, Users, Globe } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';

const LaMarcaPage = () => {
    return (
        <IronLayout>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] bg-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#FFD700] text-6xl md:text-8xl font-black">///</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight mt-4">
                            IRON<span className="text-gray-400">TRAIL</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-2xl mx-auto font-light">
                            Dominando cada terreno desde 2010
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="bg-white py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-gray-900 mb-6">
                                Nuestra <span className="text-[#FFD700]">Historia</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                IronTrail nació de la pasión por el off-road y la frustración con productos genéricos 
                                que no resistían el terreno panameño. Fundada por entusiastas del 4x4, nuestra misión 
                                es simple: ofrecer componentes que realmente funcionen cuando más los necesitas.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Cada producto que ofrecemos ha sido probado en las condiciones más extremas: 
                                desde los lodos de Darién hasta las montañas de Chiriquí. Si no pasa nuestras 
                                pruebas, no lleva nuestro nombre.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-[#FFD700] to-orange-500 rounded-3xl p-1">
                                <img 
                                    src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
                                    alt="4x4 en acción"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-black text-white p-6 rounded-2xl shadow-xl">
                                <span className="text-4xl font-black text-[#FFD700]">14+</span>
                                <p className="text-sm text-gray-400 mt-1">Años de experiencia</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-900 py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black uppercase italic text-white text-center mb-16"
                    >
                        Nuestros <span className="text-[#FFD700]">Valores</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: 'Calidad Sin Compromiso', desc: 'Utilizamos solo materiales de grado automotriz premium.' },
                            { icon: Target, title: 'Precisión', desc: 'Cada componente diseñado para ajuste perfecto.' },
                            { icon: Award, title: 'Garantía Real', desc: 'Respaldamos cada producto con garantía completa.' },
                            { icon: Zap, title: 'Rendimiento', desc: 'Probado en las condiciones más extremas.' },
                            { icon: Users, title: 'Comunidad', desc: 'Parte de la familia off-road panameña.' },
                            { icon: Globe, title: 'Disponibilidad', desc: 'Red de distribuidores en todo el país.' },
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800 p-8 rounded-2xl hover:bg-gray-750 transition-colors group"
                            >
                                <div className="w-14 h-14 bg-[#FFD700] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-gray-400">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#FFD700] py-16 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic text-black mb-6">
                        ¿Listo para equipar tu 4x4?
                    </h2>
                    <p className="text-black/70 text-lg mb-8">
                        Explora nuestro catálogo completo y encuentra las piezas que tu vehículo necesita.
                    </p>
                    <a 
                        href="/irontrail/catalogo"
                        className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
                    >
                        Ver Catálogo
                    </a>
                </div>
            </section>
        </IronLayout>
    );
};

export default LaMarcaPage;

import { motion } from 'framer-motion';
import { Gauge, Thermometer, Weight, Shield, Cog, Zap } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';

const TecnologiaPage = () => {
    const technologies = [
        {
            id: 'nitro-gas',
            title: 'Tecnología Nitro Gas',
            subtitle: 'Rendimiento Superior',
            description: 'Nuestros amortiguadores Nitro Gas utilizan nitrógeno presurizado para eliminar la formación de espuma en el aceite, garantizando un rendimiento consistente incluso en las condiciones más extremas.',
            features: [
                'Presión de nitrógeno: 150-200 PSI',
                'Aceite sintético de alta viscosidad',
                'Sello de pistón de doble labio',
                'Carcasa de acero endurecido'
            ],
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            icon: Gauge,
            color: 'from-amber-500 to-orange-600'
        },
        {
            id: 'foam-cell',
            title: 'Foam Cell Pro',
            subtitle: 'Máximo Control',
            description: 'La tecnología Foam Cell utiliza una celda de espuma interna que separa el gas del aceite, proporcionando una respuesta más rápida y precisa en todo tipo de terreno.',
            features: [
                'Celda de espuma de alta densidad',
                'Respuesta 40% más rápida',
                'Menor temperatura de operación',
                'Mayor vida útil'
            ],
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            icon: Thermometer,
            color: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'heavy-duty',
            title: 'Heavy Duty Springs',
            subtitle: 'Capacidad de Carga',
            description: 'Resortes de alta resistencia diseñados para vehículos con accesorios pesados (winches, parachoques, etc.) sin sacrificar el confort de manejo.',
            features: [
                'Acero de alta resistencia SAE 5160',
                'Tratamiento térmico especializado',
                'Aumento de carga: +200-500 lbs',
                'Altura ajustada para levantamiento'
            ],
            image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
            icon: Weight,
            color: 'from-green-500 to-emerald-600'
        }
    ];

    const specs = [
        { icon: Shield, label: 'Garantía', value: '3 Años' },
        { icon: Cog, label: 'Compatibilidad', value: '50+ Modelos' },
        { icon: Zap, label: 'Respuesta', value: '< 0.5s' },
        { icon: Gauge, label: 'Presión Max', value: '250 PSI' },
    ];

    return (
        <IronLayout>
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[450px] bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                    <img 
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
                        alt="Tecnología IronTrail"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="relative z-20 h-full flex items-center px-6">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[#FFD700] font-bold uppercase tracking-widest text-sm">Ingeniería Avanzada</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight mt-4">
                                Tecnología
                            </h1>
                            <p className="text-xl text-gray-400 mt-6 max-w-xl">
                                Descubre la ingeniería detrás de cada componente IronTrail. 
                                Diseñados para rendir donde otros fallan.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-[#FFD700] py-8">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {specs.map((spec, index) => (
                            <motion.div
                                key={spec.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <spec.icon className="w-8 h-8 text-black" />
                                <div>
                                    <p className="text-2xl font-black text-black">{spec.value}</p>
                                    <p className="text-sm text-black/70 font-medium">{spec.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies Detail */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="space-y-24">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={tech.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} text-white text-sm font-bold mb-4`}>
                                        <tech.icon className="w-4 h-4" />
                                        {tech.subtitle}
                                    </div>
                                    <h2 className="text-4xl font-black uppercase italic text-gray-900 mb-6">
                                        {tech.title}
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        {tech.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {tech.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                                                <span className="text-gray-700 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                    <div className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform`} />
                                        <img 
                                            src={tech.image}
                                            alt={tech.title}
                                            className="relative rounded-3xl w-full aspect-[4/3] object-cover shadow-xl"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-6">
                            ¿Listo para el <span className="text-[#FFD700]">Upgrade</span>?
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                            Encuentra los componentes perfectos para tu vehículo. Nuestros expertos 
                            pueden ayudarte a elegir la configuración ideal.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/irontrail/catalogo"
                                className="bg-[#FFD700] text-black px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors"
                            >
                                Ver Catálogo
                            </a>
                            <a 
                                href="/irontrail/distribuidores"
                                className="border-2 border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                            >
                                Contactar Distribuidor
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </IronLayout>
    );
};

export default TecnologiaPage;

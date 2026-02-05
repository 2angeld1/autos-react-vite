import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';
import { staggerContainer, slideUp, slideInRight } from '../animations/variants';
import specsTruckImg from '../assets/specs_truck.png';
import { ironService, IronProduct } from '../services/ironService';

// Modular Components
import HeroBanner, { ButtonPrimary } from '../components/HeroBanner';
import VehicleSelector from '../components/VehicleSelector';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import LegacySection from '../components/LegacySection';
import FeaturedExpedition from '../components/FeaturedExpedition';
import DealerSection from '../components/DealerSection';

const IronTrailHome = () => {
    const [products, setProducts] = useState<IronProduct[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await ironService.getAllProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);
    return (
        <IronLayout>
            <HeroBanner />

            {/* VEHICLE SELECTOR */}
            <div className="container mx-auto px-4 relative z-20 mb-20">
                <VehicleSelector />
            </div>

            <LegacySection />
            
            <CategoryGrid />

            {/* PRODUCTS GRID */}
            <section className="py-20 bg-white">
                 <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">BEST SELLERS</h2>
                            <div className="w-24 h-2 bg-[#FFD700] mt-2 skew-x-[-20deg]" />
                        </div>
                        <a href="#" className="hidden md:flex items-center gap-2 font-bold text-gray-500 hover:text-[#FFD700] transition-colors uppercase tracking-wider text-sm">
                            Ver Todo <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {products.slice(0, 3).map((product) => (
                            <ProductCard 
                                key={product._id}
                                image={product.image}
                                title={product.title}
                                category={product.category}
                                price={product.price}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            <FeaturedExpedition />

            <DealerSection />

             {/* TECH SPECS (Dark Section) */}
             <section className="py-24 bg-[#111] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a1a1a] skew-x-[-15deg] translate-x-32 hidden md:block" />
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
                >
                    <motion.div variants={slideUp}>
                        <h2 className="text-[#FFD700] text-sm font-bold uppercase tracking-[0.2em] mb-2">CALIDAD SUPERIOR</h2>
                        <h3 className="text-5xl font-black uppercase italic mb-6 leading-tight tracking-tighter">DISEÑADO PARA EL CALOR</h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Nuestros amortiguadores utilizan tecnología de nitrógeno gas a alta presión para evitar la cavitación en condiciones extremas.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {['Pistones de 60mm', 'Cuerpo de acero reforzado', 'Ajuste de rebote en 12 etapas'].map((item, i) => (
                                <motion.li key={i} variants={slideUp} className="flex items-center gap-3 text-lg font-bold">
                                    <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center text-black">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                        <ButtonPrimary>VER TECNOLOGÍA</ButtonPrimary>
                    </motion.div>

                    <motion.div 
                        variants={slideInRight}
                        className="relative hidden md:block"
                    >
                        <img 
                            src={specsTruckImg} 
                            alt="High-end 4x4" 
                            className="relative z-10 w-full transform scale-125 translate-x-10 mix-blend-lighten pointer-events-none"
                        />
                    </motion.div>
                </motion.div>
            </section>
        </IronLayout>
    );
};

export default IronTrailHome;

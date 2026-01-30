import { motion } from 'framer-motion';
import { IronLayout } from '../layout/IronLayout';
import { staggerContainer, slideUp } from '../animations/variants';
import ProductCard from '../components/ProductCard';
import TireTracksBackground from '../components/TireTracksBackground';
import snorkelImg from '../assets/snorkel.png';

const products = [
    { image: snorkelImg, title: 'Snorkel Safari Pro', category: 'SNORKEL', price: '189' },
    { image: snorkelImg, title: 'Parachoques Delantero', category: 'PROTECCIÓN', price: '799' },
    { image: snorkelImg, title: 'Winch 12000lbs', category: 'RESCATE', price: '599' },
    { image: snorkelImg, title: 'Barras LED 50"', category: 'ILUMINACIÓN', price: '349' },
    { image: snorkelImg, title: 'Rack de Techo', category: 'CARGA', price: '449' },
    { image: snorkelImg, title: 'Protector de Cárter', category: 'PROTECCIÓN', price: '299' },
];

const AccesoriosPage = () => {
    return (
        <IronLayout>
            {/* HERO CON TIRE TRACKS */}
            <section className="h-[60vh] flex items-center justify-center relative overflow-hidden">
                <TireTracksBackground opacity={0.4} />
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center relative z-10"
                >
                    <h1 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
                        4x4 ACCESORIOS
                    </h1>
                    <p className="text-[#FFD700] mt-4 text-xl font-bold uppercase tracking-[0.2em]">
                        Equipamiento Sin Límites
                    </p>
                </motion.div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8 lg:px-12 max-w-7xl">
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:!grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {products.map((product, i) => (
                            <motion.div key={i} variants={slideUp} className="pb-4">
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </IronLayout>
    );
};

export default AccesoriosPage;

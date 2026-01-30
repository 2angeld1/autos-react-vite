import { motion } from 'framer-motion';
import { IronLayout } from '../layout/IronLayout';
import { staggerContainer, slideUp } from '../animations/variants';
import ProductCard from '../components/ProductCard';
import TireTracksBackground from '../components/TireTracksBackground';
import suspensionImg from '../assets/suspension.png';
import springsImg from '../assets/springs.png';

const products = [
    { _id: '1', image: suspensionImg, title: 'Kit MRR Pro 2.0', category: 'SUSPENSIÓN', price: '1,299' },
    { _id: '2', image: springsImg, title: 'Resortes Heavy Duty', category: 'RESORTES', price: '249' },
    { _id: '3', image: suspensionImg, title: 'Amortiguador Nitro 3000', category: 'SUSPENSIÓN', price: '899' },
    { _id: '4', image: springsImg, title: 'Kit Lift 2"', category: 'ELEVACIÓN', price: '1,599' },
    { _id: '5', image: suspensionImg, title: 'Amortiguador Racing', category: 'SUSPENSIÓN', price: '1,099' },
    { _id: '6', image: springsImg, title: 'Resortes Reforzados', category: 'RESORTES', price: '349' },
];

const SuspensionesPage = () => {
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
                        SUSPENSIONES
                    </h1>
                    <p className="text-[#FFD700] mt-4 text-xl font-bold uppercase tracking-[0.2em]">
                        Dominando lo Imposible
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

export default SuspensionesPage;

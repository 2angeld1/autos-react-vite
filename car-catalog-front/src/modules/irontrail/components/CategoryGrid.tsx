import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '../animations/variants';

const categories = [
    { title: 'Suspensores', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800' },
    { title: 'Protección 4x4', img: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800' },
    { title: 'Accesorios', img: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800' }
];

const CategoryGrid = () => (
    <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {categories.map((cat, i) => (
                    <motion.div 
                        key={i} 
                        variants={slideUp}
                        whileHover={{ scale: 1.02 }}
                        className="relative h-96 group cursor-pointer overflow-hidden shadow-2xl"
                    >
                        <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{cat.title}</h3>
                            <div className="w-12 h-1 bg-[#FFD700] mt-2 group-hover:w-full transition-all duration-500" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default CategoryGrid;

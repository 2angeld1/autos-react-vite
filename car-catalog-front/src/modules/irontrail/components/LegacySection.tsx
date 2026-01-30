import { motion } from 'framer-motion';

const LegacySection = () => (
    <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="text-[#FFD700] font-black uppercase tracking-widest text-sm italic">Herencia Off-Road</span>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mt-4 mb-8 leading-[0.9]">EL ESTÁNDAR DE <br/>RESISTENCIA</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                    IronTrail nació en los terrenos más hostiles Australia. Cada amortiguador, resorte y accesorio es el resultado de décadas de pruebas en expediciones reales.
                </p>
                <p className="text-gray-500 text-lg leading-relaxed font-bold italic">
                    "No diseñamos para la ciudad, diseñamos para el mundo real."
                </p>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
            >
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-8 border-l-8 border-[#FFD700] z-10" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-8 border-r-8 border-[#FFD700] z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000" 
                    alt="Legacy" 
                    className="w-full h-[500px] object-cover shadow-2xl"
                />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FFD700]/10 -z-10 rounded-full blur-3xl" />
            </motion.div>
        </div>
    </section>
);

export default LegacySection;

import { motion } from 'framer-motion';
import expeditionImg from '../../../assets/expedition_v2.png';

const FeaturedExpedition = () => (
    <section className="py-0 bg-white">
        <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[600px] overflow-hidden group">
            <img 
                src={expeditionImg} 
                alt="Expedition Patagonia" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[3s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent flex items-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="bg-[#FFD700] text-black text-xs font-black px-4 py-1 uppercase italic tracking-widest inline-block mb-6">Expedición Patagonia</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic mb-6 leading-none tracking-tighter">
                                PONIENDO A <br/>PRUEBA <br/>LO IMPOSIBLE
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                                Cruzamos 3,000km de ripio y nieve en el extremo sur. Sin fallos, sin dudas. IronTrail es el compañero que necesitas cuando no hay señal de móvil.
                            </p>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-black font-black uppercase py-4 px-10 transition-all tracking-widest text-sm italic">
                                LEER LA CRÓNICA
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default FeaturedExpedition;

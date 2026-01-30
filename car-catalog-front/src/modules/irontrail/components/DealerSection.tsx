import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DealerSection = () => (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Mapa de fondo simulado con líneas */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
                <path d="M0,500 L1000,500 M500,0 L500,1000" stroke="white" strokeWidth="1" />
                <circle cx="200" cy="300" r="5" fill="#FFD700" />
                <circle cx="600" cy="150" r="5" fill="#FFD700" />
                <circle cx="800" cy="700" r="5" fill="#FFD700" />
                <circle cx="450" cy="850" r="5" fill="#FFD700" />
            </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-md">
                    <h2 className="text-[#FFD700] font-black uppercase tracking-widest text-sm mb-4 italic">Red Global</h2>
                    <h3 className="text-5xl font-black text-white uppercase italic leading-none mb-6">CERCA DE TI, <br/>LEJOS DE TODO</h3>
                    <p className="text-gray-500 text-lg mb-8">
                        Con más de 50 distribuidores oficiales certificados, siempre tendrás soporte donde quiera que tu aventura te lleve.
                    </p>
                    <div className="flex items-center gap-4 text-white hover:text-[#FFD700] cursor-pointer transition-colors group">
                        <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-[#FFD700]">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <span className="font-bold uppercase tracking-widest">Encontrar Distribuidor</span>
                    </div>
                </div>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="bg-[#111] p-10 border border-gray-800 relative"
                >
                    <div className="text-6xl font-black text-[#FFD700] mb-2 uppercase italic leading-none">52+</div>
                    <div className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Puntos de Instalación</div>
                    <div className="space-y-4">
                        {['Soporte 24/7', 'Repuestos Originales', 'Garantía Global'].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-tighter">
                                <div className="w-1.5 h-1.5 bg-[#FFD700]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

export default DealerSection;

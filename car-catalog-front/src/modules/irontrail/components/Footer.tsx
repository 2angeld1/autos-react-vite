import { motion } from 'framer-motion';

const Footer = () => (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-800 overflow-hidden">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
        >
            <div>
                <motion.div 
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    className="text-2xl font-black italic tracking-tighter mb-6 text-[#FFD700]"
                >
                    <span className="text-white text-3xl not-italic mr-1">///</span> IRONTRAIL
                </motion.div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Ingeniería de clase mundial para los terrenos más hostiles del planeta. Suspensiones diseñadas para superar cualquier límite.
                </p>
            </div>
            
            <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-400">Productos</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-500">
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Kits de Suspensión</li>
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Resortes Helicoidales</li>
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Amortiguadores MRR</li>
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Snorkels & Protección</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-400">Soporte</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-500">
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Guías de Instalación</li>
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Garantía Limitada</li>
                    <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Distribuidores Oficiales</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-400">Newsletter</h4>
                <p className="text-xs text-gray-600 mb-4">Recibe actualizaciones sobre nuevas rutas y productos.</p>
                <div className="flex border-b border-gray-700 pb-2">
                    <input type="email" placeholder="Email" className="bg-transparent text-sm w-full outline-none focus:placeholder-transparent transition-all" />
                    <button className="text-[#FFD700] text-xs font-bold uppercase tracking-tight">Unirse</button>
                </div>
            </div>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto px-6 border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-[10px] text-gray-700 uppercase tracking-[0.2em] font-bold"
        >
            <p>&copy; 2024 IronTrail Suspension Systems. All Rights Reserved.</p>
            <p className="text-gray-500">Powered by <span className="text-white hover:text-[#FFD700] transition-colors cursor-pointer text-xs">ANGEL FERNANDEZ</span></p>
        </motion.div>
    </footer>
);

export default Footer;

import { motion } from 'framer-motion';

const ButtonPrimary = ({ children, onClick, className = '' }: any) => (
  <button 
    onClick={onClick}
    className={`bg-[#FFD700] text-black font-black uppercase tracking-wider px-8 py-3 rounded-none skew-x-[-10deg] hover:bg-[#E6C200] transition-colors shadow-lg ${className}`}
  >
    <span className="inline-block skew-x-[10deg]">{children}</span>
  </button>
);

const HeroBanner = () => {
    return (
        <header className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="https://videos.pexels.com/video-files/2519660/2519660-uhd_2560_1440_24fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-[#FFD700] text-lg md:text-xl font-black uppercase tracking-[0.3em] mb-4">Ingeniería Extrema</h2>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic leading-[0.9] mb-8 drop-shadow-2xl tracking-tighter">
                        CONQUISTA <br/>CUALQUIER RUTA
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
                        IronTrail: La suspensión definitiva para 4x4. Probada en el Outback, fabricada para durar.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <ButtonPrimary>VER CATÁLOGO</ButtonPrimary>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default HeroBanner;
export { ButtonPrimary };

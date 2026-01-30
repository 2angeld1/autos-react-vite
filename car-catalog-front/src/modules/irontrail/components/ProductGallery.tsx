import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Aseguramos que siempre haya al menos una imagen
    const safeImages = images && images.length > 0 ? images : ['https://placehold.co/800x600?text=No+Image'];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    };

    return (
        <div className="w-full">
            {/* Header de Galería */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Galería del Producto</h3>
                <span className="text-gray-400 text-sm font-bold">{safeImages.length} imágenes</span>
            </div>

            {/* Imagen Principal */}
            <div className="relative group overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] shadow-lg border border-gray-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={safeImages[currentIndex]}
                        alt={`${title} - view ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsLightboxOpen(true)}
                    />
                </AnimatePresence>

                {/* Controles de Navegación (Solo si hay más de 1 imagen) */}
                {safeImages.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FFD700] shadow-md"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FFD700] shadow-md"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Indicador y Botón Expandir */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" />
                    {currentIndex + 1} / {safeImages.length}
                </div>
            </div>

            {/* Grid de Miniaturas */}
            {safeImages.length > 1 && (
                <div className="grid !grid-cols-6 md:!grid-cols-6 gap-2 mt-4">
                    {safeImages.map((img, index) => (
                        <div 
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${index === currentIndex ? 'border-[#FFD700] ring-1 ring-[#FFD700]/30 scale-95' : 'border-transparent hover:border-gray-300'}`}
                        >
                            <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button className="absolute top-6 right-6 text-white hover:text-[#FFD700] transition-colors z-50">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-full max-w-7xl max-h-[90vh] flex items-center justify-center">
                            <img 
                                src={safeImages[currentIndex]} 
                                alt="Fullscreen view" 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                            
                            {/* Navegación Lightbox */}
                            {safeImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Título en Lightbox */}
                        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                            <h3 className="text-white text-xl font-bold uppercase tracking-wider">{title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{currentIndex + 1} de {safeImages.length}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductGallery;

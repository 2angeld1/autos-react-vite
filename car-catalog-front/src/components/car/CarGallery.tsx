import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../animations/variants';
import SafeCarImage from '../common/SafeCarImage';
import type { Car } from '@/types';

interface CarGalleryProps {
    car: Car;
    imageError?: boolean;
}

const CarGallery: React.FC<CarGalleryProps> = ({ car, imageError = false }) => {
    // Combinar imagen principal + imágenes adicionales en un solo array
    const allImages = useMemo(() => {
        const images: string[] = [];
        if (car.image) {
            images.push(car.image);
        }
        if (car.images && car.images.length > 0) {
            // Evitar duplicados si la imagen principal ya está en el array
            car.images.forEach(img => {
                if (img && !images.includes(img)) {
                    images.push(img);
                }
            });
        }
        return images;
    }, [car.image, car.images]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedImage = allImages[selectedIndex] || car.image;

    const handleThumbnailClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="detail-section detail-gallery"
        >
            {/* Imagen Principal */}
            <motion.div
                className="gallery-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                style={{ position: 'relative' }}
            >
                <figure className="image is-16by9 is-clickable gallery-image-figure">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <SafeCarImage
                                car={car}
                                src={selectedImage}
                                alt={`${car.make} ${car.model} ${car.year}`}
                                className="main-gallery-image"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {imageError && (
                        <div className="image-fallback-indicator">
                            <span className="tag is-warning is-small">
                                <span className="icon"><i className="fas fa-exclamation-triangle"></i></span>
                                <span>Imagen alternativa</span>
                            </span>
                        </div>
                    )}

                    {!imageError && (
                        <div className="image-quality-badge">
                            <span className="tag is-success is-small">
                                <span className="icon"><i className="fas fa-check"></i></span>
                                <span>Original</span>
                            </span>
                        </div>
                    )}
                </figure>

                {/* Flechas de navegación (solo si hay más de 1 imagen) */}
                {allImages.length > 1 && (
                    <>
                        <button
                            className="gallery-nav-btn gallery-nav-prev"
                            onClick={handlePrev}
                            aria-label="Imagen anterior"
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                color: 'white',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            className="gallery-nav-btn gallery-nav-next"
                            onClick={handleNext}
                            aria-label="Siguiente imagen"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                color: 'white',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}
            </motion.div>

            {/* Miniaturas (solo si hay más de 1 imagen) */}
            {allImages.length > 1 && (
                <div
                    className="gallery-thumbnails mt-3"
                    style={{
                        display: 'flex',
                        gap: '10px',
                        overflowX: 'auto',
                        paddingBottom: '10px'
                    }}
                >
                    {allImages.map((img, index) => (
                        <motion.div
                            key={img + index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleThumbnailClick(index)}
                            style={{
                                flexShrink: 0,
                                width: '80px',
                                height: '60px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: selectedIndex === index
                                    ? '3px solid #3273dc'
                                    : '3px solid transparent',
                                opacity: selectedIndex === index ? 1 : 0.7,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <img
                                src={img}
                                alt={`Vista ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Contador de imágenes */}
            {allImages.length > 1 && (
                <div className="has-text-centered mt-2">
                    <span className="tag is-dark">
                        <span className="icon"><i className="fas fa-images"></i></span>
                        <span>{selectedIndex + 1} / {allImages.length}</span>
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default CarGallery;
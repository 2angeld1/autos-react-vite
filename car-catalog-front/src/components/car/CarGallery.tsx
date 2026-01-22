import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/variants';
import SafeCarImage from '../common/SafeCarImage';
import type { Car } from '@/types';

interface CarGalleryProps {
    car: Car;
    imageError?: boolean;
}

const CarGallery: React.FC<CarGalleryProps> = ({ car, imageError = false }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="detail-section detail-gallery"
        >
            <motion.div
                className="gallery-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
            >
                <figure className="image is-16by9 is-clickable gallery-image-figure">
                    <SafeCarImage
                        car={car}
                        src={car.image}
                        alt={`${car.make} ${car.model} ${car.year}`}
                        className="main-gallery-image"
                    />

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
            </motion.div>
        </motion.div>
    );
};

export default CarGallery;
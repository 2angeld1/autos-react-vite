import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';
import TravelCarCard from '../cards/TravelCarCard';
import type { Car } from '@/types';

interface CarSimilarProps {
    similarCars: Car[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
}

const CarSimilar: React.FC<CarSimilarProps> = ({ similarCars }) => {
    if (similarCars.length === 0) return null;

    return (
        <div className="detail-section mt-6">
            <h3 className="title is-4 mb-5 has-text-white">
                <span className="icon-text">
                    <span className="icon has-text-accent mr-2">
                        <i className="fas fa-layer-group"></i>
                    </span>
                    <span>También te podría interesar</span>
                </span>
            </h3>

            <motion.div
                className="columns is-multiline"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                {similarCars.map((car) => (
                    <motion.div key={car.id} className="column is-6-tablet is-6-desktop">
                        <TravelCarCard car={car} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default CarSimilar;
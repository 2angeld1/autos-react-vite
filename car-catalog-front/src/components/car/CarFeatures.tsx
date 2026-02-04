import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, slideUp } from '../../animations/variants';
import type { Car } from '@/types';

interface CarFeaturesProps {
    car: Car;
}

const CarFeatures: React.FC<CarFeaturesProps> = ({ car }) => {
    // Usar features reales del backend, o mostrar mensaje si no hay
    const features = car.features || [];
    const hasFeatures = features.length > 0;

    // Iconos para diferentes tipos de características (detectados por keyword)
    const getFeatureIcon = (feature: string): string => {
        const lowerFeature = feature.toLowerCase();
        if (lowerFeature.includes('led') || lowerFeature.includes('luz') || lowerFeature.includes('faro')) return 'fa-lightbulb';
        if (lowerFeature.includes('cuero') || lowerFeature.includes('asiento')) return 'fa-couch';
        if (lowerFeature.includes('pantalla') || lowerFeature.includes('android') || lowerFeature.includes('apple') || lowerFeature.includes('carplay')) return 'fa-tablet-alt';
        if (lowerFeature.includes('camara') || lowerFeature.includes('sensor')) return 'fa-video';
        if (lowerFeature.includes('airbag') || lowerFeature.includes('seguridad') || lowerFeature.includes('freno')) return 'fa-shield-alt';
        if (lowerFeature.includes('sunroof') || lowerFeature.includes('techo')) return 'fa-sun';
        if (lowerFeature.includes('bluetooth') || lowerFeature.includes('wifi')) return 'fa-wifi';
        if (lowerFeature.includes('clima') || lowerFeature.includes('aire')) return 'fa-snowflake';
        if (lowerFeature.includes('rin') || lowerFeature.includes('llanta')) return 'fa-circle';
        if (lowerFeature.includes('motor') || lowerFeature.includes('turbo')) return 'fa-tachometer-alt';
        return 'fa-check-circle';
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.h4 variants={slideUp} className="title is-4 mb-4 has-text-white">
                Características del Vehículo
            </motion.h4>

            {hasFeatures ? (
                <motion.div variants={fadeIn} className="features-grid">
                    <div className="columns is-multiline">
                        {features.map((feature: string, index: number) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="column is-6-tablet is-4-desktop"
                            >
                                <div className="feature-item-card">
                                    <span className="feature-icon">
                                        <i className={`fas ${getFeatureIcon(feature)}`}></i>
                                    </span>
                                    <span className="feature-text">{feature}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div variants={fadeIn} className="notification is-dark">
                    <div className="has-text-centered py-5">
                        <span className="icon is-large has-text-grey">
                            <i className="fas fa-list fa-2x"></i>
                        </span>
                        <p className="has-text-grey-light mt-3">
                            Las características de este vehículo serán agregadas próximamente.
                        </p>
                        <p className="has-text-grey is-size-7 mt-2">
                            Contáctanos para más información sobre el equipamiento.
                        </p>
                    </div>
                </motion.div>
            )}

            <style>{`
                .feature-item-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.3s ease;
                }
                
                .feature-item-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                
                .feature-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .feature-icon i {
                    color: white;
                    font-size: 0.9rem;
                }
                
                .feature-text {
                    color: #e0e0e0;
                    font-size: 0.95rem;
                    line-height: 1.3;
                }
            `}</style>
        </motion.div>
    );
};

export default CarFeatures;
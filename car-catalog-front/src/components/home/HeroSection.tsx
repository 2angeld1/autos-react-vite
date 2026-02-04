import React from 'react';
import { motion } from 'framer-motion';
import { useCarContext } from '../../context/CarContext';
import { useCarImage } from '../../hooks/useCarImage';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../animations/variants';
import DotPattern from '../layout/DotPattern';
import PromotionsBanner from './PromotionsBanner';

const HeroSection: React.FC = () => {
    const { cars } = useCarContext();

    // Usar el primer auto como destacado para el Hero
    const featuredCar = cars && cars.length > 0 ? cars[0] : null;

    const carImageHook = useCarImage({
        car: featuredCar || { id: 'fallback', make: 'Generic', model: 'Car', year: 2024 },
        fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    });

    return (
        <section className="hero is-fullheight-with-navbar luxury-dark-hero">
            <DotPattern />
            
            <div className="hero-body">
                <div className="container">
                    <motion.div
                        className="columns is-vcentered"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <div className="column is-6">
                            <motion.h1 variants={slideUp} className="title is-1 has-text-white luxury-title">
                                {featuredCar ? (
                                    <>Potencia y Elegancia:<br />{featuredCar.make} {featuredCar.model}</>
                                ) : (
                                    <>Descubre la Excelencia<br />en Cada Vehículo</>
                                )}
                            </motion.h1>
                            <motion.div variants={fadeIn} className="luxury-divider"></motion.div>
                            <motion.h2 variants={slideUp} className="subtitle has-text-white-bis is-4 mb-6 luxury-subtitle">
                                {featuredCar ? (
                                    `Disponible hoy: ${featuredCar.year} ${featuredCar.make} ${featuredCar.model} desde $${featuredCar.price?.toLocaleString()}`
                                ) : (
                                    "Catálogo premium con Toyota, Kia, Hyundai, Tesla y las mejores marcas chinas."
                                )}
                            </motion.h2>

                            <motion.div variants={slideUp} className="buttons are-medium">
                                <a href="#featured-cars" className="button is-accent luxury-button">
                                    <span className="icon">
                                        <i className="fas fa-car"></i>
                                    </span>
                                    <span>Explorar Vehículos</span>
                                </a>
                                <a href="#search" className="button is-outlined is-light luxury-button-outline">
                                    <span className="icon">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <span>Búsqueda Avanzada</span>
                                </a>
                            </motion.div>
                        </div>
                        <motion.div variants={scaleIn} className="column is-6 is-hidden-mobile">
                            <div className="luxury-car-showcase">
                                <img 
                                    src={featuredCar?.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                                    alt={featuredCar?.model || "Auto destacado"} 
                                    className="luxury-car-image"
                                    onError={carImageHook.handleImageError}
                                />
                                {featuredCar && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1, duration: 0.8 }}
                                        className="luxury-car-details"
                                    >
                                        <h3 className="title is-3 has-text-white has-text-shadow">
                                            {featuredCar.make} {featuredCar.model}
                                        </h3>
                                        <p className="has-text-grey-lighter mb-3">{featuredCar.year} - {featuredCar.class || "Premium"}</p>
                                        <a href={`/car/${featuredCar.id}`} className="button is-small is-accent is-outlined">Ver detalles</a>
                                    </motion.div>
                                )}
                                <motion.div variants={staggerContainer} className="luxury-car-specs">
                                    <motion.div variants={scaleIn} className="spec-item">
                                        <span className="spec-value">{featuredCar?.cylinders || "4"}</span>
                                        <span className="spec-label">CYL</span>
                                    </motion.div>
                                    <motion.div variants={scaleIn} className="spec-item">
                                        <span className="spec-value">{featuredCar?.transmission?.charAt(0) || "A"}</span>
                                        <span className="spec-label">TRANS</span>
                                    </motion.div>
                                    <motion.div variants={scaleIn} className="spec-item">
                                        <span className="spec-value">{featuredCar?.fuel_type?.slice(0, 3).toUpperCase() || "GAS"}</span>
                                        <span className="spec-label">FUEL</span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Promotions Banner - Ahora dentro del Hero para mantener el flujo */}
            <PromotionsBanner />
            
            {/* Características destacadas en footer */}
            <div className="hero-footer pb-2 pt-3 luxury-hero-footer">
                <div className="container">
                    <div className="columns has-text-centered is-mobile feature-row">
                        <div className="column animate-fadeIn">
                            <div className="luxury-feature-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            <p className="has-text-white-bis mt-2">Alto Rendimiento</p>
                            <div className="luxury-feature-underline"></div>
                        </div>
                        <div className="column animate-fadeIn" style={{animationDelay: "0.2s"}}>
                            <div className="luxury-feature-icon">
                                <i className="fas fa-tag"></i>
                            </div>
                            <p className="has-text-white-bis mt-2">Mejores Precios</p>
                            <div className="luxury-feature-underline"></div>
                        </div>
                        <div className="column animate-fadeIn" style={{animationDelay: "0.4s"}}>
                            <div className="luxury-feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <p className="has-text-white-bis mt-2">Seguridad Total</p>
                            <div className="luxury-feature-underline"></div>
                        </div>
                        <div className="column animate-fadeIn" style={{animationDelay: "0.6s"}}>
                            <div className="luxury-feature-icon">
                                <i className="fas fa-headset"></i>
                            </div>
                            <p className="has-text-white-bis mt-2">Soporte 24/7</p>
                            <div className="luxury-feature-underline"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

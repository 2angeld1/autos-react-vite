import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../animations/variants';
import type { Car } from '@/types';
import '../../assets/styles/CarHero.css';

interface CarHeroProps {
    car: Car;
    backgroundImageUrl: string;
    bgLoading?: boolean;
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
}

const CarHero: React.FC<CarHeroProps> = ({
    car,
    backgroundImageUrl,
    bgLoading = false,
    isFavorite,
    toggleFavorite
}) => {
    return (
        <section
            className={`car-detail-hero minimalist-hero car-detail-hero-section ${bgLoading ? 'loading' : ''}`}
            style={{ '--hero-bg-image': `url("${backgroundImageUrl}")` } as React.CSSProperties}
        >
            <div className="container pt-6 pb-6">
                {/* Breadcrumb */}
                <motion.nav variants={fadeIn} className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                    <ul>
                        <li>
                            <Link to="/" className="has-text-white-bis">
                                <span className="icon"><i className="fas fa-home"></i></span>
                                <span>Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="has-text-white-bis">
                                <span className="icon"><i className="fas fa-car"></i></span>
                                <span>Catálogo</span>
                            </Link>
                        </li>
                        <li className="is-active">
                            <a href="#" className="has-text-accent">{car.make} {car.model}</a>
                        </li>
                    </ul>
                </motion.nav>

                <motion.div variants={staggerContainer} className="columns is-vcentered mt-5">
                    {/* Left Column - Car Info */}
                    <div className="column is-7">
                        <motion.h1 variants={slideUp} className="title is-1 has-text-white">{car.make} {car.model}</motion.h1>
                        <motion.h2 variants={slideUp} className="subtitle is-3 has-text-accent">{car.year}</motion.h2>

                        {/* Highlights */}
                        <motion.div variants={staggerContainer} className="car-highlights horizontal mt-5 mb-5">
                            <motion.div variants={scaleIn} className="highlight-item">
                                <span className="icon has-text-accent"><i className="fas fa-gas-pump"></i></span>
                                <div>
                                    <p className="has-text-grey">Combustible</p>
                                    <p className="has-text-white has-text-weight-bold">{car.fuel_type}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={scaleIn} className="highlight-item">
                                <span className="icon has-text-accent"><i className="fas fa-cog"></i></span>
                                <div>
                                    <p className="has-text-grey">Transmisión</p>
                                    <p className="has-text-white has-text-weight-bold">
                                        {car.transmission === 'a' ? 'Automática' : 'Manual'}
                                    </p>
                                </div>
                            </motion.div>
                            
                            {car.cylinders && (
                                <motion.div variants={scaleIn} className="highlight-item">
                                    <span className="icon has-text-accent"><i className="fas fa-compress-arrows-alt"></i></span>
                                    <div>
                                        <p className="has-text-grey">Cilindros</p>
                                        <p className="has-text-white has-text-weight-bold">{car.cylinders}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div variants={slideUp} className="buttons are-medium">
                            <button
                                className={`button ${isFavorite(car.id) ? 'is-danger' : 'is-outlined is-light'}`}
                                onClick={() => toggleFavorite(car.id)}
                            >
                                <span className="icon"><i className="fas fa-heart"></i></span>
                                <span>{isFavorite(car.id) ? 'En Favoritos' : 'Añadir a Favoritos'}</span>
                            </button>

                            <button className="button is-outlined is-light">
                                <span className="icon"><i className="fas fa-share-alt"></i></span>
                                <span>Compartir</span>
                            </button>

                            <a href="#contact" className="button is-accent">
                                <span className="icon"><i className="fas fa-phone"></i></span>
                                <span>Contactar</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Column - Price Card */}
                    <motion.div variants={scaleIn} className="column is-5">
                        <div className="price-card glowing-border">
                            <div className="price-card-content has-text-centered">
                                <p className="is-size-4 has-text-white has-text-weight-light">Precio de Lista</p>
                                <p className="is-size-1 has-text-accent has-text-weight-bold mb-3">
                                    ${car.price?.toLocaleString() || 'Consultar'}
                                </p>
                                <p className="has-text-white-bis mb-4">Financiamiento Disponible</p>

                                {car.price && (
                                    <div className="financing-preview mb-4">
                                        <p className="is-size-7 has-text-grey is-uppercase mb-3 financing-label">Financiamiento estimado</p>
                                        <div className="is-flex is-justify-content-space-between is-align-items-flex-end pb-2 financing-row">
                                            <span className="has-text-grey-light is-size-7">Enganche (20%)</span>
                                            <span className="has-text-white has-text-weight-medium">${(car.price * 0.20).toLocaleString()}</span>
                                        </div>
                                        <div className="is-flex is-justify-content-space-between is-align-items-flex-end pt-2">
                                            <span className="has-text-grey-light is-size-7">48 Mensualidades</span>
                                            <span className="has-text-primary has-text-weight-bold is-size-5 monthly-payment">${Math.round(car.price * 0.80 / 48).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="buttons is-centered is-block">
                                    <a href="#contact" className="button is-accent is-fullwidth mb-3">
                                        <span className="icon"><i className="fas fa-envelope"></i></span>
                                        <span>Solicitar Información</span>
                                    </a>
                                    <a href="#financing" className="button is-outlined is-light is-fullwidth is-small btn-outline-custom">
                                        <span className="icon"><i className="fas fa-calculator"></i></span>
                                        <span>Calcular mensualidad</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CarHero;
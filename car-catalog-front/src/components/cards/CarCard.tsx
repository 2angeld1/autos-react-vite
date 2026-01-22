import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCarContext } from '../../context/CarContext';
import ErrorBoundaryImage from '../common/ErrorBoundaryImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { Car } from '@/types';
import { cardHover } from '../../animations/variants';

interface CarCardProps {
    car: Car;
}

interface BrandColors {
    [key: string]: string;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
    const [imgError, setImgError] = useState<boolean>(false);
    const { toggleFavorite, isFavorite } = useCarContext();
    const isCarFavorite: boolean = isFavorite(car.id.toString());

    const getBrandColor = (make: string | undefined): string => {
        const brandColors: BrandColors = {
            toyota: '#e50000',
            kia: '#0033a0',
            nissan: '#c3002f',
            ford: '#003478',
            chevrolet: '#d1a856',
            bmw: '#0066b1',
            audi: '#bb0a30',
            mercedes: '#00adef'
        };

        return brandColors[make?.toLowerCase() || ''] || '#6b7280';
    };

    const handleImageError = (): void => {
        setImgError(true);
    };

    return (
        <motion.div
            className="column is-12-mobile is-6-tablet is-4-desktop car-card-container"
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            layout
        >
            <motion.div className="card car-card modern-car-card">
                <div className="card-image">
                    {imgError ? (
                        <div
                            className="image is-4by3 card-fallback-image has-size-4"
                            style={{ backgroundColor: getBrandColor(car.make) }}
                        >
                            <span>{car.make} {car.model}</span>
                        </div>
                    ) : (
                        <figure className="image is-4by3">
                            <ErrorBoundaryImage
                                src={car.image}
                                alt={`${car.make} ${car.model} ${car.year}`}
                                fallbackSrc={`https://placehold.co/800x450/1a1a1a/ffffff?text=${car.make}+${car.model}`}
                                className="card-img-top"
                                onError={handleImageError}
                            />
                            <span
                                className="car-brand-badge"
                                style={{ backgroundColor: getBrandColor(car.make), color: 'white' }}
                            >
                                {car.make}
                            </span>
                        </figure>
                    )}
                </div>
                <div className="card-content modern-card-content">
                    <div className="media mb-4">
                        <div className="media-content modern-media-content">
                            <p className="title is-4 text-white mb-1">{car.make} <br /> {car.model}</p>
                            <p className="subtitle is-6 text-gray-400">{car.year}</p>
                        </div>
                        <div className="media-right">
                            <button
                                className={`button is-rounded ${isCarFavorite ? 'is-danger' : 'bg-gray-700 text-white border-transparent hover:bg-gray-600'}`}
                                onClick={() => toggleFavorite(car.id.toString())}
                                aria-label={isCarFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faHeart} />
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="content">
                        <p className="has-text-weight-bold is-size-4 text-purple-400 mb-3">
                            ${car.price?.toLocaleString()}
                        </p>
                        <div className="tags mb-3">
                            <span className="tag bg-blue-600 text-white border-transparent">{car.fuel_type}</span>
                            <span className="tag bg-green-600 text-white border-transparent">{car.cylinders} cilindros</span>
                            <span className="tag bg-yellow-600 text-black border-transparent">{car.transmission}</span>
                        </div>
                        {car.displacement && (
                            <p className="text-gray-400 is-size-7 mb-3">
                                Motor: {car.displacement}L • {car.cylinders} cilindros
                            </p>
                        )}
                    </div>
                </div>
                <footer className="card-footer modern-card-footer">
                    <Link
                        to={`/car/${car.id}`}
                        className="button is-fullwidth detail-link-btn transition-all"
                    >
                        <span className="icon">
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </span>
                        <span>Ver detalles</span>
                    </Link>
                </footer>
            </motion.div>
        </motion.div>
    );
};

export default CarCard;
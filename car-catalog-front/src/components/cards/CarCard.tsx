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
            className="is-6-tablet"
            style={{ display: 'flex' }}
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            layout
        >
            <motion.div className="card car-card bg-gray-800 border-gray-700 text-white" style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-image">
                    {imgError ? (
                        <div
                            className="image is-4by3 has-text-centered is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-bold"
                            style={{ backgroundColor: getBrandColor(car.make) }}
                        >
                            <span className="is-size-4">{car.make} {car.model}</span>
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
                <div className="card-content" style={{ flexGrow: 1, backgroundColor: 'transparent' }}>
                    <div className="media mb-4">
                        <div className="media-content" style={{ minHeight: '4.5rem' }}>
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
                <footer className="card-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem', backgroundColor: 'transparent' }}>
                    <Link
                        to={`/car/${car.id}`}
                        className="button is-fullwidth bg-purple-600 hover:bg-purple-700 text-white border-transparent font-bold transition-all"
                        style={{
                            borderRadius: '8px'
                        }}
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
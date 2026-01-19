import React from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { useCarImage } from '../hooks/useCarImage';
import type { Car } from '@/types';

interface TravelCarCardProps {
    car: Car;
}

const TravelCarCard: React.FC<TravelCarCardProps> = ({ car }) => {
    const { toggleFavorite, isFavorite } = useCarContext();
    const isCarFavorite = isFavorite(car.id.toString());
    
    const carImageHook = useCarImage({ 
        car,
        fallbackImage: car.image
    });

    return (
        <div className="travel-card">
            {/* Imagen de fondo */}
            <div className="travel-card-image-wrapper">
                <img 
                    src={carImageHook.imageSrc}
                    alt={`${car.make} ${car.model}`}
                    className="travel-card-image"
                    onError={carImageHook.handleImageError}
                    loading="lazy"
                />
                <div className="travel-card-overlay"></div>
            </div>

            {/* Botón favorito */}
            <div className="travel-card-top">
                <button 
                    className={`travel-favorite-btn ${isCarFavorite ? 'is-active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(car.id.toString());
                    }}
                    aria-label={isCarFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    <i className={`${isCarFavorite ? 'fas' : 'far'} fa-heart`}></i>
                </button>
            </div>

            {/* Contenido */}
            <div className="travel-card-content">
                <span className="travel-card-subtitle">{car.year} • {car.make}</span>
                <h3 className="travel-card-title">{car.model}</h3>
                <div className="travel-card-meta">
                    <span className="travel-price">
                        ${car.price?.toLocaleString() || 'Consultar'}
                    </span>
                    <span className="travel-reviews">
                        {car.transmission === 'a' ? 'Automático' : 'Manual'}
                    </span>
                </div>
            </div>

            {/* Barra de acción inferior */}
            <Link to={`/car/${car.id}`} className="travel-card-bottom-action">
                <span className="action-text">Ver más</span>
                <div className="action-icon-circle">
                    <i className="fas fa-chevron-right"></i>
                </div>
            </Link>
        </div>
    );
};

export default TravelCarCard;

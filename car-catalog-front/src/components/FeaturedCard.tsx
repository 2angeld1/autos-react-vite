
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Definición de la interfaz para el objeto car
interface Car {
    id: string | number;
    make: string;
    model: string;
    image: string;
    year: number | string;
    transmission: string;
    fuel_type: string;
    price: number;
    class?: string;
}

// Definición de las props del componente
interface FeaturedCarProps {
    car: Car;
}

const FeaturedCar: React.FC<FeaturedCarProps> = ({ car }) => {
    const [imgError, setImgError] = useState<boolean>(false);

    // Verificar si es Honda Insight para evitar mostrarlo
    if (car.make?.toLowerCase() === 'honda' && car.model?.toLowerCase() === 'insight') {
        return null;
    }

    const getBrandColor = (make: string | undefined): string => {
        const brandColors: { [key: string]: string } = {
            toyota: '#e50000',
            kia: '#0033a0',
            nissan: '#c3002f',
            ford: '#003478',
            chevrolet: '#d1a856',
            bmw: '#0066b1',
            audi: '#bb0a30',
            mercedes: '#00adef',
            honda: '#cc0000'
        };
        
        return brandColors[make?.toLowerCase() || ''] || '#6b7280';
    };

    const handleImageError = (): void => {
        setImgError(true);
    };

    return (
        <div className="card has-background-dark-surface animated-card">
            {/* Cabecera de la tarjeta con imagen */}
            <div className="card-image">
                {imgError ? (
                    <div 
                        className="image is-16by9 has-text-centered is-flex is-justify-content-center is-align-items-center"
                        style={{ 
                            backgroundColor: getBrandColor(car.make), 
                            borderRadius: '8px 8px 0 0'
                        }}
                    >
                        <div>
                            <span className="icon is-large mb-2">
                                <i className="fas fa-car fa-2x"></i>
                            </span>
                            <h3 className="is-size-4 has-text-white">{car.make}</h3>
                            <p className="is-size-5 has-text-white-ter">{car.model}</p>
                        </div>
                    </div>
                ) : (
                    <figure className="image is-16by9">
                        <img 
                            src={car.image} 
                            alt={`${car.make} ${car.model}`}
                            style={{ borderRadius: '8px 8px 0 0', objectFit: 'cover' }} 
                            onError={handleImageError}
                        />
                    </figure>
                )}
                
                {/* Etiqueta de año sobrepuesta en la imagen */}
                <div className="car-year-badge">
                    <span>{car.year}</span>
                </div>
            </div>
            
            {/* Contenido de la tarjeta */}
            <div className="card-content">
                <div className="media mb-3">
                    <div className="media-content">
                        <h3 className="title is-5 has-text-white mb-1">{car.make} {car.model}</h3>
                        <h4 className="subtitle is-6 has-text-grey-light">
                            {car.transmission === 'a' ? 'Automático' : 'Manual'} • {car.fuel_type}
                        </h4>
                    </div>
                    <div className="media-right">
                        <p className="has-text-warning has-text-weight-bold is-size-5">
                            ${car.price?.toLocaleString()}
                        </p>
                    </div>
                </div>
                
                {/* Características principales sin rendimiento */}
                <div className="car-features mb-4">
                    <div className="columns is-mobile is-multiline">
                        <div className="column is-6">
                            <div className="feature-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-gas-pump"></i>
                                </span>
                                <span className="has-text-grey-lighter">{car.fuel_type}</span>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="feature-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-cog"></i>
                                </span>
                                <span className="has-text-grey-lighter">
                                    {car.transmission === 'a' ? 'Automático' : 'Manual'}
                                </span>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="feature-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                                <span className="has-text-grey-lighter">{car.year}</span>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="feature-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-car-side"></i>
                                </span>
                                <span className="has-text-grey-lighter">{car.class || 'Estándar'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Botón de acción */}
                <Link to={`/car/${car.id}`} className="button is-accent is-outlined is-fullwidth">
                    <span>Ver detalles</span>
                    <span className="icon">
                        <i className="fas fa-arrow-right"></i>
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default FeaturedCar;
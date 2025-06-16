import React from 'react';
import { Link } from 'react-router-dom';

interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    class: string;
    fuel_type: string;
    transmission: string;
    price: number;
    image: string;
}

interface CarHeroProps {
    car: Car;
    isFavorite: (id: number) => boolean;
    toggleFavorite: (id: number) => void;
}

const CarHero: React.FC<CarHeroProps> = ({ car, isFavorite, toggleFavorite }) => {
    const getBrandColor = (make: string): string => {
        const brandColors: Record<string, string> = {
            toyota: '#e50000',
            kia: '#0033a0',
            nissan: '#c3002f',
            ford: '#003478',
            chevrolet: '#d1a856',
            bmw: '#0066b1',
            audi: '#bb0a30',
            mercedes: '#00adef'
        };

        return brandColors[make.toLowerCase()] || '#6b7280';
    };

    return (
        <section className="hero is-medium" style={{ 
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${car.image}) no-repeat center center`, 
            backgroundSize: 'cover'
        }}>
            <div className="hero-body">
                <div className="container">
                    <nav className="custom-breadcrumb mb-6" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to="/"><i className="fas fa-home"></i> Inicio</Link></li>
                            <li><Link to="/">Catálogo</Link></li>
                            <li className="is-active"><a href="#" aria-current="page">{car.make} {car.model}</a></li>
                        </ul>
                    </nav>
                
                    <div className="columns is-vcentered">
                        <div className="column is-8">
                            <h1 className="title is-1 has-text-white">{car.make} {car.model}</h1>
                            <h2 className="subtitle is-3 has-text-white-bis mb-5">{car.year}</h2>
                            
                            <div className="tags are-medium mb-5">
                                <span className="tag is-warning">{car.class}</span>
                                <span 
                                    className="tag" 
                                    style={{ backgroundColor: getBrandColor(car.make), color: 'white' }}
                                >
                                    {car.make}
                                </span>
                                <span className="tag is-info">{car.fuel_type}</span>
                                <span className="tag is-success">{car.transmission}</span>
                            </div>
                            
                            <div className="buttons are-medium">
                                <button 
                                    className={`button ${isFavorite(car.id) ? 'is-danger' : 'is-outlined is-light'}`}
                                    onClick={() => toggleFavorite(car.id)}
                                >
                                    <span className="icon">
                                        <i className={`fas fa-heart`}></i>
                                    </span>
                                    <span>{isFavorite(car.id) ? 'En favoritos' : 'Agregar a favoritos'}</span>
                                </button>
                                
                                <button className="button is-light">
                                    <span className="icon">
                                        <i className="fas fa-share-alt"></i>
                                    </span>
                                    <span>Compartir</span>
                                </button>
                            </div>
                        </div>
                        <div className="column is-4">
                            <div className="price-card">
                                <div className="price-card-content has-text-centered">
                                    <p className="is-size-3 has-text-white has-text-weight-light mb-2">Precio</p>
                                    <p className="is-size-1 has-text-accent has-text-weight-bold mb-4">${car.price.toLocaleString()}</p>
                                    <div className="buttons is-centered">
                                        <a href="#contacto" className="button is-accent is-medium is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-phone"></i>
                                            </span>
                                            <span>Contactar</span>
                                        </a>
                                        <a href="#financiamiento" className="button is-outlined is-light is-medium is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-calculator"></i>
                                            </span>
                                            <span>Calcular financiamiento</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CarHero;
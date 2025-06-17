import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCarById, getHighResCarImage } from '../services/api';
import { useCarContext } from '../context/CarContext';
import { useCarImage } from '../hooks/useCarImage';
import type { Car } from '@/types';
import SafeCarImage from '../components/SafeCarImage';

// Components
import CarTabs from '../components/car/CarTabs';

const CarDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { cars, toggleFavorite, isFavorite } = useCarContext();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [similarCars, setSimilarCars] = useState<Car[]>([]);
    const [bgImage, setBgImage] = useState<string>('');
    const [bgLoading, setBgLoading] = useState<boolean>(true);

    // ✅ SIEMPRE llamar el hook en el mismo orden, incluso si car es null
    const carForHook = car || { 
        id: 'loading', 
        make: 'Loading', 
        model: 'Car', 
        year: 2024, 
        image: undefined 
    };
    
    const carImageHook = useCarImage({ car: carForHook });

    useEffect(() => {
        const getCar = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                setBgLoading(true);
                
                const data = await fetchCarById(id); // No forzar el tipo aquí
                
                if (!data) {
                    setError('Auto no encontrado');
                    setBgLoading(false);
                    return;
                }
                
                setCar(data); // Ahora TypeScript sabe que data no es null
                setError(null);
    
                // Find similar cars
                if (cars.length > 0) {
                    const similar = cars
                        .filter(otherCar => 
                            (otherCar.make === data.make || otherCar.class === data.class) && 
                            otherCar.id !== data.id
                        )
                        .slice(0, 4);
                    setSimilarCars(similar);
                }
            } catch (err) {
                console.error('❌ Error loading car details:', err);
                setError((err as Error).message);
                setBgLoading(false);
            } finally {
                setLoading(false);
            }
        };
    
        getCar();
        window.scrollTo(0, 0);
    }, [id, cars]);

    // ✅ useEffect para background - mejorado para wallpapers específicos
    useEffect(() => {
        if (!car || car.id === 'loading' || !carImageHook.imageSrc) {
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setBgLoading(true);
                
                // Intentar obtener wallpaper específico del auto
                const wallpaperImage = await getHighResCarImage(car.make, car.model, car.year);
                
                // Precargar la imagen para verificar que funciona
                const img = new Image();
                img.onload = () => {
                    setBgImage(wallpaperImage);
                    setBgLoading(false);
                };
                img.onerror = () => {
                    console.warn(`⚠️ Failed to load wallpaper, using standard car image`);
                    setBgImage(carImageHook.imageSrc);
                    setBgLoading(false);
                };
                
                // Agregar crossOrigin para evitar problemas de CORS
                img.crossOrigin = 'anonymous';
                img.src = wallpaperImage;
                
            } catch (imgErr) {
                console.error("❌ Error loading wallpaper image:", imgErr);
                setBgImage(carImageHook.imageSrc);
                setBgLoading(false);
            }
        }, 300); // Reducir delay para carga más rápida

        return () => clearTimeout(timeoutId);
    }, [car, carImageHook.imageSrc]);

    if (loading) return (
        <div className="container has-text-centered section animated">
            <div className="loader-wrapper">
                <div className="loading-spinner">
                    <span className="icon">
                        <i className="fas fa-spinner fa-spin"></i>
                    </span>
                </div>
            </div>
            <p className="mt-4 is-size-5 has-text-accent">Cargando detalles del vehículo...</p>
        </div>
    );

    if (error) return (
        <div className="container section animated">
            <div className="notification is-danger is-light has-text-centered">
                <span className="icon">
                    <i className="fas fa-exclamation-triangle"></i>
                </span>
                <p className="is-size-5">Error: {error}</p>
                <Link to="/" className="button is-danger mt-4">
                    <span className="icon">
                        <i className="fas fa-home"></i>
                    </span>
                    <span>Volver al inicio</span>
                </Link>
            </div>
        </div>
    );

    // ✅ Solo verificar si car es null, pero el hook ya se llamó arriba
    if (!car || car.id === 'loading') return (
        <div className="container section animated">
            <div className="notification is-warning is-light has-text-centered">
                <span className="icon">
                    <i className="fas fa-search"></i>
                </span>
                <p className="is-size-5">No se encontró el vehículo solicitado</p>
                <Link to="/" className="button is-warning mt-4">
                    <span className="icon">
                        <i className="fas fa-home"></i>
                    </span>
                    <span>Volver al inicio</span>
                </Link>
            </div>
        </div>
    );

    const backgroundImageUrl = bgImage || carImageHook.imageSrc;

    return (
        <div className="animated has-background-dark">
            <section 
                className={`car-detail-hero ${bgLoading ? 'loading' : ''}`} 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${backgroundImageUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed', // Efecto parallax sutil
                    minHeight: '100vh' // Asegurar altura completa
                }}
            >
                <div className="container pt-6 pb-6">
                    <nav className="breadcrumb has-bullet-separator is-centered" aria-label="breadcrumbs">
                        <ul>
                            <li>
                                <Link to="/" className="has-text-white-bis">
                                    <span className="icon">
                                        <i className="fas fa-home"></i>
                                    </span>
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="has-text-white-bis">
                                    <span className="icon">
                                        <i className="fas fa-car"></i>
                                    </span>
                                    <span>Catálogo</span>
                                </Link>
                            </li>
                            <li className="is-active">
                                <a href="#" className="has-text-accent">{car.make} {car.model}</a>
                            </li>
                        </ul>
                    </nav>
                
                    <div className="columns is-vcentered mt-5">
                        <div className="column is-7">
                            <h1 className="title is-1 has-text-white">{car.make} {car.model}</h1>
                            <h2 className="subtitle is-3 has-text-accent">{car.year}</h2>
                            
                            <div className="car-highlights horizontal mt-5 mb-5">
                                <div className="highlight-item">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-gas-pump"></i>
                                    </span>
                                    <div>
                                        <p className="has-text-grey">Combustible</p>
                                        <p className="has-text-white has-text-weight-bold">{car.fuel_type}</p>
                                    </div>
                                </div>
                                
                                <div className="highlight-item">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-cog"></i>
                                    </span>
                                    <div>
                                        <p className="has-text-grey">Transmisión</p>
                                        <p className="has-text-white has-text-weight-bold">
                                            {car.transmission === 'a' ? 'Automática' : 'Manual'}
                                        </p>
                                    </div>
                                </div>
                                
                                {car.cylinders && (
                                    <div className="highlight-item">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-compress-arrows-alt"></i>
                                        </span>
                                        <div>
                                            <p className="has-text-grey">Cilindros</p>
                                            <p className="has-text-white has-text-weight-bold">{car.cylinders}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="buttons are-medium">
                                <button 
                                    className={`button ${isFavorite(car.id) ? 'is-danger' : 'is-outlined is-light'}`}
                                    onClick={() => toggleFavorite(car.id)}
                                >
                                    <span className="icon">
                                        <i className="fas fa-heart"></i>
                                    </span>
                                    <span>{isFavorite(car.id) ? 'En Favoritos' : 'Añadir a Favoritos'}</span>
                                </button>
                                
                                <button className="button is-outlined is-accent">
                                    <span className="icon">
                                        <i className="fas fa-share-alt"></i>
                                    </span>
                                    <span>Compartir</span>
                                </button>
                                
                                <a href="#contact" className="button is-accent">
                                    <span className="icon">
                                        <i className="fas fa-phone"></i>
                                    </span>
                                    <span>Contactar</span>
                                </a>
                            </div>
                        </div>
                        
                        <div className="column is-5">
                            <div className="price-card glowing-border">
                                <div className="price-card-content has-text-centered">
                                    <p className="is-size-4 has-text-white has-text-weight-light">Precio de Lista</p>
                                    <p className="is-size-1 has-text-accent has-text-weight-bold mb-3">
                                        ${car.price?.toLocaleString() || 'Consultar'}
                                    </p>
                                    <p className="has-text-white-bis mb-4">Financiamiento Disponible</p>
                                    
                                    {car.price && (
                                        <div className="financing-preview mb-4">
                                            <div className="columns is-mobile">
                                                <div className="column has-text-centered">
                                                    <p className="has-text-grey-light">Enganche</p>
                                                    <p className="has-text-white has-text-weight-bold">
                                                        ${(car.price * 0.20).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="column has-text-centered">
                                                    <p className="has-text-grey-light">Pago Mensual</p>
                                                    <p className="has-text-white has-text-weight-bold">
                                                        ${Math.round(car.price * 0.80 / 48).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="buttons is-centered">
                                        <a href="#financing" className="button is-secondary-accent is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-calculator"></i>
                                            </span>
                                            <span>Calcular Financiamiento</span>
                                        </a>
                                        <a href="#contact" className="button is-outlined is-light is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-envelope"></i>
                                            </span>
                                            <span>Solicitar Información</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="container p-4">                
                <div className="columns">
                    <div className="column is-8">
                        <div className="detail-section detail-gallery">
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-16by9" style={{ position: 'relative' }}>
                                    <SafeCarImage
                                            car={car}
                                            src={car.image}
                                            alt={`${car.make} ${car.model} ${car.year}`}
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'opacity 0.3s ease'
                                            }}
                                        />
                                        
                                        {carImageHook.imageError && (
                                            <div className="image-fallback-indicator" style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                zIndex: 5
                                            }}>
                                                <span className="tag is-warning is-small">
                                                    <span className="icon">
                                                        <i className="fas fa-exclamation-triangle"></i>
                                                    </span>
                                                    <span>Imagen alternativa</span>
                                                </span>
                                            </div>
                                        )}
                                        
                                        {!carImageHook.imageError && (
                                            <div className="image-quality-badge" style={{
                                                position: 'absolute',
                                                top: '15px',
                                                left: '15px',
                                                zIndex: 5
                                            }}>
                                                <span className="tag is-success is-small">
                                                    <span className="icon">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                    <span>Original</span>
                                                </span>
                                            </div>
                                        )}
                                    </figure>
                                </div>
                            </div>
                            
                            <div className="mt-5">
                                <h3 className="title is-4 mb-3 has-text-accent">
                                    <span className="icon">
                                        <i className="fas fa-info-circle"></i>
                                    </span>
                                    <span>Descripción</span>
                                </h3>
                                <p className="mb-4 has-text-white-bis has-text-centered">
                                    {car.description || `Este ${car.make} ${car.model} ${car.year} combina estilo, rendimiento y eficiencia en un paquete excepcional.`}
                                </p>
                                <p className="has-text-grey-light is-italic has-text-centered">
                                    Este vehículo se encuentra en excelentes condiciones, listo para entrega inmediata.
                                </p>
                            </div>
                        </div>
                        
                        <div className="detail-section">
                            <CarTabs car={car} />
                        </div>
                        
                        {similarCars.length > 0 && (
                            <div className="detail-section">
                                <h3 className="title is-4 has-text-accent mb-4">
                                    <span className="icon">
                                        <i className="fas fa-cars"></i>
                                    </span>
                                    <span>Vehículos Similares</span>
                                </h3>
                                <div className="columns is-multiline">
                                    {similarCars.map((similarCar) => (
                                        <SimilarCarCard 
                                            key={similarCar.id} 
                                            car={similarCar} 
                                            isFavorite={isFavorite}
                                            toggleFavorite={toggleFavorite}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="column is-4">
                        <div className="sticky-sidebar">
                            <div className="box">
                                <h4 className="title is-5">
                                    <span className="icon">
                                        <i className="fas fa-clipboard-list"></i>
                                    </span>
                                    <span>Información del Vehículo</span>
                                </h4>
                                <div className="content">
                                    <p>
                                        <span className="icon car-spec-icon">
                                            <i className="fas fa-industry"></i>
                                        </span>
                                        <strong>Marca:</strong> {car.make}
                                    </p>
                                    <p>
                                        <span className="icon car-spec-icon">
                                            <i className="fas fa-car"></i>
                                        </span>
                                        <strong>Modelo:</strong> {car.model}
                                    </p>
                                    <p>
                                        <span className="icon car-spec-icon">
                                            <i className="fas fa-calendar-alt"></i>
                                        </span>
                                        <strong>Año:</strong> {car.year}
                                    </p>
                                    <p>
                                        <span className="icon car-spec-icon">
                                            <i className="fas fa-gas-pump"></i>
                                        </span>
                                        <strong>Combustible:</strong> {car.fuel_type}
                                    </p>
                                    <p>
                                        <span className="icon car-spec-icon">
                                            <i className="fas fa-cog"></i>
                                        </span>
                                        <strong>Transmisión:</strong> {car.transmission === 'a' ? 'Automática' : 'Manual'}
                                    </p>
                                    {car.class && (
                                        <p>
                                            <span className="icon car-spec-icon">
                                                <i className="fas fa-tags"></i>
                                            </span>
                                            <strong>Categoría:</strong> {car.class}
                                        </p>
                                    )}
                                    {car.cylinders && (
                                        <p>
                                            <span className="icon car-spec-icon">
                                                <i className="fas fa-compress-arrows-alt"></i>
                                            </span>
                                            <strong>Cilindros:</strong> {car.cylinders}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="box mt-4" id="contact">
                                <h4 className="title is-5">
                                    <span className="icon">
                                        <i className="fas fa-phone"></i>
                                    </span>
                                    <span>Contactar Vendedor</span>
                                </h4>
                                <div className="content">
                                    <p className="has-text-grey-dark mb-3">
                                        ¿Interesado en este vehículo? Contáctanos para más información.
                                    </p>
                                    <div className="field">
                                        <label className="label">Nombre</label>
                                        <div className="control">
                                            <input className="input" type="text" placeholder="Tu nombre" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Teléfono</label>
                                        <div className="control">
                                            <input className="input" type="tel" placeholder="Tu teléfono" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Mensaje</label>
                                        <div className="control">
                                            <textarea 
                                                className="textarea" 
                                                placeholder={`Hola, estoy interesado en el ${car.make} ${car.model} ${car.year}`}
                                                rows={3}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <button className="button is-accent is-fullwidth">
                                                <span className="icon">
                                                    <i className="fas fa-paper-plane"></i>
                                                </span>
                                                <span>Enviar Mensaje</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="box mt-4" id="financing">
                                <h4 className="title is-5">
                                    <span className="icon">
                                        <i className="fas fa-calculator"></i>
                                    </span>
                                    <span>Calculadora de Financiamiento</span>
                                </h4>
                                <div className="content">
                                    {car.price ? (
                                        <>
                                            <div className="field">
                                                <label className="label">Precio del vehículo</label>
                                                <div className="control">
                                                    <input 
                                                        className="input" 
                                                        type="text" 
                                                        value={`$${car.price.toLocaleString()}`} 
                                                        readOnly 
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Enganche (%)</label>
                                                <div className="control">
                                                    <input className="input" type="number" defaultValue="20" min="0" max="100" />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Plazo (meses)</label>
                                                <div className="control">
                                                    <div className="select is-fullwidth">
                                                        <select defaultValue="48">
                                                            <option value="12">12 meses</option>
                                                            <option value="24">24 meses</option>
                                                            <option value="36">36 meses</option>
                                                            <option value="48">48 meses</option>
                                                            <option value="60">60 meses</option>
                                                            <option value="72">72 meses</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="control">
                                                    <button className="button is-secondary-accent is-fullwidth">
                                                        <span className="icon">
                                                            <i className="fas fa-chart-line"></i>
                                                        </span>
                                                        <span>Calcular Pagos</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="has-text-grey-dark">
                                            Contacta para información de precios y financiamiento.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="buttons is-centered mt-6 mb-6">
                    <Link to="/" className="button is-medium is-outlined is-accent">
                        <span className="icon">
                            <i className="fas fa-arrow-left"></i>
                        </span>
                        <span>Volver al Catálogo</span>
                    </Link>
                </div>
            </div>
            
            <div className="help-button animate-pulse">
                <i className="fas fa-comments"></i>
            </div>
        </div>
    );
};

const SimilarCarCard: React.FC<{
    car: Car;
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
}> = ({ car, isFavorite, toggleFavorite }) => {
    const carImageHook = useCarImage({ car });
    
    return (
        <div className="column is-6">
            <div className="card">
                <div className="card-image">
                    <figure className="image is-16by9" style={{ position: 'relative' }}>
                        <SafeCarImage
                            car={car}
                            src={car.image}
                            alt={`${car.make} ${car.model}`}
                            style={{ objectFit: 'cover' }}
                        />
                        
                        {carImageHook.imageError && (
                            <div className="image-fallback-indicator" style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 5
                            }}>
                                <span className="tag is-warning is-small">
                                    <span className="icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                    <span>Alt</span>
                                </span>
                            </div>
                        )}
                    </figure>
                </div>
                <div className="card-content">
                    <p className="title is-5 has-text-dark">
                        {car.make} {car.model}
                    </p>
                    <p className="subtitle is-6 has-text-grey">
                        {car.year}
                    </p>
                    {car.price && (
                        <p className="has-text-primary has-text-weight-bold">
                            ${car.price.toLocaleString()}
                        </p>
                    )}
                    <div className="mt-3">
                        <span className="tag is-light mr-2">
                            <span className="icon is-small">
                                <i className="fas fa-gas-pump"></i>
                            </span>
                            <span>{car.fuel_type}</span>
                        </span>
                        <span className="tag is-light">
                            <span className="icon is-small">
                                <i className="fas fa-cog"></i>
                            </span>
                            <span>
                                {car.transmission === 'a' ? 'Auto' : 'Manual'}
                            </span>
                        </span>
                    </div>
                </div>
                <footer className="card-footer">
                    <Link 
                        to={`/car/${car.id}`} 
                        className="card-footer-item has-text-primary"
                    >
                        <span className="icon">
                            <i className="fas fa-eye"></i>
                        </span>
                        <span>Ver detalles</span>
                    </Link>
                    <button 
                        className={`card-footer-item has-text-link ${
                            isFavorite(car.id) ? 'has-text-danger' : ''
                        }`}
                        onClick={() => toggleFavorite(car.id)}
                    >
                        <span className="icon">
                            <i className={`fas fa-heart ${
                                isFavorite(car.id) ? '' : 'far'
                            }`}></i>
                        </span>
                        <span>
                            {isFavorite(car.id) ? 'Favorito' : 'Agregar'}
                        </span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CarDetails;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import Testimonials from '../components/Testimonials';
import DotPattern from '../components/DotPattern';
import FeaturedCars from '../components/FeaturedCars'; // Este componente se usa más abajo
import { searchCars } from '../services/api';
import type { Car, SearchFilters } from '@/types';
import { useCarImage } from '../hooks/useCarImage';
import FeaturedCarsSection from '../components/FeaturedCarsSection';

const Home: React.FC = () => {
    const { cars: contextCars, loading: contextLoading } = useCarContext();
    const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchError, setSearchError] = useState<string | null>(null);
    
    // Añadir variables de estado para el carrusel
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const slidesToShow = 4; // Número fijo de tarjetas visibles a la vez

    // Cargar vehículos al montar el componente
    useEffect(() => {
        const loadCars = async (): Promise<void> => {
            try {
                setLoading(true);
                if (contextCars && contextCars.length > 0 && !contextLoading) {
                    // ✅ Asegurar que tengamos al menos 8 autos para el carrusel
                    if (contextCars.length >= 8) {
                        setDisplayedCars(contextCars);
                    } else {
                        // Si no hay suficientes en context, cargar más
                        const { fetchCars } = await import('../services/api/carService');
                        const moreCars = await fetchCars(16); // Cargar más autos
                        setDisplayedCars(moreCars);
                    }
                }
            } catch (error) {
                console.error("Error loading cars:", error);
                setSearchError("No pudimos cargar los vehículos. Por favor intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };
        
        loadCars();
    }, [contextCars, contextLoading]);

    // Manejador para la búsqueda
    const handleSearch = async (filters: SearchFilters): Promise<void> => {
        try {
            setLoading(true);
            setSearchError(null);
            
            const results = await searchCars(filters);
            setDisplayedCars(results);
        } catch (error) {
            console.error("Error searching cars:", error);
            setSearchError("Ocurrió un error al buscar. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const categoryImageHook = useCarImage({ 
        car: { id: 'fallback', make: 'Generic', model: 'Car', year: 2024 },
        fallbackImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    });

    // Añadir este método al componente Home
    const handleClearCache = async () => {
        setLoading(true);
        setSearchError("Actualizando datos, por favor espera...");
        
        try {
            // Importar y usar clearAllCaches directamente del archivo donde está definido
            const { clearAllCaches } = await import('../services/api/cache');
            clearAllCaches();
            
            // Recargar los datos manualmente
            const { fetchCars } = await import('../services/api/carService');
            const freshCars = await fetchCars(24);
            setDisplayedCars(freshCars);
            
            setSearchError("Datos actualizados correctamente");
            setTimeout(() => setSearchError(null), 3000);
        } catch (error) {
            console.error('Error limpiando caché:', error);
            setSearchError("Error al actualizar los datos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero is-fullheight-with-navbar luxury-dark-hero">
                <DotPattern />
                
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-vcentered">
                            <div className="column is-6 animate-fadeIn">
                                <h1 className="title is-1 has-text-white luxury-title">
                                    Descubre la Excelencia<br />en Cada Vehículo
                                </h1>
                                <div className="luxury-divider"></div>
                                <h2 className="subtitle has-text-white-bis is-4 mb-6 luxury-subtitle">
                                    Catálogo premium con Toyota, Kia, Hyundai, Tesla y las mejores marcas chinas.
                                </h2>
                                
                                <div className="features-list mb-6">
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">3 modelos por marca premium</span>
                                    </div>
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">Incluye marcas chinas innovadoras</span>
                                    </div>
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">Servicio de entrega a domicilio</span>
                                    </div>
                                </div>
                                
                                <div className="buttons are-medium">
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
                                </div>
                                
                                <div className="mt-6 luxury-badge">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-bolt"></i>
                                    </span>
                                    <span className="has-text-white-bis">Nuevos modelos 2025 disponibles</span>
                                </div>
                            </div>
                            <div className="column is-6 is-hidden-mobile">
                                <div className="luxury-car-showcase">
                                    <img 
                                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
                                        alt="Auto destacado" 
                                        className="luxury-car-image"
                                        onError={categoryImageHook.handleImageError}
                                    />
                                    <div className="luxury-car-details">
                                        <h3 className="title is-3 has-text-white has-text-shadow">Chevrolet Corvette</h3>
                                        <p className="has-text-grey-lighter mb-3">Potencia y diseño icónico</p>
                                        <a href="#featured-cars" className="button is-small is-accent is-outlined">Ver detalles</a>
                                    </div>
                                    <div className="luxury-car-specs">
                                        <div className="spec-item">
                                            <span className="spec-value">460</span>
                                            <span className="spec-label">HP</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-value">4.2</span>
                                            <span className="spec-label">0-60</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-value">V8</span>
                                            <span className="spec-label">Motor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Características destacadas en footer */}
                <div className="hero-footer pb-6 pt-3 luxury-hero-footer">
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
            
            {/* Sección de búsqueda y vehículos destacados */}
            <FeaturedCarsSection
                loading={loading}
                searchError={searchError}
                setSearchError={setSearchError}
                displayedCars={displayedCars}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                slidesToShow={slidesToShow}
                onSearch={handleSearch}
                onClearCache={handleClearCache}
            />
            
            {/* Añadir el componente FeaturedCars aquí */}
            <FeaturedCars />
            
            {/* Nueva sección que reemplaza la búsqueda personalizada */}
            <section className="section has-background-black-ter">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        Servicios Premium
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Ofrecemos servicios exclusivos para una experiencia de compra superior
                    </p>
                    
                    <div className="columns is-multiline">
                        <div className="column is-4">
                            <div className="service-box animate-fadeIn">
                                <div className="service-icon">
                                    <i className="fas fa-money-check-alt"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Financiamiento Flexible</h3>
                                <p className="has-text-grey-light">
                                    Opciones de financiamiento personalizadas con tasas competitivas y plazos flexibles.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Más información</a>
                            </div>
                        </div>
                        
                        <div className="column is-4">
                            <div className="service-box animate-fadeIn" style={{animationDelay: "0.2s"}}>
                                <div className="service-icon">
                                    <i className="fas fa-tools"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Mantenimiento Premium</h3>
                                <p className="has-text-grey-light">
                                    Paquetes de mantenimiento exclusivos con técnicos certificados y repuestos originales.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Conocer paquetes</a>
                            </div>
                        </div>
                        
                        <div className="column is-4">
                            <div className="service-box animate-fadeIn" style={{animationDelay: "0.4s"}}>
                                <div className="service-icon">
                                    <i className="fas fa-exchange-alt"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Programa de Intercambio</h3>
                                <p className="has-text-grey-light">
                                    Recibimos tu auto actual como parte del pago por tu nuevo vehículo de lujo.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Evaluar mi auto</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Categorías Populares */}
            <section className="section has-background-black-ter">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        Categorías Populares
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Explora vehículos según tus preferencias
                    </p>
                    
                    <div className="columns is-multiline">
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Sedanes" 
                                    onError={categoryImageHook.handleImageError}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Sedanes</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="SUVs" 
                                    onError={categoryImageHook.handleImageError}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">SUVs</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Deportivos" 
                                    onError={categoryImageHook.handleImageError}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Deportivos</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Eléctricos" 
                                    onError={categoryImageHook.handleImageError}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Eléctricos</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <Testimonials />
            
            {/* Call to Action */}
            <section className="section newsletter-section">
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <h3 className="title is-3 has-text-white mb-4">¡Mantente informado!</h3>
                            <p className="subtitle has-text-white-bis mb-5">
                                Recibe las últimas noticias y ofertas especiales directamente en tu correo electrónico.
                            </p>
                        </div>
                        <div className="column is-6">
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <input className="input is-medium" type="email" placeholder="Tu correo electrónico" />
                                </div>
                                <div className="control">
                                    <button className="button is-medium is-accent">
                                        Suscribirse
                                    </button>
                                </div>
                            </div>
                            <p className="has-text-grey-light is-size-7 mt-2">
                                Al suscribirte aceptas nuestra política de privacidad. Nunca compartiremos tu correo electrónico.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import CarCard from './CarCard';
import { Car, SearchFilters } from '@/types';

interface FeaturedCarsSectionProps {
    loading: boolean;
    searchError: string | null;
    setSearchError: (error: string | null) => void;
    displayedCars: Car[];
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    currentSlide: number;
    setCurrentSlide: (slide: number) => void;
    slidesToShow: number;
    onSearch: (filters: SearchFilters) => void;
    onClearCache: () => void;
}

const FeaturedCarsSection: React.FC<FeaturedCarsSectionProps> = ({
    loading,
    searchError,
    setSearchError,
    displayedCars,
    isPlaying,
    setIsPlaying,
    currentSlide,
    setCurrentSlide,
    slidesToShow,
    onSearch,
    onClearCache
}) => {
    // ✅ Estado para el número de slides según el tamaño de pantalla
    const [actualSlidesToShow, setActualSlidesToShow] = useState(slidesToShow);

    // ✅ Detectar el tamaño de pantalla y ajustar slides
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setActualSlidesToShow(1);
            } else if (width <= 768) {
                setActualSlidesToShow(2);
            } else if (width <= 1200) {
                setActualSlidesToShow(3);
            } else {
                setActualSlidesToShow(4);
            }
        };

        handleResize(); // Ejecutar al montar
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ CORREGIDO: Calcular maxSlides correctamente
    const maxSlides = Math.max(1, displayedCars.length - actualSlidesToShow + 1);
    
    // ✅ NUEVO: Mostrar indicadores siempre que haya autos
    const shouldShowIndicators = displayedCars.length > 0;
    
    // ✅ NUEVO: Si solo hay un auto o menos autos que slides, asegurar currentSlide = 0
    useEffect(() => {
        if (displayedCars.length <= actualSlidesToShow) {
            setCurrentSlide(0);
        } else if (currentSlide >= maxSlides) {
            setCurrentSlide(Math.max(0, maxSlides - 1));
        }
    }, [displayedCars.length, actualSlidesToShow, currentSlide, maxSlides, setCurrentSlide]);

    // ✅ Auto-play del carrusel (solo si hay múltiples slides)
    useEffect(() => {
        if (!isPlaying || displayedCars.length <= actualSlidesToShow || maxSlides <= 1) return;
        
        const interval = setInterval(() => {
            const nextSlide = currentSlide >= maxSlides - 1 ? 0 : currentSlide + 1;
            setCurrentSlide(nextSlide);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [isPlaying, displayedCars.length, actualSlidesToShow, maxSlides, setCurrentSlide, currentSlide]);

    // ✅ Función helper para manejar el siguiente slide
    const handleNextSlide = () => {
        if (displayedCars.length <= actualSlidesToShow) return;
        
        const nextSlide = currentSlide >= maxSlides - 1 ? 0 : currentSlide + 1;
        setCurrentSlide(nextSlide);
    };

    // ✅ Función helper para manejar el slide anterior
    const handlePrevSlide = () => {
        if (displayedCars.length <= actualSlidesToShow) return;
        
        const prevSlide = currentSlide <= 0 ? maxSlides - 1 : currentSlide - 1;
        setCurrentSlide(prevSlide);
    };

    return (
        <section className="section" id="featured-cars">
            <div className="container">
                <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                    Explora Nuestra Colección
                </h2>
                <p className="subtitle has-text-centered has-text-grey-light mb-6">
                    Encuentra el auto perfecto según tus preferencias
                </p>
                
                {/* Filtros de búsqueda integrados */}
                <div className="box has-background-dark has-shadow animate-fadeIn mb-6" id="search">
                    <SearchFilter onSearch={onSearch} />
                </div>
                
                {/* Mostrar estado de carga */}
                {loading && (
                    <div className="has-text-centered p-6">
                        <div className="button is-loading is-large is-white"></div>
                        <p className="mt-4 is-size-5 has-text-grey-light">Cargando vehículos...</p>
                    </div>
                )}
                
                {/* Mostrar error si ocurre */}
                {searchError && (
                    <div className="notification is-danger mt-5">
                        <button className="delete" onClick={() => setSearchError(null)}></button>
                        {searchError}
                    </div>
                )}
                
                {/* Resultados/Vehículos destacados */}
                {!loading && displayedCars.length > 0 && (
                    <div className="auto-carousel-container">
                        {/* ✅ CORREGIDO: Controles del carousel - mostrar siempre que haya autos */}
                        <div className="carousel-controls">
                            <button 
                                className="control-btn prev-btn"
                                onClick={handlePrevSlide}
                                title="Anterior"
                                disabled={displayedCars.length <= actualSlidesToShow}
                                style={{ 
                                    opacity: displayedCars.length <= actualSlidesToShow ? 0.3 : 1,
                                    cursor: displayedCars.length <= actualSlidesToShow ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            
                            <button 
                                className={`control-btn play-pause ${isPlaying ? 'is-playing' : 'is-paused'}`}
                                onClick={() => setIsPlaying(!isPlaying)}
                                title={isPlaying ? 'Pausar' : 'Reproducir'}
                                disabled={displayedCars.length <= actualSlidesToShow}
                                style={{ 
                                    opacity: displayedCars.length <= actualSlidesToShow ? 0.3 : 1,
                                    cursor: displayedCars.length <= actualSlidesToShow ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>
                            
                            {/* ✅ CORREGIDO: Indicadores de posición - mostrar siempre */}
                            {shouldShowIndicators && (
                                <div className="carousel-indicators">
                                    {displayedCars.length <= actualSlidesToShow ? (
                                        // ✅ Si hay un auto o menos que slides visibles, mostrar un solo indicador activo
                                        <button
                                            className="indicator is-active"
                                            disabled
                                        />
                                    ) : (
                                        // ✅ Si hay múltiples slides, mostrar todos los indicadores
                                        Array.from({ length: maxSlides }).map((_, index) => (
                                            <button
                                                key={index}
                                                className={`indicator ${index === currentSlide ? 'is-active' : ''}`}
                                                onClick={() => setCurrentSlide(index)}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                            
                            <button 
                                className="control-btn next-btn"
                                onClick={handleNextSlide}
                                title="Siguiente"
                                disabled={displayedCars.length <= actualSlidesToShow}
                                style={{ 
                                    opacity: displayedCars.length <= actualSlidesToShow ? 0.3 : 1,
                                    cursor: displayedCars.length <= actualSlidesToShow ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        {/* ✅ Contenedor del carousel */}
                        <div className="auto-carousel-wrapper">
                            <div 
                                className="auto-carousel-track"
                                style={{
                                    // ✅ CLAVE: Transform basado en el porcentaje por slide
                                    transform: displayedCars.length <= actualSlidesToShow 
                                        ? 'translateX(0%)' // No mover si hay pocos autos
                                        : `translateX(-${currentSlide * (100 / actualSlidesToShow)}%)`,
                                }}
                            >
                                {displayedCars.map((car: Car) => (
                                    <div key={car.id} className="auto-carousel-item">
                                        <CarCard car={car} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* ✅ Información adicional */}
                        <div className="has-text-centered mt-4">
                            <p className="has-text-grey-light">
                                {displayedCars.length <= actualSlidesToShow 
                                    ? `Mostrando ${displayedCars.length} ${displayedCars.length === 1 ? 'vehículo' : 'vehículos'}`
                                    : `Mostrando ${actualSlidesToShow} de ${displayedCars.length} vehículos`
                                }
                            </p>
                        </div>
                        
                        <div className="has-text-centered mt-6">
                            <Link to="/catalog" className="button is-accent is-medium mr-2">
                                <span className="icon">
                                    <i className="fas fa-th-large"></i>
                                </span>
                                <span>Ver catálogo completo</span>
                            </Link>
                            <button 
                                className="button is-warning is-medium"
                                onClick={onClearCache}
                                disabled={loading}
                            >
                                <span className="icon">
                                    <i className="fas fa-sync-alt"></i>
                                </span>
                                <span>Actualizar datos</span>
                            </button>
                        </div>
                    </div>
                )}
                
                {!loading && displayedCars.length === 0 && (
                    <div className="notification is-warning has-text-centered">
                        <p className="is-size-5">No se encontraron vehículos con esos criterios de búsqueda.</p>
                        <button 
                            className="button is-warning is-light mt-3"
                            onClick={() => window.location.reload()}
                        >
                            Reiniciar búsqueda
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCarsSection;
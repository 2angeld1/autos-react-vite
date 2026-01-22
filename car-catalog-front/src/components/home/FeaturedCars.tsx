import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import { useCarImage } from '../../hooks/useCarImage';
import type { Car } from '@/types';

const FeaturedCars: React.FC = () => {
    const { cars, loading } = useCarContext();
    const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
    const [isValidating, setIsValidating] = useState<boolean>(true);
    
    useEffect(() => {
        const validateAndFilterCars = async () => {
            if (cars.length > 0 && !loading) {                
                // ✅ ACTUALIZADO: Orden prioritario de marcas con 2 por marca
                const featuredBrands = [
                    'toyota', 'kia', 'hyundai', // ✅ PRIORIDAD MÁXIMA
                    'tesla', 'geely', 'nissan', 'chevrolet', 'mitsubishi'
                ];
                
                // Filtrar por marcas específicas primero
                const brandFilteredCars = cars.filter(car => {
                    const make = car.make.toLowerCase();
                    return featuredBrands.includes(make);
                });
                                
                // ✅ MODIFICADO: 2 autos por marca máximo
                const validatedCars: Car[] = [];
                const brandCounts: Record<string, number> = {};
                const maxPerBrand = 2; // ✅ CAMBIADO de 3 a 2
                
                // ✅ PASO 1: Asegurar que TODAS las marcas tengan al menos 1 auto
                for (const brand of featuredBrands) {
                    const brandCars = brandFilteredCars.filter(car => 
                        car.make.toLowerCase() === brand && car.year >= 2020
                    );
                    
                    if (brandCars.length > 0) {
                        // Tomar los mejores 2 autos de esta marca
                        const carsToAdd = brandCars.slice(0, maxPerBrand);
                        carsToAdd.forEach(car => {
                            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
                            validatedCars.push(car);
                        });
                    } else {
                        console.warn(`⚠️ No se encontraron autos para ${brand}`);
                    }
                }
                setFeaturedCars(validatedCars);
                setIsValidating(false);
            }
        };
        
        validateAndFilterCars();
    }, [cars, loading]);

    // ✅ MOSTRAR distribución en el subtítulo
    const getBrandDistribution = (): string => {
        const counts: Record<string, number> = {};
        featuredCars.forEach(car => {
            counts[car.make] = (counts[car.make] || 0) + 1;
        });
        
        return Object.entries(counts)
            .map(([make, count]) => `${make} (${count})`)
            .join(' • ');
    };

    if (isValidating) {
        return (
            <section className="section has-background-black-ter">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        🌟 Vehículos Destacados 2024
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Toyota • Kia • Hyundai • Tesla • Geely • Nissan • Chevrolet • Mitsubishi
                    </p>
                    <div className="has-text-centered p-6">
                        <div className="button is-loading is-large is-white"></div>
                        <p className="mt-4 is-size-5 has-text-grey-light">Validando vehículos destacados...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (featuredCars.length === 0) {
        return null;
    }

    return (
        <section className="section has-background-black-ter">
            <div className="container">
                <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                    🌟 Vehículos Destacados 2024
                </h2>
                <p className="subtitle has-text-centered has-text-grey-light mb-6">
                    {getBrandDistribution()}
                </p>
                
                <div className="featured-cars-grid">
                    {featuredCars.map((car: Car) => (
                        <FeaturedCarCard key={car.id} car={car} />
                    ))}
                </div>
                
                {featuredCars.length > 0 && (
                    <div className="has-text-centered mt-6">
                        <Link to="/catalog" className="button is-accent is-medium">
                            <span className="icon">
                                <i className="fas fa-th-large"></i>
                            </span>
                            <span>Ver catálogo completo</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

const FeaturedCarCard: React.FC<{ car: Car }> = ({ car }) => {
    const carImageHook = useCarImage({ 
        car,
        fallbackImage: car.image
    });

    return (
        <div className="travel-card animate-fadeIn">
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
                <button className="travel-favorite-btn">
                    <i className="far fa-heart"></i>
                </button>
            </div>

            {/* Contenido */}
            <div className="travel-card-content">
                <span className="travel-card-subtitle">{car.year} • {car.make}</span>
                <h3 className="travel-card-title">{car.model}</h3>
                <div className="travel-card-meta">
                    <span className="travel-rating">
                        <i className="fas fa-star"></i> 5.0
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

export default FeaturedCars;
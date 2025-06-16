import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { useCarImage } from '../hooks/useCarImage';
import { getDefaultCarImage } from '../services/api/carBrands';
import type { Car } from '@/types';

const FeaturedCars: React.FC = () => {
    const { cars, loading } = useCarContext();
    const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
    const [isValidating, setIsValidating] = useState<boolean>(true);
    
    useEffect(() => {
        const validateAndFilterCars = async () => {
            if (cars.length > 0 && !loading) {
                console.log('🎯 Filtering featured cars for specified brands...');
                
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
                
                console.log(`📊 Found ${brandFilteredCars.length} cars from featured brands`);
                
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
                            console.log(`✅ ${brand}: ${car.make} ${car.model} added (${brandCounts[brand]}/${maxPerBrand})`);
                        });
                    } else {
                        console.warn(`⚠️ No se encontraron autos para ${brand}`);
                    }
                }
                
                console.log(`🎯 Featured cars set: ${validatedCars.length} vehicles from featured brands`);
                console.log('📊 Final distribution:', brandCounts);
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
    // Usar imagen precargada para evitar errores
    const carImageHook = useCarImage({ 
        car,
        fallbackImage: getDefaultCarImage(car.make) // Asegurar un fallback específico por marca
    });
    
    // ✅ Determinar si es marca china
    const isChineseBrand = ['byd', 'nio', 'geely', 'xpeng', 'li auto', 'chery', 'great wall', 'mg'].includes(car.make.toLowerCase());
    
    return (
        <div className="featured-car-card animate-fadeIn">
            <div className="card-image-container">
                <img 
                    src={carImageHook.imageSrc}
                    alt={`${car.make} ${car.model}`}
                    className="car-image"
                    onError={carImageHook.handleImageError}
                    loading="lazy" // Mejora de rendimiento
                />
                
                {/* Overlay gradient */}
                <div className="image-gradient-overlay"></div>
                
                {/* Year badge */}
                <div className="car-year-badge">
                    <span>{car.year}</span>
                </div>
                
                {/* Price badge */}
                <div className="car-price-badge">
                    <span>${car.price?.toLocaleString() || 'Consultar'}</span>
                </div>
                
                {/* Chinese brand badge */}
                {isChineseBrand && (
                    <div className="chinese-brand-badge">
                        <span className="icon">
                            <i className="fas fa-star"></i>
                        </span>
                        <span>Marca China</span>
                    </div>
                )}
                
                {/* Electric badge */}
                {car.fuel_type === 'electricity' && (
                    <div className="electric-badge">
                        <span className="icon">
                            <i className="fas fa-bolt"></i>
                        </span>
                        <span>Eléctrico</span>
                    </div>
                )}
            </div>
            
            <div className="card-content">
                <div className="car-info">
                    <h3 className="car-title">{car.make} {car.model}</h3>
                    <p className="car-specs">
                        {car.fuel_type === 'electricity' ? 'Eléctrico' : 
                         car.fuel_type === 'hybrid' ? 'Híbrido' : 'Gasolina'}
                        {car.transmission === 'a' ? ' • Automático' : ' • Manual'}
                    </p>
                </div>
                
                <div className="car-features">
                    <div className="feature-chip">
                        <span className="icon">
                            <i className="fas fa-gas-pump"></i>
                        </span>
                        <span>{car.fuel_type === 'electricity' ? '⚡' : '⛽'}</span>
                    </div>
                    <div className="feature-chip">
                        <span className="icon">
                            <i className="fas fa-tachometer-alt"></i>
                        </span>
                        <span>{car.combination_mpg || car.highway_mpg || 'N/A'} MPG</span>
                    </div>
                    {car.cylinders !== undefined && car.cylinders > 0 && (
                        <div className="feature-chip">
                            <span className="icon">
                                <i className="fas fa-cog"></i>
                            </span>
                            <span>{car.cylinders}V</span>
                        </div>
                    )}
                </div>
                
                <div className="card-actions">
                    <Link to={`/car/${car.id}`} className="view-details-btn">
                        <span>Ver detalles</span>
                        <span className="icon">
                            <i className="fas fa-arrow-right"></i>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCars;
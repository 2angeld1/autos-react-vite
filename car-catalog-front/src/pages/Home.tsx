import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCarContext } from '../context/CarContext';
import Testimonials from '../components/home/Testimonials';
import FeaturedCars from '../components/home/FeaturedCars';
import { searchCars } from '../services/api';
import type { Car, SearchFilters } from '@/types';
import { useCarImage } from '../hooks/useCarImage';
import FeaturedCarsSection from '../components/home/FeaturedCarsSection';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../animations/variants';
import HeroSection from '../components/home/HeroSection';

const Home: React.FC = () => {
    const { cars: contextCars, loading: contextLoading } = useCarContext();
    const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchError, setSearchError] = useState<string | null>(null);
    
    // Año de inicio para el carrusel
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

    // Método para refrescar los datos directamente del backend
    const handleRefreshData = async () => {
        setLoading(true);
        setSearchError("Actualizando datos, por favor espera...");
        
        try {
            // Recargar los datos manualmente desde el servicio de backend
            const { fetchCars } = await import('../services/api/carService');
            const freshCars = await fetchCars(24);
            setDisplayedCars(freshCars);
            
            setSearchError("Datos actualizados correctamente");
            setTimeout(() => setSearchError(null), 3000);
        } catch (error) {
            console.error('Error actualizando datos:', error);
            setSearchError("Error al actualizar los datos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <HeroSection />

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
                onClearCache={handleRefreshData}
            />
            
            {/* Añadir el componente FeaturedCars aquí */}
            <FeaturedCars />
            
            {/* Nueva sección que reemplaza la búsqueda personalizada */}
            <section className="section has-background-black-ter">
                <div className="container">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUp}
                        className="title is-2 has-text-centered section-title"
                    >
                        Servicios Premium
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="subtitle has-text-centered has-text-grey-light mb-6"
                    >
                        Ofrecemos servicios exclusivos para una experiencia de compra superior
                    </motion.p>
                    
                    <motion.div
                        className="columns is-multiline"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={slideUp} className="column is-4">
                            <div className="service-box">
                                <div className="service-icon">
                                    <i className="fas fa-money-check-alt"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Financiamiento Flexible</h3>
                                <p className="has-text-grey-light">
                                    Opciones de financiamiento personalizadas con tasas competitivas y plazos flexibles.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Más información</a>
                            </div>
                        </motion.div>
                        
                        <motion.div variants={slideUp} className="column is-4">
                            <div className="service-box">
                                <div className="service-icon">
                                    <i className="fas fa-tools"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Mantenimiento Premium</h3>
                                <p className="has-text-grey-light">
                                    Paquetes de mantenimiento exclusivos con técnicos certificados y repuestos originales.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Conocer paquetes</a>
                            </div>
                        </motion.div>
                        
                        <motion.div variants={slideUp} className="column is-4">
                            <div className="service-box">
                                <div className="service-icon">
                                    <i className="fas fa-exchange-alt"></i>
                                </div>
                                <h3 className="title is-4 mt-4 mb-3">Programa de Intercambio</h3>
                                <p className="has-text-grey-light">
                                    Recibimos tu auto actual como parte del pago por tu nuevo vehículo de lujo.
                                </p>
                                <a href="#" className="button is-small is-outlined is-accent mt-4">Evaluar mi auto</a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* Categorías Populares */}
            <section className="section has-background-black-ter">
                <div className="container">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUp}
                        className="title is-2 has-text-centered section-title"
                    >
                        Categorías Populares
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="subtitle has-text-centered has-text-grey-light mb-6"
                    >
                        Explora vehículos según tus preferencias
                    </motion.p>
                    
                    <motion.div
                        className="columns is-multiline"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={scaleIn} className="column is-3-desktop is-6-tablet">
                            <div className="category-card">
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
                        </motion.div>
                        <motion.div variants={scaleIn} className="column is-3-desktop is-6-tablet">
                            <div className="category-card">
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
                        </motion.div>
                        <motion.div variants={scaleIn} className="column is-3-desktop is-6-tablet">
                            <div className="category-card">
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
                        </motion.div>
                        <motion.div variants={scaleIn} className="column is-3-desktop is-6-tablet">
                            <div className="category-card">
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
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* Testimonials */}
            <Testimonials />
            
            {/* Call to Action */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="section newsletter-section"
            >
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <motion.h3 variants={slideUp} className="title is-3 has-text-white mb-4">¡Mantente informado!</motion.h3>
                            <motion.p variants={slideUp} className="subtitle has-text-white-bis mb-5">
                                Recibe las últimas noticias y ofertas especiales directamente en tu correo electrónico.
                            </motion.p>
                        </div>
                        <div className="column is-6">
                            <motion.div variants={slideUp} className="field has-addons">
                                <div className="control is-expanded">
                                    <input className="input is-medium" type="email" placeholder="Tu correo electrónico" />
                                </div>
                                <div className="control">
                                    <button className="button is-medium is-accent">
                                        Suscribirse
                                    </button>
                                </div>
                            </motion.div>
                            <motion.p variants={fadeIn} className="has-text-grey-light is-size-7 mt-2">
                                Al suscribirte aceptas nuestra política de privacidad. Nunca compartiremos tu correo electrónico.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
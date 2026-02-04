import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCarContext } from '../context/CarContext';
import Testimonials from '../components/home/Testimonials';
import FeaturedCars from '../components/home/FeaturedCars';
import type { Car } from '@/types';
import { useCarImage } from '../hooks/useCarImage';
import FeaturedCarsSection from '../components/home/FeaturedCarsSection';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../animations/variants';
import HeroSection from '../components/home/HeroSection';

import { inventoryService, Category } from '../services/api/inventoryService';

const Home: React.FC = () => {
    const { cars: contextCars, loading: contextLoading, handleSearch } = useCarContext();
    const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchError, setSearchError] = useState<string | null>(null);
    
    // Año de inicio para el carrusel
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const slidesToShow = 4; // Número fijo de tarjetas visibles a la vez

    // Cargar datos al montar
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                // Cargar categorías del backend
                const cats = await inventoryService.getCategories();
                setCategories(cats);

                if (contextCars && contextCars.length > 0 && !contextLoading) {
                    setDisplayedCars(contextCars);
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialData();
    }, [contextCars, contextLoading]);

    // Manejador para filtrar por categoría desde las cards
    const handleCategoryClick = (categoryName: string) => {
        handleSearch({ searchTerm: '', make: '', fuelType: '', transmission: '', category: categoryName });
        // Hacer scroll suave hacia los resultados destacados
        const element = document.getElementById('featured-cars-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
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
                        className="columns is-multiline is-centered"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {(categories.length > 0 ? categories : [
                            { _id: '1', name: 'Sedanes', slug: 'sedanes', image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750' },
                            { _id: '2', name: 'SUVs', slug: 'suvs', image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750' },
                            { _id: '3', name: 'Deportivos', slug: 'deportivos', image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750' },
                            { _id: '4', name: 'Pickups', slug: 'pickups', image: 'https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750' }
                        ]).map((cat: any) => (
                            <motion.div key={cat._id} variants={scaleIn} className="column is-3-desktop is-6-tablet">
                                <div
                                    className="category-card is-clickable"
                                    onClick={() => handleCategoryClick(cat.name)}
                                >
                                    <img 
                                        src={cat.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'}
                                        alt={cat.name}
                                        onError={categoryImageHook.handleImageError}
                                    />
                                    <div className="category-overlay">
                                        <h3 className="title is-4 has-text-white mb-2">{cat.name}</h3>
                                        <span className="button is-small is-secondary-accent is-outlined">
                                            Explorar
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                                if (!email) return;
                                const { quoteService } = await import('../services/api');
                                try {
                                    await quoteService.requestQuote({
                                        carId: 'newsletter',
                                        customerName: 'Suscripción Newsletter',
                                        email: email,
                                        phone: '0000000000',
                                        downPayment: 0,
                                        term: 0
                                    });
                                    const { toast } = await import('react-hot-toast');
                                    toast.success('¡Gracias por suscribirte!');
                                    (e.target as HTMLFormElement).reset();
                                } catch (err) {
                                    console.error(err);
                                }
                            }}>
                                <motion.div variants={slideUp} className="field has-addons">
                                    <div className="control is-expanded">
                                        <input className="input is-medium" type="email" name="email" placeholder="Tu correo electrónico" required />
                                    </div>
                                    <div className="control">
                                        <button type="submit" className="button is-medium is-accent">
                                            Suscribirse
                                        </button>
                                    </div>
                                </motion.div>
                            </form>
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
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCarById } from '../services/api';
import { useCarContext } from '../context/CarContext';
import { useCarImage } from '../hooks/useCarImage';
import type { Car } from '@/types';
import { fadeIn, slideUp } from '../animations/variants';

// Components
import CarHero from '../components/car/CarHero';
import CarGallery from '../components/car/CarGallery';
import CarTabs from '../components/car/CarTabs';
import CarDescription from '../components/car/CarDescription';
import CarSimilar from '../components/car/CarSimilar';
import SidebarComponents from '../components/car/SidebarComponents';
import QuoteModal from '../components/common/QuoteModal';
import '../assets/styles/CarDetails-page.css';

const CarDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { cars, toggleFavorite, isFavorite } = useCarContext();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [similarCars, setSimilarCars] = useState<Car[]>([]);
    const [bgImage, setBgImage] = useState<string>('');
    const [bgLoading, setBgLoading] = useState<boolean>(true);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    // Siempre llamar el hook en el mismo orden, incluso si car es null
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
                
                const data = await fetchCarById(id);
                
                if (!data) {
                    setError('Auto no encontrado');
                    setBgLoading(false);
                    return;
                }
                
                setCar(data);
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

    // useEffect para background - usar imagen del backend
    useEffect(() => {
        if (!car || car.id === 'loading') {
            return;
        }

        const imageUrl = car.image || carImageHook.imageSrc;
        
        if (imageUrl) {
            setBgImage(imageUrl);
        }
        setBgLoading(false);
    }, [car, carImageHook.imageSrc]);

    // Loading state
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

    // Error state
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

    // Not found state
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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="has-background-dark"
        >
            {/* Hero Section */}
            <CarHero
                car={car}
                backgroundImageUrl={backgroundImageUrl}
                bgLoading={bgLoading}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
            />

            {/* Main Content */}
            <div className="container p-4">                
                <div className="columns">
                    {/* Left Column - Main Content */}
                    <div className="column is-8">
                        {/* Gallery Section */}
                        <CarGallery
                            car={car}
                            imageError={carImageHook.imageError}
                        />

                        {/* Description Section */}
                        <div className="mt-5">
                            <CarDescription car={car} />
                        </div>
                        
                        {/* Tabs Section */}
                        <div className="detail-section">
                            <CarTabs car={car} />
                        </div>
                        
                        {/* Similar Cars Section */}
                        <CarSimilar
                            similarCars={similarCars}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                        />
                    </div>
                    
                    {/* Right Column - Sidebar */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUp}
                        className="column is-4"
                    >
                        <SidebarComponents
                            car={car}
                            onQuoteClick={() => setIsQuoteOpen(true)}
                        />
                    </motion.div>
                </div>
                
                {/* Back Button */}
                <div className="buttons is-centered mt-6 mb-6">
                    <Link to="/" className="button is-medium is-outlined is-accent">
                        <span className="icon"><i className="fas fa-arrow-left"></i></span>
                        <span>Volver al Catálogo</span>
                    </Link>
                </div>
            </div>

            {/* Quote Modal */}
            {car && (
                <QuoteModal
                    isOpen={isQuoteOpen}
                    onClose={() => setIsQuoteOpen(false)}
                    car={car}
                />
            )}
        </motion.div>
    );
};

export default CarDetails;
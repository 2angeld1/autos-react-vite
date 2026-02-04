import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLatestReviews } from '../../services/api/reviewService';
import type { Review } from '@/types';
import { fadeIn, slideUp, staggerContainer } from '../../animations/variants';

const Testimonials: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            const data = await fetchLatestReviews();
            // Si hay reseñas reales las usamos, si no, mostramos un estado vacío o placeholders
            setReviews(data.slice(0, 3)); // Solo mostramos las 3 más recientes en el Home
            setLoading(false);
        };
        loadReviews();
    }, []);

    // Datos por defecto por si no hay reseñas aún (para que no se vea vacío el home)
    const fallbackTestimonials = [
        {
            id: 'f1',
            userName: "María García",
            comment: "Encontré mi Toyota Corolla ideal gracias a este catálogo. La búsqueda fue muy intuitiva y los filtros me ayudaron mucho.",
            rating: 5,
            car: { make: 'Toyota', model: 'Corolla', year: 2023 }
        },
        {
            id: 'f2',
            userName: "Carlos Rodríguez",
            comment: "Excelente servicio. Pude comparar varios modelos antes de decidirme. La información detallada es clave.",
            rating: 5,
            car: { make: 'Honda', model: 'Civic', year: 2024 }
        },
        {
            id: 'f3',
            userName: "Laura Martínez",
            comment: "Recomiendo totalmente este catálogo. La función de favoritos me permitió guardar mis opciones y decidir con calma.",
            rating: 5,
            car: { make: 'Hyundai', model: 'Tucson', year: 2022 }
        }
    ];

    const displayReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

    if (loading) return null; // O un pequeño loader

    return (
        <section className="section has-background-black">
            <div className="container">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={slideUp}
                    className="title is-2 has-text-centered section-title"
                >
                    Lo que dicen nuestros usuarios
                </motion.h2>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="subtitle has-text-centered has-text-grey-light mb-6"
                >
                    Testimonios de personas que encontraron su auto ideal con nosotros
                </motion.p>
                
                <motion.div
                    className="columns"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <AnimatePresence>
                        {displayReviews.map((review: any) => (
                            <motion.div key={review.id} className="column is-4" variants={fadeIn}>
                                <div className="testimonial-card-pro">
                                    <div className="quote-icon">
                                        <i className="fas fa-quote-left"></i>
                                    </div>
                                    <p className="testimonial-text mb-4">
                                        "{review.comment}"
                                    </p>
                                    <div className="testimonial-footer">
                                        <div className="author-info">
                                            <div className="author-avatar-small">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="has-text-white has-text-weight-bold is-size-6">{review.userName}</p>
                                                {review.car && (
                                                    <p className="has-text-accent is-size-7">
                                                        Sobre: {review.car.make} {review.car.model}
                                                    </p>
                                                )}
                                                <div className="stars-mini mt-1">
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <i key={i} className={`fas fa-star is-size-7 ${i < review.rating ? 'has-text-warning' : 'has-text-grey-light'}`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
                .testimonial-card-pro {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    height: 100%;
                    position: relative;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .testimonial-card-pro:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-5px);
                    border-color: #764ba2;
                }
                
                .quote-icon {
                    color: rgba(118, 75, 162, 0.3);
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                
                .testimonial-text {
                    color: #e0e0e0;
                    font-style: italic;
                    line-height: 1.6;
                    flex-grow: 1;
                }
                
                .author-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .author-avatar-small {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .has-text-accent {
                    color: #667eea !important;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
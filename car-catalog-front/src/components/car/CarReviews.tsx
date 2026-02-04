import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeIn } from '../../animations/variants';
import { fetchCarReviews, postReview } from '../../services/api/reviewService';
import type { Review } from '@/types';
import { toast } from 'react-hot-toast';

interface CarReviewsProps {
    carId: string;
}

const CarReviews: React.FC<CarReviewsProps> = ({ carId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        userName: '',
        rating: 5,
        comment: '',
        honeypot: '' // Trampa para bots
    });

    useEffect(() => {
        loadReviews();
    }, [carId]);

    const loadReviews = async () => {
        setLoading(true);
        const data = await fetchCarReviews(carId);
        setReviews(data);
        setLoading(false);
    };

    const handleRatingClick = (val: number) => {
        setFormData(prev => ({ ...prev, rating: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.userName || !formData.comment) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        setSubmitting(true);
        const result = await postReview({
            carId,
            userName: formData.userName,
            rating: formData.rating,
            comment: formData.comment,
            honeypot: formData.honeypot
        });

        if (result.success) {
            toast.success('¡Gracias por tu opinión!');
            setFormData({ userName: '', rating: 5, comment: '', honeypot: '' });
            loadReviews(); // Recargar lista
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const renderStars = (rating: number, interactive = false) => {
        return Array(5).fill(0).map((_, i) => (
            <i
                key={i}
                className={`fas fa-star ${i < rating ? 'has-text-warning' : 'has-text-grey-light'} ${interactive ? 'is-clickable' : ''}`}
                onClick={interactive ? () => handleRatingClick(i + 1) : undefined}
            ></i>
        ));
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="reviews-section"
        >
            <div className="columns is-multiline">
                {/* Resumen y Formulario */}
                <div className="column is-12-tablet is-4-desktop">
                    <div className="review-summary-card mb-5">
                        <div className="has-text-centered mb-4">
                            <p className="title is-1 has-text-white mb-1">{averageRating}</p>
                            <div className="stars is-size-4">{renderStars(Math.round(Number(averageRating)))}</div>
                            <p className="subtitle is-6 has-text-grey mt-2">
                                {reviews.length} opiniones verificadas
                            </p>
                        </div>

                        <hr className="has-background-grey-dark" />

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="review-form">
                            <h5 className="title is-5 has-text-white mb-4">Deja tu opinión</h5>

                            <div className="field">
                                <label className="label has-text-grey-light">Tu Nombre</label>
                                <div className="control">
                                    <input
                                        className="input is-dark"
                                        type="text"
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.userName}
                                        onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label has-text-grey-light">Calificación</label>
                                <div className="stars-input is-size-4 mb-3">
                                    {renderStars(formData.rating, true)}
                                </div>
                            </div>

                            <div className="field">
                                <label className="label has-text-grey-light">Comentario</label>
                                <div className="control">
                                    <textarea
                                        className="textarea is-dark"
                                        placeholder="¿Qué te pareció este auto?"
                                        rows={3}
                                        value={formData.comment}
                                        onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Campo Honeypot (Invisible para humanos) */}
                            <div style={{ display: 'none' }}>
                                <input
                                    type="text"
                                    value={formData.honeypot}
                                    onChange={e => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                                />
                            </div>

                            <div className="control">
                                <button
                                    className={`button is-accent is-fullwidth ${submitting ? 'is-loading' : ''}`}
                                    type="submit"
                                    disabled={submitting}
                                >
                                    Publicar Opinión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Reseñas */}
                <div className="column is-12-tablet is-8-desktop">
                    <div className="reviews-list-container">
                        <h4 className="title is-4 has-text-white mb-5">Opiniones recientes</h4>

                        {loading ? (
                            <div className="has-text-centered py-6">
                                <span className="icon is-large"><i className="fas fa-circle-notch fa-spin fa-2x"></i></span>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="reviews-scroll">
                                <AnimatePresence>
                                    {reviews.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            variants={fadeIn}
                                            initial="hidden"
                                            animate="visible"
                                            className="review-item mb-4"
                                        >
                                            <div className="is-flex">
                                                <div className="review-avatar mr-3">
                                                    {review.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="is-flex is-justify-content-space-between mb-1">
                                                        <p className="has-text-white has-text-weight-bold">{review.userName}</p>
                                                        <span className="is-size-7 has-text-grey">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="stars is-size-7 mb-2">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <p className="has-text-grey-light is-size-6">{review.comment}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="has-text-centered py-6 has-background-dark rounded-lg">
                                <span className="icon is-large has-text-grey"><i className="fas fa-comment-slash fa-2x"></i></span>
                                <p className="has-text-grey mt-3">Aún no hay opiniones. ¡Sé el primero en compartir la tuya!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .review-summary-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                }
                
                .review-item {
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }
                
                .review-item:hover {
                    background: rgba(255, 255, 255, 0.04);
                }
                
                .review-avatar {
                    width: 42px;
                    height: 42px;
                    background: #4a4a4a;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .input.is-dark, .textarea.is-dark {
                    background-color: rgba(0,0,0,0.2);
                    border-color: rgba(255,255,255,0.1);
                    color: white;
                }

                .input.is-dark:focus, .textarea.is-dark:focus {
                    border-color: #764ba2;
                    box-shadow: 0 0 0 0.125em rgba(118, 75, 162, 0.25);
                }

                .stars-input i {
                    cursor: pointer;
                    margin-right: 5px;
                    transition: transform 0.2s ease;
                }

                .stars-input i:hover {
                    transform: scale(1.2);
                }
            `}</style>
        </motion.div>
    );
};

export default CarReviews;

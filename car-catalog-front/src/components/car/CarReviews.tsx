import React from 'react';
import { motion } from 'framer-motion';
import { slideUp, staggerContainer, fadeIn } from '../../animations/variants';

const CarReviews: React.FC = () => {
    // Datos simulados de reseñas
    const reviews = [
        {
            id: 1,
            user: "Carlos M.",
            date: "Hace 2 meses",
            rating: 5,
            comment: "El rendimiento es increíble, superó todas mis expectativas. El interior es muy cómodo para viajes largos.",
            avatar: "https://i.pravatar.cc/150?u=1"
        },
        {
            id: 2,
            user: "Ana G.",
            date: "Hace 1 mes",
            rating: 4,
            comment: "Excelente relación calidad-precio. El sistema de infoentretenimiento es muy intuitivo y rápido.",
            avatar: "https://i.pravatar.cc/150?u=5"
        },
        {
            id: 3,
            user: "Roberto D.",
            date: "Hace 3 semanas",
            rating: 5,
            comment: "El diseño exterior roba miradas. Muy satisfecho con la compra y el servicio post-venta.",
            avatar: "https://i.pravatar.cc/150?u=8"
        }
    ];

    const filledStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <i key={i} className={`fas fa-star ${i < rating ? 'has-text-warning' : 'has-text-grey-light'}`}></i>
        ));
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <div className="reviews-header mb-5 is-flex is-align-items-center is-justify-content-space-between">
                <div>
                    <motion.h4 variants={slideUp} className="title is-4 mb-1 has-text-white">Opiniones de Dueños</motion.h4>
                    <motion.p variants={slideUp} className="subtitle is-6 has-text-grey">Basado en 12 opiniones verificadas</motion.p>
                </div>
                <motion.div variants={fadeIn} className="rating-summary has-text-right">
                    <p className="title is-3 has-text-white mb-0">4.8</p>
                    <div className="stars is-size-6">{filledStars(5)}</div>
                </motion.div>
            </div>

            <div className="reviews-list">
                {reviews.map((review) => (
                    <motion.div key={review.id} variants={fadeIn} className="review-item mb-4">
                        <div className="is-flex">
                            <figure className="image is-48x48 mr-3">
                                <img src={review.avatar} alt={review.user} className="is-rounded" />
                            </figure>
                            <div style={{ flex: 1 }}>
                                <div className="is-flex is-justify-content-space-between mb-1">
                                    <p className="has-text-white has-text-weight-bold">{review.user}</p>
                                    <span className="is-size-7 has-text-grey">{review.date}</span>
                                </div>
                                <div className="stars is-size-7 mb-2">
                                    {filledStars(review.rating)}
                                </div>
                                <p className="has-text-grey-light is-size-6">{review.comment}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <motion.div variants={fadeIn} className="mt-5 has-text-centered">
                <button className="button is-outlined is-small is-light rounded-pill">
                    Ver todas las opiniones
                </button>
            </motion.div>
        </motion.div>
    );
};

export default CarReviews;

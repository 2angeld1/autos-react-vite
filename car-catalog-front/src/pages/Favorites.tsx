import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarContext } from '@/context/CarContext';
import CarCard from '@/components/cards/CarCard';
import type { Car } from '@/types';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../animations/variants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faCompass } from '@fortawesome/free-solid-svg-icons';

const Favorites: React.FC = () => {
  const { getFavorites } = useCarContext();
  const favoriteCars: Car[] = getFavorites();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gray-900"
    >
      {/* Hero Section */}
      <section className="hero is-medium has-bg-gradient py-16 mb-8" style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
          background: 'radial-gradient(circle at 20% 30%, #f97316 0%, transparent 40%)'
        }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div variants={scaleIn} className="mb-6">
              <span className="icon is-large has-text-danger" style={{ fontSize: '3rem' }}>
                <FontAwesomeIcon icon={faHeart} />
              </span>
            </motion.div>
            <motion.h1 variants={slideUp} className="title is-1 has-text-white font-bold mb-4">
              Mis <span className="has-text-accent">Favoritos</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="subtitle is-4 has-text-grey-light">
              Tu colección personal de vehículos extraordinarios
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {favoriteCars.length === 0 ? (
          /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-3xl p-12 text-center shadow-2xl">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FontAwesomeIcon icon={faCompass} className="is-size-1 text-gray-400" />
                </div>

                <h2 className="title is-3 has-text-white mb-4">
                  Tu garaje está vacío
                </h2>
                <p className="subtitle is-5 has-text-grey-light mb-8">
                  Explora nuestro catálogo y guarda los autos que te enamoren en un solo lugar.
                </p>

                <Link
                  to="/" 
                  className="button is-accent is-large is-rounded px-6 py-4 transition-all hover:scale-105"
                >
                  <span className="icon mr-2">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </span>
                  <span>Ir al catálogo</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Cars Grid */
              <motion.div
                key="grid"
                variants={staggerContainer}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="title is-3 has-text-white mb-0">
                    Tus favoritos <span className="tag is-accent is-medium is-rounded ml-3">{favoriteCars.length}</span>
                  </h3>
                  <Link to="/" className="button is-text has-text-accent has-text-weight-bold">
                    Ver más autos
                  </Link>
                </div>

                {/* Grid */}
                <motion.div className="columns is-multiline">
                  {favoriteCars.map((car: Car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
                .has-text-accent {
                    color: #f97316 !important;
                }
                .button.is-accent {
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    border: none;
                    color: white;
                    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
                }
                .tag.is-accent {
                    background: #f97316;
                    color: white;
                }
            `}</style>
    </motion.div>
  );
};

export default Favorites;
import React from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '@/context/CarContext';
import CarCard from '@/components/CarCard';
import type { Car } from '@/types';

const Favorites: React.FC = () => {
  const { getFavorites } = useCarContext();
  const favoriteCars: Car[] = getFavorites();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Mis Favoritos
            </h1>
            <h2 className="text-xl text-blue-100">
              Aquí encontrarás todos tus autos favoritos
            </h2>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 pb-12">
        {favoriteCars.length === 0 ? (
          /* Empty State */
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              
              <p className="text-xl font-semibold text-yellow-800 mb-4">
                No tienes autos favoritos
              </p>
              <p className="text-yellow-700 mb-6">
                Explora nuestro catálogo y agrega algunos autos a tus favoritos
              </p>
              
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Ir al catálogo
              </Link>
            </div>
          </div>
        ) : (
          /* Cars Grid */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                Tus favoritos ({favoriteCars.length})
              </h3>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteCars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
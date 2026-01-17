import React from 'react';

const Promotions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </span>
          Promociones Disponibles
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Promo 1 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
            <div className="h-48 bg-gradient-to-br from-purple-900 to-indigo-900 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                OFERTA LIMITADA
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Descuento de Verano</h3>
              <p className="text-gray-400 mb-4">Obtén un 20% de descuento en todos los servicios de mantenimiento preventivo durante este mes.</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Cambio de aceite y filtro
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Rotación de llantas
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Inspección de frenos
                </li>
              </ul>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Reclamar Oferta
              </button>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
            <div className="h-48 bg-gradient-to-br from-blue-900 to-cyan-900 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                NUEVO CLIENTE
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Primera Revisión Gratis</h3>
              <p className="text-gray-400 mb-4">Tu seguridad es nuestra prioridad. Disfruta de una inspección multipunto completa cortesía de la casa.</p>
              <div className="flex items-center gap-4 text-gray-300 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs">Puntos</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs">Gratis</div>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Agendar Cita
              </button>
            </div>
          </div>

          {/* Promo 3 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group">
            <div className="h-48 bg-gradient-to-br from-red-900 to-orange-900 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                ACCESORIOS
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Kit Deportivo</h3>
              <p className="text-gray-400 mb-4">Mejora el rendimiento y estilo de tu auto con nuestro kit deportivo premium.</p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Precio Regular</span>
                  <span className="text-gray-400 line-through">$1,200</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Precio Oferta</span>
                  <span className="text-red-400">$899</span>
                </div>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;

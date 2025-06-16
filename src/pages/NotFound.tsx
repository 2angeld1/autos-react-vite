import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Número 404 grande */}
        <div className="mb-8">
          <h1 className="text-[12rem] lg:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 leading-none select-none">
            404
          </h1>
          <div className="relative -mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
          </div>
        </div>
        
        {/* Icono de auto */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-600/20 rounded-full mb-6">
            <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v8h8V4H6z" clipRule="evenodd" />
              <path d="M3 9a1 1 0 000 2h1a1 1 0 000-2H3zM16 9a1 1 0 000 2h1a1 1 0 000-2h-1z" />
            </svg>
          </div>
        </div>
        
        {/* Título y descripción */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Página no encontrada
        </h2>
        
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"></div>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          <br />
          Pero no te preocupes, tenemos muchos autos increíbles esperándote.
        </p>
        
        {/* Sugerencias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V17a1 1 0 102 0V5.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Ir al inicio</h3>
            <p className="text-gray-400 text-sm">Explora nuestra página principal</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Ver catálogo</h3>
            <p className="text-gray-400 text-sm">Descubre todos nuestros vehículos</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Buscar autos</h3>
            <p className="text-gray-400 text-sm">Encuentra tu vehículo ideal</p>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 transform"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V17a1 1 0 102 0V5.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Ir al inicio</span>
          </Link>
          
          <Link 
            to="/catalog" 
            className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Ver catálogo</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Volver atrás</span>
          </button>
        </div>
        
        {/* Información adicional */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:soporte@autoscatalog.com" className="text-purple-400 hover:text-purple-300 transition-colors">
              soporte@autoscatalog.com
            </a>
          </p>
        </div>
        
        {/* Efectos visuales */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default NotFound;
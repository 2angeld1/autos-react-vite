import React, { useState } from 'react';
import { runApiDiagnostics } from '../services/api/apiDiagnostics';
import { clearAllCaches } from '../services/api/cache';

const DiagnosticsButton: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string>('');

  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    setResults('');
    
    try {
      const result = await runApiDiagnostics();
      
      setResults(JSON.stringify(result, null, 2));
    } catch (error) {
      setResults(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCache = () => {
    try {
      clearAllCaches();
      alert('Cache limpiado con éxito. La página se recargará.');
      window.location.reload();
    } catch (error) {
      console.error('Error al limpiar cache:', error);
      alert('Hubo un error al limpiar el cache.');
    }
  };

  const handleForceImageUpdate = async () => {
    try {
      setIsRunning(true);
      setResults('🔄 Limpiando cache de imágenes problemáticas...');
      
      // Importar y ejecutar limpieza específica
      const { clearProblematicBrandsCache } = await import('../services/api/cache');
      clearProblematicBrandsCache();
      
      setResults('🔄 Recargando datos con nuevas imágenes...');
      
      // Forzar recarga
      const { fetchCars } = await import('../services/api/carService');
      await fetchCars(16); // 8 marcas × 2 autos = 16 total
      
      setResults('✅ Imágenes actualizadas! Recargando página...');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      setResults('❌ Error actualizando imágenes: ' + error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="box" style={{ margin: '1rem 0' }}>
      <h4 className="title is-5">🔧 Diagnósticos de API</h4>
      
      <button 
        className={`button is-info ${isRunning ? 'is-loading' : ''}`}
        onClick={handleRunDiagnostics}
        disabled={isRunning}
      >
        <span className="icon">
          <i className="fas fa-stethoscope"></i>
        </span>
        <span>Ejecutar Diagnósticos</span>
      </button>
      
      <button 
        className="button is-small is-danger is-light" 
        onClick={handleResetCache}
        title="Limpiar caché y reiniciar"
      >
        <span className="icon">
          <i className="fas fa-sync-alt"></i>
        </span>
        <span>Reiniciar datos</span>
      </button>
      
      <button 
        className={`button is-warning ${isRunning ? 'is-loading' : ''}`}
        onClick={handleForceImageUpdate}
        disabled={isRunning}
      >
        🔧 Actualizar Imágenes Problemáticas
      </button>
      
      {results && (
        <div className="mt-4">
          <h5 className="title is-6">Resultados:</h5>
          <pre 
            style={{ 
              background: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              maxHeight: '200px',
              overflow: 'auto'
            }}
          >
            {results}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsButton;
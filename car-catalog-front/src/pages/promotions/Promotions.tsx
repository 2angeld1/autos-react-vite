import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { promotionService, Promotion } from '../../services/api/promotionService';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../animations/variants';
import { Tag, Sparkles, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionService.getActivePromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const getImageUrl = (image?: string): string => {
    if (!image) return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800';
    if (image.startsWith('http')) return image;
    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando ofertas especiales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={scaleIn} className="inline-block p-3 bg-red-500/10 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-red-400" />
          </motion.div>
          <motion.h1
            variants={slideUp}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Ofertas & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Promociones</span>
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Descubre las mejores oportunidades para estrenar tu próximo vehículo o ahorrar en servicios exclusivos.
          </motion.p>
        </motion.div>

        {promotions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50"
          >
            <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-gray-300">No hay promociones activas en este momento</h3>
            <p className="text-gray-500 mt-2">Vuelve pronto para descubrir nuevas ofertas.</p>
          </motion.div>
        ) : (
          <div className="featured-cars-grid">
            {promotions.map((promo) => (
              <div key={promo._id} className="travel-card animate-fadeIn">
                {/* Imagen de fondo */}
                <div className="travel-card-image-wrapper">
                  <img
                    src={getImageUrl(promo.image)}
                    alt={promo.name}
                    className="travel-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800';
                    }}
                    loading="lazy"
                  />
                  <div className="travel-card-overlay"></div>
                </div>

                {/* Badge de descuento */}
                <div className="travel-card-top">
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)'
                    }}
                  >
                    {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                  </span>
                </div>

                {/* Contenido */}
                <div className="travel-card-content">
                  <span className="travel-card-subtitle">
                    Válido hasta {new Date(promo.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                  <h3 className="travel-card-title">{promo.name}</h3>
                  <div className="travel-card-meta">
                    <span
                      className="travel-rating"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCopyCode(promo.code)}
                    >
                      {copiedCode === promo.code ? (
                        <><CheckCircle2 className="inline w-4 h-4 mr-1" style={{ color: '#4ade80' }} /> Copiado</>
                      ) : (
                        <><Copy className="inline w-4 h-4 mr-1" /> {promo.code}</>
                      )}
                    </span>
                    {promo.minPurchase && promo.minPurchase > 0 && (
                      <span className="travel-reviews">
                        Min: ${promo.minPurchase.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de acción inferior */}
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="travel-card-bottom-action"
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    minWidth: '200px',
                    justifyContent: 'space-between',
                    paddingLeft: '1.5rem',
                    paddingRight: '1rem'
                  }}
                >
                  <span className="action-text" style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
                    Copiar código
                  </span>
                  <div className="action-icon-circle">
                    {copiedCode === promo.code ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;

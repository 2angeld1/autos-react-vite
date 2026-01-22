import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promotionService, Promotion } from '../../services/api/promotionService';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../animations/variants';
import { Tag, Sparkles, Loader2, Copy, CheckCircle2, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation(); // Evitar abrir/cerrar el modal si se clica solo en copiar
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
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--accent-color)' }} />
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
          <motion.div variants={scaleIn} className="inline-block p-3 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}>
            <Sparkles className="w-8 h-8" style={{ color: 'var(--accent-color)' }} />
          </motion.div>
          <motion.h1
            variants={slideUp}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Ofertas & <span style={{
              background: 'linear-gradient(to right, var(--accent-color), var(--secondary-accent, var(--accent-color)))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Promociones</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <motion.div
                layoutId={`card-${promo._id}`}
                key={promo._id}
                onClick={() => setSelectedId(promo._id as string)}
                className="bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow border border-gray-700 relative group"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    layoutId={`image-${promo._id}`}
                    src={getImageUrl(promo.image)}
                    alt={promo.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

                  {/* Badge descuento */}
                  <motion.div
                    layoutId={`badge-${promo._id}`}
                    className="absolute top-4 right-4 px-3 py-1 rounded-lg font-bold text-white shadow-lg"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                  </motion.div>
                </div>

                <div className="p-6">
                  <motion.h3 layoutId={`title-${promo._id}`} className="text-xl font-bold text-white mb-2">{promo.name}</motion.h3>
                  <motion.p layoutId={`desc-${promo._id}`} className="text-gray-400 text-sm mb-4 line-clamp-2">{promo.description}</motion.p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                      Expira: {new Date(promo.endDate).toLocaleDateString()}
                    </span>
                    <button className="text-sm font-medium hover:underline flex items-center" style={{ color: 'var(--accent-color)' }}>
                      <Info className="w-4 h-4 mr-1" /> Detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal de Expansión */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              layoutId={selectedId}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                layoutId={`card-${selectedId}`}
                className="bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const promo = promotions.find(p => p._id === selectedId);
                  if (!promo) return null;

                  return (
                    <>
                      <div className="relative h-64 md:h-80">
                        <motion.img
                          layoutId={`image-${selectedId}`}
                          src={getImageUrl(promo.image)}
                          alt={promo.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        <motion.div
                          layoutId={`badge-${selectedId}`}
                          className="absolute top-4 right-14 px-4 py-2 rounded-xl font-bold text-white text-lg shadow-lg z-10"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                          {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                          </motion.div>
                          <button
                            onClick={() => setSelectedId(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-20"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="p-8">
                          <motion.h3 layoutId={`title-${selectedId}`} className="text-3xl font-bold text-white mb-4">{promo.name}</motion.h3>

                          <div className="prose prose-invert mb-8">
                            <motion.p layoutId={`desc-${selectedId}`} className="text-gray-300 text-lg leading-relaxed">{promo.description}</motion.p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                              <p className="text-gray-500 text-sm mb-1">Código Promocional</p>
                              <div
                                className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:border-gray-500 transition-colors"
                                onClick={(e) => handleCopyCode(e, promo.code)}
                              >
                                <code className="text-xl font-mono font-bold text-white">{promo.code}</code>
                                {copiedCode === promo.code ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Copy className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                              <p className="text-gray-500 text-sm mb-2">Detalles Adicionales</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Válido hasta:</span>
                                  <span className="text-white font-medium">{new Date(promo.endDate).toLocaleDateString()}</span>
                                </div>
                                {promo.minPurchase && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Compra mínima:</span>
                                    <span className="text-white font-medium">${promo.minPurchase.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <motion.button
                            className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{ 
                                      background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--secondary-accent, var(--accent-color)) 100%)',
                                    }}
                            onClick={(e) => handleCopyCode(e, promo.code)}
                          >
                            ¡Quiero esta promoción!
                          </motion.button>
                        </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Promotions;

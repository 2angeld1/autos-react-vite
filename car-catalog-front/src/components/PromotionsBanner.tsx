import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Copy, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { promotionService, Promotion } from '../services/api/promotionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PromotionsBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await promotionService.getActivePromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Failed to fetch promotions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promotions]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getImageUrl = (image?: string): string | undefined => {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  if (loading || promotions.length === 0) return null;

  const currentPromo = promotions[currentIndex];

  return (
    <div 
      className="w-full text-white relative overflow-hidden border-b border-gray-800/50"
      style={{ background: 'linear-gradient(to bottom, rgba(10, 10, 20, 0.8), rgba(20, 20, 40, 0.9))' }}
    >
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentPromo._id}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               transition={{ duration: 0.3 }}
               className="flex items-center justify-between gap-4"
             >
                {/* Image Section (Optional) */}
                {currentPromo.image && (
                   <div className="hidden md:block w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-700/50">
                      <img 
                        src={getImageUrl(currentPromo.image)} 
                        alt={currentPromo.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                   </div>
                )}

                {/* Text Section */}
                <div className="flex-1 flex items-center gap-4">
                   <div className="flex items-center gap-3">
                      <span className="bg-primary-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {currentPromo.type === 'percentage' ? `${currentPromo.value}% OFF` : `$${currentPromo.value} OFF`}
                      </span>
                      <h2 className="text-sm font-semibold text-white hidden sm:block">
                         {currentPromo.name}
                      </h2>
                   </div>
                   <span className="text-gray-500 text-xs items-center hidden lg:flex">
                      <Clock className="w-3 h-3 mr-1" />
                      Expira: {format(new Date(currentPromo.endDate), "d MMM", { locale: es })}
                   </span>
                </div>

                {/* Code Section */}
                <div className="flex items-center gap-3">
                    <button 
                      onClick={() => copyCode(currentPromo.code)}
                      className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                       <span className="text-xs font-mono font-bold text-primary-400 tracking-wider">
                          {currentPromo.code}
                       </span>
                       {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />}
                    </button>
                    <Link 
                      to="/promotions" 
                      className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Ver todas <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
             </motion.div>
          </AnimatePresence>
          
          {/* Indicators */}
          {promotions.length > 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
               {promotions.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-1 h-1 rounded-full transition-all ${idx === currentIndex ? 'bg-primary-500 h-2' : 'bg-gray-600'}`} 
                  />
               ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default PromotionsBanner;

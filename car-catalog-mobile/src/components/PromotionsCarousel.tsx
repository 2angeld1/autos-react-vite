import React, { useState } from 'react';
import { Clock, Copy, Check, Tag, X } from 'lucide-react';
import { usePromotions } from '../hooks/usePromotions';
import { type Promotion } from '../services/api/promotions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const PromotionsCarousel: React.FC = () => {
  const { promotions, loading } = usePromotions();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const copyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return null;
  if (promotions.length === 0) return null;

  return (
    <div className="mb-10 px-6">
       <div className="flex items-center gap-2 mb-4">
           <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
             <Tag size={16} fill="currentColor" />
           </div>
           <h3 className="text-lg font-bold text-slate-900">Ofertas Especiales</h3>
       </div>

       <Swiper
         modules={[Autoplay]}
         spaceBetween={16}
         slidesPerView={1.1}
         loop={promotions.length > 1}
         autoplay={{
           delay: 4000,
           disableOnInteraction: false,
         }}
         className="w-full"
       >
         {promotions.map((promo) => (
            <SwiperSlide key={promo._id}>
              <div 
                onClick={() => setSelectedPromo(promo)}
                className={`relative overflow-hidden rounded-[2rem] text-white p-6 shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all cursor-pointer h-full min-h-[220px] flex flex-col justify-end ${!promo.image ? 'bg-gradient-to-br from-slate-900 to-indigo-900' : 'bg-slate-900'}`}
              >
                  {/* Background Image Logic */}
                  {promo.image ? (
                     <>
                        <img src={promo.image} alt={promo.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                     </>
                  ) : (
                     <>
                        {/* Decorative Circles (Fallback) */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl translate-y-1/3 -translate-x-1/3"></div>
                     </>
                  )}
                
                 <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 shadow-sm">
                               {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} DESC`}
                            </span>
                            {promo.endDate && (
                              <span className="text-[10px] text-white/90 flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                <Clock size={10} className="mr-1" />
                                {format(new Date(promo.endDate), "d MMM", { locale: es })}
                              </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-extrabold leading-tight mb-1 drop-shadow-md">{promo.name}</h3>
                        <p className="text-indigo-100 text-xs font-medium line-clamp-2 drop-shadow-sm">
                          {promo.description || 'Aprovecha esta oferta por tiempo limitado en nuestros servicios seleccionados.'}
                        </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                        <span className="text-xs text-white/80 font-medium font-mono tracking-wide">Código:</span>
                        <button 
                          onClick={(e) => copyCode(e, promo.code, promo._id)}
                          className="!flex !items-center !gap-2 !bg-white !text-indigo-900 !px-4 !py-2 !rounded-xl !font-bold !text-sm !shadow-lg !active:scale-95 transition-transform"
                        >
                           {promo.code} 
                           {copiedId === promo._id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </button>
                    </div>
                 </div>
              </div>
            </SwiperSlide>
         ))}
       </Swiper>

       {/* Detailed Modal Overlay */}
       {selectedPromo && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedPromo(null)}>
            <div 
              className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
               <button 
                 onClick={() => setSelectedPromo(null)}
                 className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors z-20 shadow-sm"
               >
                 <X size={18} />
               </button>

               {selectedPromo.image ? (
                 <div className="w-full h-56 relative">
                    <img src={selectedPromo.image} alt={selectedPromo.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>
                 </div>
               ) : (
                 <div className="pt-8 flex justify-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                      <Tag size={32} />
                    </div>
                 </div>
               )}

               <div className={`px-8 pb-8 flex flex-col items-center text-center ${selectedPromo.image ? '-mt-12 relative z-10' : ''}`}>
                  
                  <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 shadow-sm">
                      {selectedPromo.type === 'percentage' ? `Ahorra hasta ${selectedPromo.value}%` : `Descuento de $${selectedPromo.value}`}
                  </span>

                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{selectedPromo.name}</h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {selectedPromo.description || 'Esta oferta exclusiva te permite obtener grandes descuentos en servicios seleccionados de mantenimiento. Aplica términos y condiciones.'}
                  </p>

                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200 mb-6">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Tu Código Personal</p>
                      <button 
                         onClick={(e) => copyCode(e, selectedPromo.code, selectedPromo._id)}
                         className="w-full bg-white border border-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 font-mono font-bold text-lg text-indigo-600 shadow-sm active:scale-95 transition-transform"
                      >
                         {selectedPromo.code}
                         {copiedId === selectedPromo._id ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-slate-400" />}
                      </button>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium">
                     Válido hasta el {selectedPromo.endDate ? format(new Date(selectedPromo.endDate), "d 'de' MMMM", { locale: es }) : 'agotar existencias'}.
                  </p>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default PromotionsCarousel;

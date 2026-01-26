import React from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

interface CarCardProps {
  car: any;
  viewMode?: 'list' | 'grid';
}

const CarCard: React.FC<CarCardProps> = ({ car, viewMode = 'grid' }) => {
  const history = useHistory();

  // Helper functions (duplicated from hook for portability, or could pass as props)
  // To keep it truly reusable, we should probably pass them, or just implement them simply here.
  // Implementing simply here to avoid prop drilling complex functions.
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCarImage = (car: any) => {
      // Logic from useCarDetail/Showcase
      // Prioritize: car.image -> car.imageUrl -> car.images[0] -> Fallback
      if (car.image) return car.image;
      if (car.imageUrl) return car.imageUrl;
      if (car.images && car.images.length > 0) return car.images[0];
      return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => history.push(`/car/${car.id || car._id}`)}
      className={`relative overflow-hidden rounded-[1.5rem] shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group bg-slate-900 ${viewMode === 'list' ? 'aspect-[2/1]' : 'aspect-[3/4]'}`}
    >
      {/* Full Background Image */}
      <img 
        src={getCarImage(car)} 
        alt={car.model}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

      {/* Price Badge (Top Right) */}
      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-lg">
         <span className="font-extrabold text-white text-xs tracking-tight">{formatPrice(car.price)}</span>
      </div>

      {/* Content (Bottom) */}
      <div className="absolute bottom-0 inset-x-0 p-4">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{car.make}</p>
         <h3 className="font-bold text-white text-lg leading-tight truncate mb-2">{car.model}</h3>
         
         <div className="flex items-center gap-2">
            <span className="bg-white/10 backdrop-blur-sm text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">{car.year}</span>
            <span className="bg-white/10 backdrop-blur-sm text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[80px] capitalize">{car.fuel_type || 'Gas'}</span>
         </div>
      </div>
    </motion.div>
  );
};

export default CarCard;

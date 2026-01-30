import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { scaleIn } from '../animations/variants';

interface ProductCardProps {
    _id?: string;
    image: string;
    title: string;
    price: string;
    category: string;
}

const ProductCard = ({ _id, image, title, price, category }: ProductCardProps) => (
    <Link to={`/irontrail/product/${_id || '1'}`}>
        <motion.div 
            variants={scaleIn}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white group cursor-pointer border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 relative"
        >
            <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-bold px-3 py-1 z-10 skew-x-[-10deg] translate-x-2 -translate-y-px shadow-sm">
                 <span className="skew-x-[10deg] inline-block">{category}</span>
            </div>
            <div className="h-72 overflow-hidden relative border-b border-gray-100">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-5">
                <h3 className="text-lg font-black text-gray-900 uppercase leading-tight mb-2 font-oswald line-clamp-2">{title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Suspensión diseñada para condiciones extremas.</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xl font-bold text-gray-900">${price}</span>
                    <span className="text-[#FFD700] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap">
                        VER DETALLES <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </motion.div>
    </Link>
);

export default ProductCard;

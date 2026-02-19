import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface JewelCardProps {
    _id?: string;
    image: string;
    title: string;
    price: string;
    category: string;
    material?: string;
}

const JewelCard = ({ _id, image, title, price, category, material }: JewelCardProps) => (
    <Link to={`/luxjewel/product/${_id || '1'}`}>
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="group cursor-pointer"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-square bg-[#13111a] mb-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3">
                    <span className="text-[9px] tracking-[0.3em] uppercase font-sans text-[#C9A84C] bg-black/60 px-2 py-1">
                        {category}
                    </span>
                </div>
                {/* View CTA */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-sans bg-[#C9A84C] text-black px-4 py-2">
                        Ver Pieza <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="px-1">
                {material && (
                    <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#C9A84C] mb-1">{material}</p>
                )}
                <h3 className="text-white font-bold tracking-wide text-sm mb-2 line-clamp-2 italic">{title}</h3>
                <p className="text-gray-400 text-sm font-sans">${price}</p>
            </div>
        </motion.div>
    </Link>
);

export default JewelCard;
